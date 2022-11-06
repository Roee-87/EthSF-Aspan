// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IPriceOracle {
    function getUSDPriceOf(
        address vaultAddress,
        address tokenAddress,
        address[3] calldata aTokenAddresses
    ) external view returns (uint256);

    function getUSDCPriceOf(
        address vaultAddress,
        address tokenAddress,
        address[3] calldata aTokenAddresses
    ) external view returns (uint256);
}
