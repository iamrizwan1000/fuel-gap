import { Suspense, useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";

import { useNotifications } from "@/hooks/useNotifications";
import AnimatedSplash from "@/components/AnimatedSplash";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useNotifications();

  return (
    <Suspense fallback={null}>
      <SQLiteProvider
        databaseName="foods.db"
        assetSource={{ assetId: require("../../assets/foods.db") }}
        useSuspense
      >
        <AppStack />
      </SQLiteProvider>
    </Suspense>
  );
}

function AppStack() {
  const [splashDone, setSplashDone] = useState(false);

  const onSplashDone = useCallback(() => {
    setSplashDone(true);
  }, []);

  useEffect(() => {
    if (splashDone) {
      SplashScreen.hideAsync();
    }
  }, [splashDone]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
      {!splashDone && <AnimatedSplash onDone={onSplashDone} />}
    </>
  );
}
