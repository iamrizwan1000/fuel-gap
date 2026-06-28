import Database from "better-sqlite3";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const API_KEY = process.env.USDA_API_KEY;
if (!API_KEY) throw new Error("USDA_API_KEY env var is required");

const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

const SEARCH_TERMS = [
  "apple", "apricot", "avocado", "banana", "blackberry", "blueberry",
  "cherry", "coconut", "cranberry", "date", "fig", "grape", "grapefruit",
  "guava", "kiwi", "lemon", "lime", "mango", "melon", "nectarine",
  "orange", "papaya", "peach", "pear", "pineapple", "plum", "pomegranate",
  "raisin", "raspberry", "strawberry", "tangerine", "watermelon",
  "artichoke", "asparagus", "beet", "broccoli", "brussels sprout",
  "cabbage", "carrot", "cauliflower", "celery", "collard", "corn",
  "cucumber", "eggplant", "endive", "garlic", "green bean", "kale",
  "kohlrabi", "leek", "lettuce", "mushroom", "okra", "onion",
  "parsley", "parsnip", "pea", "pepper", "potato", "pumpkin",
  "radish", "rhubarb", "rutabaga", "scallion", "shallot", "spinach",
  "squash", "sweet potato", "swiss chard", "tomatillo", "tomato",
  "turnip", "watercress", "zucchini",
  "almond", "bean", "brazil nut", "cashew", "chestnut", "chickpea",
  "chili pepper", "edamame", "flaxseed", "hazelnut", "hemp seed",
  "hummus", "lentil", "macadamia", "nut", "peanut", "pecan",
  "pine nut", "pistachio", "pumpkin seed", "quinoa", "sesame seed",
  "soybean", "sunflower seed", "tempeh", "tofu", "walnut",
  "bagel", "barley", "biscuit", "bread", "brown rice", "bulgur",
  "cake", "cereal", "cinnamon", "cookie", "cornbread", "cornmeal",
  "couscous", "cracker", "croissant", "doughnut", "flour", "granola",
  "grits", "muffin", "noodle", "oat", "pancake", "pasta", "pie",
  "pita", "popcorn", "pretzel", "rice", "roll", "rye", "tortilla",
  "waffle", "white rice", "whole wheat",
  "beef", "bacon", "bologna", "bratwurst", "chicken", "duck",
  "egg", "goose", "ground beef", "ham", "hot dog", "lamb", "liver",
  "pork", "prosciutto", "salami", "sausage", "steak", "turkey",
  "veal", "venison",
  "clam", "cod", "crab", "fish", "haddock", "halibut", "herring",
  "lobster", "mackerel", "mussel", "octopus", "oyster", "pollock",
  "salmon", "sardine", "scallop", "shrimp", "snapper", "squid",
  "tilapia", "trout", "tuna",
  "butter", "buttermilk", "cheese", "cottage cheese", "cream",
  "cream cheese", "greek yogurt", "ice cream", "milk", "mozzarella",
  "parmesan", "sour cream", "whipped cream", "yogurt",
  "brownie", "candy", "caramel", "chocolate", "fudge", "gelatin",
  "honey", "jam", "jelly", "licorice", "maple syrup", "molasses",
  "pudding", "sugar", "syrup",
  "barbecue sauce", "baking powder", "baking soda", "catsup",
  "coconut oil", "condiment", "cooking oil", "dressing", "gravy",
  "ketchup", "margarine", "mayonnaise", "mustard", "olive oil",
  "pepper", "pickle", "relishes", "salt", "sauce", "shortening",
  "soy sauce", "spice", "vinegar", "worcestershire sauce", "yeast",
  "ale", "beer", "brandy", "champagne", "cider", "coffee", "cola",
  "energy drink", "fruit juice", "gin", "juice", "liquor", "malt",
  "port", "punch", "red wine", "rum", "sake", "sherry", "soda",
  "sports drink", "tea", "tequila", "vermouth", "vodka", "water",
  "whiskey", "white wine", "wine",
  "baby food", "cereal bar", "chips", "energy bar", "enchilada",
  "french fry", "granola bar", "nacho", "pizza", "quesadilla",
  "sandwich", "soup", "taco", "toaster pastry", "tortilla chip",
  "burrito",
];

interface USDAFood {
  fdcId: number;
  description: string;
  foodCategory?: { description: string } | string;
  foodNutrients: Array<{ nutrientId: number; value: number }>;
}

const emojiMap: [RegExp, string][] = [
  [/apples?/, "🍎"], [/apricot/, "🍑"], [/avocado/, "🥑"], [/banana/, "🍌"],
  [/blueberries?/, "🫐"], [/cantaloupe/, "🍈"], [/cherries?/, "🍒"],
  [/coconut/, "🥥"], [/cranberry/, "🔴"], [/dates?/, "🌴"], [/fig/, "🫐"],
  [/grapefruit/, "🍊"], [/grapes?/, "🍇"], [/guava/, "🍈"], [/kiwi/, "🥝"],
  [/lemon/, "🍋"], [/lime/, "🍋"], [/mango/, "🥭"], [/melon/, "🍈"],
  [/nectarine/, "🍑"], [/oranges?/, "🍊"], [/papaya/, "🫒"], [/peach/, "🍑"],
  [/peanut/, "🥜"], [/pear/, "🍐"], [/pineapple/, "🍍"],
  [/plum/, "🫐"], [/pomegranate/, "🍎"], [/raisin/, "🍇"],
  [/raspberries?/, "🫐"], [/strawberries?/, "🍓"],
  [/tangerine/, "🍊"], [/watermelon/, "🍉"],
  [/artichoke/, "🥬"], [/asparagus/, "🥦"], [/beet/, "🥬"],
  [/broccoli/, "🥦"], [/brussels sprout/, "🥬"], [/cabbage/, "🥬"],
  [/carrot/, "🥕"], [/cauliflower/, "🥦"], [/celery/, "🥬"],
  [/collard/, "🥬"], [/corn/, "🌽"], [/cucumber/, "🥒"],
  [/eggplant/, "🍆"], [/endive/, "🥬"], [/garlic/, "🧄"],
  [/green bean/, "🫘"], [/kale/, "🥬"], [/kohlrabi/, "🥬"],
  [/leek/, "🥬"], [/lettuce/, "🥬"], [/mushroom/, "🍄"],
  [/okra/, "🥬"], [/onion/, "🧅"], [/parsley/, "🌿"], [/parsnip/, "🥬"],
  [/peas?/, "🫛"], [/pepper/, "🫑"], [/potato/, "🥔"],
  [/pumpkin/, "🎃"], [/radish/, "🥬"], [/rhubarb/, "🫚"],
  [/rutabaga/, "🥬"], [/scallion/, "🧅"], [/shallot/, "🧅"],
  [/spinach/, "🍃"], [/squash/, "🫚"], [/sweet potato/, "🍠"],
  [/swiss chard/, "🥬"], [/tomatillo/, "🫒"], [/tomato/, "🍅"],
  [/turnip/, "🥬"], [/watercress/, "🥬"], [/zucchini/, "🥒"],
  [/almond/, "🌰"], [/lentil/, "🫘"], [/beans?/, "🫘"],
  [/brazil nut/, "🌰"], [/cashew/, "🌰"], [/chestnut/, "🌰"],
  [/chickpea/, "🫘"], [/edamame/, "🫘"], [/flaxseed/, "🌱"],
  [/hazelnut/, "🌰"], [/hemp seed/, "🌱"], [/hummus/, "🫘"],
  [/macadamia/, "🌰"], [/nuts?/, "🌰"], [/pecan/, "🌰"],
  [/pine nut/, "🌰"], [/pistachio/, "🌰"], [/pumpkin seed/, "🌱"],
  [/quinoa/, "🌾"], [/sesame seed/, "🌱"], [/soybean/, "🫘"],
  [/sunflower seed/, "🌱"], [/tempeh/, "🫘"], [/tofu/, "🧈"],
  [/walnut/, "🌰"], [/olive/, "🫒"],
  [/bagel/, "🥯"], [/barley/, "🌾"], [/biscuit/, "🥐"],
  [/bread/, "🍞"], [/brown rice/, "🍘"], [/bulgur/, "🌾"],
  [/cake/, "🎂"], [/cereal/, "🥣"], [/cookie/, "🍪"],
  [/cornbread/, "🌽"], [/cornmeal/, "🌽"], [/couscous/, "🌾"],
  [/cracker/, "🍘"], [/croissant/, "🥐"], [/doughnut/, "🍩"],
  [/flour/, "🌾"], [/granola/, "🥣"], [/grits/, "🌽"],
  [/muffin/, "🧁"], [/noodle/, "🍜"], [/oats?/, "🥣"],
  [/pancake/, "🥞"], [/pasta/, "🍝"], [/pie/, "🥧"],
  [/pita/, "🥙"], [/popcorn/, "🍿"], [/pretzel/, "🥨"],
  [/rice/, "🍚"], [/tortilla/, "🌮"], [/waffle/, "🧇"],
  [/whole wheat/, "🍞"],
  [/beef/, "🥩"], [/bacon/, "🥓"], [/bologna/, "🥩"],
  [/bratwurst/, "🌭"], [/chicken/, "🍗"], [/duck/, "🦆"],
  [/eggs?/, "🥚"], [/goose/, "🦆"], [/ground beef/, "🥩"],
  [/ham/, "🥩"], [/hot dog/, "🌭"], [/lamb/, "🥩"],
  [/liver/, "🥩"], [/pork/, "🥩"], [/prosciutto/, "🥩"],
  [/salami/, "🥩"], [/sausage/, "🌭"], [/steak/, "🥩"],
  [/turkey/, "🦃"], [/veal/, "🥩"], [/venison/, "🥩"],
  [/clam/, "🦪"], [/cod/, "🐟"], [/crab/, "🦀"], [/fish/, "🐟"],
  [/haddock/, "🐟"], [/halibut/, "🐟"], [/herring/, "🐟"],
  [/lobster/, "🦞"], [/mackerel/, "🐟"], [/mussel/, "🦪"],
  [/octopus/, "🐙"], [/oyster/, "🦪"], [/pollock/, "🐟"],
  [/salmon/, "🐟"], [/sardine/, "🐟"], [/scallop/, "🦪"],
  [/shrimp/, "🦐"], [/snapper/, "🐟"], [/squid/, "🦑"],
  [/tilapia/, "🐟"], [/trout/, "🐟"], [/tuna/, "🐠"],
  [/butter/, "🧈"], [/buttermilk/, "🥛"], [/cheese/, "🧀"],
  [/cottage cheese/, "🥣"], [/cream cheese/, "🧀"], [/cream/, "🥛"],
  [/greek yogurt/, "🥣"], [/ice cream/, "🍦"], [/milk/, "🥛"],
  [/mozzarella/, "🧀"], [/parmesan/, "🧀"], [/sour cream/, "🥛"],
  [/whipped cream/, "🥛"], [/yogurt/, "🥣"],
  [/brownie/, "🍫"], [/candy/, "🍬"], [/caramel/, "🍬"],
  [/chocolate/, "🍫"], [/fudge/, "🍫"], [/gelatin/, "🍮"],
  [/honey/, "🍯"], [/jams?/, "🍯"], [/jelly/, "🍯"],
  [/licorice/, "🍬"], [/maple syrup/, "🍁"], [/molasses/, "🫗"],
  [/pudding/, "🍮"], [/sugar/, "🍬"], [/syrup/, "🫗"],
  [/barbecue sauce/, "🫗"], [/catsup/, "🫗"], [/ketchup/, "🫗"],
  [/mayonnaise/, "🫗"], [/mustard/, "🫗"],
  [/coconut oil/, "🫒"], [/cooking oil/, "🫒"], [/olive oil/, "🫒"],
  [/dressing/, "🫗"], [/gravy/, "🫗"], [/margarine/, "🧈"],
  [/soy sauce/, "🫗"], [/spices?/, "🌶️"], [/vinegar/, "🫗"],
  [/yeast/, "🧫"], [/pickle/, "🥒"], [/salsa/, "🫗"],
  [/salt/, "🧂"], [/pepper/, "🌶️"], [/sauce/, "🫗"],
  [/coffee/, "☕"], [/tea/, "🍵"], [/beer/, "🍺"],
  [/ale/, "🍺"], [/champagne/, "🍾"], [/cider/, "🍎"],
  [/cola/, "🥤"], [/energy drink/, "⚡"], [/juice/, "🧃"],
  [/soda/, "🥤"], [/sports drink/, "🥤"], [/water/, "💧"],
  [/red wine/, "🍷"], [/white wine/, "🍷"], [/wine/, "🍷"],
  [/whiskey/, "🥃"], [/vodka/, "🥃"], [/rum/, "🥃"],
  [/gin/, "🥃"], [/tequila/, "🥃"],
  [/baby food/, "👶"], [/cereal bar/, "🍫"], [/chips/, "🍟"],
  [/energy bar/, "🍫"], [/enchilada/, "🌯"], [/french fry/, "🍟"],
  [/granola bar/, "🍫"], [/nacho/, "🫓"], [/pizza/, "🍕"],
  [/quesadilla/, "🫓"], [/sandwich/, "🥪"], [/soup/, "🍜"],
  [/taco/, "🌮"], [/burrito/, "🌯"], [/toaster pastry/, "🥐"],
  [/tortilla chip/, "🫓"],
];

function getEmoji(desc: string): string {
  const d = desc.toLowerCase();
  for (const [re, emoji] of emojiMap) {
    if (re.test(d)) return emoji;
  }
  if (/beef|pork|lamb|veal|venison|meat/.test(d)) return "🥩";
  if (/chicken|turkey|duck|poultry/.test(d)) return "🍗";
  if (/fish|seafood|salmon|tuna|cod|trout/.test(d)) return "🐟";
  if (/fruit|berry|citrus|melon/.test(d)) return "🍎";
  if (/vegetable|greens|salad/.test(d)) return "🥦";
  if (/dairy|milk|cheese|yogurt|cream/.test(d)) return "🥛";
  if (/grain|cereal|rice|wheat|oats|barley/.test(d)) return "🌾";
  if (/nut|seed|almond|walnut|cashew/.test(d)) return "🌰";
  if (/soup/.test(d)) return "🍜";
  if (/dessert|cake|cookie|pie|pudding|ice cream/.test(d)) return "🍰";
  if (/beverage|drink|juice|soda|coffee|tea/.test(d)) return "🥤";
  if (/alcohol|beer|wine|liquor|vodka/.test(d)) return "🍺";
  if (/oil|fat/.test(d)) return "🫒";
  if (/spice|herb|seasoning/.test(d)) return "🌿";
  if (/sauce|condiment|dressing|gravy/.test(d)) return "🫗";
  if (/bread|bagel|toast|roll|bun/.test(d)) return "🍞";
  if (/pasta|noodle|spaghetti/.test(d)) return "🍝";
  if (/pizza/.test(d)) return "🍕";
  if (/sandwich|burger|wrap/.test(d)) return "🥪";
  if (/taco|burrito|enchilada/.test(d)) return "🌮";
  if (/snack|chip|cracker|popcorn/.test(d)) return "🍿";
  if (/candy|chocolate|sugar|candy/.test(d)) return "🍬";
  if (/egg/.test(d)) return "🥚";
  return "🍽️";
}

function getServingOptions(desc: string, category: string) {
  const d = desc.toLowerCase();
  const opts: { label: string; grams: number }[] = [{ label: "g", grams: 1 }];

  const isLiquid = /milk|juice|cream|soup|beverage|drink|water|tea|coffee|beer|wine|oil|sauce|syrup|vinegar/.test(d);
  const isWhole = /apple|banana|orange|peach|pear|mango|egg|potato|tomato|carrot|cucumber|pepper|chicken breast|steak|fish fillet/.test(d);

  if (isLiquid) opts.push({ label: "cup", grams: 237 });
  if (isWhole) opts.push({ label: "piece", grams: 100 });
  if (/butter|margarine|oil|honey|syrup|jam|jelly|peanut butter|mayonnaise|ketchup|mustard/.test(d)) {
    opts.push({ label: "tbsp", grams: 14 });
  }
  if (/nuts?|almond|cashew|walnut|pecan|seeds?|granola|berries?|raisin/.test(d)) {
    opts.push({ label: "handful", grams: 30 });
  }
  if (/bread|toast|bagel|bun|roll|slice/.test(d)) {
    opts.push({ label: "slice", grams: 30 });
  }
  if (/pasta|rice|quinoa|couscous|oats|cereal|yogurt|cottage cheese/.test(d)) {
    opts.push({ label: "cup", grams: 150 });
  }
  if (/cheese/.test(d) && !/cottage|cream/.test(d)) {
    opts.push({ label: "slice", grams: 28 });
  }

  return opts;
}

function getCategoryName(foodCategory: { description: string } | string | undefined): string {
  if (!foodCategory) return "Other";
  const cat = typeof foodCategory === "string" ? foodCategory : foodCategory.description;
  const c = cat.toLowerCase();

  if (c.includes("fruit")) return "Fruit";
  if (c.includes("vegetable") || c.includes("legume")) return "Vegetable";
  if (c.includes("beef") || c.includes("pork") || c.includes("lamb") || c.includes("meat")) return "Meat";
  if (c.includes("poultry") || c.includes("chicken") || c.includes("turkey")) return "Poultry";
  if (c.includes("fish") || c.includes("shellfish") || c.includes("seafood")) return "Seafood";
  if (c.includes("dairy") || c.includes("milk") || c.includes("cheese") || c.includes("yogurt")) return "Dairy";
  if (c.includes("grain") || c.includes("rice") || c.includes("bread") || c.includes("cereal") || c.includes("pasta")) return "Grain";
  if (c.includes("nut") || c.includes("seed")) return "Nuts & Seeds";
  if (c.includes("oil") || c.includes("fat")) return "Oil";
  if (c.includes("spice") || c.includes("herb")) return "Spices";
  if (c.includes("soup")) return "Soup";
  if (c.includes("sauce") || c.includes("condiment") || c.includes("dressing") || c.includes("gravy")) return "Sauce";
  if (c.includes("beverage") || c.includes("drink") || c.includes("juice") || c.includes("tea") || c.includes("coffee")) return "Beverage";
  if (c.includes("dessert") || c.includes("cake") || c.includes("cookie") || c.includes("pie") || c.includes("ice cream")) return "Dessert";
  if (c.includes("candy") || c.includes("chocolate") || c.includes("sugar") || c.includes("sweet")) return "Sweets";
  if (c.includes("snack") || c.includes("chip") || c.includes("cracker")) return "Snacks";
  if (c.includes("egg")) return "Eggs";
  if (c.includes("baby")) return "Baby Food";
  if (c.includes("fast food") || c.includes("restaurant")) return "Fast Food";
  if (c.includes("alcoholic") || c.includes("beer") || c.includes("wine") || c.includes("spirit") || c.includes("liquor")) return "Alcohol";

  return cat.replace(/^.+?,\s*/, "").replace(/\s*\(.*?\)\s*$/, "").trim() || "Other";
}

async function searchFoods(term: string): Promise<USDAFood[]> {
  const all: USDAFood[] = [];
  for (let page = 1; page <= 2; page++) {
    const url = new URL(SEARCH_URL);
    url.searchParams.set("query", term);
    url.searchParams.set("dataType", "Foundation,SR Legacy");
    url.searchParams.set("pageSize", "200");
    url.searchParams.set("pageNumber", String(page));
    url.searchParams.set("api_key", API_KEY!);

    try {
      const res = await fetch(url.toString());
      if (!res.ok) break;
      const data = await res.json();
      if (!data.foods?.length) break;
      all.push(...data.foods);
    } catch {
      break;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return all;
}

function getNutrient(nutrients: Array<{ nutrientId: number; value: number }>, id: number) {
  return nutrients.find((n) => n.nutrientId === id)?.value ?? 0;
}

async function main() {
  console.log("Fetching foods from USDA API...");
  const seen = new Set<number>();
  const allFoods: USDAFood[] = [];

  for (const term of SEARCH_TERMS) {
    const foods = await searchFoods(term);
    let added = 0;
    for (const f of foods) {
      if (!seen.has(f.fdcId)) {
        seen.add(f.fdcId);
        allFoods.push(f);
        added++;
      }
    }
    console.log(`  "${term}": ${foods.length} results, ${added} new (total: ${allFoods.length})`);
  }

  console.log(`\nTotal unique foods: ${allFoods.length}`);

  const dbDir = resolve("assets");
  if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });
  const dbPath = resolve(dbDir, "foods.db");
  if (existsSync(dbPath)) writeFileSync(dbPath, "");

  const db = new Database(dbPath);

  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other',
      emoji TEXT NOT NULL DEFAULT '🍽️',
      calories_per_100g REAL NOT NULL DEFAULT 0,
      protein_per_100g REAL NOT NULL DEFAULT 0,
      carbs_per_100g REAL NOT NULL DEFAULT 0,
      fat_per_100g REAL NOT NULL DEFAULT 0,
      serving_options TEXT NOT NULL DEFAULT '[{"label":"g","grams":1}]'
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS foods_fts USING fts5(
      name, category,
      content='foods',
      content_rowid='rowid',
      tokenize='porter unicode61'
    );
  `);

  const insert = db.prepare(`
    INSERT OR IGNORE INTO foods (id, name, category, emoji, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, serving_options)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertFts = db.prepare(`
    INSERT INTO foods_fts (rowid, name, category)
    VALUES (?, ?, ?)
  `);

  let committed = 0;
  const batchSize = 100;

  for (const food of allFoods) {
    const cals = round(getNutrient(food.foodNutrients, 1008));
    const protein = round(getNutrient(food.foodNutrients, 1003));
    const carbs = round(getNutrient(food.foodNutrients, 1005));
    const fat = round(getNutrient(food.foodNutrients, 1004));

    if (cals === 0 && protein === 0 && carbs === 0 && fat === 0) continue;

    const desc = food.description.trim();
    const usdaCat = typeof food.foodCategory === "object" ? food.foodCategory?.description : food.foodCategory;
    const category = getCategoryName(usdaCat || food.foodCategory as string);
    const emoji = getEmoji(desc);
    const servingOpts = JSON.stringify(getServingOptions(desc, category));

    const info = insert.run(String(food.fdcId), desc, category, emoji, cals, protein, carbs, fat, servingOpts);
    const rowId = info.lastInsertRowid;
    if (typeof rowId === "number" && rowId > 0) {
      insertFts.run(rowId, desc, category);
    }

    committed++;
    if (committed % batchSize === 0) {
      console.log(`    Inserted ${committed}/${allFoods.length}...`);
    }
  }

  db.close();

  console.log(`\nWrote ${allFoods.length} foods to ${dbPath}`);
  console.log(`DB size: ${(await import("node:fs")).statSync(dbPath).size} bytes`);
}

function round(value: number, decimals = 1): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

main().catch(console.error);
