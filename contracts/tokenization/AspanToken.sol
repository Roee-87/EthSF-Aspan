//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {GPv2SafeERC20} from '../dependencies/gnosis/contracts/GPv2SafeERC20.sol';
import {SafeCast} from '../dependencies/openzeppelin/contracts/SafeCast.sol';
import {Errors} from '../libraries/helpers/Errors.sol';
import {WadRayMath} from '../libraries/math/WadRayMath.sol';
import {IPool} from './IPool.sol';
import {AspanToken} from './IAspanToken.sol';
import {IInitializableAspanToken} from './IInitializableAspanToken.sol';
import {EIP712Base} from './base/EIP712Base.sol';

contract AspanToken is IAspanToken, IncentivizedERC20, EIP712Base {
    using WadRayMath for uint256;
    using SafeCast for uint256;
    using GPv2SafeERC20 for IERC20;

    address internal _treasury;
    address internal _underlyingAsset;

    uint256 tokenPrice; // in USDC
    uint256 aspanTokenAmountMint;
    uint256 aspanTokenAmountBurn;
    ITokenPriceOracle oracle;
    address owner;

    //number of decimals
    constructor(IPool pool)
        InventivizedERC20(pool, 'AspanToken_IMPL', 'AspanToken_IMPL', 0) 
        EIP712Base()
    {
    // Intentionally left blank
    }

    /// @inheritdoc IInitializableAspanToken
    function initialize(
        IPool initializingPool,
        address treasury,
        address underlyingAsset,
        uint8 AspanTokenDecimals,
        string calldata AspanTokenName,
        string calldata AspanTokenSymbol,
        bytes calldata params
    ) external override initializer {
        require(initializingPool == POOL, Errors.POOL_ADDRESSES_DO_NOT_MATCH);
        _setName(AspanTokenName);
        _setSymbol(AspanTokenSymbol);
        _setDecimals(AspanTokenDecimals);
    
        _treasury = treasury;
        _underlyingAsset = underlyingAsset;
    
        _domainSeparator = _calculateDomainSeparator();

        emit Initialized(
        underlyingAsset,
        address(POOL),
        treasury,
        address(incentivesController),
        AspanTokenDecimals,
        AspanTokenName,
        AspanTokenSymbol,
        params
        );
    }

    /// @inheritdoc AspanToken
    function mint(
        address caller,
        address onBehalfOf,
        uint256 amount,
        uint256 index
    ) external virtual override onlyPool returns (bool) {
        return _mintScaled(caller, onBehalfOf, amount, index);
    }

    /// @inheritdoc AspanToken
    function burn(
        address from,
        address receiverOfUnderlying,
        uint256 amount,
        uint256 index
    ) external virtual override onlyPool {
        _burnScaled(from, receiverOfUnderlying, amount, index);
        if (receiverOfUnderlying != address(this)) {
        IERC20(_underlyingAsset).safeTransfer(receiverOfUnderlying, amount);
        }
    }

    /// @inheritdoc AspanToken
    function mintToTreasury(uint256 amount, uint256 index) external override onlyPool {
        if (amount == 0) {
        return;
        }
        _mintScaled(address(POOL), _treasury, amount, index);
    }

    /// @inheritdoc AspanToken
    function transferOnLiquidation(
        address from,
        address to,
        uint256 value
    ) external override onlyPool {
        // Being a normal transfer, the Transfer() and BalanceTransfer() are emitted
        // so no need to emit a specific event here
        _transfer(from, to, value, false);

        emit Transfer(from, to, value);
    }

    /// @inheritdoc IERC20
    function balanceOf(address user)
        public
        view
        virtual
        override(IncentivizedERC20, IERC20)
        returns (uint256)
    {
        return super.balanceOf(user).rayMul(POOL.getReserveNormalizedIncome(_underlyingAsset));
    }

    /// @inheritdoc IERC20
    function totalSupply() public view virtual override(IncentivizedERC20, IERC20) returns (uint256) {
        uint256 currentSupplyScaled = super.totalSupply();

        if (currentSupplyScaled == 0) {
        return 0;
        }

        return currentSupplyScaled.rayMul(POOL.getReserveNormalizedIncome(_underlyingAsset));
    }

    /// @inheritdoc AspanToken
    function RESERVE_TREASURY_ADDRESS() external view override returns (address) {
        return _treasury;
    }

    /// @inheritdoc AspanToken
    function UNDERLYING_ASSET_ADDRESS() external view override returns (address) {
        return _underlyingAsset;
    }

    /// @inheritdoc AspanToken
    function transferUnderlyingTo(address target, uint256 amount) external virtual override onlyPool {
        IERC20(_underlyingAsset).safeTransfer(target, amount);
    }

    /// @inheritdoc AspanToken
    function handleRepayment(address user, uint256 amount) external virtual override onlyPool {
        // Intentionally left blank
    }

    /// @inheritdoc AspanToken
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override {
        require(owner != address(0), Errors.ZERO_ADDRESS_NOT_VALID);
        //solium-disable-next-line
        require(block.timestamp <= deadline, Errors.INVALID_EXPIRATION);
        uint256 currentValidNonce = _nonces[owner];
        bytes32 digest = keccak256(
        abi.encodePacked(
            '\x19\x01',
            DOMAIN_SEPARATOR(),
            keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline))
        )
        );
        require(owner == ecrecover(digest, v, r, s), Errors.INVALID_SIGNATURE);
        _nonces[owner] = currentValidNonce + 1;
        _approve(owner, spender, value);
    }

    /**
    * @notice Transfers the AspanTokens between two users. Validates the transfer
    * (ie checks for valid HF after the transfer) if required
    * @param from The source address
    * @param to The destination address
    * @param amount The amount getting transferred
    * @param validate True if the transfer needs to be validated, false otherwise
    **/
    function _transfer(
        address from,
        address to,
        uint256 amount,
        bool validate
    ) internal {
        address underlyingAsset = _underlyingAsset;

        uint256 index = POOL.getReserveNormalizedIncome(underlyingAsset);

        uint256 fromBalanceBefore = super.balanceOf(from).rayMul(index);
        uint256 toBalanceBefore = super.balanceOf(to).rayMul(index);

        super._transfer(from, to, amount.rayDiv(index).toUint128());

        if (validate) {
        POOL.finalizeTransfer(underlyingAsset, from, to, amount, fromBalanceBefore, toBalanceBefore);
        }

        emit BalanceTransfer(from, to, amount, index);
    }

    /**
    * @notice Overrides the parent _transfer to force validated transfer() and transferFrom()
    * @param from The source address
    * @param to The destination address
    * @param amount The amount getting transferred
    **/
    function _transfer(
        address from,
        address to,
        uint128 amount
    ) internal override {
        _transfer(from, to, amount, true);
    }

    /**
    * @dev Overrides the base function to fully implement AspanToken
    * @dev see `IncentivizedERC20.DOMAIN_SEPARATOR()` for more detailed documentation
    */
    function DOMAIN_SEPARATOR() public view override(AspanToken, EIP712Base) returns (bytes32) {
        return super.DOMAIN_SEPARATOR();
    }

    /**
    * @dev Overrides the base function to fully implement AspanToken
    * @dev see `IncentivizedERC20.nonces()` for more detailed documentation
    */
    function nonces(address owner) public view override(AspanToken, EIP712Base) returns (uint256) {
        return super.nonces(owner);
    }

    /// @inheritdoc EIP712Base
    function _EIP712BaseId() internal view override returns (string memory) {
        return name();
    }

    /// @inheritdoc AspanToken
    function rescueTokens(
        address token,
        address to,
        uint256 amount
    ) external override onlyPoolAdmin {
        require(token != _underlyingAsset, Errors.UNDERLYING_CANNOT_BE_RESCUED);
        IERC20(token).safeTransfer(to, amount);
    }

    /*constructor(address oracleAddress) ERC20("ASPAN", "ARP") {
        oracle = ITokenPriceOracle(oracleAddress);
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
    }*/
}
