/**
 * Minimal Hardhat config for compiling contracts and running tests
 */
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
const { PRIVATE_KEY, REACTIVE_RPC } = process.env;

module.exports = {
  solidity: {
    compilers: [{ version: '0.8.19' }]
  },
  networks: {
    reactive: {
      url: REACTIVE_RPC || 'https://sepolia-rpc.reactive.network',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: './contracts',
    tests: './test'
  }
};
