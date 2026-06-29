import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DailyTargets, Food, LogEntry } from "@/types/food";
import { calculateMacros, generateId } from "@/utils/nutrition";

type AppState = {
  log: LogEntry[];
  targets: DailyTargets;
  dayKey: string;
};

type AppActions = {
  addToLog: (food: Food, quantity: number, unitLabel: string, unitGrams: number) => void;
  removeFromLog: (entryId: string) => void;
  clearLog: () => void;
  setTargets: (targets: DailyTargets) => void;
  checkDayReset: () => void;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const defaultTargets: DailyTargets = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      log: [],
      targets: defaultTargets,
      dayKey: todayKey(),

      checkDayReset: () => {
        const { dayKey } = get();
        const currentDay = todayKey();
        if (dayKey !== currentDay) {
          set({ log: [], dayKey: currentDay });
        }
      },

      addToLog: (food, quantity, unitLabel, unitGrams) => {
        const macros = calculateMacros(food, quantity, unitGrams);
        const entry: LogEntry = {
          id: generateId(),
          foodId: food.id,
          name: food.name,
          emoji: food.emoji,
          quantity,
          unit: unitLabel,
          grams: macros.grams,
          calories: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          timestamp: Date.now(),
        };
        set((state) => ({ log: [...state.log, entry] }));
      },

      removeFromLog: (entryId) => {
        set((state) => ({ log: state.log.filter((e) => e.id !== entryId) }));
      },

      clearLog: () => set({ log: [], dayKey: todayKey() }),

      setTargets: (targets) => set({ targets }),
    }),
    {
      name: "fuelgap-store",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        log: state.log,
        targets: state.targets,
        dayKey: state.dayKey,
      }) as AppState & AppActions,
    }
  )
);
