import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "King";
const ATTACKER_NAME = "KingAttacker";

describe(CONTRACT_NAME, () => {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let attackerContract: Contract;

  beforeEach(async () => {
    [owner, attacker] = await ethers.getSigners();

    const sentEther = ethers.utils.parseEther("0.001");

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy({ value: sentEther });
    await contract.deployed();

    contract = contract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const etherToSend = ethers.utils.parseEther("0.001").add(1);

    const attackerContractFactory = await ethers.getContractFactory(ATTACKER_NAME);
    attackerContract = await attackerContractFactory.connect(attacker).deploy(contract.address, { value: etherToSend });
    await attackerContract.deployed();

    const tx = owner.sendTransaction({
      to: contract.address,
    });

    await expect(tx).to.be.rejectedWith(Error);
  });
});
