// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IPriceOracle {
    function getPriceOf(
        address vaultAddress,
        address tokenAddress,
        address[] calldata aTokenAddresses
    ) external view returns (uint256);
}
