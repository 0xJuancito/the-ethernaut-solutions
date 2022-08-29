import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Reentrance";
const ATTACKER_NAME = "ReentranceAttacker";

describe(CONTRACT_NAME, () => {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let attackerContract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [owner, attacker] = await ethers.getSigners();

    const sentEther = ethers.utils.parseEther("0.001");

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy();
    await contract.deployed();

    const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
    attackerContract = await attackerFactory.connect(attacker).deploy(contract.address);
    await attackerContract.deployed();

    tx = await owner.sendTransaction({
      to: contract.address,
      value: sentEther,
    });
    await tx.wait();

    contract = contract.connect(attacker);
    attackerContract = attackerContract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const sentEther = ethers.utils.parseEther("0.001");

    tx = await attackerContract.attack({ value: sentEther });
    await tx.wait();

    expect(await ethers.provider.getBalance(contract.address)).to.eq(0);
  });
});
