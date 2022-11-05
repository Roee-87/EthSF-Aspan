// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./IAToken.sol";
import "./IdERC20.sol";
import "./IPriceOracle.sol";

contract PriceOracle is IPriceOracle, Ownable {
    mapping(address => address) private s_USDAggregatorAddresses;
    address private s_USDCaddress;

    constructor(address usdcAddress, address usdcAggregatorAddress) {
        setUSDCaddress(usdcAddress);
        setAggregatorAddress(usdcAddress, usdcAggregatorAddress);
    }

    function _toWei(uint256 number, uint256 decimals)
        internal
        pure
        returns (uint256)
    {
        uint256 power = 18 - decimals;
        return number * (10**power);
    }

    function _getUnderlyingAddressOf(address aTokenAddress)
        internal
        view
        returns (address)
    {
        IAToken aToken = IAToken(aTokenAddress);
        address underlyingAddress = aToken.UNDERLYING_ASSET_ADDRESS();

        return underlyingAddress;
    }

    function _getUnderlyingBalanceOf(address owner, address aTokenAddress)
        internal
        view
        returns (uint256)
    {
        IERC20 underlyingToken = IERC20(_getUnderlyingAddressOf(aTokenAddress));
        return underlyingToken.balanceOf(owner);
    }

    function getPriceFromAggregator(address priceFeedAddress)
        public
        view
        returns (uint256)
    {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();

        return _toWei(uint256(price), priceFeed.decimals());
    }

    function setUSDCaddress(address usdcAddress) public onlyOwner {
        s_USDCaddress = usdcAddress;
    }

    function setAggregatorAddress(
        address erc20Address,
        address aggregatorAddress
    ) public onlyOwner {
        s_USDAggregatorAddresses[erc20Address] = aggregatorAddress;
    }

    function getValueOf(address valueHolder, address[] calldata aTokenAddresses)
        public
        view
        returns (uint256)
    {
        uint256 usdValue;
        for (uint256 i = 0; i < aTokenAddresses.length; i++) {
            address aTokenAddress = aTokenAddresses[i];
            IdERC20 aToken = IdERC20(aTokenAddress);

            uint256 aBalanceOfVault = aToken.balanceOf(valueHolder);
            uint256 pricePerToken = getPriceFromAggregator(
                s_USDAggregatorAddresses[_getUnderlyingAddressOf(aTokenAddress)]
            );

            usdValue += (_toWei(aBalanceOfVault, aToken.decimals()) *
                pricePerToken);
        }

        // converting total usd value to usdc value
        // (bc we are returning usdc to the user => price has to be in usdc)
        return
            usdValue *
            (1e18 /
                getPriceFromAggregator(
                    s_USDAggregatorAddresses[s_USDCaddress]
                ));
    }

    function getPriceOf(
        address vaultAddress,
        address tokenAddress,
        address[] calldata aTokenAddresses
    ) external view override returns (uint256) {
        return
            getValueOf(vaultAddress, aTokenAddresses) /
            IERC20(tokenAddress).totalSupply();
    }
}
