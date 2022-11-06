import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
} from "react-native";
import { Button, Divider } from "react-native-paper";

import React, { useState, forwardRef } from "react";
import { theme } from "../../themes";
import { depositFunds, approveETH } from "../../contracts/deposit";
const DepositView = (props) => {
  const account = props.account;
  const name = props.name;
  const [amount, setAmount] = useState(0);
  const [inBalance, setInBalance] = useState(0);
  const deposit = async () => {
    // props.deposit()
    await approveETH();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: "600",
            textAlign: "center",
          }}
          variant="displayLarge"
        >
          Confirm Deposit
        </Text>
        <View style={{ paddingTop: 6, width: "90%", alignSelf: "center" }}>
          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
            }}
          >
            By clicking approve, your deposit will be executed on the
            blockchain.
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.item}>
          <Text
            style={{
              fontSize: theme.text.body,
              fontWeight: "600",
            }}
            variant="displayLarge"
          >
            Deposit Asset
          </Text>
          <View
            style={{ padding: 7, flexDirection: "row", alignItems: "center" }}
          >
            <Image
              style={{ resizeMode: "contain", height: 30, width: 30 }}
              source={require("../../assets/usdc.png")}
            />
            <View style={{ paddingHorizontal: 10 }}>
              <Text
                style={{
                  fontSize: theme.text.body,
                  fontWeight: "300",
                  fontStyle: "",
                }}
                variant="displayLarge"
              >
                USDC
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            ...styles.item,
            borderBottomColor: "black",
          }}
        >
          <Text
            style={{
              fontSize: theme.text.body,
              fontWeight: "600",
            }}
            variant="displayLarge"
          >
            Deposit Amount
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: theme.text.body,
                fontWeight: "600",
              }}
              variant="displayLarge"
            >
              $
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setAmount}
              value={amount}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          onPress={async () => {
            deposit();
          }}
          mode="contained"
          color={"#0F9CF3"}
        >
          Deposit
        </Button>
      </View>
    </View>
  );
};
export default DepositView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    width: "100%",
  },
  header: {
    flex: 2,
    padding: 60,
  },
  item: {
    padding: 10,
  },
  body: {
    flex: 4,
    alignItems: "center",
  },
  footer: {
    flex: 2,
  },
  input: {
    height: 40,
    width: 100,
    margin: 12,
    padding: 10,
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 10,
  },
});
