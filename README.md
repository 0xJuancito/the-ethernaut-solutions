# The Ethernaut Writeup

Solutions to [The Ethernaut](https://ethernaut.openzeppelin.com/) CTF challenges ⛳️

WIP 🚧

## Contents

0.  [Hello Ethernaut](#hello-ethernaut)
1.  [Fallback](#fallback)
2.  [Fallout](#fallout)
3.  [Coinflip](#coinflip)
4.  [Telephone](#telephone)
5.  [Token](#token)
6.  [Delegation](#delegation)
7.  [Force](#force)
8.  [Vault](#vault)
9.  [King](#king)
10. [Re-entrancy](#re-entrancy)
11. [Elevator](#elevator)
12. [Privacy](#privacy)
13. [Gatekeeper One](#gatekeeper-one)
14. [Gatekeeper Two](#gatekeepertwo)
15. [Naught Coin](#naught-coin)
16. [Preservation](#preservation)
17. [Recovery](#recovery)
18. [MagicNumber](#magic-number)
19. [AlienCodex](#alien-codex)
20. [Denial](#denial)
21. [Shop](#shop)
22. [DEX](#dex)
23. [DEX TWO](#dex-two)
24. [Puzzle Wallet](#puzzle-wallet)
25. [Motorbike](#Motorbike)
26. [DoubleEntryPoint](#double-entry-point)

## 00 - Hello Ethernaut

This is a warmup. Just start by calling `info()` and follow the instructions

[Script](./scripts/warmup/00-HelloEthernaut.ts)

## 01 - Fallback

Here we have to take ownership of the contract and withdraw all the Ether.

In order to be the `owner` we will have to send at least 1 wei to the contract, which will trigger the `receive` special function:

```solidity
receive() external payable {
  require(msg.value > 0 && contributions[msg.sender] > 0);
  owner = msg.sender;
}

```

We also have to satisfy the `contributions[msg.sender] > 0`:

```solidity
function contribute() public payable {
  require(msg.value < 0.001 ether);
  contributions[msg.sender] += msg.value;
}

```

So beforehand, we have to call the contribute, and make a small contribution to it.

After those two steps we can call the `withdraw` and job done.

[Script](./scripts/01-Fallback.ts) | [Test](./test/01-Fallback.spec.ts)

## 02 - Fallout

## 03 - Coinflip

## 04 - Telephone

## 05 - Token

## 06 - Delegation

## 07 - Force

## 08 - Vault

## 09 - King

## 10 - Re-entrancy

## 11 - Elevator

## 12 - Privacy

## 13 - Gatekeeper One

## 14 - Gatekeeper Two

## 15 - Naught Coin

## 16 - Preservation

## 17 - Recovery

## 19 - MagicNumber

## 20 - AlienCodex

## 21 - Denial

## 22 - Shop

## 23 - DEX

## 24 - DEX TWO

## 25 - Puzzle Wallet

## 26 - Motorbike

## 27 - DoubleEntryPoint
