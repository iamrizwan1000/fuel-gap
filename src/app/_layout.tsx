import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useNotifications } from "@/hooks/useNotifications";

export default function RootLayout() {
  useNotifications();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
