import { Wallet } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Token";
const CONTRACT_ADDRESS = "0xA3A643987c1356F5230e01754d8C15d459B7e078";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const tx = await contract.transfer(Wallet.createRandom().address, 21);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
