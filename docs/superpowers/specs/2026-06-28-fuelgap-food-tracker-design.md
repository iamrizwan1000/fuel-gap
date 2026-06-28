# FuelGap Food Tracker — Design Spec

## Overview
Build a simple React Native / Expo utility app for searching foods, viewing calories and macros by quantity, logging what the user ate today, and seeing remaining daily targets. No login, no server, no meal planning — just search, detail, and today summary.

## Requirements

### Screens
1. **Search Food Screen**
   - Search bar to filter foods.
   - Show food emoji, name, and calories per 100 g in a card list.
   - Tapping a food opens Food Detail.

2. **Food Detail Screen**
   - Show emoji, name, and base macros per 100 g.
   - Quantity stepper (+ / -) with unit selector (g, piece, cup, half, bite).
   - Live-updated macros for the selected quantity.
   - Primary "I Ate This" button that saves the entry to today's log.

3. **Today Tracker Screen**
   - Editable daily targets for calories, protein, carbs, and fats.
   - Show total eaten today and remaining for each macro.
   - List of foods logged today with quantity.
   - Rule-based suggestions (e.g., if protein remaining → suggest chicken, eggs, tuna, lentils, Greek yogurt).

### Core Features
- Search foods.
- View food details with quantity-based macro calculation.
- Log food with "I Ate This".
- Show eaten totals and remaining targets.
- Suggest foods to fill remaining macros.
- Persist log and targets locally.
- Local scheduled notifications (midday + evening reminders).

### Data Model
- Local `foods.ts` with 50–100 common foods.
- Each food item:
  - `id: string`
  - `name: string`
  - `category: string`
  - `emoji: string`
  - `caloriesPer100g: number`
  - `proteinPer100g: number`
  - `carbsPer100g: number`
  - `fatPer100g: number`
  - `servingOptions: { label: string; grams: number }[]`

### Calculations
For selected `quantity` and `unit`:
1. Convert to grams: `grams = quantity * unit.grams`
2. `calories = caloriesPer100g * grams / 100`
3. `protein = proteinPer100g * grams / 100`
4. `carbs = carbsPer100g * grams / 100`
5. `fat = fatPer100g * grams / 100`

### State
Zustand store with three slices:
- `foods`: static imported food array.
- `log`: array of `{ id, foodId, name, emoji, quantity, unit, grams, calories, protein, carbs, fat, timestamp }`.
- `targets`: `{ calories, protein, carbs, fat }`.

Persist `log` and `targets` via `@react-native-async-storage/async-storage`.

### Navigation
- Bottom tabs: `Search` and `Today`.
- Food Detail pushes as a stack screen.
- Logged items in Today can tap through to Food Detail pre-filled for editing.

### Styling
Follow `DESIGN_SYSTEM.md`:
- Screen background: `#F5F5F5`
- Cards / surfaces: `#FFFFFF`
- Primary CTA: `#E8175D`
- Text primary: `#222222`, secondary: `#717171`
- Border: `#EBEBEB`
- 4 px base spacing grid; 16 px horizontal screen padding.
- Rounded corners everywhere (cards 12 px, pills 999 px).
- Emoji icons only; no image assets or remote URLs.

### Notifications
Use `expo-notifications` to schedule two friendly local reminders:
1. Around 12:00–13:00 if user has not logged food today.
2. Evening reminder if targets are not completed.

### Tech Stack
- Expo SDK 56
- Expo Router (file-based)
- React Native
- NativeWind / Tailwind CSS for styling
- Zustand for state
- AsyncStorage for persistence
- expo-notifications for local reminders
- lucide-react-native for icons
- Emoji icons for food items

## Out of Scope
- Authentication / accounts
- Server backend / API integration
- Barcode scanning
- Meal planning or recipes
- Historical logs beyond "today"
- Push notifications from a server

## Open Decisions / Defaults
- Food database: local TypeScript file, ~50 common foods, emoji icons.
- Default daily targets: calories 2000, protein 150 g, carbs 250 g, fat 65 g (editable).
- Notifications: scheduled after first app launch; rescheduled daily based on log state.
