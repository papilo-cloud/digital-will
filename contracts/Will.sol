// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreateWill {

    address public owner;

    struct Will {
        address[] beneficiaries;
        uint256[] amounts;
        bool executed;
        uint lastPing;
        bool cancelled;
        uint256 balance;
        uint256 deathTimeout;
    }

    mapping(address => Will) public usersWill;

    address[] public testators;

    event WillCreated(address indexed testator, address[] beneficiaries, uint256[] amounts, uint256 balance, uint256 deathTimeout);
    event WillExecuted(address indexed testator);
    event WillCancelled(address indexed testator);
    event Ping(address indexed testator);

    modifier onlyTestator() {
        require(usersWill[msg.sender].beneficiaries.length > 0, "Will not found");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }

    function createWill(address[] memory _beneficiaries, uint256[] memory _amounts, uint256 _deathTimeout) external payable {
        require(usersWill[msg.sender].beneficiaries.length == 0 || usersWill[msg.sender].cancelled || usersWill[msg.sender].executed, "Will already exists");
        require(msg.value >= 1 ether, "Minimum of 1 ether required to create will");
        require(_beneficiaries.length == _amounts.length, "Bebeficiaries and amount must be of the same length");
        require(_beneficiaries.length > 0 && _amounts.length <= 10, "1 to 10 beneficiaries allowed");

        uint256 total = 0;
        for (uint i = 0; i < _beneficiaries.length; i++) {
            require(_beneficiaries[i] != address(0), "Beneficiary address must be a valid address");
            require(_amounts[i] > 0 && _amounts[i] < 100 ether, "Invalid mount");

            total += _amounts[i];
        }

        require(total <= msg.value, "Insufficient ether sent");
        
        if(usersWill[msg.sender].balance == 0) {
            testators.push(msg.sender);
        }

        usersWill[msg.sender] = Will(_beneficiaries, _amounts, false, block.timestamp, false, msg.value, _deathTimeout);

        emit WillCreated(msg.sender, _beneficiaries, _amounts, msg.value, _deathTimeout);
    }

    function ping() external onlyTestator {
        require(!usersWill[msg.sender].cancelled || !usersWill[msg.sender].executed, "Will don't exist");
        usersWill[msg.sender].lastPing = block.timestamp;
        emit Ping(msg.sender);
    }

     function executeWill(address _testator) external {
        Will storage will = usersWill[_testator];
        require((block.timestamp - will.lastPing) > will.deathTimeout, "Testator still alive");
        require(!will.executed, "Will already executed");
        require(!will.cancelled, "Will already cancelled");
        require(will.balance != 0, "Will don't exist");

        for (uint i = 0; i < will.beneficiaries.length ; i++) {
            (bool success, ) = payable(will.beneficiaries[i]).call{value: will.amounts[i]}("");
            require(success, "Transfer to beneficiary failed");
        }

        will.executed = true;
        will.balance = 0;
        delete will.beneficiaries;
        delete will.amounts;

        emit WillExecuted(_testator);
    }

    function cancelWill() external onlyTestator {
        Will storage will = usersWill[msg.sender];
        require(!will.executed, "Will already executed");
        require(!will.cancelled, "Will already cancelled");

        uint256 balance = will.balance;
        will.cancelled = true;
        delete will.beneficiaries;
        delete will.amounts;

        will.balance = 0;

        if (balance > 0) {
            (bool success, ) = payable(msg.sender).call{value: balance}("");
            require(success, "REfund failed");
        }

        emit WillCancelled(msg.sender);
    }

    function getWill(address _user) external view returns(Will memory) {
        return usersWill[_user];
    }

    function getAllTestators() external view returns(address[] memory) {
        return testators;
    }

    receive() external payable {}
}