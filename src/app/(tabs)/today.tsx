import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { useSQLiteContext } from "expo-sqlite";

import { searchFoods } from "@/db";
import { MacroBar } from "@/components/MacroBar";
import { SuggestionChips } from "@/components/SuggestionChips";
import { useAppStore } from "@/store/useAppStore";
import type { DailyTargets, Food } from "@/types/food";
import { getRemaining, getSuggestions, sumMacros } from "@/utils/nutrition";

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const db = useSQLiteContext();
  const log = useAppStore((s) => s.log);
  const targets = useAppStore((s) => s.targets);
  const setTargets = useAppStore((s) => s.setTargets);
  const removeFromLog = useAppStore((s) => s.removeFromLog);
  const [foods, setFoods] = useState<Food[]>([]);
  const [editing, setEditing] = useState(false);
  const [editTargets, setEditTargets] = useState<DailyTargets>({ ...targets });

  const totals = sumMacros(log);
  const remaining = getRemaining(totals, targets);
  const suggestions = getSuggestions(remaining, foods);

  useEffect(() => {
    searchFoods(db, "").then(setFoods);
  }, [db]);

  const handleSuggestion = useCallback(
    (name: string) => {
      const food = foods.find(
        (f) => f.name.toLowerCase() === name.toLowerCase()
      );
      if (food) router.push(`/food/${food.id}`);
    },
    [foods, router]
  );

  const titleSize = Math.min(width * 0.07, 28);
  const titleH = titleSize + 6;
  const topPad = 40;
  const headerAreaHeight = topPad + 16 + titleH + 8;

  const handleSaveTargets = () => {
    setTargets(editTargets);
    setEditing(false);
  };

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollInner}
      >
        <View style={[s.content, { paddingTop: headerAreaHeight + 12, paddingBottom: 20 }]}>        
          {editing ? (
            <View style={s.card}>
              <Text style={s.cardTitle}>Daily Targets</Text>
              <TargetInput
                label="Calories"
                value={editTargets.calories}
                onChange={(v) => setEditTargets({ ...editTargets, calories: v })}
              />
              <TargetInput
                label="Protein (g)"
                value={editTargets.protein}
                onChange={(v) => setEditTargets({ ...editTargets, protein: v })}
              />
              <TargetInput
                label="Carbs (g)"
                value={editTargets.carbs}
                onChange={(v) => setEditTargets({ ...editTargets, carbs: v })}
              />
              <TargetInput
                label="Fat (g)"
                value={editTargets.fat}
                onChange={(v) => setEditTargets({ ...editTargets, fat: v })}
              />
              <Pressable onPress={handleSaveTargets} style={s.saveBtn}>
                <Text style={s.saveBtnText}>Save Targets</Text>
              </Pressable>
            </View>
          ) : (
            <View style={s.card}>
              <Text style={s.cardTitle}>Daily Summary</Text>
              <Text style={[s.bigCal, { fontSize: Math.min(width * 0.08, 32) }]}>
                {Math.round(totals.calories)}
                <Text style={s.bigCalSub}>
                  {" "}/ {targets.calories} cal
                </Text>
              </Text>
              <MacroBar label="Protein" current={totals.protein} target={targets.protein} color="#E8175D" />
              <MacroBar label="Carbs" current={totals.carbs} target={targets.carbs} color="#3C9FFE" />
              <MacroBar label="Fat" current={totals.fat} target={targets.fat} color="#F5A623" />
            </View>
          )}

          {!editing && (
            <View style={s.remainCard}>
              <Text style={s.cardTitle}>Remaining</Text>
              <Text style={[s.remainCal, { fontSize: Math.min(width * 0.08, 32) }]}>
                {Math.max(0, Math.round(remaining.calories))}
                <Text style={s.remainCalSub}> cal left</Text>
              </Text>
              <View style={s.remainRow}>
                <RemainChip label="P" value={`${Math.max(0, Math.round(remaining.protein))}g`} color="#E8175D" />
                <RemainChip label="C" value={`${Math.max(0, Math.round(remaining.carbs))}g`} color="#3C9FFE" />
                <RemainChip label="F" value={`${Math.max(0, Math.round(remaining.fat))}g`} color="#F5A623" />
              </View>
            </View>
          )}

          {suggestions.length > 0 && !editing && (
            <View style={s.suggestionsSection}>
              <Text style={s.sectionTitle}>Fill the gap</Text>
              <SuggestionChips
                suggestions={suggestions}
                onPress={handleSuggestion}
              />
            </View>
          )}

          {log.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🍽️</Text>
              <Text style={s.emptyTitle}>Nothing logged yet</Text>
              <Text style={s.emptySub}>Search for food and tap "I Ate This"</Text>
            </View>
          ) : (
            <View style={s.logSection}>
              <Text style={s.sectionTitle}>Logged ({log.length})</Text>
              {log.map((entry) => (
                <View key={entry.id} style={s.logCard}>
                  <View style={s.logEmojiBox}>
                    <Text style={s.logEmoji}>{entry.emoji}</Text>
                  </View>
                  <View style={s.logInfo}>
                    <Text style={s.logName}>{entry.name}</Text>
                    <Text style={s.logDetail}>
                      {entry.quantity} {entry.unit} ({entry.grams}g) — {Math.round(entry.calories)} cal
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removeFromLog(entry.id)}
                    style={s.logDelete}
                  >
                    <X size={14} color="#717171" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[s.headerWrap, { paddingTop: topPad }]}>        
        <View style={s.header}>
          <Text style={[s.title, { fontSize: titleSize }]}>
            Today
          </Text>
          <Pressable onPress={() => setEditing(!editing)}>
            {editing ? (
              <Text style={s.cancelText}>Cancel</Text>
            ) : (
              <Text style={s.setTargetBtn}>Set target</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function RemainChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[rc.chip, { backgroundColor: color + "15", borderColor: color + "30" }]}>
      <Text style={[rc.label, { color }]}>{label}</Text>
      <Text style={[rc.value, { color }]}>{value}</Text>
    </View>
  );
}

const rc = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginRight: 4,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
  },
});

function TargetInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={s.targetRow}>
      <Text style={s.targetLabel}>{label}</Text>
      <TextInput
        style={s.targetInput}
        value={String(value)}
        onChangeText={(t) => onChange(Number(t) || 0)}
        keyboardType="numeric"
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 640,
  },
  content: {
    paddingHorizontal: 16,
  },
  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: 640,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "700",
    color: "#222222",
  },
  cancelText: {
    fontSize: 15,
    color: "#717171",
  },
  setTargetBtn: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E8175D",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E8175D15",
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#717171",
    marginBottom: 12,
  },
  bigCal: {
    fontWeight: "700",
    color: "#222222",
    marginBottom: 12,
  },
  bigCalSub: {
    fontSize: 16,
    fontWeight: "400",
    color: "#717171",
  },
  saveBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8175D",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  targetRow: {
    marginBottom: 12,
  },
  targetLabel: {
    fontSize: 13,
    color: "#717171",
    marginBottom: 4,
  },
  targetInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },
  remainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  remainCal: {
    fontWeight: "700",
    color: "#222222",
    marginBottom: 12,
  },
  remainCalSub: {
    fontSize: 16,
    fontWeight: "400",
    color: "#717171",
  },
  remainRow: {
    flexDirection: "row",
    gap: 8,
  },
  suggestionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 8,
  },
  empty: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 15,
    color: "#717171",
  },
  logSection: {
    marginBottom: 16,
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  logEmojiBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F0F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logEmoji: {
    fontSize: 20,
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222222",
  },
  logDetail: {
    fontSize: 12,
    color: "#717171",
    marginTop: 2,
  },
  logDelete: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
