# CityFix Hub Homepage – UI Design Notes

## Overall Theme
- **Dark theme:** Deep green/teal-black gradient background.
- **Vivid green accents** and neon-style highlights for emphasis and CTAs.

---

## Layout Structure
### Header/Navigation
- **Fixed position, horizontal navigation** at top.
  - **Left:** Brand logo ("Save Earth" with a stylized planet/earth icon)
  - **Right:** Navigation links (“About”, “Articles”, “For Business”, “Discover”) spaced evenly.
  - **Text color:** White/light-gray, high contrast.

### Hero Section
- **Dominant, eye-catching hero:** 
  - Large headline with layered text: 
    - _"Mother"_ (white, bold)
    - _"Earth"_ (neon/bright green, glow effect, bold)
  - **Subheading:** Short supporting statement (“We help you live carbon neutral.”), left-aligned, smaller.
  - **CTA Button:** “Calculate Impact” — vivid green; bold/uppercase; rounded; centered horizontally with prominent padding.
  - **Hero Visual:** Striking bust/statue (Mother Earth), facing left, covered with foliage and colorful lighting, partially behind headline; image breaks the grid purposely.
  - **Decorative accent:** Translucent geometric/organic shapes for depth behind main content.

### Features Section (Grid/Cards)
- **Two horizontally aligned cards:**
  - **Card 1:** “Understand Emission”
    - Subtext: Calculator info, “Use our calculator powered by better data…”
    - Action button: “Discover More” (green, round, with white arrow icon)
  - **Card 2:** “Support Climate Projects”
    - Subtext: “Sign up and fund high-impact carbon offsets…”
    - Action button: “Discover More” (green, round, white icon)
- **Cards use:** Slightly lighter dark backgrounds, rounded corners, subtle drop shadow for elevation; 32px spacing between.

---

## Color Palette
| Variable Name          | Hex Value   | Usage                        |
|-----------------------|------------|-------------------------------|
| --bg-canvas           | #07181a    | Main background, hero area    |
| --bg-canvas-accent    | #112629    | Gradients, deeper shadows     |
| --primary-text        | #ffffff    | Headlines, navigation         |
| --secondary-text      | #eaf8f9    | Subheadings, nav, cards       |
| --tertiary-text       | #b8d6ce    | Card subtext/placeholders     |
| --accent-green        | #27fa76    | CTA & Accent (“Earth”, buttons)|
| --card-bg             | #1e2931    | Card panels                   |
| --btn-text            | #212829    | Button text on green          |
| --icon-accent         | #2cfb72    | Button icons, highlights      |

---

## Typography
| Element           | Font Family                    | Size     | Weight  | Style      |
|-------------------|-------------------------------|----------|---------|------------|
| Headline (Hero)   | Helvetica Neue, Arial, sans-serif | 72-90px | 900     | Bold/Glow  |
| Navigation/Buttons| Helvetica Neue, Arial, sans-serif | 16-18px | 600     | Uppercase  |
| Subheading/Text   | Helvetica Neue, Arial, sans-serif | 14-16px | 400     | Normal     |
| Button Label      | Helvetica Neue, Arial, sans-serif | 16px    | 700     | Uppercase  |

---

## Spacing
- **Header:** 32px vertical padding; 40px horizontal margin on nav links.
- **Hero Headline:** 48px top margin; 36px bottom margin.
- **CTA Button:** 20px top & bottom padding; 32px left/right; 16px bottom margin from text; border-radius: 8px.
- **Hero Image:** Overlapping headline (negative right margin ~-48px), filling ~40% of hero width.
- **Cards Row:** 40px margin-top from Hero; 32px gap between cards.
- **Cards:** 32px internal padding, border-radius: 16px, subtle drop shadow.

---

## Components & States

### Logo
- Left: Planet/earth icon (SVG or asset), gradient fill (green/blue/white).

### Navigation
- Links: Horizontal stack, spaced, white text, hover underline or subtle neon effect.
- Active: Brighter or outlined.

### Button (Primary/CTA)
- **Background:** --accent-green
- **Text:** --btn-text, bold, uppercase, drop-shadow for focus.
- **Icon:** Circle/arrow, white, 16px, right of text.
- **Hover:** Slightly lighter/darker green, intensified glow/border.

### Card
- **Background:** --card-bg; 
- **Border radius:** 16px 
- **Box shadow:** 0 4px 16px #000a (subtle)
- **Content:** 
  - Headline: secondary-text, bold
  - Subtext: tertiary-text, regular
  - Action Button: style as above

### Image Component
- Hero: Decorative, partial background effect, not in main layout flow, z-index below text.

---

## Responsive/Adaptive Notes
- **Large screens:** Cards side by side, hero image left, text right.
- **Medium/small screens:** Cards stack vertically, CTA center, hero image shrinks or stacks above text.

---

# Summary for React Implementation
- Use CSS-in-JS or Tailwind for dark gradients, palette, glow/shadow effects.
- Structure:
  - `<header>`: fixed, nav/brand
  - `<main>`: hero section with stack/grid, hero image as decorative
  - `<section>`: feature cards, flex or grid
- Ensure all brand green accents and glows are established in palette/constants.
- Typography and spacing set via theme/provider for consistency.
- All interactive elements use hover/focus states as above (prefer animated/transitioned).

---
