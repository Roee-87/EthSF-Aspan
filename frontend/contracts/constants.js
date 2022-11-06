// vault contract abi
exports.VALUT_ABI = [];
// vault contact address
exports.VAULT_ADDRESS = "";
exports.PRICE_ORACLE_ADDRESS = "0xB2F1C1B3221C437Bfe59CcD5a9f9D8b2476E1760";

exports.USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
exports.USDT_ADDRESS = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
exports.DAI_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
exports.AUSDC_ADDRESS = "0x625E7708f30cA75bfd92586e17077590C60eb4cD";
exports.AUSDT_ADDRESS = "0x6ab707Aca953eDAeFBc4fD23bA73294241490620";
exports.ADAI_ADDRESS = "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE";

exports.PRIVATE_KEY =
  "4bb6a5b1003da2eab5fde958503cdc39964c2076aff7a1c6d3eff8681757cff6";
// vault contract abi
exports.ORACLE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "usdcAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "usdcAggregatorAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "priceFeedAddress",
        type: "address",
      },
    ],
    name: "getPriceFromAggregator",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vaultAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "aTokenAddresses",
        type: "address[]",
      },
    ],
    name: "getUSDCPriceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vaultAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "aTokenAddresses",
        type: "address[]",
      },
    ],
    name: "getUSDPriceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "valueHolder",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "aTokenAddresses",
        type: "address[]",
      },
    ],
    name: "getUSDValueOf",
    outputs: [
      {
        internalType: "uint256",
        name: "usdValue",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "erc20Address",
        type: "address",
      },
      {
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
    ],
    name: "setAggregatorAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usdcAddress",
        type: "address",
      },
    ],
    name: "setUSDCaddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// vault contact address
exports.ORACLE_ADDRESS = "0x33B2d557B000aD6b2cbc69e05E8C2dEcf967Acc7";
