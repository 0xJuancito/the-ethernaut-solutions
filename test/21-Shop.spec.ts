import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Shop";
const ATTACKER_NAME = "ShopAttacker";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let attackerContract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy();
    await contract.deployed();

    const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
    attackerContract = await attackerFactory.connect(attacker).deploy(contract.address);
    await attackerContract.deployed();

    contract = contract.connect(attacker);
    attackerContract = attackerContract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    tx = await attackerContract.buy();
    await tx.wait();

    expect(await contract.isSold()).to.be.true;
    expect(await contract.price()).to.be.lessThan(100);
  });
});
