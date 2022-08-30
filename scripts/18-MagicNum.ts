import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xb45adaFDeE7Dd85cAc0De94fD1475b25782e5B75";
const CONTRACT_NAME = "MagicNum";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const initOpcode = "600a600c600039600a6000f3";
  const runtimeOpcode = "602a60805260206080f3";
  const bytecode = `0x${initOpcode}${runtimeOpcode}`;

  const abi = ["function whatIsTheMeaningOfLife() pure returns (uint)"];
  const byteFactory = new ethers.ContractFactory(abi, bytecode, ethers.provider.getSigner());
  const byteContract = await byteFactory.deploy();
  await byteContract.deployed();

  const tx = await contract.setSolver(byteContract.address);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
