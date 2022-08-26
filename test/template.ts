import { expect } from "chai";
import { ethers } from "hardhat";

const contractName = "";
let tx;

describe(contractName, () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory(contractName);
    const contract = await factory.deploy();
    await contract.deployed();

    tx = await contract.callme();
    await tx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
