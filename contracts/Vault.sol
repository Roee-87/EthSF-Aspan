//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IPool} from "../contracts/dependencies/openzeppelin/contracts/IPool.sol";
import {IPoolAddressesProvider} from "../contracts/dependencies/openzeppelin/contracts/IPoolAddressesProvider.sol";
import {IERC20} from "../contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IAspanToken} from "../contracts/tokenization/IAspanToken.sol";
import {IPriceOracle} from "../contracts/oracle/IPriceOracle.sol";

//import {IOracle}
//import {IAspanToken}
//import {IStrategy}

/// @title The master vault contract
/// @author Roy Rotstein, etc
/// @notice the vault contracts accepts user funds and deploys Aspan's investing strategy
/// @dev users can call three functions:  deposit(), withdraw(), checkMyBalance();
contract Vault {
    address private _owner;
    //IStrategy currentStrategy;

    event Deposit(address user, uint256 aspanBalance, uint256 usdcDeposited);
    event Withdraw(address user, uint256 aspanBurned, uint256 usdcWithdrew); //amount deposited, AspanToken minted)
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

    address private poolProviderAddress = 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb; //polygon POS

    address polygonProxyAddr = 0xDef1C0ded9bec7F1a1670819833240f027b25EfF; //mumbai 0x proxy address

    IAspanToken public ASPANTOKEN;
    IPriceOracle private _priceOracle;

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the Owner can access this function");
        _;
    }

    ///@dev We instantiate all of the instances of all the token contracts used in Vault
    constructor() {
        _owner = msg.sender;
        //IStrategy currentStrategy = IStrategy(_stratAddress);
    }

    // function setStrategy(address _strategy) external onlyOwner {
    //     currentStrategy = IStrategy(_strategy);
    // }

    ///@notice The contract accepts a minimum of 100 USDC.  No other type of deposit is allowed.
    ///@dev User must first approve the transfer of _amount.  6 decimals for USDC in Polygon
    ///user deposits _amount of USDC.
    function deposit(uint256 _amount, bytes calldata dc2dtSwapCallData, bytes calldata dc2daiSwapCallData) external {
        uint256 allowance = IERC20(usdcTokenAddress).allowance(msg.sender, address(this));
        //check balance on front end too
        require(allowance >= _amount, "user needs to approve the deposit");
        uint256 aspanPrice = IPriceOracle(_priceOracle).getUSDCPriceOf(address(this), address(ASPANTOKEN), [aaveATokenDaiAddress, aaveATokenUsdcAddress, aaveATokenUsdtAddress]);
        IERC20(usdcTokenAddress).transferFrom(msg.sender, address(this), _amount); //if the checks pass, transfer proceeds
        fillQuote(_amount/3, IERC20(usdcTokenAddress), usdtTokenAddress, dc2dtSwapCallData);
        fillQuote(_amount/3, IERC20(usdcTokenAddress), daiTokenAddress, dc2daiSwapCallData);

        supplyToAave(_amount/3, usdcTokenAddress);
        supplyToAave(_amount/3, usdtTokenAddress);
        supplyToAave(_amount/3, daiTokenAddress);
        IAspanToken(ASPANTOKEN).mint(address(this), msg.sender, _amount/aspanPrice);
        
        emit Deposit(msg.sender, IAspanToken(ASPANTOKEN).balanceOf(msg.sender), _amount);
    }

    function withdraw(uint256 aspanTokenAmount, bytes calldata dt2dcSwapCallData, bytes calldata dai2dcSwapCallData) external {
        require(IERC20(ASPANTOKEN).balanceOf(msg.sender) > aspanTokenAmount);
        IAspanToken(ASPANTOKEN).burn(msg.sender, msg.sender, aspanTokenAmount);
        uint256 aspanPrice = IPriceOracle(_priceOracle).getUSDCPriceOf(address(this), address(ASPANTOKEN), [aaveATokenDaiAddress, aaveATokenUsdcAddress, aaveATokenUsdtAddress]);
        uint256 usdcValue = aspanPrice * aspanTokenAmount;
        // /1e18
        withdrawFromAave(usdcValue/3, usdtTokenAddress);
        withdrawFromAave(usdcValue/3, usdcTokenAddress);
        withdrawFromAave(usdcValue/3, daiTokenAddress);
        fillQuote(usdcValue/3, IERC20(usdtTokenAddress), usdcTokenAddress, dt2dcSwapCallData);
        fillQuote(usdcValue/3, IERC20(daiTokenAddress), usdcTokenAddress, dai2dcSwapCallData);
        IERC20(usdcTokenAddress).transfer(msg.sender, usdcValue);
        emit Withdraw(msg.sender, aspanTokenAmount, usdcValue);
    }

    function getPoolAddress() public view returns (address) {
        return IPoolAddressesProvider(poolProviderAddress).getPool();
    }

    function supplyToAave(uint256 _amount, address tokenAddr) public onlyOwner {
        address poolAddr = getPoolAddress();
        IPool(poolAddr).supply(tokenAddr, _amount, address(this), 0);
    }

    function withdrawFromAave(uint256 _amount, address tokenAddr) internal {
        address poolAddr = getPoolAddress();
        //function withdraw(address asset, uint256 amount, address to)
        IPool(poolAddr).withdraw(tokenAddr, _amount, address(this)); 
    }

    function setAspanTokenAddress(IAspanToken newAspanToken) external onlyOwner{
        ASPANTOKEN = newAspanToken;
    }

    function setPriceOracle(IPriceOracle newPriceOracle) external onlyOwner{
        _priceOracle = newPriceOracle;
    }

    function rescueFund(address tokenAddress, address to) external onlyOwner{
        IERC20(tokenAddress).transfer(to,IERC20(tokenAddress).balanceOf(address(this)));
    }

    //swap function
    function fillQuote(
        // amount to swap -- for approve function
        uint256 amount,
        // // The `sellTokenAddress` field from the API response.
        IERC20 sellToken,
        // // The `buyTokenAddress` field from the API response.
        // IERC20 buyToken,
        // // The `allowanceTarget` field from the API response.
        //address spender,
        // The `to` field from the API response.
        address swapTarget,
        // The `data` field from the API response.
        bytes calldata swapCallData
    )
        internal
    // Must attach ETH equal to the `value` field from the API response.
    {
        // require swapTarget == polygonProxyAddr
        require(
            swapTarget == polygonProxyAddr,
            "proxy address isn't the same as swapTarget address! Dubug this"
        );

        // Give `spender` an infinite allowance to spend this contract's `sellToken`.
        // Note that for some tokens (e.g., USDT, KNC), you must first reset any existing
        // allowance to 0 before being able to update it.
        //IERC20 daiCon = IERC20(0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1);
        require(sellToken.approve(swapTarget, 0), "approve to 0 failed");
        require(sellToken.approve(swapTarget, amount), "approve failed");

        // Call the encoded swap function call on the contract at `swapTarget`,
        // passing along any ETH attached to this function call to cover protocol fees.
        (bool success, ) = swapTarget.call(swapCallData);
        require(success, "SWAP_CALL_FAILED");
        // Refund any unspent protocol fees to the sender.
        //msg.sender.transfer(address(this).balance);

        // ...
    }
}
