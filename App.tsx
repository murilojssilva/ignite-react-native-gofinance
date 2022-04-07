import React from "react";
import { Dashboard } from "./src/screens/Dashboard";
import { Register } from "./src/screens/Register";
import { CategorySelect } from "./src/screens/CategorySelect";

import { ThemeProvider } from "styled-components/native";
import AppLoading from "expo-app-loading";

import theme from "./src/global/styles/theme";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function App() {
  const [loadedFonts] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!loadedFonts) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Register />
    </ThemeProvider>
  );
}
