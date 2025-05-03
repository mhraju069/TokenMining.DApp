require("dotenv").config(); 
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.end_point,
      accounts: [process.env.peivate_key],
    },
  },
  etherscan: {
    apiKey: process.env.etherscan_api_key,
  },
  sourcify: {
    enabled: true,
  },
};
