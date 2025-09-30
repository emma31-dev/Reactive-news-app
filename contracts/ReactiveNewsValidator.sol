// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./lib/reactive/IReactive.sol";
import "./lib/reactive/AbstractReactive.sol";

/**
 * @title ReactiveNewsValidator
 * @dev A Reactive Network contract that validates news articles and reacts to verification events
 */
contract ReactiveNewsValidator is AbstractReactive {
    
    // Structs
    struct NewsItem {
        uint256 id;
        string title;
        string content;
        string category;
        address submitter;
        uint256 timestamp;
        uint256 upvotes;
        uint256 downvotes;
        bool verified;
        bytes32 contentHash;
    }
    
    struct Verifier {
        bool authorized;
        uint256 reputation;
        uint256 totalVerifications;
        uint256 correctVerifications;
    }
    
    // State variables
    mapping(uint256 => NewsItem) public newsItems;
    mapping(bytes32 => uint256) public hashToNewsId;
    mapping(address => Verifier) public verifiers;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256[]) public userSubmissions;
    
    uint256 public nextNewsId = 1;
    uint256 public constant VERIFICATION_THRESHOLD = 3;
    uint256 public constant MIN_REPUTATION = 100;
    
    address public owner;
    bool public paused = false;
    
    // Events
    event NewsSubmitted(
        uint256 indexed newsId, 
        address indexed submitter, 
        string title, 
        string category,
        uint256 timestamp
    );
    
    event NewsVoted(
        uint256 indexed newsId, 
        address indexed voter, 
        bool upvote, 
        uint256 newUpvotes, 
        uint256 newDownvotes
    );
    
    event NewsVerified(
        uint256 indexed newsId, 
        bool verified, 
        uint256 finalUpvotes, 
        uint256 finalDownvotes
    );
    
    event VerifierAuthorized(address indexed verifier, uint256 reputation);
    event VerifierReputation(address indexed verifier, uint256 oldRep, uint256 newRep);
    
    // Reactive Network Events for cross-chain monitoring
    event ReactiveCallback(
        uint256 indexed newsId,
        string action,
        bytes data
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    modifier onlyAuthorizedVerifier() {
        require(verifiers[msg.sender].authorized, "Not authorized verifier");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        // Initialize owner as first verifier
        verifiers[owner] = Verifier({
            authorized: true,
            reputation: 1000,
            totalVerifications: 0,
            correctVerifications: 0
        });
    }
    
    /**
     * @dev Submit news article for verification
     */
    function submitNews(
        string calldata title,
        string calldata content,
        string calldata category
    ) external whenNotPaused returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(content).length > 0, "Content required");
        
        bytes32 contentHash = keccak256(abi.encodePacked(title, content));
        require(hashToNewsId[contentHash] == 0, "Duplicate content");
        
        uint256 newsId = nextNewsId++;
        
        newsItems[newsId] = NewsItem({
            id: newsId,
            title: title,
            content: content,
            category: category,
            submitter: msg.sender,
            timestamp: block.timestamp,
            upvotes: 0,
            downvotes: 0,
            verified: false,
            contentHash: contentHash
        });
        
        hashToNewsId[contentHash] = newsId;
        userSubmissions[msg.sender].push(newsId);
        
        emit NewsSubmitted(newsId, msg.sender, title, category, block.timestamp);
        
        // Reactive Network callback for cross-chain notification
        emit ReactiveCallback(newsId, "news_submitted", abi.encode(title, category, msg.sender));
        
        return newsId;
    }
    
    /**
     * @dev Vote on news article (community verification)
     */
    function voteOnNews(uint256 newsId, bool upvote) external whenNotPaused {
        require(newsItems[newsId].id != 0, "News not found");
        require(!newsItems[newsId].verified, "Already verified");
        require(!hasVoted[newsId][msg.sender], "Already voted");
        require(newsItems[newsId].submitter != msg.sender, "Cannot vote on own submission");
        
        hasVoted[newsId][msg.sender] = true;
        
        if (upvote) {
            newsItems[newsId].upvotes++;
        } else {
            newsItems[newsId].downvotes++;
        }
        
        emit NewsVoted(newsId, msg.sender, upvote, newsItems[newsId].upvotes, newsItems[newsId].downvotes);
        
        // Check if verification threshold reached
        uint256 totalVotes = newsItems[newsId].upvotes + newsItems[newsId].downvotes;
        if (totalVotes >= VERIFICATION_THRESHOLD) {
            _finalizeVerification(newsId);
        }
        
        // Reactive callback for voting activity
        emit ReactiveCallback(newsId, "vote_cast", abi.encode(msg.sender, upvote, totalVotes));
    }
    
    /**
     * @dev Manual verification by authorized verifier
     */
    function verifyNews(uint256 newsId, bool isVerified) external onlyAuthorizedVerifier whenNotPaused {
        require(newsItems[newsId].id != 0, "News not found");
        require(!newsItems[newsId].verified, "Already verified");
        
        newsItems[newsId].verified = true;
        
        Verifier storage verifier = verifiers[msg.sender];
        verifier.totalVerifications++;

        uint256 oldReputation = verifier.reputation;

        if (isVerified) {
            verifier.correctVerifications++;
            // Boost reputation for correct verifications
            verifier.reputation = verifier.reputation + 10;
        } else {
            // Slight penalty for rejected news
            if (verifier.reputation > 10) {
                verifier.reputation = verifier.reputation - 5;
            }
        }

        emit NewsVerified(newsId, isVerified, newsItems[newsId].upvotes, newsItems[newsId].downvotes);
        emit VerifierReputation(msg.sender, oldReputation, verifier.reputation);
        
        // Reactive callback for verification
        emit ReactiveCallback(newsId, "verified", abi.encode(isVerified, msg.sender));
    }
    
    /**
     * @dev Internal function to finalize community verification
     */
    function _finalizeVerification(uint256 newsId) internal {
        NewsItem storage news = newsItems[newsId];
        
        // News is verified if upvotes > downvotes
        bool isVerified = news.upvotes > news.downvotes;
        news.verified = true;
        
        // Reward/penalize submitter based on community verdict
        if (isVerified) {
            // Could add token rewards here
        }
        
        emit NewsVerified(newsId, isVerified, news.upvotes, news.downvotes);
        
        // Reactive callback for community verification
        emit ReactiveCallback(newsId, "community_verified", abi.encode(isVerified, news.upvotes, news.downvotes));
    }
    
    /**
     * @dev Authorize new verifier
     */
    function authorizeVerifier(address newVerifier, uint256 initialReputation) external onlyOwner {
        require(newVerifier != address(0), "Invalid address");
        require(!verifiers[newVerifier].authorized, "Already authorized");
        require(initialReputation >= MIN_REPUTATION, "Insufficient reputation");
        
        verifiers[newVerifier] = Verifier({
            authorized: true,
            reputation: initialReputation,
            totalVerifications: 0,
            correctVerifications: 0
        });
        
        emit VerifierAuthorized(newVerifier, initialReputation);
    }
    
    /**
     * @dev Remove verifier authorization
     */
    function revokeVerifier(address verifier) external onlyOwner {
        require(verifiers[verifier].authorized, "Not authorized");
        verifiers[verifier].authorized = false;
    }
    
    /**
     * @dev Reactive Network callback implementation
     */
    function react(
        uint256 /* chain */,
        address /* _contract */,
        uint256 /* topic_0 */,
        uint256 /* topic_1 */,
        uint256 /* topic_2 */,
        uint256 /* topic_3 */,
        bytes calldata data,
        uint256 /* block_number */,
        uint256 /* op_code */
    ) external vmOnly {
        // Process reactive callbacks from other chains
        // This could trigger cross-chain news verification
        emit ReactiveCallback(0, "cross_chain_reaction", data);
    }
    
    // View functions
    function getNewsItem(uint256 newsId) external view returns (NewsItem memory) {
        return newsItems[newsId];
    }
    
    function getUserSubmissions(address user) external view returns (uint256[] memory) {
        return userSubmissions[user];
    }
    
    function isNewsVerified(uint256 newsId) external view returns (bool) {
        return newsItems[newsId].verified;
    }
    
    function getVerifierInfo(address verifierAddr) external view returns (Verifier memory) {
        return verifiers[verifierAddr];
    }
    
    function getNewsCount() external view returns (uint256) {
        return nextNewsId - 1;
    }
    
    // Admin functions
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    function updateVerificationThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold > 0, "Invalid threshold");
        // Could emit event and update VERIFICATION_THRESHOLD if it wasn't constant
    }
}