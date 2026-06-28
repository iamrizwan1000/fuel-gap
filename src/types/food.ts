export type ServingOption = { label: string; grams: number };

export type Food = {
  id: string;
  name: string;
  category: string;
  emoji: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  servingOptions: ServingOption[];
};

export type LogEntry = {
  id: string;
  foodId: string;
  name: string;
  emoji: string;
  quantity: number;
  unit: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
};

export type DailyTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
