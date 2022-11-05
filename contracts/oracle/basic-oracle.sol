//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract TokenPriceOracle {
    address owner;
    uint256 private indexPrice; //in USDC

    constructor() {
        owner = msg.sender;
    }

    function setPrice(uint256 _newPrice) external {
        require(msg.sender == owner, "Only Owner can set the Index Price");
        indexPrice = _newPrice;
    }

    function getIndexPrice() public view returns (uint256) {
        return indexPrice;
    }
}
