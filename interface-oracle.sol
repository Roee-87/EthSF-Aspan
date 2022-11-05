//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface ITokenPriceOracle {
    function getIndexPrice() external view returns (uint256);
}
