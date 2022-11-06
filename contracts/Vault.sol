//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IPool} from "../dependencies/IPool.sol";
import {IPoolAddressesProvider} from "../dependencies/IPoolAddressesProvider.sol";
import {IERC20} from "../dependencies/IERC20.sol";
import {IAspanToken} from "EthSF-Aspan/contracts/tokenization/IAspanToken.sol";
import {IPriceOracle} from "EthSF-Aspan/contracts/oracle/IPriceOracle.sol";

//import {IOracle}
//import {IAspanToken}
//import {IStrategy}

/// @title The master vault contract
/// @author Roy Rotstein, etc
/// @notice the vault contracts accepts user funds and deploys Aspan's investing strategy
/// @dev users can call three functions:  deposit(), withdraw(), checkMyBalance();
contract Vault {
        address private _owner;

    Ipool pool;

    //@dev List of token addresses and corresponding Aave ATokens that we use in this strategy
    address private constant usdcTokenAddress =
        0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address private constant daiTokenAddress =
        0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address private constant usdtTokenAddress =
        0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address private constant aaveATokenUsdcAddress =
        0x625E7708f30cA75bfd92586e17077590C60eb4cD;
    address private constant aaveATokenDaiAddress =
        0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE;
    address private constant aaveATokenUsdtAddress =
        0x6ab707Aca953eDAeFBc4fD23bA73294241490620;
    address private constant zeroExPolygonExchangeProxyAddress =
        0xDef1C0ded9bec7F1a1670819833240f027b25EfF;
    address private constant poolProviderAddress =
        0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb;

    //@dev List of all the token contracts we will use in this strategy
    IERC20 private _usdcToken;
    IERC20 private _daiToken;
    IERC20 private _usdtToken;
    IERC20 private _aaveATokenUsdc;
    IERC20 private _aaveATokenDai;
    IERC20 private _aaveATokenUsdt;

    modifier onlyOwner() {
        require(
            msg.sender == _owner,
            "Only the Owner can access this function"
        );
        _;
    }
    event NewDeposit(address indexed user, uint256 indexed amount);

    ///@dev We instantiate all of the instances of all the token contracts used in Vault
    constructor() {
        _owner = msg.sender;
        _usdcToken = IERC20(usdcTokenAddress);
        _daiToken = IERC20(daiTokenAddress);
        _usdtToken = IERC20(usdtTokenAddress);
        _aaveATokenUsdc = IERC20(aaveATokenUsdcAddress);
        _aaveATokenDai = IERC20(aaveATokenDaiAddress);
        _aaveATokenUsdt = IERC20(aaveATokenUsdtAddress);

        //IStrategy currentStrategy = IStrategy(_stratAddress);
    }

    // function setStrategy(address _strategy) external onlyOwner {
    //     currentStrategy = IStrategy(_strategy);
    // }

    ///@notice The contract accepts a minimum of 10 USDC.  No other type of deposit is allowed.
    ///@dev User must first approve the transfer of _amount.  6 decimals for USDC in Polygon
    ///user deposits _amount of USDC.
    function depositUsdcIntoVault(
        uint256 _amount, //this is an amount of USDC
        bytes calldata daiData, //generated off chain prior to function call
        bytes calldata usdtData //generated off chain prior to function call
    ) external {
        address user = msg.sender;
        uint256 allowance = _usdcToken.allowance(user, address(this)); //prior approval by user necessary
        //check balance on front end too

        require(allowance >= _amount, "user needs to approve the deposit");

        _usdcToken.transferFrom(user, address(this), _amount); //if the checks pass, transfer proceeds
        //swap 1/3 of _amount to Dai
        swap0x(_amount / 3, daiData);
        //swap 1/3 of _amount to USDT
        swap0x(_amount / 3, usdtData);

        uint256 amountUsdc = _usdcToken.balanceOf(address(this));
        uint256 amountDai = _daiToken.balanceOf(address(this));
        uint256 amountUsdt = _usdtToken.balanceOf(address(this));

        deployFundsToAave(amountUsdc, usdcTokenAddress);
        deployFundsToAave(amountDai, daiTokenAddress);
        deployFundsToAave(amountUsdt, usdtTokenAddress);

        emit NewDeposit(user, _amount);
    }

    function withdrawUSDCFromVault(uint256 aspanTokenAmount) external {
        address user = msg.sender;
        require(IERC20(ASPANTOKEN).balanceOf(msg.sender) > aspanTokenAmount);
        IAspanToken(ASPANTOKEN).burn(msg.sender, msg.sender, _aspanTokenAmount);
        
        

        usdcToken.transferFrom(user, address(this), _amount); //if the checks pass, transfer proceeds

        uint256 swappedDai = swapUsdcToDai(_amount / 3);
        uint256 swappedUsdt = swapUsdcToUsdt(_amount / 3);

        supplyUsdcToAave(_amount / 3);
        supplyDaiToAave(swappedDai);
        supplyUsdtToAave(swappedUsdt);

        //mint AsPan Token to the user:  USDC / oracle price

        // uint256 totalValue = aspanToken.balance(user) * oracle price

        emit UserDepositedFunds(user, aspanToken.balance(user), _amount); //amount deposited, AspanToken minted)
    }

    function setAspanTokenAddress(IAspanToken newAspanToken) external onlyOwner{
        ASPANTOKEN = newAspanToken;
    }

    function setPriceOracle(IAspanToken newPriceOracle) external onlyOwner{
        _priceOracle = newPriceOracle;
    }
}
