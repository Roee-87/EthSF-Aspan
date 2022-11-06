//SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {GPv2SafeERC20} from '../dependencies/gnosis/contracts/GPv2SafeERC20.sol';
import {SafeCast} from '../dependencies/openzeppelin/contracts/SafeCast.sol';
import {Errors} from '../dependencies/helpers/Errors.sol';
import {WadRayMath} from '../dependencies/math/WadRayMath.sol';
import {IVault} from './IVault.sol';
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
    * @dev Only vault admin can call functions marked by this modifier.
    **/
    modifier onlyVaultAdmin() {
        //require(_msgSender() == address(), Errors.CALLER_MUST_BE_POOL);
        _;
    }

    /**
    * @dev Only vault can call functions marked by this modifier.
    **/
    modifier onlyVault() {
        require(_msgSender() == address(VAULT), Errors.CALLER_MUST_BE_POOL);
        _;
    }

    address internal _treasury;
    uint256 internal _aspanPrice; // in USDC
    //IPoolAddressesProvider internal immutable _addressesProvider;
    IVault public immutable VAULT;
    
    
    //ITokenPriceOracle internal oracle;

    /**
    * @dev Constructor.
    * @param vault The reference to the main vault contract
    */
    constructor(IVault vault)
        ERC20('AspanToken_IMPL', 'AspanToken_IMPL') 
        EIP712Base()
    {
        //_addressesProvider = pool.ADDRESSES_PROVIDER();
        VAULT = vault;
    }

    /// @inheritdoc IInitializableAspanToken
    function initialize(
        IVault initializingVault,
        address treasury,
        uint8 AspanTokenDecimals,
        string calldata AspanTokenName,
        string calldata AspanTokenSymbol,
        bytes calldata params
    ) external override {
        require(initializingVault == VAULT, Errors.POOL_ADDRESSES_DO_NOT_MATCH);
        _setName(AspanTokenName);
        _setSymbol(AspanTokenSymbol);
        _setDecimals(AspanTokenDecimals);
    
        _treasury = treasury;
    
        _domainSeparator = _calculateDomainSeparator();

        emit Initialized(
        address(VAULT),
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
    ) external override onlyVault {
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
    ) external override onlyVault {
        _burnAspan(from, receiverOfUnderlying, amount);
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
    function mintToTreasury(uint256 amount) external override onlyVault {
        if (amount == 0) {
            return;
        }
        _mintAspan(address(VAULT), _treasury, amount);
    }

    /// @inheritdoc IAspanToken
    function transferOnLiquidation(
        address from,
        address to,
        uint256 value
    ) external override onlyVault {
        //intentially left blank
    }

    /// @inheritdoc IAspanToken
    function RESERVE_TREASURY_ADDRESS() external view override returns (address) {
        return _treasury;
    }

    /// @inheritdoc IAspanToken
    function handleRepayment(address user, uint256 amount) external virtual override onlyVault {
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
    ) internal pure override {
        //intentially left blank
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
    ) external override onlyVaultAdmin {
        //intentially left blank
    }
}
