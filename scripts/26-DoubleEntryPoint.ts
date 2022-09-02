import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("DoubleEntryPoint");
  const contract = factory.attach("0x127bFe4D6520B47f56C2708B49462148b0C4E534");

  const fortaAddress = await contract.forta();
  const fortaFactory = await ethers.getContractFactory("Forta");
  const forta = fortaFactory.attach(fortaAddress);

  const detectionBotFactory = await ethers.getContractFactory("DetectionBot");
  const detectionBot = await detectionBotFactory.deploy(forta.address);
  await detectionBot.deployed();

  const tx = await forta.setDetectionBot(detectionBot.address);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
