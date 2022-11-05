//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ITokenPriceOracle.sol";

contract IndexToken is ERC20 {
    uint256 tokenPrice; // in USDC
    uint256 aspanTokenAmountMint;
    uint256 aspanTokenAmountBurn;
    ITokenPriceOracle oracle;
    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address oracleAddress) ERC20("ASPAN", "ARP") {
        oracle = ITokenPriceOracle(oracleAddress);
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        //revert();
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        //revert();
    }

    function mintIndexTokens(address depositer, uint256 totalUSDC)
        external
        onlyOwner
    {
        tokenPrice = oracle.getIndexPrice();
        aspanTokenAmountMint = totalUSDC / tokenPrice;
        _mint(depositer, aspanTokenAmountMint);
    }

    function burnIndexTokens(address withdrawer, uint256 totalUSDC)
        external
        onlyOwner
    {
        tokenPrice = oracle.getIndexPrice();
        aspanTokenAmountBurn = totalUSDC / tokenPrice;
        _burn(withdrawer, aspanTokenAmountBurn);
    }

    //This allows us to designate our Vault contract as the "owner" that has sole authority to mint and burn index tokens
    function setNewOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }
}
