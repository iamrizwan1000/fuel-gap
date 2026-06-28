import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

export function Card({ className, children, ...props }: ViewProps & { children: ReactNode }) {
  return (
    <View
      className={`rounded-xl bg-white px-4 py-3 shadow-sm ${className ?? ""}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      }}
      {...props}
    >
      {children}
    </View>
  );
}
