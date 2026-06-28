# FuelGap Food Tracker — Implementation Plan

> Fast build. No test suite. Focus on 3 working screens + local data + persistence + notifications.

**Goal:** Replace the Expo starter screens with a working 3-screen food/macro tracker.

**Architecture:** Local `foods.ts` database, Zustand store persisted with AsyncStorage, Expo Router tabs + stack, NativeWind styling following `DESIGN_SYSTEM.md`.

**Tech Stack:** Expo SDK 56, Expo Router, React Native, NativeWind, Zustand, AsyncStorage, expo-notifications, lucide-react-native.

---

## Task 1: Fix project config

**Files:**
- Modify: `tailwind.config.js`
- Modify: `package.json`

**Steps:**
- [ ] Update Tailwind content paths to scan `src/`:
  ```js
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  ```
- [ ] Move `prettier-plugin-tailwindcss` from `dependencies` to `devDependencies`.
- [ ] Install missing peer dependency: `npx expo install react-native-svg`
- [ ] Verify export still works: `npx expo export --platform web`

---

## Task 2: Clean up starter screens

**Files:**
- Delete: `src/app/index.tsx`
- Delete: `src/app/explore.tsx`
- Replace: `src/app/_layout.tsx`
- Delete unused starter components in `src/components/` (keep only reusable helpers if needed)

**Steps:**
- [ ] Remove starter screens and components.
- [ ] Create tab group: `src/app/(tabs)/_layout.tsx` with Search and Today tabs.
- [ ] Replace root `_layout.tsx` with simple stack + status-bar styling.

---

## Task 3: Fetch food data from USDA FoodData Central

**Files:**
- Create: `src/types/food.ts`
- Create: `scripts/fetch-foods.ts`
- Create: `src/data/foods.ts`
- Create: `.env.local`

**Steps:**
- [ ] Define types in `src/types/food.ts`:
  ```ts
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
  ```
- [ ] Store USDA API key in `.env.local` as `USDA_API_KEY` (already gitignored).
- [ ] Create `scripts/fetch-foods.ts` that:
  - Reads `USDA_API_KEY` from env.
  - Searches USDA FoodData Central for ~50 common foods by name.
  - Extracts per-100g calories, protein, carbs, fat from `foodNutrients`.
  - Assigns category and emoji.
  - Adds serving options (`g`, `piece`, `cup`, etc.) with approximate gram weights.
  - Writes formatted TypeScript array to `src/data/foods.ts`.
- [ ] Add a script to `package.json`: `"fetch-foods": "tsx scripts/fetch-foods.ts"`.
- [ ] Run `npm install -D tsx`.
- [ ] Run `npm run fetch-foods` to generate `src/data/foods.ts`.
- [ ] Verify `src/data/foods.ts` exports a `foods: Food[]` array.

---

## Task 4: Nutrition calculation utilities

**Files:**
- Create: `src/utils/nutrition.ts`

**Steps:**
- [ ] Add `calculateMacros(food, quantity, unitGrams)` returning `{ grams, calories, protein, carbs, fat }`.
- [ ] Add `sumMacros(logEntries)` returning totals.
- [ ] Add `getSuggestions(remaining, allFoods)` returning rule-based suggestions (protein → chicken/eggs/etc., carbs → rice/banana/etc., fats → nuts/avocado/etc.).

---

## Task 5: Zustand store with persistence

**Files:**
- Create: `src/store/useAppStore.ts`

**Steps:**
- [ ] Create store with:
  - `foods: Food[]`
  - `log: LogEntry[]`
  - `targets: { calories, protein, carbs, fat }`
  - `addToLog(food, quantity, unitGrams, unitLabel)`
  - `removeFromLog(entryId)`
  - `clearLog()`
  - `setTargets(targets)`
  - `getTotals()` derived from log
- [ ] Persist `log` and `targets` using `persist` middleware + AsyncStorage.
- [ ] Set default targets: calories 2000, protein 150, carbs 250, fat 65.

---

## Task 6: Build reusable UI components

**Files:**
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/FoodCard.tsx`
- Create: `src/components/MacroBar.tsx`
- Create: `src/components/SuggestionChips.tsx`

**Steps:**
- [ ] `Card`: white bg, rounded-xl, shadow-sm.
- [ ] `Button`: primary (brand pink), ghost/outline, icon circle variants.
- [ ] `Input`: rounded-xl border, focus state.
- [ ] `FoodCard`: emoji + name + calories per 100g.
- [ ] `MacroBar`: label, current, target, remaining, progress bar.
- [ ] `SuggestionChips`: horizontal scroll of suggestion pills.

---

## Task 7: Search Food screen

**Files:**
- Create: `src/app/(tabs)/index.tsx`

**Steps:**
- [ ] Screen bg `#F5F5F5`, safe-area padding.
- [ ] Title: "Search Food".
- [ ] Pill search bar with magnifier icon.
- [ ] Filter `foods` by name/category.
- [ ] Render `FoodCard` list.
- [ ] Tap card → push `/food/[id]`.

---

## Task 8: Food Detail screen

**Files:**
- Create: `src/app/food/[id].tsx`

**Steps:**
- [ ] Read `id` from route params, find food in store.
- [ ] Show large emoji, name, macros per 100g.
- [ ] Quantity stepper: - / + buttons and numeric display.
- [ ] Unit selector: dropdown/segment for `g`, `piece`, `cup`, etc.
- [ ] Live display of calculated macros for selected quantity.
- [ ] "I Ate This" primary button → `addToLog` → navigate back to Today tab.
- [ ] Handle food not found with simple message.

---

## Task 9: Today Tracker screen

**Files:**
- Create: `src/app/(tabs)/today.tsx`

**Steps:**
- [ ] Screen bg `#F5F5F5`.
- [ ] Title: "Today".
- [ ] Editable target inputs for calories/protein/carbs/fat.
- [ ] `MacroBar` summary cards for calories and macros.
- [ ] List of logged entries with quantity, macros, and delete button.
- [ ] Rule-based suggestion section using `getSuggestions`.
- [ ] Empty state if nothing logged.

---

## Task 10: Local notifications

**Files:**
- Create: `src/hooks/useNotifications.ts`
- Modify: `src/app/_layout.tsx`

**Steps:**
- [ ] Request notification permissions.
- [ ] Schedule two daily local notifications:
  - 12:30 PM: "Log your first meal today?"
  - 7:00 PM: "Check your remaining targets."
- [ ] Cancel/reschedule based on whether user has logged food or completed targets.
- [ ] Call hook in root layout.

---

## Task 11: Final verification

**Steps:**
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npx expo export --platform web`.
- [ ] Run `npx expo-doctor` and fix any new issues.
- [ ] Spot-check Search → Food Detail → "I Ate This" → Today flow.

---

## Notes

- Use emoji icons only; no image assets.
- Food data comes from USDA FoodData Central at build time via `scripts/fetch-foods.ts`.
- USDA API key is stored in `.env.local` (gitignored).
- No unit tests per user request; verify via TypeScript + export + manual flow.
