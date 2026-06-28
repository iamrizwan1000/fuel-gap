import { type SQLiteDatabase } from "expo-sqlite";

import type { Food, ServingOption } from "@/types/food";

export function rowToFood(row: FoodRow): Food {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    emoji: row.emoji,
    caloriesPer100g: row.calories_per_100g,
    proteinPer100g: row.protein_per_100g,
    carbsPer100g: row.carbs_per_100g,
    fatPer100g: row.fat_per_100g,
    servingOptions: JSON.parse(row.serving_options) as ServingOption[],
  };
}

export async function searchFoods(
  db: SQLiteDatabase,
  query: string,
  limit = 50
): Promise<Food[]> {
  if (!query.trim()) {
    const rows = await db.getAllAsync<FoodRow>(
      `SELECT * FROM foods ORDER BY name LIMIT ?`,
      limit
    );
    return rows.map(rowToFood);
  }

  const rows = await db.getAllAsync<FoodRow>(
    `SELECT f.*
     FROM foods_fts fts
     JOIN foods f ON fts.rowid = f.rowid
     WHERE foods_fts MATCH ?
     ORDER BY rank
     LIMIT ?`,
    query.trim() + "*",
    limit
  );

  if (rows.length === 0) {
    const fallback = await db.getAllAsync<FoodRow>(
      `SELECT * FROM foods WHERE name LIKE ? LIMIT ?`,
      `%${query.trim()}%`,
      limit
    );
    return fallback.map(rowToFood);
  }

  return rows.map(rowToFood);
}

export async function getFoodById(
  db: SQLiteDatabase,
  id: string
): Promise<Food | null> {
  const row = await db.getFirstAsync<FoodRow>(
    "SELECT * FROM foods WHERE id = ?",
    id
  );
  return row ? rowToFood(row) : null;
}

export async function getCategories(
  db: SQLiteDatabase
): Promise<string[]> {
  const rows = await db.getAllAsync<{ category: string }>(
    "SELECT DISTINCT category FROM foods ORDER BY category"
  );
  return rows.map((r) => r.category);
}

interface FoodRow {
  id: string;
  name: string;
  category: string;
  emoji: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_options: string;
}
