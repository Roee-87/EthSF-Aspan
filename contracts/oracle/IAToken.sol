// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IAToken {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);
}
