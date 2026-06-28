import { useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { useNotifications } from "@/hooks/useNotifications";
import AnimatedSplash from "@/components/AnimatedSplash";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  useNotifications();

  const onSplashDone = useCallback(() => {
    setSplashDone(true);
  }, []);

  useEffect(() => {
    if (splashDone) {
      SplashScreen.hideAsync();
      setReady(true);
    }
  }, [splashDone]);

  if (!ready) {
    return <AnimatedSplash onDone={onSplashDone} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
