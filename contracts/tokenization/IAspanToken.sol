// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {IInitializableAspanToken} from './IInitializableAspanToken.sol';

/**
 * @title IAspanToken
 * @author BuzzCai.eth
 * @notice Defines the basic interface for an AspanToken.
 **/
interface IAspanToken is IERC20 {
  /**
   * @dev Emitted during the transfer action
   * @param from The user whose tokens are being transferred
   * @param to The recipient
   * @param value The amount being transferred
   **/
  event BalanceTransfer(address indexed from, address indexed to, uint256 value);

  /**
   * @dev Emitted after the mint action
   * @param caller The address performing the mint
   * @param onBehalfOf The address of the user that will receive the minted scaled balance tokens
   * @param value The amount being minted (user entered amount + balance increase from interest)
   **/
  event Mint(
    address indexed caller,
    address indexed onBehalfOf,
    uint256 value
  );

  /**
   * @dev Emitted after scaled balance tokens are burned
   * @param from The address from which the scaled tokens will be burned
   * @param target The address that will receive the underlying, if any
   * @param value The amount being burned (user entered amount - balance increase from interest)
   * @param balanceIncrease The increase in balance since the last action of the user
   **/
  event Burn(
    address indexed from,
    address indexed target,
    uint256 value
  );

  /**
   * @notice Mints `amount` AspanTokens to `user`
   * @param caller The address performing the mint
   * @param onBehalfOf The address of the user that will receive the minted AspanTokens
   * @param amount The amount of tokens getting minted
   */
  function mint(
    address caller,
    address onBehalfOf,
    uint256 amount
  ) external;

  /**
   * @notice Burns AspanTokens from `user` and sends the equivalent amount of underlying to `receiverOfUnderlying`
   * @dev In some instances, the mint event could be emitted from a burn transaction
   * if the amount to burn is less than the interest that the user accrued
   * @param from The address from which the AspanTokens will be burned
   * @param receiverOfUnderlying The address that will receive the underlying
   * @param amount The amount being burned
   **/
  function burn(
    address from,
    address receiverOfUnderlying,
    uint256 amount
  ) external;

  /**
   * @notice Mints AspanTokens to the reserve treasury
   * @param amount The amount of tokens getting minted
   */
  function mintToTreasury(uint256 amount) external;

  /**
   * @notice Transfers AspanTokens in the event of a borrow being liquidated, in case the liquidators reclaims the AspanToken
   * @param from The address getting liquidated, current owner of the AspanTokens
   * @param to The recipient
   * @param value The amount of tokens getting transferred
   **/
  function transferOnLiquidation(
    address from,
    address to,
    uint256 value
  ) external;

  /**
   * @notice Transfers the underlying asset to `target`.
   * @dev Used by the Pool to transfer assets in borrow(), withdraw() and flashLoan()
   * @param user The recipient of the underlying
   * @param amount The amount getting transferred
   **/
  function transferUnderlyingTo(address user, uint256 amount) external;

  /**
   * @notice Handles the underlying received by the AspanToken after the transfer has been completed.
   * @dev The default implementation is empty as with standard ERC20 tokens, nothing needs to be done after the
   * transfer is concluded. However in the future there may be AspanTokens that allow for example to stake the underlying
   * to receive LM rewards. In that case, `handleRepayment()` would perform the staking of the underlying asset.
   * @param user The user executing the repayment
   * @param amount The amount getting repaid
   **/
  function handleRepayment(address user, uint256 amount) external;

  /**
   * @notice Returns the address of the underlying asset of this AspanToken (E.g. WETH for aWETH)
   * @return The address of the underlying asset
   **/
  function UNDERLYING_ASSET_ADDRESS() external view returns (address);

  /**
   * @notice Returns the address of the Aave treasury, receiving the fees on this AspanToken.
   * @return Address of the Aave treasury
   **/
  function RESERVE_TREASURY_ADDRESS() external view returns (address);

  /**
   * @notice Get the domain separator for the token
   * @dev Return cached value if chainId matches cache, otherwise recomputes separator
   * @return The domain separator of the token at current chain
   */
  function DOMAIN_SEPARATOR() external view returns (bytes32);

  /**
   * @notice Returns the nonce for owner.
   * @param owner The address of the owner
   * @return The nonce of the owner
   **/
  function nonces(address owner) external view returns (uint256);

  /**
   * @notice Rescue and transfer tokens locked in this contract
   * @param token The address of the token
   * @param to The address of the recipient
   * @param amount The amount of token to transfer
   */
  function rescueTokens(
    address token,
    address to,
    uint256 amount
  ) external;
}
