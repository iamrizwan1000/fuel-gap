import { Text, View, StyleSheet } from "react-native";

type Props = {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
};

export function MacroBar({ label, current, target, unit = "g", color }: Props) {
  const remaining = Math.max(0, target - current);
  const progress = target > 0 ? Math.min(current / target, 1) : 0;

  return (
    <View style={s.container}>
      <View style={s.labelRow}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.value}>
          {Math.round(current)} / {Math.round(target)} {unit}
        </Text>
      </View>
      <View style={s.track}>
        <View style={[s.fill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.remaining}>
        {remaining > 0
          ? `${Math.round(remaining)} ${unit} remaining`
          : "Complete!"}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222222",
  },
  value: {
    fontSize: 13,
    color: "#717171",
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EBEBEB",
    marginBottom: 4,
    overflow: "hidden",
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  remaining: {
    fontSize: 12,
    color: "#717171",
  },
});
