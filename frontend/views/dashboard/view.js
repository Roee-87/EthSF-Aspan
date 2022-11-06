import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { IconButton, Button } from "react-native-paper";
import { theme } from "../..//themes";
import { useQuery, gql } from "@apollo/client";
import { ethers } from "ethers";
import {
  PRIVATE_KEY,
  USDC_ADDRESS,
  DAI_ADDRESS,
  USDT_ADDRESS,
} from "../../contracts/constants";

const DashboardView = (props) => {
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const ONE_ETH = ethers.utils.parseEther("1");

  const GET_POSITION = gql`
    {
        positions(
          where: {
            # TODO: uncomment line below (to get the position of user)
            # userAddress: "${wallet.address}"
            active: true
          }
        ) {
        usdcProvided
        usdcWithdrawn
        aspanBalance
      }
    }
  `;

  const { data: graphData, error: graphError } = useQuery(GET_POSITION);
  graphError && console.error(graphError);
  const position = graphData && graphData.positions[0];

  // TODO: get aspan token price from oracle
  const aspanTokenPrice = ethers.utils.parseEther("0.99");

  const providedMinWithdrawn =
    position && String(position.usdcProvided - position.usdcWithdrawn);

  const balance =
    position &&
    ethers.BigNumber.from(position.aspanBalance)
      .mul(aspanTokenPrice)
      .div(ONE_ETH);

  const ROI_IN_USD =
    providedMinWithdrawn &&
    balance &&
    ethers.utils.formatEther(String(balance.toString() - providedMinWithdrawn));

  const name = props.name;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.general}>
          <Text
            style={{
              fontSize: theme.text.body,
              fontWeight: "300",
            }}
            variant="displayLarge"
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: theme.text.title,
              fontWeight: "600",
            }}
            variant="displayLarge"
          >
            $ {balance ? ethers.utils.formatEther(balance) : "0"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text style={{ color: "#2173DF" }}>^ $ {ROI_IN_USD}</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => {
              props.deposit();
            }}
          >
            Deposit
          </Button>
          <Button style={styles.button} mode="contained" onPress={() => {}}>
            Withdraw
          </Button>
        </View>
      </View>

      <View style={styles.chart}>
        <Image
          style={{ resizeMode: "contain", height: 236, width: "100%" }}
          source={require("../../assets/graph.png")}
        />
      </View>
      <View style={styles.history}>
        <Text
          style={{
            fontSize: theme.text.body,
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          History
        </Text>
      </View>
    </View>
  );
};
export default DashboardView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FBFBFB",
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 20,
    flex: 1,
    width: "100%",
  },
  general: {
    width: "60%",
  },
  header: {
    flex: 2,
    paddingTop: 60,
    flexDirection: "row",
    paddingLeft: 40,
    alignContent: "center",
  },
  chart: {
    flex: 6,
  },
  history: { flex: 10, paddingLeft: 40 },
  button: {
    margin: 3,
  },
});
