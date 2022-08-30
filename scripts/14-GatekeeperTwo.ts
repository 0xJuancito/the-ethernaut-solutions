import { Wallet } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "GatekeeperTwo";
const ATTACKER_NAME = "GatekeeperTwoAttacker";
const CONTRACT_ADDRESS = "0x87c4cF76412d257997eF586AbaFf36727766ea24";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy(contract.address);
  await attackerContract.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
