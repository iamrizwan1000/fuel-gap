import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

export function useNotifications() {
  useEffect(() => {
    if ((Constants as any).appOwnership === "expo") {
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        const Notifications = require("expo-notifications");

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") return;

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        if (cancelled) return;

        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "FuelGap",
            body: "Took a break from logging? Add your meals and see your progress.",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 12,
            minute: 30,
          },
        });

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Evening check-in",
            body: "Check your remaining targets and complete your food log for today.",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 19,
            minute: 0,
          },
        });
      } catch {
        // Notifications not available
      }
    };

    setup();
    return () => { cancelled = true; };
  }, []);
}
