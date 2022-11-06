import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { IconButton } from "react-native-paper";
import { theme } from "../..//themes";
const Account = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  //   const account = props.account;

  const curr_account = props.account;

  const name = props.name;
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: isSelected ? "#0F9CF3" : "#FFF",
        opacity: curr_account.isReady ? 1 : 0.5,
      }}
      onPress={() => {
        if (curr_account.isReady) {
          props.select(props.name);
          setIsSelected(!isSelected);
        }
      }}
    >
      <View style={styles.header}>
        <View style={styles.apy}>
          <Text
            style={{
              fontSize: theme.text.header,
              fontWeight: "600",
            }}
            variant="displayLarge"
          >
            {curr_account.apy}% -
          </Text>
        </View>

        <View style={styles.title}>
          <Text
            style={{
              fontSize: theme.text.header,
              fontWeight: "600",
            }}
            variant="displayLarge"
          >
            {name}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text
          style={{
            fontSize: theme.text.paragraph,
          }}
        >
          {curr_account.description}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton
            icon={curr_account.icon}
            size={20}
            color={curr_account.icon_color}
          />
          <Text
            style={{
              fontSize: theme.text.paragraph,
            }}
          >
            {curr_account.risk_description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default Account;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FBFBFB",
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  body: {
    padding: 10,
  },
  title: {
    width: "60%",
  },
  apy: {
    width: "30%",
  },
});
