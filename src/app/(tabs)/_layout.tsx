import { Tabs } from "expo-router";
import { Search, Utensils } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E8175D",
        tabBarInactiveTintColor: "#717171",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EBEBEB",
          borderTopWidth: 1,
          height: 83,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          lineHeight: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => <Utensils size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
