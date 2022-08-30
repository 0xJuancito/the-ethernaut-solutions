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

[Script](./scripts/07-Force.ts) | [Test](./test/07-Force.spec.ts)

## 08 - Vault

Here we have to guess a secret password to unlock the vault.

The issue is that the password is stored in the contract as `private`. Nevertheless, it is possible to access private storage variables in contracts, if we know the slot they are in:

```typescript
const password = await ethers.provider.getStorageAt(contract.address, 1);
```

[Script](./scripts/08-Vault.ts) | [Test](./test/08-Vault.spec.ts)

## 09 - King

For this challenge we have to perform a DOS (Denial of Service) into the contract.

```solidity
receive() external payable {
  require(msg.value >= prize || msg.sender == owner);
  king.transfer(msg.value);
  king = msg.sender;
  prize = msg.value;
}

```

The vulnerable line is `king.transfer(msg.value);`.

We can create a contract that reverts when it receives some ether. So, when `transfer` is executed it will revert the tx, making the contract not usable anymore.

[Script](./scripts/09-King.ts) | [Test](./test/09-King.spec.ts)

## 10 - Re-entrancy

The goal of this challenge is to empty the contract ether.

```solidity
function withdraw(uint256 _amount) public {
  if (balances[msg.sender] >= _amount) {
    (bool result, ) = msg.sender.call{ value: _amount }("");
    if (result) {
      _amount;
    }
    balances[msg.sender] -= _amount;
  }
}

```

But it is vulnerable to a [Re-entrancy attack](https://solidity-by-example.org/hacks/re-entrancy/).

The balance of the contract is updated after the ether is sent, and there is no safeguard.

We can create a contract with a `receive` function that calls `withdraw` again, and it will bypass the requirement.

```solidity
receive() external payable {
  reentrance.withdraw(msg.value);
}

```

So, the ether is withdrawn twice and the balance is updated

[Script](./scripts/10-Reentrance.ts) | [Test](./test/10-Reentrance.spec.ts)

## 11 - Elevator

For this challenge we have to set the `top` variable to `true`

```solidity
function goTo(uint256 _floor) public {
  Building building = Building(msg.sender);

  if (!building.isLastFloor(_floor)) {
    floor = _floor;
    top = building.isLastFloor(floor);
  }
}

```

We just have to create a contract that implements the `Building` interface:

```solidity
interface Building {
  function isLastFloor(uint256) external returns (bool);
}

```

With the only catch that the first time it has to return `false` to enter the `if (!building.isLastFloor(_floor)) {}` and the second time it has to return `true` to satisfy the challenge requirement.

[Script](./scripts/11-Building.ts) | [Test](./test/11-Building.spec.ts)

## 12 - Privacy

In this challenge we have to unlock a vault with a secret:

```solidity
contract Privacy {
  bool public locked = true;
  uint256 public ID = block.timestamp;
  uint8 private flattening = 10;
  uint8 private denomination = 255;
  uint16 private awkwardness = uint16(now);
  bytes32[3] private data;

  constructor(bytes32[3] memory _data) public {
    data = _data;
  }

  function unlock(bytes16 _key) public {
    require(_key == bytes16(data[2]));
    locked = false;
  }
}

```

The secret is stored in `bytes32[3] private data;`, but data in smart contracts can be read, despite it being set as `private`.

We first need to understand the storage slot corresponding to `data[2]`, which is the key we want.

Different types occupy different space in the storage. The compiler tries to fit them in the same slot if it can, depending on its neighbours. Taking that into account, we can see that the storage is occupied this way:

```typescript
| Slot 0 | bool locked |
| Slot 1 | uint256 ID |
| Slot 2 | uint8 flattening + unit8 denomination + uint16 awkwardness |
| Slot 3 | bytes32 data[0] |
| Slot 4 | bytes32 data[1] |
| Slot 5 | bytes32 data[2] |
```

We can see that the compiler stores multiple variables on `slot 2` because it knows they will all fit in the 32 bytes space of the slot.

The one that is most important for us is `slot 5`, where our answer lies on.

We can easily get it, and parse to `bytes16` to solve the challenge:

```typescript
const dataArraySlot = 5;
const key32 = await ethers.provider.getStorageAt(contract.address, dataArraySlot);
const key16 = key32.slice(0, 16 * 2 + 2); // 16 bytes * 2 char + 2 char (0x)

const tx = await contract.unlock(key16);
await tx.wait();
```

[Script](./scripts/12-Privacy.ts) | [Test](./test/12-Privacy.spec.ts)

## 13 - Gatekeeper One

Here we have to unlock three gates to pass the challenge.

The first one is straightforward. We have to call the function from another contract:

```solidity
modifier gateOne() {
    require(msg.sender != tx.origin);
    _;
}
```

The second one implies gas manipulation:

```solidity
modifier gateTwo() {
    require(gasleft().mod(8191) == 0);
    _;
}
```

It is not an easy task to calculate the exact amount of gas spent until that point, so we have two options:

- Use Remix debugger to find the exact number of gas left at that point
- Brute force the contract to get a number that satisfies that condition

In both cases, we have to work with the exact same Solidity version that was compiled, as different versions would results in different gas results. We can temporary bypass the third gate to calculate this number.

On our auxiliary contract:

```solidity
function enter(uint256 gasOffset, bytes8 _gateKey) public {
  gatekeeper.enter.gas(8191 * 10 + gasOffset)(_gateKey);
}

```

The third gate involves byte calculation:

```solidity
modifier gateThree(bytes8 _gateKey) {
    require(uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)), "GatekeeperOne: invalid gateThree part one");
    require(uint32(uint64(_gateKey)) != uint64(_gateKey), "GatekeeperOne: invalid gateThree part two");
    require(uint32(uint64(_gateKey)) == uint16(tx.origin), "GatekeeperOne: invalid gateThree part three");
    _;
}
```

Let's say our address is `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`, and let's focus on the last condition:

```solidity
uint32(uint64(_gateKey)) == uint16(tx.origin) == 0x2266 == 0x00002266
```

This function looks like it is applying a mask `0xffffffff0000ffff` to the address.

Let's complete the rest of the 8 bytes of the `_gateKey` with the address + the mask: `0x827279cf00002266`

Fortunately this also satisfies the first two parts of the last gate. So we are done :)

[Script](./scripts/13-GatekeeperOne.ts) | [Test](./test/13-GatekeeperOne.spec.ts)

## 14 - Gatekeeper Two

## 15 - Naught Coin

The idea of this challenge is to move all the tokens away to another address.

The contract has a `transfer` function with some restrictions, but the gotcha is that it inherits `ERC20`, which has other methods for interacting with the tokens, such as `transferFrom`, that can be used to move the tokens without the supposed restrictions.

[Script](./scripts/15-NaughtCoin.ts) | [Test](./test/15-NaughtCoin.spec.ts)

## 16 - Preservation

## 17 - Recovery

## 18 - MagicNumber

The goal here is to write a contract in bytecode in less than 10 bytes that returns the number 42 when called.

Here are two great writeups that explain it:

- [How to deploy contracts using raw assembly opcodes | by 0xSage](https://medium.com/coinmonks/ethernaut-lvl-19-magicnumber-walkthrough-how-to-deploy-contracts-using-raw-assembly-opcodes-c50edb0f71a2)
- [The Ethernaut Challenge #18 Solution — Magic Number | by StErMi](https://stermi.medium.com/the-ethernaut-challenge-18-solution-magic-number-2cb8edee383a)

[Script](./scripts/18-MagicNum.ts) | [Test](./test/18-MagicNum.spec.ts)

## 19 - AlienCodex

## 20 - Denial

The goal of this challenge is to perform a DOS on the contract, when the owner tries to use the `withdraw`:

```solidity
function withdraw() public {
  uint256 amountToSend = address(this).balance.div(100);
  partner.call{ value: amountToSend }("");
  owner.transfer(amountToSend);
}

```

The `partner` can be set, and it can be a contract. So it is a good target to perform an attack when it receives ether.

As the purpose of the challenge is to deny the service, spending all the gas on the `receive` function from the attacker contract is enough. It can be done with some `while` loop, for example:

```solidity
receive() external payable {
  while (true) {}
}

```

[Script](./scripts/20-Denial.ts) | [Test](./test/20-Denial.spec.ts)

## 21 - Shop

## 22 - DEX

## 23 - DEX TWO

## 24 - Puzzle Wallet

## 25 - Motorbike

## 26 - DoubleEntryPoint
