import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "GatekeeperTwo";
const ATTACKER_NAME = "GatekeeperTwoAttacker";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let attackerContract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy();
    await contract.deployed();

    contract = contract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
    attackerContract = await attackerFactory.connect(attacker).deploy(contract.address);
    await attackerContract.deployed();

    expect(await contract.entrant()).to.eq(attacker.address);
  });
});
