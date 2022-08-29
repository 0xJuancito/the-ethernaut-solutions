import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Force";
const ATTACKER_NAME = "ForceAttacker";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy();
    await contract.deployed();

    contract = contract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
    const attackerContract = await attackerFactory.deploy(contract.address, { value: 1 });
    await attackerContract.deployed();

    expect(await ethers.provider.getBalance(contract.address)).to.be.greaterThan(0);
  });
});
