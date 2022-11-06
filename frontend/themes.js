import { DefaultTheme as NavigationLightTheme } from "@react-navigation/native";

import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  configureFonts,
} from "react-native-paper";

const text = {
  paragraph: 12,
  body: 16,
  header: 20,
  title: 28,
  weight: {
    bold: ".56",
    normal: ".2",
  },
};

export const CustomLightThem = {
  ...NavigationLightTheme,
  ...PaperDefaultTheme,
  text: text,
  colors: {
    ...NavigationLightTheme.colors,
    ...PaperDefaultTheme.colors,
    primary: "#FBFCFC",
    defaultPill: "#CFCFCF",
    backgroundColor: "#EAEAEA",
  },
};

const isDarkTheme = false;
export const theme = CustomLightThem;
