// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import {IPool} from './IPool.sol';

/**
 * @title IInitializableAspanToken
 * @author BuzzCai.eth
 * @notice Interface for the initialize function on AspanToken
 **/
interface IInitializableAspanToken {
  /**
   * @dev Emitted when an AspanToken is initialized
   * @param underlyingAsset The address of the underlying asset
   * @param pool The address of the associated pool
   * @param treasury The address of the treasury
   * @param AspanTokenDecimals The decimals of the underlying
   * @param AspanTokenName The name of the AspanToken
   * @param AspanTokenSymbol The symbol of the AspanToken
   * @param params A set of encoded parameters for additional initialization
   **/
  event Initialized(
    address indexed underlyingAsset,
    address indexed pool,
    address treasury,
    uint8 AspanTokenDecimals,
    string AspanTokenName,
    string AspanTokenSymbol,
    bytes params
  );

  /**
   * @notice Initializes the AspanToken
   * @param pool The pool contract that is initializing this contract
   * @param treasury The address of the Aave treasury, receiving the fees on this AspanToken
   * @param underlyingAsset The address of the underlying asset of this AspanToken (E.g. WETH for aWETH)
   * @param AspanTokenDecimals The decimals of the AspanToken, same as the underlying asset's
   * @param AspanTokenName The name of the AspanToken
   * @param AspanTokenSymbol The symbol of the AspanToken
   * @param params A set of encoded parameters for additional initialization
   */
  function initialize(
    IPool pool,
    address treasury,
    address underlyingAsset,
    uint8 AspanTokenDecimals,
    string calldata AspanTokenName,
    string calldata AspanTokenSymbol,
    bytes calldata params
  ) external;
}