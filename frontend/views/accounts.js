var accounts = {
  "Standard Savings": {
    apy: "1.72",
    description:
      "Variable APY, Deposits into high-yield USD lending markets on a single blockchain.",
    coin: "USDT",
    market: "AAVE",
    icon_color: "green",
    icon: "chevron-down",
    risk_description: "Low risk exposure",
    icon_desc: "Standard Checking",
    long_description:
      "An account for risk-conscious savers. Your deposit will be converted into the market assets above. Interest is earned from USD lending markets on the blockchain. You can withdraw into your initial deposit asset.",
    risks:
      "Interest rates never go below zero. However, you could lose your initial deposit if: \n \
      \t - The USD lending market is hacked \n \
      \t - The USD blockchain currency loses its value or is \n \t hacked",
    isReady: true,
  },
  "Flexible Saver": {
    apy: "2.72",
    description:
      "Variable APY, Deposits into high-yield USD lending markets on a single blockchain.",
    coin: "DAI",
    market: "AAVE",
    icon_color: "#F9D14A",
    icon: "trending-neutral",
    risk_description: "Less flexible, low risk exposure",
    icon_desc: "",
    isReady: false,
  },
  "Crypto Saver": {
    apy: "5.18",
    description:
      "Variable APY, Deposits into high-yield USD lending markets on a single blockchain.",
    coin: "USDC",
    market: "AAVE",
    icon_color: "red",
    icon: "chevron-up",
    icon_desc: "high risk exposure",
    risk_description: "Higher volatility",
    isReady: false,
  },
};

exports.ACCOUNT_TYPES = accounts;
