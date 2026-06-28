import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export function useNotifications() {
  useEffect(() => {
    const setup = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

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
    };

    setup();
  }, []);
}
