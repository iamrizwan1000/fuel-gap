Build a simple React Native Expo application for food calorie and macro tracking.

This is not a full diet app, nutritionist app, meal plan app, or medical/fitness coaching app. Keep it simple. The purpose of this app is:

Users can search food, check calories/protein/carbs/fats by quantity, log what they ate today, see what is remaining, and get simple food suggestions to complete their daily target.

Application should have only 3 main screens.

Screen 1: Search Food Screen

This is the main food search screen.

Features:

* Search bar at the top.
* Filter icon beside the search bar.
* User can search foods like apple, banana, rice, egg, chicken, milk, bread, potato, oats, lentils, etc.
* Show food name, category, emoji/icon/image, calories, protein, carbs, and fats.
* User can tap any food to open detail screen.
* Add filter bottom sheet/modal with options:

  * High Protein
  * High Calories
  * Low Calories
  * High Carbs
  * High Fat
  * Low Fat
  * Fruits
  * Vegetables
  * Meat/Eggs
  * Dairy
  * Grains
  * Snacks
  * Drinks
* Search and filters should work from local database, not live API.

Screen 2: Food Detail Screen

This screen shows selected food details and lets user choose quantity.

Features:

* Show food name, category, icon/image.
* Show nutrition values for selected quantity:

  * calories
  * protein
  * carbs
  * fats
* Use plus/minus buttons to increase or decrease quantity.
* When quantity changes, nutrition values should update automatically.
* Support quantity options like:

  * 100g
  * 1 piece
  * half piece
  * 1 bite
  * 1 cup
  * custom grams
* Add main button text: “I Ate This”.
* When user taps “I Ate This”, save this food in today’s eating log.
* This means user has eaten this food today and app should count it in today’s totals.

Screen 3: Today Tracker Screen

This screen shows today’s progress.

Features:

* User can set daily target:

  * calories
  * protein
  * carbs
  * fats
* Show total eaten today.
* Show remaining target today.
* Show list of foods user has eaten today.
* User can delete/remove logged foods if needed.
* Show simple suggestions based on remaining target.
* Example:

  * If protein is remaining, suggest chicken, eggs, tuna, lentils, yogurt.
  * If carbs are remaining, suggest rice, banana, oats, potato, bread.
  * If calories are low but protein is remaining, suggest high-protein low-calorie foods.
* Suggestions should be rule-based for MVP, not AI-based.

Food Data Plan

Use USDA FoodData Central as the main nutrition data source, but do not call USDA API every time user searches in the app.

Correct system:
USDA FoodData Central API → importer script → cleaned local database → mobile app SQLite search

Create an importer script that fetches useful/common foods from USDA FoodData Central, cleans the data, and saves simplified records into SQLite.

The mobile app should use SQLite locally for search and filters.

Do not load 10,000 or 20,000 foods directly from one big JSON into React state. For large food data, use SQLite.

For MVP:

* Start with 100–500 common foods if needed.
* If time allows, prepare SQLite structure from beginning.
* Later expand to 5,000–20,000 foods.

Each food record should have:

* id
* name
* category
* emoji
* image nullable
* caloriesPer100g
* proteinPer100g
* carbsPer100g
* fatPer100g
* servingOptions

Example food structure:

{
id: "apple_raw",
name: "Apple",
category: "Fruits",
emoji: "🍎",
image: null,
caloriesPer100g: 52,
proteinPer100g: 0.3,
carbsPer100g: 14,
fatPer100g: 0.2,
servingOptions: [
{ label: "1 bite", grams: 10 },
{ label: "1/2 apple", grams: 90 },
{ label: "1 medium apple", grams: 180 },
{ label: "100g", grams: 100 }
]
}

Nutrition Calculation

Store nutrition per 100g.

When user selects quantity, calculate:

calories = caloriesPer100g * grams / 100
protein = proteinPer100g * grams / 100
carbs = carbsPer100g * grams / 100
fat = fatPer100g * grams / 100

Example:
If apple has 52 calories per 100g and user selects 50g:
52 * 50 / 100 = 26 calories.

Images Plan

USDA is mainly for nutrition data. Do not depend on USDA for images.

For MVP:

* Use emojis/category icons.
* Use placeholder images if needed.
* Add real images later.

Later:

* Use local images for popular foods.
* Use Open Food Facts for packaged food/product images if barcode or packaged products are added.

Notifications

Use local notifications for MVP with expo-notifications.

Do not use Firebase or OneSignal right now unless remote push notifications are required.

Notification requirements:

* Notification 1 around 12 PM or 1 PM if user has not opened/logged food today.
* Notification 2 in the evening if user still has remaining target or has not completed today’s log.
* Keep notification text simple and friendly.
* Do not spam users.

Example notifications:

* “Quick check-in: add what you’ve eaten so far.”
* “You still have some target remaining today. Want to update your log?”
* “Don’t forget to log your food today.”

Authentication

Do not force login in MVP.

App should work without auth.

Save user data locally:

* daily target
* today’s logged foods
* recent searches
* notification preference

Auth can be added later only for:

* backup
* sync between devices
* restore data after phone change
* premium features

Required Packages

Use Expo React Native.

Install these packages:

npx expo install expo-notifications expo-image expo-sqlite
npx expo install @react-native-async-storage/async-storage
npm install nativewind react-native-reanimated react-native-safe-area-context
npm install zustand lucide-react-native
npm install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo

Package usage:

* expo-router: navigation/screens
* nativewind: styling
* expo-sqlite: local food database
* expo-notifications: local reminders
* expo-image: optimized images
* async-storage: simple settings/user preferences
* zustand: app state management
* lucide-react-native: icons

Design Requirements

* Clean and simple UI.
* Modern mobile design.
* Use rounded cards.
* Use clear numbers.
* Use bottom tabs:

  * Search
  * Today
* Food detail can be a separate screen.
* Use button text “I Ate This”.
* Keep app simple and fast.
* Avoid complicated meal planning, medical advice, AI diet plans, or nutritionist language.

Important Technical Requirements

* Do not call USDA API live on every search.
* Search foods from local SQLite.
* Filters should query SQLite.
* Only show limited results, for example 20–50 foods at a time.
* Do not load thousands of foods into React state.
* Make the code structured so data source can later expand from 500 foods to 20,000 foods.
* Use local SQLite first, API fallback can be added later.

Future Enhancements

Do not build these in MVP, but keep code flexible for later:

* USDA online fallback search
* Open Food Facts barcode scanning
* packaged product images
* optional auth
* cloud sync
* premium features
* larger food database
* admin-managed food database
* AI-based suggestions

Final MVP Goal

The app should answer these simple questions for the user:

1. How many calories/protein/carbs/fats does this food have?
2. How much did I eat today?
3. How much is remaining today?
4. What can I eat next to complete my remaining target?
