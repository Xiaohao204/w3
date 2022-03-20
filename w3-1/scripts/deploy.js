// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
const { ethers, artifacts, network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')

async function main() {
  const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
     //代币合约
     const Token = await ethers.getContractFactory("ERC20Token");
     const token = await Token.deploy();
     //银行合约
     const Vault = await ethers.getContractFactory("Vault");
     const vault = await Vault.deploy(token.address);
    //等待部署完成
    await token.deployed();
    await vault.deployed();
    console.log("token：", token.address);
    console.log("vault：", vault.address);
    //储存部署信息在文件
    let artifactT20 = await artifacts.readArtifact("ERC20Token");
    await writeAbiAddr(artifactT20, token.address, "ERC20Token", network.name);
    let artifactVault = await artifacts.readArtifact("Vault");
    await writeAbiAddr(artifactVault, vault.address, "Vault", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});
