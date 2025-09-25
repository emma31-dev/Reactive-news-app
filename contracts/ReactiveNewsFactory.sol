// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ReactiveNewsValidator.sol";

/**
 * @title ReactiveNewsFactory
 * @dev Factory contract to deploy and manage multiple news validator instances
 */
contract ReactiveNewsFactory {
    
    struct NewsValidatorInstance {
        address contractAddress;
        string name;
        address owner;
        uint256 createdAt;
        bool active;
    }
    
    mapping(uint256 => NewsValidatorInstance) public instances;
    mapping(address => uint256[]) public ownerInstances;
    
    uint256 public nextInstanceId = 1;
    address public factoryOwner;
    
    event ValidatorDeployed(
        uint256 indexed instanceId,
        address indexed contractAddress,
        address indexed owner,
        string name
    );
    
    constructor() {
        factoryOwner = msg.sender;
    }
    
    /**
     * @dev Deploy new news validator instance
     */
    function deployValidator(string calldata name) external returns (address) {
        ReactiveNewsValidator newValidator = new ReactiveNewsValidator();
        
        uint256 instanceId = nextInstanceId++;
        
        instances[instanceId] = NewsValidatorInstance({
            contractAddress: address(newValidator),
            name: name,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true
        });
        
        ownerInstances[msg.sender].push(instanceId);
        
        emit ValidatorDeployed(instanceId, address(newValidator), msg.sender, name);
        
        return address(newValidator);
    }
    
    /**
     * @dev Get all instances for an owner
     */
    function getOwnerInstances(address owner) external view returns (uint256[] memory) {
        return ownerInstances[owner];
    }
    
    /**
     * @dev Get instance details
     */
    function getInstance(uint256 instanceId) external view returns (NewsValidatorInstance memory) {
        return instances[instanceId];
    }
    
    /**
     * @dev Deactivate instance
     */
    function deactivateInstance(uint256 instanceId) external {
        require(instances[instanceId].owner == msg.sender || msg.sender == factoryOwner, "Unauthorized");
        instances[instanceId].active = false;
    }
}