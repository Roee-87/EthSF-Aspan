// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IPriceOracle {
    function getUSDPriceOf(
        address vaultAddress,
        address tokenAddress,
        address[] calldata aTokenAddresses
    ) external view returns (uint256);

    function getUSDCPriceOf(
        address vaultAddress,
        address tokenAddress,
        address[] calldata aTokenAddresses
    ) external view returns (uint256);
}
