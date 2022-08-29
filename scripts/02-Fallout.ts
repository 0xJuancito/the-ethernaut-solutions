import { ethers } from "hardhat";

const CONTRACT_NAME = "Fallout";
const CONTRACT_ADDRESS = "0x02d207A2Dd680CE747e2B1B44390Fb3f241A8Da3";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const tx = await contract.Fal1out();
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
