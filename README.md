# The Ethernaut Writeup

Solutions to [The Ethernaut](https://ethernaut.openzeppelin.com/) CTF challenges ⛳️

WIP 🚧

## Contents

0.  [Hello Ethernaut](#00---hello-ethernaut)
1.  [Fallback](#01---fallback)
2.  [Fallout](#02---fallout)
3.  [Coinflip](#03---coinflip)
4.  [Telephone](#04---telephone)
5.  [Token](#05---token)
6.  [Delegation](#06---delegation)
7.  [Force](#07---force)
8.  [Vault](#08---vault)
9.  [King](#09---king)
10. [Re-entrancy](#10---re-entrancy)
11. [Elevator](#11---elevator)
12. [Privacy](#12---privacy)
13. [Gatekeeper One](#13---gatekeeper-one)
14. [Gatekeeper Two](#14---gatekeepertwo)
15. [Naught Coin](#15---naught-coin)
16. [Preservation](#16---preservation)
17. [Recovery](#17---recovery)
18. [MagicNumber](#18---magic-number)
19. [AlienCodex](#19---alien-codex)
20. [Denial](#20---denial)
21. [Shop](#21---shop)
22. [DEX](#22---dex)
23. [DEX TWO](#23---dex-two)
24. [Puzzle Wallet](#24---puzzle-wallet)
25. [Motorbike](#25---Motorbike)
26. [DoubleEntryPoint](#26---double-entry-point)

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

In previous versions of Solidity there was no `constructor` function, so it had to be named with the same name as the contract.

In this case the "constructor" had a typo and was named `Fal1out`. Just call the function to gain ownership of the contract.

[Script](./scripts/02-Fallout.ts) | [Test](./test/02-Fallout.spec.ts)

## 03 - Coinflip

For this challenge we have to guess a coin flip for 10 times in a row.

The "random" function looks like this:

```solidity
uint256 blockValue = uint256(blockhash(block.number.sub(1)));

if (lastHash == blockValue) {
    revert();
}

lastHash = blockValue;
uint256 coinFlip = blockValue.div(FACTOR);
bool side = coinFlip == 1 ? true : false;
```

Truly random numbers cannot be generated in Solidity. So, we can create an attacker contract with the same random function, calculate the outcome and send it to the original contract. This way we can make sure the guess will always be correct.

Repeat it 10 times and we win.

[Script](./scripts/03-CoinFlip.ts) | [Test](./test/03-CoinFlip.spec.ts)

## 04 - Telephone

Here we have to claim ownership of the contract. In order to do that we have to call the function:

```solidity
function changeOwner(address _owner) public {
  if (tx.origin != msg.sender) {
    owner = _owner;
  }
}

```

To satisfy the `tx.origin != msg.sender` requirement we just have to make the call from another contract.

[Script](./scripts/04-Telephone.ts) | [Test](./test/04-Telephone.spec.ts)

## 05 - Token

For this challenge we need to increment our tokens to over 20.

In older versions of Solidity overflows and underflows didn't revert the tx. In this case, an underflow can be achieved in the function:

```solidity
function transfer(address _to, uint256 _value) public returns (bool) {
  require(balances[msg.sender] - _value >= 0);
  balances[msg.sender] -= _value;
  balances[_to] += _value;
  return true;
}

```

If we send a `_value` greater than the balance we have, there will be an underflow, leading to a huge number.

So, what we have to do is send, lets say 21 tokens to any other address, and then our balance will significantly increase!

[Script](./scripts/05-Token.ts) | [Test](./test/05-Token.spec.ts)

## 06 - Delegation

This challenge demonstrates the usage of `delegatecall` and its risks, modifying the storage of the former contract.

Here is an example on how to send a transaction to the delegated contract:

```typescript
const iface = new ethers.utils.Interface(["function pwn()"]);
const data = iface.encodeFunctionData("pwn");

const tx = await attacker.sendTransaction({
  to: delegate.address,
  data,
  gasLimit: 100000,
});
await tx.wait();
```

`gasLimit` has been explicitly set because gas estimations might fail when making delegate calls.

[Script](./scripts/06-Delegation.ts) | [Test](./test/06-Delegation.spec.ts)

## 07 - Force

The goal of this challenge is to make the balance of the contract greater than zero.

The problem is that the contract doesn't have any function to receive ether, nor does it have any fallback.

But it can be forced to receive ether by calling `autodestruct` on another contract, and the remaining balance will go to the specified address.

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

```

```
