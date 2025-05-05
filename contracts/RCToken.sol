// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RCToken is ERC20, Ownable {
    uint public mineRate = 1;
    uint public interval = 5 minutes;
    mapping(address => uint) public lastMined;
    mapping(address => uint) public totalMined;
    mapping(address => bool) public isMining;
    mapping(address => uint) public mineCount;
    mapping(address => uint) public joinDate;

    event minelog(address indexed user, uint token, uint time);
    event claimlog(address indexed user, uint token, uint time);

    constructor() ERC20("RCToken", "RC") Ownable(msg.sender) {}

    function Mine() public {
        require(isMining[msg.sender] == false, "Already mining....");
        lastMined[msg.sender] = block.timestamp;
        isMining[msg.sender] = true;
        emit minelog(msg.sender, mineRate * 10 ** decimals(), block.timestamp);

        if (joinDate[msg.sender] == 0) {
            joinDate[msg.sender] = block.timestamp;
        }
    }

    function Claim() public {
        require(
            lastMined[msg.sender] == 0 ||
                block.timestamp > lastMined[msg.sender] + interval,
            "Minig isn't end yet"
        );
        _mint(msg.sender, mineRate * 10 ** decimals());
        totalMined[msg.sender] += mineRate * 10 ** decimals();
        lastMined[msg.sender] = 0;
        isMining[msg.sender] = false;
        mineCount[msg.sender] += 1;
        emit claimlog(msg.sender, mineRate * 10 ** decimals(), block.timestamp);
    }

    function ChangeRate(uint _mineRate) public onlyOwner {
        mineRate = _mineRate;
    }

    function ChangeInterval(uint _interval) public onlyOwner {
        interval = _interval * 1 minutes;
    }
}
