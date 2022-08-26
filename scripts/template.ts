import { ethers } from "hardhat";

const contractAddress = "";
const contractName = "";

async function main() {
  let tx;

  const factory = await ethers.getContractFactory(contractName);
  const contract = factory.attach(contractAddress);

  tx = await contract.callme();
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
