# Publishing FuelGap to Android & iOS

## Prerequisites

### Accounts
| Account | Cost | Needed For |
|---------|------|------------|
| [Apple Developer Program](https://developer.apple.com/programs/) | $99/year | iOS builds, App Store |
| [Google Play Developer](https://play.google.com/console/signup) | $25 one-time | Android builds, Play Store |
| [Expo Account](https://expo.dev/signup) | Free | EAS Build & Submit |

### Install Tools
```bash
npm install -g eas-cli
eas login
```

---

## 1. Required `app.json` Fields — Fill These In

Edit `app.json` before building. These fields **must** have real values:

| Field | Example Value | Where to get it |
|-------|--------------|-----------------|
| `ios.bundleIdentifier` | `com.fuelgap` | Any unique reverse-domain string |
| `ios.appleTeamId` | `ABC123DEFG` | [Apple Developer](https://developer.apple.com) → Membership → Team ID |
| `android.package` | `com.fuelgap` | Same as bundle identifier (or any unique string) |

**Important:** These IDs cannot be changed after the first build submission. Choose carefully.

### Full `app.json` reference

```json
{
  "expo": {
    "name": "FuelGap",                     // Display name on home screen
    "slug": "fuel-gap",                    // URL-friendly name
    "version": "1.0.0",                    // Increment for each release
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",    // 1024x1024 PNG
    "userInterfaceStyle": "automatic",     // light/dark mode
    "ios": {
      "bundleIdentifier": "com.fuelgap",              // ✓ DONE
      "appleTeamId": "YOUR_APPLE_TEAM_ID",            // ← CHANGE THIS
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"] // push notifications
      }
    },
    "android": {
      "package": "com.fuelgap",                       // ✓ DONE
      "adaptiveIcon": {
        "backgroundColor": "#F5F5F5",
        "foregroundImage": "./assets/images/adaptive-icon.png"
      },
      "permissions": ["POST_NOTIFICATIONS"]
    },
    "plugins": [
      "expo-router",
      ["expo-splash-screen", {
        "backgroundColor": "#F5F5F5",
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 100
      }],
      ["expo-notifications", {
        "icon": "./assets/images/notification-icon.png",
        "color": "#E8175D"
      }]
    ]
  }
}
```

---

## 2. App Icons & Assets

Create these image files and place them in `assets/images/`:

| Asset | Required Size | Required For |
|-------|--------------|--------------|
| `icon.png` | 1024×1024 | iOS + Android app icon |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon (foreground, no background) |
| `splash-icon.png` | 1284×2778 | Splash screen image |
| `notification-icon.png` | 96×96 (Android) / 32×32 (iOS) | Notification bar icon |
| `favicon.png` | 48×48 | Web export |

**Tools to generate:** [icon.kitchen](https://icon.kitchen), [Canva](https://canva.com), or [Figma](https://figma.com)

---

## 3. Android Build & Publish

### 3a. Development Build (testing on device)
```bash
eas build --platform android --profile development
```
Output: `.apk` file → install directly on any Android device.

### 3b. Production Build (Play Store)
```bash
eas build --platform android --profile production
```
Output: `.aab` (Android App Bundle) file.

### 3c. Submit to Google Play
```bash
eas submit --platform android
```
Or upload `.aab` manually at [play.google.com/console](https://play.google.com/console).

### Required Inputs for Google Play Console
- **App name:** FuelGap
- **Short description (max 80 chars):** Track your daily macros with thousands of foods at your fingertips.
- **Full description (max 4000 chars):** --- *(use description below)*
- **Screenshots:** 2-8 phone (minimum 2), 2-8 tablet (minimum 2) — 1080×1920 or larger
- **Feature graphic:** 1024×500 PNG or JPG
- **App category:** Health & Fitness
- **Tags:** nutrition, calorie counter, macro tracker, food diary, diet tracker, fitness
- **Email contact:** your-email@example.com
- **Privacy policy URL:** Host `PRIVACY.md` (included in project) on GitHub Pages, a personal site, or use a service like [privacypolicies.com](https://privacypolicies.com)
- **Content rating:** Complete questionnaire (answers determine age rating)
- **App signing:** Google manages app signing key by default (recommended)
- **Pricing & distribution:** Free, all countries

---

## 4. iOS Build & Publish

### 4a. Prerequisites in Apple Developer Portal

Before building iOS, set up:

1. **Certificate & Profile:**
   - EAS handles this automatically for managed builds
   - You'll need your **Apple Team ID** (from Membership page)

2. **Push Notifications Capability:**
   - Go to [developer.apple.com](https://developer.apple.com)
   - Certificates, Identifiers & Profiles → Identifiers → select your App ID
   - Enable **Push Notifications** capability
   - Generate a **Push Notification Key** (.p8 file) under Keys → Add → Push Notifications
   - EAS will ask for this .p8 file during build

### 4b. Development Build
```bash
eas build --platform ios --profile development
```
Output: `.ipa` file → install via TestFlight or direct device install.

### 4c. Production Build
```bash
eas build --platform ios --profile production
```
Output: `.ipa` file.

### 4d. Submit to App Store
```bash
eas submit --platform ios
```
Or use Transporter app to upload `.ipa`.

### Required Inputs for App Store Connect
- **App Information:**
  - Name (max 30 chars)
  - Subtitle (max 30 chars, optional)
  - Privacy policy URL
  - Category (e.g. Health & Fitness, Food & Drink)
  - Age rating questionnaire
- **Screenshots:**
  - 6.7" display (1290×2796) — required
  - 6.5" display (1242×2688) — required
  - 5.5" display (1242×2208) — required
  - iPhone screenshots can be reused with scaling
- **App Review Information:**
  - Demo account: None required (no sign-up)
  - Contact info: your-email@example.com
  - Notes for reviewer: Simple macro tracking app. No sign-up. All food data searchable offline.
- **Version Release:** Manual or automatic

---

## 5. EAS Build Profiles

Create `eas.json` in the project root:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

---

## 6. iOS Push Notification Credentials

When you run `eas build --platform ios` for the first time:

1. EAS will detect that push notifications are needed (from `expo-notifications` plugin)
2. It will prompt you to upload a **.p8 key** from Apple Developer Portal
3. Steps to create the .p8 key:
   - Go to [developer.apple.com/account/resources/keys/add](https://developer.apple.com/account/resources/keys/add)
   - Select **Apple Push Notifications service (APNs)**
   - Download the `.p8` file (one-time download only!)
   - Upload it when EAS prompts you

---

## 7. Environment Variables

The USDA API key (`USDA_API_KEY` in `.env.local`) is used by:
```
npm run build-db
```
to generate `assets/foods.db`. This SQLite database is bundled with the app for fast offline search. Re-run this command if you want to refresh the food database.

**Important:** Ensure `.env.local` is in `.gitignore` so the API key is never committed.

---

## 8. Permissions

The app uses these device permissions:

| Permission | Platform | Reason | Config |
|-----------|----------|--------|---------|
| Push Notifications | iOS + Android | Daily meal reminders | `"expo-notifications"` plugin in app.json |
| `POST_NOTIFICATIONS` | Android 13+ | Notification permission | Added in `android.permissions` |

These are auto-configured by the `expo-notifications` plugin.

---

## 9. Local Build (alternative to EAS)

### Android (requires Android Studio)
```bash
npx expo run:android
```

### iOS (requires Xcode)
```bash
npx expo run:ios
```

---

## 10. Pre-Submission Checklist

### Before First Build
- [ ] `ios.bundleIdentifier` set in `app.json`
- [ ] `ios.appleTeamId` set in `app.json`
- [ ] `android.package` set in `app.json`
- [ ] App icons generated and placed in `assets/images/`
- [ ] Splash screen image sized correctly
- [ ] Notification icon created
- [ ] `eas.json` created in project root
- [ ] Logged into EAS CLI (`eas login`)

### Before Play Store Submission
- [ ] Tested on physical Android device
- [ ] Tested on Android tablet (7" + 10")
- [ ] Privacy policy URL ready
- [ ] 2+ phone screenshots, 2+ tablet screenshots
- [ ] Feature graphic (1024×500)
- [ ] App description written
- [ ] Content rating questionnaire completed

### Before App Store Submission
- [ ] Tested on physical iOS device
- [ ] Tested on iPad
- [ ] Apple Team ID confirmed
- [ ] Push Notifications capability enabled
- [ ] APNs .p8 key generated and uploaded
- [ ] Privacy policy URL ready
- [ ] Screenshots for all required display sizes
- [ ] App description, keywords, and support URL ready

---

## 11. Quick Commands

```bash
# Android production build
eas build --platform android --profile production

# iOS production build
eas build --platform ios --profile production

# Submit both to stores
eas submit --platform all

# View build status
eas build:list

# Clear credentials (if stuck on iOS)
eas credentials --platform ios
```

---

## 12. App Store Descriptions

### Short Description (Android — max 80 chars)
```
Track your daily macros with thousands of foods at your fingertips.
```

### Short Description (iOS — max 30 chars)
```
Macro Tracker
```

### Subtitle (iOS — max 30 chars)
```
Track what you eat
```

### Full Description (both stores — 4000 chars max)
```
FuelGap makes it easy to track your daily nutrition with a clean, simple interface.

SEARCH ANY FOOD
Browse thousands of foods — fruits, vegetables, meats, grains, dairy, and more. Each food shows its calories, protein, carbs, and fat per 100g. Search by name or category and find what you need instantly.

LOG YOUR MEALS
Select your portion size using grams, cups, pieces, or spoons. Tap "I Ate This" and it's logged. No accounts. No subscriptions. No complicated forms.

SEE YOUR DAILY PROGRESS
Your logged meals are tallied into a clear daily summary. A remaining-macros card shows what's left, with smart suggestions to help you fill nutritional gaps.

DAILY REMINDERS
Optional notifications at lunchtime and evening help you stay consistent with your logging.

DESIGNED FOR TABLETS
Works beautifully on phones, 7" tablets, and 10" tablets. The interface adapts to any screen size.

OFFLINE FIRST
All food data is stored locally on your device. No internet connection needed after installation.

No ads. No tracking. No account required. Just a straightforward macro tracker that works.
```

### Keywords (iOS — max 100 chars)
```
nutrition,calorie counter,macro tracker,food diary,diet tracker,fitness,protein,carbs,fat
```

### Promotional Text (iOS — max 170 chars)
```
Track your daily macros with thousands of foods. Simple, fast, and works offline. No account needed.
```

### App Category
| Store | Category |
|-------|----------|
| Google Play | Health & Fitness |
| App Store | Health & Fitness |
