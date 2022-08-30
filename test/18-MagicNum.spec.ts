import { expect } from "chai";
import { ethers } from "hardhat";

const CONTRACT_NAME = "MagicNum";

describe(CONTRACT_NAME, () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    const contract = await factory.deploy();
    await contract.deployed();

    const initOpcode = "600a600c600039600a6000f3";
    const runtimeOpcode = "602a60805260206080f3";
    const bytecode = `0x${initOpcode}${runtimeOpcode}`;

    const abi = ["function whatIsTheMeaningOfLife() pure returns (uint)"];
    const byteFactory = new ethers.ContractFactory(abi, bytecode, ethers.provider.getSigner());
    const byteContract = await byteFactory.deploy();
    await byteContract.deployed();

    const tx = await contract.setSolver(byteContract.address);
    await tx.wait();

    const life = await byteContract.whatIsTheMeaningOfLife();

    expect(life).to.eq(42);
  });
});
