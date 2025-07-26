/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-chai-matchers')
require('@nomiclabs/hardhat-ethers')
require('@nomicfoundation/hardhat-verify')
require('dotenv').config()


module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  sourcify: {
    enabled: true
  }
};