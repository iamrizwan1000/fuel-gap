import { writeFileSync } from "node:fs";

const API_KEY = process.env.USDA_API_KEY;
if (!API_KEY) {
  throw new Error("USDA_API_KEY env var is required");
}

const FOOD_URL = "https://api.nal.usda.gov/fdc/v1/food";
const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

type FoodInput = {
  query: string;
  fdcId?: number;
  displayName?: string;
  category: string;
  emoji: string;
  servingOptions: { label: string; grams: number }[];
};

const FOODS: FoodInput[] = [
  // Fruits
  { query: "apple raw", displayName: "Apple", category: "Fruit", emoji: "🍎", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 182 }, { label: "half", grams: 91 }, { label: "cup", grams: 125 }] },
  { query: "banana raw", category: "Fruit", emoji: "🍌", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 118 }, { label: "half", grams: 59 }, { label: "cup", grams: 150 }] },
  { query: "orange raw", displayName: "Orange", category: "Fruit", emoji: "🍊", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 131 }, { label: "cup", grams: 180 }] },
  { query: "grapes raw american slip skin", displayName: "Grapes", category: "Fruit", emoji: "🍇", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 151 }, { label: "handful", grams: 50 }] },
  { query: "strawberries raw", category: "Fruit", emoji: "🍓", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 152 }, { label: "handful", grams: 50 }] },
  { query: "blueberries raw", category: "Fruit", emoji: "🫐", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 148 }, { label: "handful", grams: 45 }] },
  { query: "mango raw", category: "Fruit", emoji: "🥭", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 336 }, { label: "cup", grams: 165 }, { label: "half", grams: 168 }] },
  { query: "pineapple raw", category: "Fruit", emoji: "🍍", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 165 }, { label: "piece", grams: 905 }] },
  { query: "watermelon raw", category: "Fruit", emoji: "🍉", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 154 }, { label: "piece", grams: 286 }] },
  { query: "peach raw", displayName: "Peach", category: "Fruit", emoji: "🍑", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 150 }, { label: "cup", grams: 154 }] },

  // Vegetables
  { query: "broccoli raw", category: "Vegetable", emoji: "🥦", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 91 }, { label: "piece", grams: 225 }] },
  { query: "carrot raw", category: "Vegetable", emoji: "🥕", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 61 }, { label: "cup", grams: 128 }] },
  { query: "spinach raw", category: "Vegetable", emoji: "🍃", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 30 }, { label: "handful", grams: 20 }] },
  { query: "tomato raw", displayName: "Tomato", category: "Vegetable", emoji: "🍅", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 123 }, { label: "cup", grams: 149 }] },
  { query: "cucumber raw", fdcId: 169225, category: "Vegetable", emoji: "🥒", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 301 }, { label: "cup", grams: 133 }] },
  { query: "bell pepper raw", displayName: "Bell Pepper", category: "Vegetable", emoji: "🫑", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 119 }, { label: "cup", grams: 149 }] },
  { query: "onion raw", category: "Vegetable", emoji: "🧅", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 110 }, { label: "cup", grams: 160 }] },
  { query: "potato russet raw", fdcId: 2346401, displayName: "Potato", category: "Vegetable", emoji: "🥔", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 213 }, { label: "cup", grams: 150 }] },
  { query: "sweet potato orange flesh raw", fdcId: 2346404, displayName: "Sweet Potato", category: "Vegetable", emoji: "🍠", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 151 }, { label: "cup", grams: 133 }] },
  { query: "lettuce raw", category: "Vegetable", emoji: "🥬", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 36 }, { label: "bowl", grams: 100 }] },

  // Grains
  { query: "rice white cooked enriched", displayName: "White Rice", category: "Grain", emoji: "🍚", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 158 }, { label: "bowl", grams: 250 }] },
  { query: "oats whole grain rolled", fdcId: 2346396, displayName: "Rolled Oats", category: "Grain", emoji: "🥣", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 81 }, { label: "bowl", grams: 160 }] },
  { query: "bread white commercially prepared", category: "Grain", emoji: "🍞", servingOptions: [{ label: "g", grams: 1 }, { label: "slice", grams: 29 }, { label: "piece", grams: 29 }] },
  { query: "pasta cooked enriched without salt", fdcId: 169737, displayName: "Pasta", category: "Grain", emoji: "🍝", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 140 }, { label: "bowl", grams: 250 }] },
  { query: "quinoa cooked", category: "Grain", emoji: "🌾", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 185 }, { label: "bowl", grams: 300 }] },
  { query: "brown rice long grain cooked", fdcId: 169704, displayName: "Brown Rice", category: "Grain", emoji: "🍘", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 195 }, { label: "bowl", grams: 300 }] },
  { query: "bagel plain enriched", category: "Grain", emoji: "🥯", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 98 }, { label: "half", grams: 49 }] },
  { query: "tortilla flour ready bake", category: "Grain", emoji: "🌮", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 45 }, { label: "half", grams: 23 }] },

  // Proteins
  { query: "chicken breast roasted cooked", displayName: "Chicken Breast", category: "Protein", emoji: "🍗", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 172 }, { label: "cup", grams: 140 }] },
  { query: "egg whole cooked", category: "Protein", emoji: "🥚", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 50 }, { label: "half", grams: 25 }] },
  { query: "beef ground 85% cooked", displayName: "Ground Beef", category: "Protein", emoji: "🥩", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 150 }, { label: "piece", grams: 85 }] },
  { query: "salmon atlantic cooked dry heat", displayName: "Salmon", category: "Protein", emoji: "🐟", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 154 }, { label: "cup", grams: 150 }] },
  { query: "tuna light canned water", displayName: "Tuna", category: "Protein", emoji: "🐠", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 154 }, { label: "can", grams: 165 }] },
  { query: "turkey roasted cooked", displayName: "Turkey Breast", category: "Protein", emoji: "🦃", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 120 }, { label: "cup", grams: 140 }] },
  { query: "tofu raw regular", category: "Protein", emoji: "🧈", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 91 }, { label: "cup", grams: 146 }] },
  { query: "lentils cooked boiled", fdcId: 175254, displayName: "Lentils", category: "Protein", emoji: "🫘", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 198 }, { label: "bowl", grams: 300 }] },
  { query: "black beans cooked boiled", fdcId: 175237, displayName: "Black Beans", category: "Protein", emoji: "🫘", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 172 }, { label: "bowl", grams: 300 }] },
  { query: "chickpeas cooked boiled", fdcId: 173799, displayName: "Chickpeas", category: "Protein", emoji: "🫘", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 164 }, { label: "bowl", grams: 300 }] },

  // Dairy
  { query: "milk whole 3.25% fat", fdcId: 171265, displayName: "Whole Milk", category: "Dairy", emoji: "🥛", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 244 }, { label: "glass", grams: 250 }] },
  { query: "greek yogurt plain whole milk", displayName: "Greek Yogurt", category: "Dairy", emoji: "🥣", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 245 }, { label: "bowl", grams: 170 }] },
  { query: "cheddar cheese", category: "Dairy", emoji: "🧀", servingOptions: [{ label: "g", grams: 1 }, { label: "slice", grams: 28 }, { label: "cup", grams: 132 }, { label: "piece", grams: 28 }] },
  { query: "cottage cheese", category: "Dairy", emoji: "🥣", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 226 }, { label: "bowl", grams: 170 }] },
  { query: "butter salted", category: "Dairy", emoji: "🧈", servingOptions: [{ label: "g", grams: 1 }, { label: "tbsp", grams: 14 }, { label: "tsp", grams: 5 }] },

  // Nuts & seeds
  { query: "almonds raw", category: "Nuts", emoji: "🌰", servingOptions: [{ label: "g", grams: 1 }, { label: "handful", grams: 30 }, { label: "tbsp", grams: 15 }] },
  { query: "peanut butter smooth style", displayName: "Peanut Butter", category: "Nuts", emoji: "🥜", servingOptions: [{ label: "g", grams: 1 }, { label: "tbsp", grams: 16 }, { label: "tsp", grams: 5 }] },
  { query: "walnuts raw", category: "Nuts", emoji: "🌰", servingOptions: [{ label: "g", grams: 1 }, { label: "handful", grams: 30 }, { label: "tbsp", grams: 15 }] },
  { query: "chia seeds dried", category: "Nuts", emoji: "🌱", servingOptions: [{ label: "g", grams: 1 }, { label: "tbsp", grams: 12 }, { label: "tsp", grams: 4 }] },

  // Drinks & sweets
  { query: "orange juice raw", category: "Drink", emoji: "🧃", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 248 }, { label: "glass", grams: 250 }] },
  { query: "coffee brewed", displayName: "Coffee", category: "Drink", emoji: "☕", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 237 }, { label: "mug", grams: 350 }] },
  { query: "tea brewed", displayName: "Tea", category: "Drink", emoji: "🍵", servingOptions: [{ label: "g", grams: 1 }, { label: "cup", grams: 237 }, { label: "mug", grams: 350 }] },
  { query: "honey", category: "Sweet", emoji: "🍯", servingOptions: [{ label: "g", grams: 1 }, { label: "tbsp", grams: 21 }, { label: "tsp", grams: 7 }] },
  { query: "chocolate dark 70% cacao", fdcId: 170273, displayName: "Dark Chocolate", category: "Sweet", emoji: "🍫", servingOptions: [{ label: "g", grams: 1 }, { label: "piece", grams: 28 }, { label: "tbsp", grams: 15 }] },

  // Oils & basics
  { query: "olive oil", category: "Oil", emoji: "🫒", servingOptions: [{ label: "g", grams: 1 }, { label: "tbsp", grams: 14 }, { label: "tsp", grams: 5 }] },
  { query: "sugar white granulated", category: "Basic", emoji: "🍬", servingOptions: [{ label: "g", grams: 1 }, { label: "tbsp", grams: 13 }, { label: "tsp", grams: 4 }] },
  { query: "salt table", category: "Basic", emoji: "🧂", servingOptions: [{ label: "g", grams: 1 }, { label: "tsp", grams: 6 }] },
];

function round(value: number, decimals = 1): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

const EXCLUDED_TERMS = ["peel", "skin", "babyfood", "infant", "formula", "supplement", "powder", "mix", "flavored", "sweetened", "unsweetened", "nuggets", "breaded", "tenders", "glutenous", "muscadine"];

function scoreResult(query: string, description: string): number {
  const desc = description.toLowerCase();
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t !== "raw" && t !== "cooked" && t !== "whole" && t !== "plain");
  const mainTerm = terms[0];
  let score = 0;
  for (const term of terms) {
    if (desc.includes(term)) score += 10;
  }
  if (mainTerm && desc.startsWith(mainTerm)) score += 15;
  if (mainTerm && desc.startsWith(mainTerm + "s")) score += 12;
  for (const ex of EXCLUDED_TERMS) {
    if (desc.includes(ex)) score -= 25;
  }
  // Prefer shorter, more exact matches
  score -= (description.split(/[\s,]+/).length - terms.length) * 0.5;
  return score;
}

async function searchFood(query: string, fdcId?: number) {
  if (fdcId) {
    const url = `${FOOD_URL}/${fdcId}?api_key=${API_KEY!}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`USDA API error for fdcId ${fdcId}: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as {
      fdcId: number;
      description: string;
      foodNutrients: Array<{ nutrientId: number; value: number }>;
    };
    return data;
  }
  const url = new URL(SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("dataType", "Foundation,SR Legacy");
  url.searchParams.set("pageSize", "10");
  url.searchParams.set("api_key", API_KEY!);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`USDA API error for "${query}": ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as {
    foods?: Array<{
      fdcId: number;
      description: string;
      foodNutrients: Array<{ nutrientId: number; value: number }>;
    }>;
  };
  const foods = data.foods ?? [];
  if (foods.length === 0) return undefined;
  foods.sort((a, b) => scoreResult(query, b.description) - scoreResult(query, a.description));
  return foods[0];
}

function getNutrient(nutrients: Array<{ nutrientId: number; value: number }>, id: number) {
  return nutrients.find((n) => n.nutrientId === id)?.value ?? 0;
}

async function main() {
  const results: Array<{
    id: string;
    name: string;
    category: string;
    emoji: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    servingOptions: { label: string; grams: number }[];
  }> = [];

  const manualOverrides: Record<string, { calories: number; protein: number; carbs: number; fat: number; name: string }> = {
    "orange juice raw": { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, name: "Orange Juice" },
  };

  for (const item of FOODS) {
    try {
      const food = await searchFood(item.query, item.fdcId);
      if (!food) {
        console.warn(`No result for "${item.query}"`);
        continue;
      }
      const nutrients = food.foodNutrients;
      results.push({
        id: String(food.fdcId),
        name:
          item.displayName ??
          food.description
            .replace(/, raw$/, "")
            .replace(/, cooked$/, "")
            .replace(/\s+/g, " ")
            .trim(),
        category: item.category,
        emoji: item.emoji,
        caloriesPer100g: round(getNutrient(nutrients, 1008)),
        proteinPer100g: round(getNutrient(nutrients, 1003)),
        carbsPer100g: round(getNutrient(nutrients, 1005)),
        fatPer100g: round(getNutrient(nutrients, 1004)),
        servingOptions: item.servingOptions,
      });
      const override = manualOverrides[item.query];
      if (override) {
        const last = results[results.length - 1];
        last.caloriesPer100g = override.calories;
        last.proteinPer100g = override.protein;
        last.carbsPer100g = override.carbs;
        last.fatPer100g = override.fat;
        last.name = override.name;
      }
      console.log(`Fetched: ${item.query}`);
      // Be polite to the API
      await new Promise((resolve) => setTimeout(resolve, 150));
    } catch (err) {
      console.error(`Failed "${item.query}":`, err);
    }
  }

  const fileContent = `import { Food } from "@/types/food";

export const foods: Food[] = ${JSON.stringify(results, null, 2)};
`;
  writeFileSync("src/data/foods.ts", fileContent);
  console.log(`\nWrote ${results.length} foods to src/data/foods.ts`);
}

main();
