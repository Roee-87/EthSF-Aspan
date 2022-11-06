//SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {GPv2SafeERC20} from '../dependencies/gnosis/contracts/GPv2SafeERC20.sol';
import {SafeCast} from '../dependencies/openzeppelin/contracts/SafeCast.sol';
import {Errors} from '../dependencies/helpers/Errors.sol';
import {WadRayMath} from '../dependencies/math/WadRayMath.sol';
import {IPool} from './IPool.sol';
import {IAspanToken} from './IAspanToken.sol';
import {IInitializableAspanToken} from './IInitializableAspanToken.sol';
import {EIP712Base} from '../dependencies/openzeppelin/contracts/EIP712Base.sol';
import {ERC20} from '../dependencies/openzeppelin/contracts/ERC20.sol';
import {IPoolAddressesProvider} from '../dependencies/openzeppelin/contracts/IPoolAddressesProvider.sol';
import {IACLManager} from '../dependencies/openzeppelin/contracts/IACLManager.sol';

contract AspanToken is IAspanToken, ERC20, EIP712Base {
    using WadRayMath for uint256;
    using SafeCast for uint256;
    using GPv2SafeERC20 for IERC20;

    bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");

    /**
    * @dev Only pool admin can call functions marked by this modifier.
    **/
    modifier onlyPoolAdmin() {
        //require(_msgSender() == address(), Errors.CALLER_MUST_BE_POOL);
        _;
    }

    /**
    * @dev Only pool can call functions marked by this modifier.
    **/
    modifier onlyPool() {
        require(_msgSender() == address(POOL), Errors.CALLER_MUST_BE_POOL);
        _;
    }

    address internal _treasury;
    address internal _underlyingAsset;
    uint256 internal _aspanPrice; // in USDC
    //IPoolAddressesProvider internal immutable _addressesProvider;
    IPool public immutable POOL;
    
    
    //ITokenPriceOracle internal oracle;

    /**
    * @dev Constructor.
    * @param pool The reference to the main Pool contract
    */
    constructor(IPool pool)
        ERC20('AspanToken_IMPL', 'AspanToken_IMPL') 
        EIP712Base()
    {
        //_addressesProvider = pool.ADDRESSES_PROVIDER();
        POOL = pool;
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
    ) external override {
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
        AspanTokenDecimals,
        AspanTokenName,
        AspanTokenSymbol,
        params
        );
    }

    /// @inheritdoc IAspanToken
    function mint(
        address caller,
        address onBehalfOf,
        uint256 amount
    ) external override onlyPool {
        _mintAspan(caller, onBehalfOf, amount);
        return;
    }

    function _mintAspan(
        address caller,
        address onBehalfOf,
        uint256 amount
    ) internal {
        require(amount != 0, Errors.INVALID_MINT_AMOUNT);
        emit Mint(caller, onBehalfOf, amount);
        _mint(onBehalfOf, amount);
        return;
    }

    /// @inheritdoc IAspanToken
    function burn(
        address from,
        address receiverOfUnderlying,
        uint256 amount
    ) external override onlyPool {
        _burnAspan(from, receiverOfUnderlying, amount);
        if (receiverOfUnderlying != address(this)) {
        IERC20(_underlyingAsset).safeTransfer(receiverOfUnderlying, amount * _aspanPrice);
        }
    }

    function _burnAspan(
        address from,
        address receiverOfUnderlying,
        uint256 amount
    ) internal {
        require(amount != 0, Errors.INVALID_BURN_AMOUNT);
        _burn(from, amount);
        emit Burn(from, receiverOfUnderlying, amount);
    }

    /// @inheritdoc IAspanToken
    function mintToTreasury(uint256 amount) external override onlyPool {
        if (amount == 0) {
            return;
        }
        _mintAspan(address(POOL), _treasury, amount);
    }

    /// @inheritdoc IAspanToken
    function transferOnLiquidation(
        address from,
        address to,
        uint256 value
    ) external override onlyPool {
        // Being a normal transfer, the Transfer() and BalanceTransfer() are emitted
        // so no need to emit a specific event here
        _transfer(from, to, value);
        
    }

    /// @inheritdoc IAspanToken
    function RESERVE_TREASURY_ADDRESS() external view override returns (address) {
        return _treasury;
    }

    /// @inheritdoc IAspanToken
    function UNDERLYING_ASSET_ADDRESS() external view override returns (address) {
        return _underlyingAsset;
    }

    /// @inheritdoc IAspanToken
    function transferUnderlyingTo(address target, uint256 amount) external virtual override onlyPool {
        IERC20(_underlyingAsset).safeTransfer(target, amount);
    }

    /// @inheritdoc IAspanToken
    function handleRepayment(address user, uint256 amount) external virtual override onlyPool {
        // Intentionally left blank
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
        uint256 amount
    ) internal override {
        revert();
    }

    /**
   * @dev Overrides the base function to fully implement IAToken
   * @dev see `IncentivizedERC20.DOMAIN_SEPARATOR()` for more detailed documentation
   */
    function DOMAIN_SEPARATOR() public view override(IAspanToken, EIP712Base) returns (bytes32) {
        return super.DOMAIN_SEPARATOR();
    }

    /**
    * @dev Overrides the base function to fully implement AspanToken
    * @dev see `IncentivizedERC20.nonces()` for more detailed documentation
    */
    function nonces(address owner) public view override(IAspanToken, EIP712Base) returns (uint256) {
        return super.nonces(owner);
    }

    /// @inheritdoc EIP712Base
    function _EIP712BaseId() internal view override returns (string memory) {
        return name();
    }

    function rescueTokens(
        address token,
        address to,
        uint256 amount
    ) external override onlyPoolAdmin {
        require(token != _underlyingAsset, Errors.UNDERLYING_CANNOT_BE_RESCUED);
        IERC20(token).safeTransfer(to, amount);
    }
}
