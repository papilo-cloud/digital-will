// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreateWill {

    address public owner;
    uint DEATH_TIMEOUT = 2 minutes;

    struct Will {
        address[] beneficiaries;
        uint256[] amounts;
        bool executed;
        uint lastPing;
    }

    mapping(address => Will) public usersWill;
    
    Will public will;

    constructor() payable {
        require(msg.value >= 1 ether, "Minimum of 1 ether required to initialize the will");
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function createWill(address[] memory _beneficiaries, uint256[] memory _amounts) external onlyOwner {
        require(_beneficiaries.length == _amounts.length, "Bebeficiaries and amount must be of the same length");
        require(_beneficiaries.length > 0 && _amounts.length > 0, "At least one beneficiary and one amount is required");
        require(_beneficiaries.length < 10 && _amounts.length < 10, "Maximum of 10 beneficiaries and amounts allowed");

        for (uint i = 0; i < _beneficiaries.length; i++) {
            require(_beneficiaries[i] != address(0), "Beneficiary address must be a valid address");
            require(_amounts[i] > 0, "Amount must be greater than zero");
            require(_amounts[i] < 10 ether, "Amount must be less than 10 ether");
        }
        will = Will(_beneficiaries, _amounts, false, block.timestamp);
    }

    function ping() external onlyOwner {
        will.lastPing = block.timestamp;
    }

     function executeWill() {
        require((block.timestamp - will.lastPing) > DEATH_TIMEOUT, "Death timeout not reached");
        require(!will.executed, "Will already executed");

        for (uint i = 0; i < will.beneficiaries.length ; i++) {
            (bool success, ) = payable(will.beneficiaries[i]).call{value: will.amounts[i]}("");
            require(success);
        }

        will.executed = true
    }

    receive() external payable {}
}