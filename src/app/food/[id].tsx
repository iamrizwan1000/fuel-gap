import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Minus, Plus } from "lucide-react-native";

import { useAppStore } from "@/store/useAppStore";
import { calculateMacros } from "@/utils/nutrition";

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const foods = useAppStore((s) => s.foods);
  const addToLog = useAppStore((s) => s.addToLog);
  const isWeb = Platform.OS === "web";

  const food = foods.find((f) => f.id === id);

  const [selectedUnit, setSelectedUnit] = useState(food?.servingOptions[0] ?? { label: "g", grams: 1 });
  const [quantity, setQuantity] = useState(1);

  if (!food) {
    return (
      <View style={[s.screen, { paddingTop: insets.top }]}>
        <Text style={s.notFoundIcon}>❓</Text>
        <Text style={s.notFoundText}>Food not found</Text>
      </View>
    );
  }

  const macros = calculateMacros(food, quantity, selectedUnit.grams);
  const maxWidth = isWeb ? Math.min(width, 640) : width;
  const titleSize = Math.min(width * 0.06, 22);

  const handleAdd = () => {
    addToLog(food, quantity, selectedUnit.label, selectedUnit.grams);
    router.push("/(tabs)/today");
  };

  const emojiSize = Math.min(width * 0.18, 80);

  return (
    <View
      style={[
        s.screen,
        { paddingTop: isWeb ? 0 : insets.top },
      ]}
    >
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollInner, { maxWidth }]}
      >
        <View style={s.hero}>
          <View style={s.heroRow}>
            <Pressable onPress={() => router.back()} style={s.backBtn}>
              <ArrowLeft size={22} color="#222222" />
            </Pressable>
            <View style={s.heroCenter}>
              <Text style={{ fontSize: emojiSize }}>
                {food.emoji}
              </Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
          <Text style={[s.foodName, { fontSize: titleSize }]}>{food.name}</Text>
          <Text style={s.category}>{food.category}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Per 100g</Text>
          <MacroRow label="Calories" value={`${food.caloriesPer100g}`} unit="" />
          <MacroRow label="Protein" value={`${food.proteinPer100g}`} unit="g" />
          <MacroRow label="Carbs" value={`${food.carbsPer100g}`} unit="g" />
          <MacroRow label="Fat" value={`${food.fatPer100g}`} unit="g" />
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Quantity</Text>
          <View style={s.unitRow}>
            {food.servingOptions.map((opt) => (
              <Pressable
                key={opt.label}
                onPress={() => {
                  setSelectedUnit(opt);
                  setQuantity(1);
                }}
                style={[
                  s.unitChip,
                  selectedUnit.label === opt.label
                    ? s.unitChipActive
                    : s.unitChipInactive,
                ]}
              >
                <Text
                  style={[
                    s.unitChipText,
                    selectedUnit.label === opt.label && s.unitChipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={s.stepper}>
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={s.stepperBtn}
            >
              <Minus size={20} color="#222222" />
            </Pressable>
            <Text style={s.stepperValue}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              style={s.stepperBtn}
            >
              <Plus size={20} color="#222222" />
            </Pressable>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Your selection ({macros.grams}g)</Text>
          <MacroRow label="Calories" value={`${macros.calories}`} unit="" />
          <MacroRow label="Protein" value={`${macros.protein}`} unit="g" />
          <MacroRow label="Carbs" value={`${macros.carbs}`} unit="g" />
          <MacroRow label="Fat" value={`${macros.fat}`} unit="g" />
        </View>

        <Pressable onPress={handleAdd} style={s.cta}>
          <Text style={s.ctaText}>I Ate This</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function MacroRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={s.macroRow}>
      <Text style={s.macroLabel}>{label}</Text>
      <Text style={s.macroValue}>{value}{unit}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 6,
  },
  heroCenter: {
    flex: 1,
    alignItems: "center",
  },

  foodName: {
    fontWeight: "700",
    color: "#222222",
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: "#717171",
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
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  macroLabel: {
    fontSize: 15,
    color: "#717171",
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222222",
  },
  unitRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  unitChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  unitChipActive: {
    backgroundColor: "#E8175D",
  },
  unitChipInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  unitChipText: {
    fontSize: 13,
    color: "#222222",
  },
  unitChipTextActive: {
    color: "#FFFFFF",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F3",
    justifyContent: "center",
    alignItems: "center",
  },
  stepperValue: {
    minWidth: 40,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#222222",
  },
  cta: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#E8175D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  notFoundIcon: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222222",
    textAlign: "center",
  },
});
