// import fetch from "node-fetch";
import "react-native-get-random-values";
import "@ethersproject/shims";
import qs from "querystring";

import { ethers } from "ethers";

import {
  VAULT_ADDRESS,
  VAULT_ABI,
  ORACLE_ADDRESS,
  ORACLE_ABI,
  PRIVATE_KEY,
} from "./constants";
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [],
    name: "adrs",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "data",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getData",
    outputs: [{ internalType: "string", name: "dats", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "ownero", type: "address" },
      { internalType: "string", name: "collName", type: "string" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newData", type: "string" }],
    name: "setData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];
const vault_abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "aspanBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdcDeposited",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "aspanBurned",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdcWithdrew",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "ASPANTOKEN",
    outputs: [
      { internalType: "contract IAspanToken", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "bytes", name: "dc2dtSwapCallData", type: "bytes" },
      { internalType: "bytes", name: "dc2daiSwapCallData", type: "bytes" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "rescueFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IAspanToken",
        name: "newAspanToken",
        type: "address",
      },
    ],
    name: "setAspanTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPriceOracle",
        name: "newPriceOracle",
        type: "address",
      },
    ],
    name: "setPriceOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "tokenAddr", type: "address" },
    ],
    name: "supplyToAave",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "aspanTokenAmount", type: "uint256" },
      { internalType: "bytes", name: "dt2dcSwapCallData", type: "bytes" },
      { internalType: "bytes", name: "dai2dcSwapCallData", type: "bytes" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const price_oracle_abi = [
  {
    inputs: [
      { internalType: "address", name: "usdcAddress", type: "address" },
      {
        internalType: "address",
        name: "usdcAggregatorAddress",
        type: "address",
      },
      { internalType: "address", name: "usdtAddress", type: "address" },
      {
        internalType: "address",
        name: "usdtAggregatorAddress",
        type: "address",
      },
      { internalType: "address", name: "daiAddress", type: "address" },
      {
        internalType: "address",
        name: "daiAggregatorAddress",
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
      { internalType: "address", name: "priceFeedAddress", type: "address" },
    ],
    name: "getPriceFromAggregator",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "vaultAddress", type: "address" },
      { internalType: "address", name: "tokenAddress", type: "address" },
      {
        internalType: "address[3]",
        name: "aTokenAddresses",
        type: "address[3]",
      },
    ],
    name: "getUSDCPriceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "vaultAddress", type: "address" },
      { internalType: "address", name: "tokenAddress", type: "address" },
      {
        internalType: "address[3]",
        name: "aTokenAddresses",
        type: "address[3]",
      },
    ],
    name: "getUSDPriceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "valueHolder", type: "address" },
      {
        internalType: "address[3]",
        name: "aTokenAddresses",
        type: "address[3]",
      },
    ],
    name: "getUSDValueOf",
    outputs: [{ internalType: "uint256", name: "usdValue", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
      { internalType: "address", name: "erc20Address", type: "address" },
      { internalType: "address", name: "aggregatorAddress", type: "address" },
    ],
    name: "setAggregatorAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "usdcAddress", type: "address" }],
    name: "setUSDCaddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const usdc_abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];
const price_oracle_address = "0xB2F1C1B3221C437Bfe59CcD5a9f9D8b2476E1760";
const vault_address = "0x11a4905161E79a5d5bACbF7e4c72Cb57407E0e09";
const affiliate_address = "0x2FA9B4f9A126b8E7B76666a24370D6087CbDeDDd";

export const getCallData = async (sellAddress, buyAddress, amount) => {
  const params = {
    sellToken: sellAddress,
    buyToken: buyAddress,
    sellAmount: amount.toString(),
    affiliateAddress: affiliate_address,
  };
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  const response = await fetch(
    `https://polygon.api.0x.org/swap/v1/quote?${query}`
  );
  const { data } = await response.json();
  console.log(data);

  return data;
};

export async function approveETH() {
  const polygon_rpc =
    "https://polygon-mainnet.g.alchemy.com/v2/DWQwRdeh1rp2H4l1aaw1p2OXDHhHYgsF";
  const provider = new ethers.providers.JsonRpcProvider(polygon_rpc);
  const contract_address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  var walletPrivateKey = new ethers.Wallet(PRIVATE_KEY).connect(provider);
  const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const USDT_ADDRESS = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
  const DAI_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  const va = "0x90F3028c9a1B1c4FFadF2ad2B09fAD55ee978C9a";
  // call approve for usdc from pK to vault contract
  var USDCContract = new ethers.Contract(
    USDC_ADDRESS,
    usdc_abi,
    walletPrivateKey
  );
  var amount = 1000;
  //   // amount in wei?
  console.log("starting transaction");
  var result = await USDCContract.approve(va, 10000000, {
    maxFeePerGas: 4000000,
    maxPriorityFeePerGas: 3000000,
  });
  // var result = await USDCContract.totalSupply();
  console.log(result);
  console.log("FINISHHHHED");
}

export async function depositFunds() {
  const polygon_rpc =
    "https://polygon-mainnet.g.alchemy.com/v2/DWQwRdeh1rp2H4l1aaw1p2OXDHhHYgsF";
  const provider = new ethers.providers.JsonRpcProvider(polygon_rpc);
  const contract_address = "0xc86F88ACDceb1f4Cfc3eb0e018D22FAa2aBBEaE1";
  var walletPrivateKey = new ethers.Wallet(PRIVATE_KEY).connect(provider);
  const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const USDT_ADDRESS = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
  const DAI_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

  // call approve for usdc from pK to vault contract
  var VaultContract = new ethers.Contract(
    contract_address,
    vault_abi,
    walletPrivateKey
  );
  var amount = 100000;
  var dc2dt = getCallData(USDC_ADDRESS, USDT_ADDRESS, 10000000);
  var dc2da = getCallData(USDC_ADDRESS, DAI_ADDRESS, 10000000);

  //   // amount in wei?
  var result = await VaultContract.deposit(amount, dc2dt, dc2da);
  //   console.log(result);
}

export async function doContractThings(web3) {
  // console.log("Initialized Deposit");
  // const polygon_rpc = "https://rpc-mumbai.maticvigil.com/";
  // const provider = new ethers.providers.JsonRpcProvider(polygon_rpc);
  // const contract_address = "0xc86F88ACDceb1f4Cfc3eb0e018D22FAa2aBBEaE1";
  // var walletPrivateKey = new ethers.Wallet(PRIVATE_KEY).connect(provider);
  // var RandomContract = new ethers.Contract(
  //   contract_address,
  //   abi,
  //   walletPrivateKey
  // );
  // var result = await RandomContract.setData("data");
  // console.log(result);
  // console.log("ye");
}
