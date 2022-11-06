import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Account from "./views/account/AccountType";
import AccountTypes from "./views/account/SelectAccount";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import DetailsView from "./views/details/details";
import { ACCOUNT_TYPES } from "./views/accounts";
import * as Withdraw from "./contracts/withdraw";
import DashboardView from "./views/dashboard/view";
import { getBlock } from "./contracts/withdraw";
import DepositView from "./views/details/deposit";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export default function App() {
  async function fetchJSONAsync() {
    await getBlock();
  }
  // could use navigators but this is most simple for now
  const [isSelectingAccount, setIsSelectingAccount] = useState(true);
  const [isAccountDetails, setIsAccountDetails] = useState(false);
  const [isOnDeposit, setIsOnDeposit] = useState(false);
  const [isOnDashboard, setIsOnDashboard] = useState(false);
  // temporary for now, can pass with navigation
  const temp_name = "Standard Savings";
  const temp_selection = ACCOUNT_TYPES[temp_name];
  const selectAccount = () => {
    setIsOnDashboard(false);
    setIsSelectingAccount(true);
  };
  const startDeposit = () => {
    setIsSelectingAccount(false);
    setIsAccountDetails(true);
  };
  const finishAccount = () => {
    setIsAccountDetails(false);
    setIsOnDeposit(true);
  };

  const completeDeposit = () => {
    setIsOnDeposit(false);
    setIsOnDashboard(true);
  };

  const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/keinberger/aspan",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {isSelectingAccount && (
        <View style={styles.container}>
          {isSelectingAccount && (
            <AccountTypes
              style={styles.accountTypes}
              next={() => {
                startDeposit();
              }}
            ></AccountTypes>
          )}
        </View>
      )}
      {isAccountDetails && (
        <View style={styles.container}>
          <DetailsView
            deposit={() => {
              finishAccount();
            }}
            name={temp_name}
            account={temp_selection}
          />
        </View>
      )}
      {isOnDeposit && (
        <View style={styles.container}>
          <DepositView
            deposit={() => {
              completeDeposit();
            }}
            name={temp_name}
            account={temp_selection}
          />
        </View>
      )}
      {isOnDashboard && (
        <View style={styles.container}>
          <DashboardView
            deposit={() => {
              selectAccount();
            }}
            name={temp_name}
          />
        </View>
      )}
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  accountTypes: {},
});
