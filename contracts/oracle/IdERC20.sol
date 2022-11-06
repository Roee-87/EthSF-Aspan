// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// interface for erc20 that also implements decimals getter
interface IdERC20 is IERC20 {
    function decimals() external view returns (uint8);
}
