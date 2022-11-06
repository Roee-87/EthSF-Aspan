import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Button } from "react-native-paper";

import React, { useState, forwardRef } from "react";
import { theme } from "../..//themes";
const DetailsView = (props) => {
  const account = props.account;
  const name = props.name;
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <ScrollView>
          <Text
            style={{
              fontSize: theme.text.title,
              fontWeight: "600",
              textAlign: "center",
            }}
            variant="displayLarge"
          >
            {name}
          </Text>
          <View
            style={{ width: "80%", alignSelf: "center", paddingVertical: 10 }}
          ></View>
          <Image
            style={{ resizeMode: "contain", height: 236, width: "100%" }}
            source={require("../../assets/bank.png")}
          />
          <View style={styles.stat}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                textAlign: "center",
              }}
              variant="displayLarge"
            >
              {account.apy}%
            </Text>
            <Text
              style={{
                fontSize: theme.text.paragraph,
                textAlign: "center",
              }}
              variant="displayLarge"
            >
              For savers seeking low APY volatility and the least risk of losing
              their initial deposit.
            </Text>
          </View>
          <View style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={styles.item}>
                <Text
                  style={{
                    fontSize: theme.text.body,
                    textTransform: "uppercase",
                    fontWeight: "500",
                  }}
                >
                  Account Description
                </Text>
              </View>
              <View style={styles.item}>
                <Text
                  style={{
                    fontSize: theme.text.paragraph,
                  }}
                  variant="displayLarge"
                >
                  {account.long_description}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ ...styles.group, paddingTop: 0 }}>
            <View style={styles.groupHeader}>
              <View style={styles.item}>
                <Text
                  style={{
                    fontSize: theme.text.body,
                    textTransform: "uppercase",
                    fontWeight: "500",
                  }}
                >
                  Risks
                </Text>
              </View>
              <View style={styles.item}>
                <Text
                  style={{
                    fontSize: theme.text.paragraph,
                  }}
                  variant="displayLarge"
                >
                  {account.risks}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ ...styles.group, paddingTop: 0 }}>
            <View style={styles.groupHeader}>
              <View style={styles.item}>
                <Text
                  style={{
                    fontSize: theme.text.body,
                    textTransform: "uppercase",
                    fontWeight: "500",
                  }}
                >
                  USD Lending Market
                </Text>
              </View>
              <View style={styles.item}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ resizeMode: "contain", height: 30, width: 30 }}
                    source={require("../../assets/aave.png")}
                  />
                  <View style={{ paddingHorizontal: 30 }}>
                    <Text
                      style={{
                        fontSize: theme.text.paragraph,
                        fontWeight: "300",
                      }}
                    >
                      A trusted and audited lending and borrowing platform.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ ...styles.group, paddingTop: 0 }}>
            <View style={styles.groupHeader}>
              <View style={styles.item}>
                <Text
                  style={{
                    fontSize: theme.text.body,
                    textTransform: "uppercase",
                    fontWeight: "500",
                  }}
                >
                  Market Assets
                </Text>
              </View>
              <View style={styles.item}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ resizeMode: "contain", height: 30, width: 30 }}
                    source={require("../../assets/dai.png")}
                  />
                  <View style={{ paddingHorizontal: 30 }}>
                    <Text
                      style={{
                        fontSize: theme.text.paragraph,
                        fontWeight: "300",
                      }}
                    >
                      A digital currency pegged to the USD. Backed by
                      over-collateralized digital assets.
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                  <Image
                    style={{ resizeMode: "contain", height: 30, width: 30 }}
                    source={require("../../assets/usdc.png")}
                  />
                  <View style={{ paddingHorizontal: 30 }}>
                    <Text
                      style={{
                        fontSize: theme.text.paragraph,
                        fontWeight: "300",
                      }}
                    >
                      A digital currency pegged to the USD. Backed and managed
                      by the US based company, Circle.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <Button
            onPress={() => {
              props.deposit();
            }}
            mode="contained"
            color={"#0F9CF3"}
          >
            Open Account
          </Button>
        </View>
      </View>
    </View>
  );
};
export default DetailsView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  footerButton: {
    alignContent: "flex-start",
  },
  stat: {
    paddingTop: 20,
    paddingBottom: 10,
    width: "80%",
    alignSelf: "center",
  },
  group: {
    padding: 20,
    paddingBottom: 0,
  },
  groupHeader: {
    paddingBottom: 15,
  },
  groupBody: {
    padding: 10,
  },
  footer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    paddingTop: 10,
  },
  item: {
    padding: 5,
  },
  info: {
    flex: 7,
    width: "100%",
    paddingTop: 70,
  },
});
