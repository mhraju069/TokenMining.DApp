const hre = require("hardhat");


async function main() {
    const start = await hre.ethers.getContractFactory("RCToken")
    console.log("Deploying...");
    const deploy = await start.deploy()
    await deploy.waitForDeployment()
    console.log("Deploying success to : ", deploy.target)
}
main()