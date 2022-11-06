import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import Account from "./AccountType";
import React, { useState, forwardRef } from "react";
import { theme } from "../..//themes";
import { ACCOUNT_TYPES } from "../accounts";
const AccountTypes = (props) => {
  const [selected, setSelected] = useState("");
  const accounts = Object.entries(ACCOUNT_TYPES);
  const newSelection = (selection) => {
    if (selection == selected) {
      setSelected("");
    } else {
      setSelected(selection);
    }
  };
  const listAccounts = () => {
    // return Object.entries(ACCOUNT_TYPES).map((account) => {
    //   <View key={account[0]} style={styles.type}>
    //     <Account account={account[1]} select={newSelection} />
    //   </View>;
    // });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: theme.text.title,
            fontWeight: "600",
          }}
          variant="displayLarge"
        >
          Select An Account
        </Text>
        <View style={{ width: "80%", alignSelf: "center" }}>
          <Text
            style={{
              fontSize: theme.text.paragraph,
              textAlign: "center",
            }}
          >
            Aspan connects you to borderless USD savings opportunities in the
            blockchain. Touch to view more.
          </Text>
        </View>
      </View>
      <View style={styles.account}>
        <View style={styles.type}>
          <Account
            name={accounts[0][0]}
            account={accounts[0][1]}
            select={newSelection}
          />
        </View>
        <View style={styles.type}>
          <Account
            name={accounts[1][0]}
            account={accounts[1][1]}
            select={newSelection}
          />
        </View>
        <View style={styles.type}>
          <Account
            name={accounts[2][0]}
            account={accounts[2][1]}
            select={newSelection}
          />
        </View>
      </View>
      <View style={styles.footer}>
        {selected != "" && (
          <Button
            mode="contained"
            onPress={() => {
              props.next();
            }}
            color={"#0F9CF3"}
          >
            View Account Details
          </Button>
        )}
      </View>
    </View>
  );
};
export default AccountTypes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  description: {
    alignSelf: "center",
  },
  type: { padding: 10, width: "100%" },
  header: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  footer: {
    flex: 2,
    justifyContent: "flex-start",
  },
  account: {
    flex: 8,
    width: "85%",
  },
});
