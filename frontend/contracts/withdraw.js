//docs.ethers.io/v5/cookbook/react-native/
import "react-native-get-random-values";

import "@ethersproject/shims";

import { ethers } from "ethers";

import {
  VAULT_ADDRESS,
  VAULT_ABI,
  ORACLE_ADDRESS,
  ORACLE_ABI,
  PRIVATE_KEY,
} from "./constants";

// is this the right rpc??
const polygon_rpc = "https://polygonscan.com/";
const provider = new ethers.providers.JsonRpcProvider(polygon_rpc);
var walletPrivateKey = new ethers.Wallet(PRIVATE_KEY).connect(provider);

// var Vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider.getSigner());
var Oracle = new ethers.Contract(
  ORACLE_ADDRESS,
  ORACLE_ABI,
  walletPrivateKey
).connect();

const getAspanPriceInUSD = (amount_aspan) => {
  // query oracle
  // pUSDC = oracle returns price of Aspan in USDC
  // multiply amount_aspan * pUSD
  var pUSDC = Oracle.getUSDCPriceOf();
};

const withdraw = (amount) => {
  // amount in usd = getAspanPriceInUSD * amount
  // Vault.withdraw()
};

const getBlock = async () => {
  var result = await provider.getBlockNumber();
  console.log("ahh");
  console.log(result);
  //     await daiContract.name()
  //     console.log(result);

  return "result";
};
exports.getBlock = getBlock;
