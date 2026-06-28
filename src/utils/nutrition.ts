import { Food, LogEntry } from "@/types/food";

export function calculateMacros(
  food: Food,
  quantity: number,
  unitGrams: number
): { grams: number; calories: number; protein: number; carbs: number; fat: number } {
  const grams = quantity * unitGrams;
  return {
    grams: Math.round(grams),
    calories: round((food.caloriesPer100g * grams) / 100),
    protein: round((food.proteinPer100g * grams) / 100),
    carbs: round((food.carbsPer100g * grams) / 100),
    fat: round((food.fatPer100g * grams) / 100),
  };
}

export function sumMacros(entries: LogEntry[]) {
  return entries.reduce(
    (acc, e) => ({
      calories: round(acc.calories + e.calories),
      protein: round(acc.protein + e.protein),
      carbs: round(acc.carbs + e.carbs),
      fat: round(acc.fat + e.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function getRemaining(totals: { calories: number; protein: number; carbs: number; fat: number }, targets: { calories: number; protein: number; carbs: number; fat: number }) {
  return {
    calories: Math.round(targets.calories - totals.calories),
    protein: round(targets.protein - totals.protein),
    carbs: round(targets.carbs - totals.carbs),
    fat: round(targets.fat - totals.fat),
  };
}

type Suggestion = {
  emoji: string;
  name: string;
  reason: string;
};

export function getSuggestions(remaining: ReturnType<typeof getRemaining>, allFoods: Food[]): Suggestion[] {
  const result: Suggestion[] = [];

  const gaps: { macro: "protein" | "carbs" | "fat"; value: number }[] = [
    { macro: "protein" as const, value: remaining.protein },
    { macro: "carbs" as const, value: remaining.carbs },
    { macro: "fat" as const, value: remaining.fat },
  ].sort((a, b) => b.value - a.value);

  for (const gap of gaps) {
    if (gap.value <= 5) continue;
    if (result.length >= 5) break;

    let candidates: Food[] = [];
    if (gap.macro === "protein") {
      candidates = allFoods.filter((f) => f.category === "Protein" || f.category === "Dairy");
    } else if (gap.macro === "carbs") {
      candidates = allFoods.filter((f) => f.category === "Fruit" || f.category === "Grain" || f.category === "Vegetable");
    } else {
      candidates = allFoods.filter((f) => f.category === "Nuts" || f.category === "Oil" || f.name.includes("Avocado") || f.name.includes("Butter") || f.name.includes("Cheese"));
    }

    const picks = pickRandom(candidates, Math.min(3, 5 - result.length));
    picks.forEach((f) => {
      const val = gap.macro === "protein" ? f.proteinPer100g : gap.macro === "carbs" ? f.carbsPer100g : f.fatPer100g;
      result.push({
        emoji: f.emoji,
        name: f.name,
        reason: `${val}g ${gap.macro} per 100g`,
      });
    });
  }

  return result.slice(0, 5);
}

function round(value: number, decimals = 1): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
