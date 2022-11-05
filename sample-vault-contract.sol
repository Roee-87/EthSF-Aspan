//SPDX-License-Identifier:  MIT
pragma solidity 0.8.17;

import "./IStrategy.sol";
import "./I_IndexToken.sol";
import "./ITokenPriceOracle.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    //state variables

    uint256 counterId = 1;

    address[] auth; //list of authorized users who can change strategy and activate "kill" switch in case of an emergency (token death spiral)

    IStrategy strategy;
    I_IndexToken aspanTokenContract;
    ITokenPriceOracle oracleContract;
    IERC20 usdcContract;

    struct User {
        uint256 id;
        address addr;
        uint256 totalUsdcDeposited;
    }

    //mappings
    mapping(address => User) users;

    modifier onlyAuthorized() {
        bool check;
        for (uint8 i = 0; i < auth.length; i++) {
            if (auth[i] == msg.sender) {
                check = true;
            }
        }
        require(check, "Not authorized!");
        _;
    }

    constructor(
        address _oracleAddr,
        address _aspanTokenAddr,
        address _usdcAddr,
        address strategyContractAddress,
        address addr1,
        address addr2,
        address addr3,
        address addr4
    ) {
        oracleContract = ITokenPriceOracle(_oracleAddr);
        aspanTokenContract = I_IndexToken(_aspanTokenAddr);
        usdcContract = IERC20(_usdcAddr);
        strategy = IStrategy(strategyContractAddress);
        auth = [addr1, addr2, addr3, addr4]; //our addresses
    }

    // If we want to change strategies later on, we can instantiate the new strategy contract by calling this function
    function changeStrategy(address newStrategyContractAddress)
        external
        onlyAuthorized
    {
        strategy = IStrategy(newStrategyContractAddress);
    }

    //functions

    //deposit function will need to:
    //1.  convert whitelisted tokens to USDC using 0X swap
    //2.  transfer USDC to smart contract
    //3.  User receives Aspan tokens
    //4.  smart contract directs USDC funds to strategy

    function deposit(uint256 _amountUSDC) external {
        require(_amountUSDC > 0, "Nothing deposited");
        if (users[msg.sender].id == 0) {
            users[msg.sender] = User(counterId, msg.sender, _amountUSDC); //new user is created
            counterId++; //increment counter ID after new user is registered
        }
        users[msg.sender].totalUsdcDeposited += _amountUSDC; //increment USDC deposited by _amount
        usdcContract.transferFrom(msg.sender, address(this), _amountUSDC); // USDC now is in the smartcontract and can be redirected to our strategies.
        aspanTokenContract.mintIndexTokens(msg.sender, _amountUSDC);
        strategy.addToPosition(_amountUSDC); //deploy the funds to our strategy.  This may need to be a separate function outside of deposit() because the state will not have been updated to reflect our contract's balance of USDC.
    }

    function withdraw(uint256 _amountUSDC) external {
        uint256 balance = getMyBalance();
        require(
            _amountUSDC <= balance,
            "withdrawl amount exceeds current balance"
        );
        users[msg.sender].totalUsdcDeposited -= _amountUSDC;
        aspanTokenContract.burnIndexTokens(msg.sender, _amountUSDC); //burn the required amount of index tokens
        strategy.exitPosition(_amountUSDC); //remove the desired amount of funds from the strategy.  User sets the amount in USDC
        usdcContract.transferFrom(address(this), msg.sender, _amountUSDC); //transfer USDC back to the user.  Again, will probably need to be outside of withdraw();
    }

    //users can transfer funds between accounts.  _sum is in USDC  our token smart contract handles the conversion from USDC to Arpan tokens.
    function transferToAnotherAccount(address _otherAccount, uint256 _sum)
        external
    {
        require(
            getMyBalance() >= _sum,
            "You are trying to transfer more money than is in your account!"
        );
        require(
            users[_otherAccount].id != 0,
            "This user doesn't have an account!"
        );
        require(
            msg.sender != _otherAccount,
            "Transfering to yourself is frivolous and not allowed!"
        );
        aspanTokenContract.mintIndexTokens(_otherAccount, _sum);
        aspanTokenContract.burnIndexTokens(msg.sender, _sum);
    }

    // view functions
    //returns balance in USDC by checking allotment of Arpan tokens
    function getMyBalance() public view returns (uint256) {
        return
            oracleContract.getIndexPrice() *
            aspanTokenContract.balanceOf(msg.sender);
    }
}
