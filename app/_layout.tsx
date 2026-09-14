import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { cores } from "../constants/cores";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      />
    </>
  );
}
