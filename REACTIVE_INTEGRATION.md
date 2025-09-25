# 🔗 Reactive Network Integration Guide

## Smart Contract Deployment

### 1. Prerequisites
- Install Hardhat or Foundry for smart contract deployment
- Get Reactive Network testnet tokens from [Kopli Testnet Faucet](https://kopli-faucet.reactive.network)
- Configure MetaMask with Reactive Network

### 2. Reactive Network Configuration
```javascript
// Add to MetaMask
Network Name: Reactive Network Testnet  
RPC URL: https://sepolia-rpc.reactive.network
Chain ID: 5318008
Symbol: REACT
Explorer: https://sepolia-explorer.reactive.network
```

### 3. Deploy the Contract

#### Using Hardhat:
```bash
# Install Hardhat
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Initialize Hardhat project
npx hardhat init

# Copy contracts to contracts/ folder
# Deploy to Reactive Network
npx hardhat run scripts/deploy.js --network reactive-testnet
```

#### Using Foundry:
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy contract
forge create --rpc-url https://sepolia-rpc.reactive.network \
  --private-key YOUR_PRIVATE_KEY \
  src/ReactiveNewsValidator.sol:ReactiveNewsValidator
```

### 4. Update Environment Variables
```bash
# Copy environment template
cp env.example .env.local

# Update with your deployed contract address
NEXT_PUBLIC_REACTIVE_NEWS_CONTRACT=0xYourContractAddress
```

## Frontend Integration Features

### 🔒 Web3 Connection
- MetaMask integration with automatic network switching
- Reactive Network testnet support
- Account management and wallet connection status

### ✅ News Verification System  
- Submit news articles to blockchain for verification
- Community voting mechanism (upvote/downvote)
- Authorized verifier system for manual verification
- Real-time verification status display

### 🏆 Reputation & Incentives
- Verifier reputation scoring
- News submitter tracking
- Voting participation rewards
- Blockchain-based credibility system

### 📊 Reactive Network Features
- Cross-chain event monitoring
- Reactive callbacks for real-time updates  
- On-chain news validation and persistence
- Decentralized verification consensus

## Usage Examples

### Submit News to Blockchain
```typescript
const { submitNews } = useWeb3();

const handleSubmit = async () => {
  try {
    const txHash = await submitNews(
      "Breaking: New DeFi Protocol Launched",
      "A revolutionary new protocol...", 
      "DeFi"
    );
    console.log('News submitted:', txHash);
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

### Vote on News Verification  
```typescript
const { voteOnNews } = useWeb3();

const handleVote = async (newsId: number, approve: boolean) => {
  try {
    await voteOnNews(newsId, approve);
    console.log('Vote submitted successfully');
  } catch (error) {
    console.error('Voting failed:', error);
  }
};
```

### Check Verification Status
```typescript
const { getNewsVerification } = useWeb3();

const checkStatus = async (newsId: number) => {
  const isVerified = await getNewsVerification(newsId);
  return isVerified ? 'Verified ✅' : 'Pending ⏳';
};
```

## Smart Contract Features

### 📝 News Submission
- Unique content hash verification
- Category-based organization  
- Timestamp and author tracking
- Duplicate content prevention

### 🗳️ Community Verification
- Threshold-based verification (3+ votes)
- Upvote/downvote mechanism
- Voter eligibility requirements
- Anti-spam protections

### 👥 Authorized Verifiers
- Multi-tier verification system
- Reputation-based scoring
- Manual verification override
- Verifier performance tracking

### 🔄 Reactive Callbacks
- Cross-chain event monitoring
- Real-time notification system
- Automated verification workflows
- Inter-chain news synchronization

## Benefits

### 🛡️ Trust & Transparency
- Immutable news verification records
- Public voting and verification history  
- Decentralized consensus mechanism
- Tamper-proof content validation

### ⚡ Real-Time Updates  
- Reactive Network's live monitoring
- Instant verification notifications
- Cross-chain news propagation
- Automated callback triggers

### 🎯 User Incentives
- Reputation-based rewards
- Verification participation incentives
- Quality content promotion
- Community-driven moderation

### 🔗 Blockchain Integration
- Native REACT token integration
- On-chain governance capabilities
- Decentralized storage options
- Cross-platform verification

## Next Steps

1. **Deploy Contract**: Use provided Solidity contracts
2. **Update Config**: Set contract address in environment  
3. **Test Features**: Try news submission and voting
4. **Add Incentives**: Implement token rewards
5. **Scale**: Deploy on Reactive mainnet when ready

## Security Considerations

- Always verify contract addresses
- Use testnet for development
- Implement proper access controls  
- Monitor for malicious activities
- Regular security audits recommended

---

**Built for the Reactive Network ecosystem** 🚀