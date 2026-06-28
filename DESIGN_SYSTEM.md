# DESIGN_SYSTEM.md
> A reusable, app-agnostic design system for React Native mobile applications.
> Inspired by Airbnb's visual language — clean, warm, minimal, and content-first.
> Drop this file into any project and follow these rules for consistent UI.

---

## 1. Design Philosophy

- **White and off-white do the work.** Let backgrounds breathe. Never fill a screen with color.
- **One accent color per screen.** The brand color appears on a single primary action only.
- **Content is the hero.** Photos, listings, and text take priority over decorative UI.
- **Rounded everywhere.** Nothing has sharp corners. Softness builds trust.
- **Flat with subtle depth.** Minimal shadows, no gradients, no heavy borders.

---

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `color.brand.primary` | `#E8175D` | Primary CTA buttons, active tab icons, key highlights |
| `color.brand.dark` | `#1A1A1A` | Confirm/serious action buttons, headings |
| `color.bg.screen` | `#F5F5F5` | All screen backgrounds (warm light gray) |
| `color.bg.card` | `#FFFFFF` | Cards, modals, bottom sheets, inputs |
| `color.text.primary` | `#222222` | All primary text — headings, body |
| `color.text.secondary` | `#717171` | Subtitles, meta text, placeholders, helper text |
| `color.text.link` | `#222222` | Underlined inline links |
| `color.border` | `#EBEBEB` | Input borders, dividers, card outlines |
| `color.badge.dark` | `#1A1A1A` | Dark badge backgrounds (e.g. "NEW") |
| `color.badge.light` | `#FFFFFF` | Light badge backgrounds overlaid on images |
| `color.icon.inactive` | `#717171` | All inactive icons |
| `color.icon.active` | `#E8175D` | Active/selected icons |
| `color.overlay` | `rgba(0,0,0,0.5)` | Modal/sheet background overlay |

### Rules
- Never use `color.brand.primary` on more than one button per screen.
- `color.brand.dark` is for confirmatory or serious actions (agree, confirm, submit).
- Screen background is always `color.bg.screen`, never pure white (`#FFFFFF`).
- Cards and surfaces on top of the screen background are always `#FFFFFF`.

---

## 3. Typography

### Font Families
- **iOS:** `SF Pro Display` (headings) / `SF Pro Text` (body)
- **Android:** `Roboto`
- **Fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `type.display` | 28px | 700 | 34px | Large screen titles |
| `type.title` | 22px | 700 | 28px | Modal/sheet headings |
| `type.section` | 18px | 700 | 24px | Section headings within screens |
| `type.body.large` | 16px | 400 | 24px | Primary body text, descriptions |
| `type.body` | 15px | 400 | 22px | Standard body text |
| `type.card.title` | 14px | 500 | 20px | Card primary labels |
| `type.card.meta` | 13px | 400 | 18px | Card secondary info (price, location, rating) |
| `type.label` | 13px | 600 | 18px | Form field labels |
| `type.helper` | 12px | 400 | 16px | Input helper/error text |
| `type.badge` | 11px | 700 | 14px | Badge and chip labels |
| `type.tab` | 10px | 500 | 12px | Bottom tab bar labels |

### Rules
- Always **sentence case** — never ALL CAPS in body or headings.
- ALL CAPS only for badge labels (`NEW`, `TOP`).
- Heading weight is always `700` — never lighter for any title.
- Never use more than 2 font sizes in a single card component.

---

## 4. Spacing

**Base unit: `4px`**

| Token | Value | Usage |
|---|---|---|
| `space.xs` | 4px | Tight inline gaps, icon-to-label spacing |
| `space.sm` | 8px | Inner element padding (top/bottom), small gaps |
| `space.md` | 16px | Screen horizontal padding, standard gaps |
| `space.lg` | 24px | Section vertical spacing |
| `space.xl` | 32px | Large section breaks, screen top padding |
| `space.xxl` | 48px | Hero section spacing |

### Rules
- **Screen horizontal padding is always `16px`** on both sides — no exceptions.
- Vertical spacing between sections is always `space.lg` (24px) minimum.
- Bottom safe area: always add device safe area inset + `8px` above any fixed bottom bar.

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | 4px | Checkboxes, small toggles |
| `radius.sm` | 8px | Small chips, tags |
| `radius.md` | 12px | Inputs, standard buttons, cards |
| `radius.lg` | 16px | Large cards, prominent containers |
| `radius.xl` | 20px | Bottom sheet top corners, modals |
| `radius.pill` | 999px | Pill buttons, search bar, circular icon buttons, badges |

### Rules
- **Nothing has sharp corners (0px radius).** Minimum is `radius.xs` (4px).
- Search bars and floating CTAs always use `radius.pill`.
- Bottom sheets always have `radius.xl` on top corners only, square bottom.
- All icon buttons (back, share, save) are perfect circles — `radius.pill`.

---

## 6. Shadows & Elevation

Keep shadows subtle. This is a flat design — depth is used sparingly.

| Token | Value | Usage |
|---|---|---|
| `shadow.xs` | `0 1px 3px rgba(0,0,0,0.06)` | Subtle card lift |
| `shadow.sm` | `0 2px 8px rgba(0,0,0,0.08)` | Standard cards, inputs on focus |
| `shadow.md` | `0 4px 12px rgba(0,0,0,0.10)` | Floating buttons, active elements |
| `shadow.lg` | `0 -4px 24px rgba(0,0,0,0.10)` | Bottom sheets lifting from screen |
| `shadow.circle` | `0 2px 6px rgba(0,0,0,0.12)` | Circular icon buttons (back, share) |

### Rules
- Cards use `shadow.xs` or `shadow.sm` only — never heavy shadows.
- Circular icon buttons always have `shadow.circle`.
- Bottom sheets always use `shadow.lg` (upward shadow).
- Never use `elevation` on flat text or label elements.

---

## 7. Buttons

### Primary — Brand
```
Background:   color.brand.primary (#E8175D)
Text:         #FFFFFF, type.body, weight 600
Height:       52px
Radius:       radius.md (12px)
Width:        Full width in forms/modals
```

### Primary — Dark
```
Background:   color.brand.dark (#1A1A1A)
Text:         #FFFFFF, type.body, weight 600
Height:       52px
Radius:       radius.md (12px)
Width:        Full width
Use for:      Confirmatory actions (Agree, Submit, Continue)
```

### Floating Pill CTA
```
Background:   color.brand.primary
Text:         #FFFFFF, weight 600
Height:       52px
Radius:       radius.pill (999px)
Padding:      24px horizontal
Position:     Fixed bottom-right, above tab bar
Shadow:       shadow.md
Use for:      Primary action on detail screens
```

### Ghost / Outline Button
```
Background:   transparent
Border:       1px solid color.border (#EBEBEB)
Text:         color.text.primary, weight 500
Height:       52px
Radius:       radius.md
Use for:      Secondary actions, cancel, skip
```

### Icon Button (Circle)
```
Shape:        Perfect circle, 40px diameter
Background:   #FFFFFF
Shadow:       shadow.circle
Icon:         24px, color.text.primary
Tap target:   Minimum 44px × 44px
Use for:      Back navigation, share, save/heart
```

### Social Login Button (Square)
```
Shape:        64px × 64px square
Background:   #FFFFFF
Border:       1px solid color.border
Radius:       radius.md (12px)
Icon:         Centered, 28px
```

### Rules
- One `color.brand.primary` button maximum per screen.
- Loading state: replace button label with three animated dots `• • •`.
- Disabled state: opacity `0.4`, not interactive.
- Tap feedback: scale to `0.97` + opacity `0.85`, `80ms`.

---

## 8. Inputs & Form Fields

### Text Input
```
Height:       52px
Background:   #FFFFFF
Border:       1px solid color.border (#EBEBEB)
Radius:       radius.md (12px)
Padding:      16px horizontal
Placeholder:  color.text.secondary, type.body
Focus:        Border → color.brand.dark, no glow
Filled:       Label floats to top at 12px, value at 15px
```

### Grouped Input (multiple fields, one container)
```
Single shared border container, radius.md
Internal horizontal divider: 1px color.border
No repeated outer borders per field
```

### Input with Icon
```
Same as text input
Icon: 24px, right-aligned, color.text.secondary
```

### Checkbox
```
Size:         24px × 24px
Radius:       radius.xs (4px)
Unchecked:    White bg, 1px color.border
Checked:      color.brand.dark bg, white checkmark icon
```

### Toggle / Switch
```
Active:       color.brand.primary track, white thumb
Inactive:     #CCCCCC track, white thumb
Size:         Standard platform toggle
```

### Rules
- Every input must have a placeholder or floating label — never bare.
- Helper/error text appears below input, `type.helper`, `color.text.secondary`.
- Error state: border becomes `#FF3B30`, helper text turns red.
- Group related inputs in a single rounded container with internal dividers.

---

## 9. Cards

### Standard Card
```
Background:   #FFFFFF
Radius:       radius.md (12px)
Shadow:       shadow.sm
Overflow:     hidden (so image respects radius)
```

### Card Image
```
Aspect ratio: 3:2 (landscape)
Position:     Top of card, full width
Radius:       Applied via card container overflow
```

### Card Body
```
Padding:      12px
Title:        type.card.title, color.text.primary
Meta line:    type.card.meta, color.text.secondary
```

### Badge on Card (overlaid on image)
```
Position:     Bottom-left of image, 8px margin
Background:   #FFFFFF (light) or #1A1A1A (dark)
Text:         type.badge
Radius:       radius.pill
Padding:      4px 10px
```

### Heart / Save Button on Card
```
Position:     Top-right of image, 8px margin
Shape:        Circle, 32px
Background:   rgba(255,255,255,0.9)
Icon:         Heart outline → filled red on tap
Animation:    Scale 1.0 → 1.2 → 1.0, 150ms
```

---

## 10. Bottom Sheet / Modal

```
Background:       #FFFFFF
Top radius:       radius.xl (20px) on top-left and top-right only
Bottom radius:    0px (square, sits at bottom edge)
Overlay behind:   color.overlay rgba(0,0,0,0.5)
Drag handle:      Optional — 4px × 32px pill, #CCCCCC, centered top
Close button:     × icon, top-right, 44px tap target
Back button:      Circle icon button (§7), top-left, when multi-step
Animation:        Slide up from bottom, 280ms, ease-out
```

---

## 11. Navigation

### Bottom Tab Bar
```
Height:           83px (including safe area)
Background:       #FFFFFF
Top border:       1px solid color.border
Icon size:        26px × 26px
Label:            type.tab
Active:           Icon + label → color.brand.primary
Inactive:         Icon + label → color.icon.inactive
```

### Top Navigation / Header
```
Background:       Transparent (overlaid on screen bg or photo)
Back button:      Circle icon button (§7), left side
Title:            type.body, weight 600, centered (optional)
Action buttons:   Circle icon buttons, right side
```

### Search Bar
```
Shape:            Full-width pill, radius.pill
Height:           52px
Background:       #FFFFFF
Shadow:           shadow.sm
Left icon:        Magnifier, 20px, color.text.secondary
Placeholder:      color.text.secondary, type.body
Margin:           16px horizontal, 12px top
```

### Category / Tab Switcher (horizontal)
```
Layout:           Horizontal row, evenly spaced
Active tab:       weight 700 + 2px underline, color.brand.primary
Inactive tab:     color.text.secondary, weight 400
Gap:              space.lg (24px) between tabs
```

---

## 12. Badges & Chips

### Pill Badge (on image)
```
Background:   #FFFFFF or #1A1A1A
Text:         type.badge, matching contrast color
Radius:       radius.pill
Padding:      4px 10px
Shadow:       shadow.xs
```

### "NEW" Badge
```
Background:   color.badge.dark (#1A1A1A)
Text:         #FFFFFF, type.badge (ALL CAPS)
Radius:       radius.pill
Size:         Small, overlaid top-right of icon
```

### Filter Chip (horizontal scroll row)
```
Background:   #FFFFFF (inactive) / #1A1A1A (active)
Text:         type.card.meta, color swaps with bg
Border:       1px solid color.border (inactive only)
Radius:       radius.pill
Padding:      8px 16px
Height:       36px
```

---

## 13. Icons

- **Style:** Outlined, 1.5px stroke, no fills (except active state)
- **Default size:** 24px × 24px
- **Tab bar size:** 26px × 26px
- **Inactive color:** `color.icon.inactive` (#717171)
- **Active color:** `color.icon.active` (#E8175D)
- **Inside buttons:** Always white when on a colored button background

---

## 14. Avatar

```
Shape:        Perfect circle
Border:       1px solid color.border
Sizes:        32px (small), 48px (medium), 64px (large)
Fallback:     Initials on color.bg.screen background
Badge overlay: 20px circle, bottom-right of avatar
```

---

## 15. Dividers & Separators

```
Color:        color.border (#EBEBEB)
Thickness:    1px
Style:        Solid, full width (with 16px horizontal margin)
Vertical gap: space.lg (24px) above and below
```

---

## 16. Empty States

```
Icon/Emoji:   Centered, large (48px icon or single emoji)
Heading:      type.section, color.text.primary, centered
Subtext:      type.body, color.text.secondary, centered, max 2 lines
CTA Button:   color.brand.primary, below subtext, not full-width
Layout:       Vertically centered in available space
```

---

## 17. Motion & Animation

| Action | Animation | Duration | Easing |
|---|---|---|---|
| Bottom sheet open | Slide up | 280ms | ease-out |
| Bottom sheet close | Slide down | 240ms | ease-in |
| Card press | Scale 1.0 → 0.97 | 100ms | ease |
| Button press | Opacity 1.0 → 0.85 | 80ms | ease |
| Heart/save tap | Scale 1.0 → 1.2 → 1.0, fill red | 150ms | spring |
| Screen push | Native platform slide | Default | Default |
| Tab switch | Instant | — | — |
| Loading dots | Fade pulse, staggered | 400ms | ease-in-out |

### Rules
- Never override the native screen transition animation.
- Never animate layout shifts or reflows — only transform and opacity.
- Keep all animations under 300ms. Anything longer feels slow.

---

## 18. Dos and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Use `color.bg.screen` (#F5F5F5) for all screen backgrounds | Use pure white (#FFF) as a screen background |
| Use white cards on top of the gray screen background | Put cards on a white screen background (no contrast) |
| Use one `color.brand.primary` action per screen | Use pink/brand color on multiple buttons |
| Make all icon buttons perfect white circles with shadow | Use plain back arrows or text "Back" links |
| Use `radius.pill` for search bars and floating CTAs | Use rectangular or sharp-cornered buttons |
| Use `color.brand.dark` for confirm/agree actions | Use brand pink for serious/legal confirmations |
| Floating label inputs (label moves up when filled) | Stack label above input as static text |
| Show partial third card to hint at horizontal scroll | Use pagination dots for card rows |
| Keep section headings left-aligned at 16px from edge | Center-align section headings |
| Group related inputs in one container with dividers | Use separate bordered boxes for each field |
| Keep shadows subtle (8–12% opacity max) | Use heavy or colored shadows |
| Sentence case for all labels and headings | ALL CAPS for anything except badge labels |
