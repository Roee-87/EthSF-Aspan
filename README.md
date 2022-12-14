# EthSF-Aspan
Aspan was built to provide a reliable means for individuals to access DeFi savings opportunities, with a focus on emerging markets that are characteristically risk-averse. By lessening the cognitive load of discovering, depositing, and withdrawing from DeFi protocols, we aim to bring financial versatility to every corner of the globe. Insofar as emerging markets are perenially underbanked and especially volatile after COVID, a decentralized and transparent means to protect wealth from local uncertainty is paramount to economic development. Being able to protect one's hard earned money is itself a financial must.
Whereas a majority of today's dapps attempt to improve usability for the same old crypto users based in western countries, Aspan makes DeFi accessible to emerging markets across the globe. We focus on DeFi services, which deliver the most benefit to places that are underbanked and unstable. We do this in a variety of means: lessening optionality, removing all jargon, and abstracting away technical complexities. We refocus users' attentions on their savings potential, risk, and account capabilities, not on comprehending the differences between tokens, chains, and acronyms.

0x:  When making a deposit, users are prompted to deposit USDC funds into the Vault contract.  In order to reduce risk exposure to any one stablecoin, we use 0x swap api to convert a portion of the user's USDC deposit into DAI and USDT tokens.  The three stablecoins are then supplied to Aave lending pools and interest is earned by the Vault contract on behalf of the users. The partition ratio of the various stablecoins will be updated by the ASPAN team in order to optimize risk exposure and acceptable APY.  When a user wishes to withdraw funds, the DAI and USDT portion of the user's funds are converted back to USDC and subsequently returned to the user.  0x swap endpiont allows us to access the most competitive quotes with minimal slippage to the user.

The Graph:  We are using The Graph to index our userbase and ensure our committment to transparent cashflows. 

Aspan Token: Aspan Token acts as the deposit receipt for users to reclaim assets and interests. It is controlled by the Vault to mint new tokens and burn tokens to redeem assets. 

Price Oracle (Chainlink): The repo uses Chainlink to facilitate price feeds for aave stablecoin pools and its corresponding udnerlying asset to price our custom Aspan Token.

Vault: Vault smart contracts controls the deposit and withdraw logic, including the aave, 0x, and Aspan Token reclaim processes
