# SPATIAL FLOW -- Installation Guide

> From zero to living interface in 10 minutes.

---

## Prerequisites

- **React 18+** (React 19 compatible)
- **TypeScript 5+** (recommended, JavaScript also supported)
- **Motion** (formerly Framer Motion) v11+
- **Tailwind CSS v4** (recommended, not strictly required)

---

## Step 1: Install Dependencies

### Option A: Install as npm package (recommended)

```bash
npm install @spatial-flow/core motion
```

Then import directly:

```tsx
import { SOUL_PHYSICS, useReducedMotion, KineticItem } from "@spatial-flow/core";
import "@spatial-flow/core/viewport-lock.css";
import "@spatial-flow/core/reduced-motion.css";
```

### Option B: Install dependencies manually

```bash
# Motion is the only hard dependency
npm install motion

# Recommended: Tailwind CSS (for utility classes in examples)
npm install tailwindcss @tailwindcss/postcss
```

> **Note**: The `motion` package is the successor to `framer-motion`. Import from `motion/react`:
> ```tsx
> import { motion, AnimatePresence } from "motion/react";
> ```

---

## Step 2: Copy Source Files

Copy the `spatial-flow/src/` directory into your project:

```bash
# Option A: Copy the entire framework
cp -r spatial-flow/src/ src/spatial-flow/

# Option B: Cherry-pick what you need
# At minimum, you need core/:
cp -r spatial-flow/src/core/ src/spatial-flow/core/
```

### Minimum Required Files

| File | Purpose | Required? |
|:-----|:--------|:----------|
| `core/soul-constants.ts` | Physics engine constants | **YES** |
| `core/types.ts` | TypeScript definitions | **YES** |
| `core/scale-transition.ts` | Transition scaling utilities | If using speed control |
| `core/spatial-speed.ts` | Global speed control | If using speed presets |
| `core/viewport-lock.css` | CSS viewport constraints | **YES** |
| `core/reduced-motion.ts` | WCAG reduced motion module | **Recommended** |
| `core/reduced-motion.css` | CSS reduced motion safety net | **Recommended** |
| `hooks/useSpatialSpeed.ts` | React hook for speed | If using speed control |
| `hooks/useReducedMotion.ts` | WCAG reduced motion hook | **Recommended** |
| `hooks/useGhostDom.ts` | Dimension measurement | If using Chrysalis Shift |
| `hooks/useFollowFlow.ts` | Direction-aware variants | If using Follow Flow |
| `components/KineticItem.tsx` | Lateral Glide component | Optional |
| `components/CascadeList.tsx` | SSC component | Optional |
| `components/ChrysalisContainer.tsx` | Chrysalis Shift component | Optional |

---

## Step 3: Add Viewport Lock CSS

**This step is CRITICAL.** Without it, spatial animations will create parasitic scrollbars and break the illusion.

### Option A: Import in your global CSS

```css
/* In your main CSS file (e.g., src/styles/index.css) */
@import "../spatial-flow/core/viewport-lock.css";
```

### Option B: Add manually

```css
/* === SPATIAL FLOW: VIEWPORT LOCK === */
html, body, #root {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* Scrollbar hider for internal scroll containers */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

### Option C: HTML viewport meta tag

```html
<!-- In your index.html <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

> **Why?** The viewport must be a fixed stage where actors move, not a scrolling document. Lateral movements (x: +/- 150px) and Visiomorphism create temporary overflow. The viewport lock prevents this from creating scrollbars.

---

## Step 3b: Add Reduced Motion CSS (WCAG)

**Strongly recommended for accessibility compliance (WCAG 2.1 SC 2.3.3 AAA).**

```css
/* In your main CSS file, after viewport-lock */
@import "../spatial-flow/core/reduced-motion.css";
```

This provides a CSS-level safety net that instantly kills all animations when the user has `prefers-reduced-motion: reduce` enabled in their OS settings. The JS-level hook (`useReducedMotion`) provides finer control per-component.

---

## Step 4: Verify Installation

Create a test component:

```tsx
import { motion } from "motion/react";
import { SOUL_PHYSICS } from "./spatial-flow/core/soul-constants";

export function SpatialFlowTest() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SOUL_PHYSICS.standard}
      className="p-8 bg-white rounded-xl shadow-lg"
    >
      <h1>Spatial Flow is alive!</h1>
      <p>This element entered with Soul Physics.</p>
    </motion.div>
  );
}
```

If the element slides up with a spring animation, the installation is complete.

---

## Step 5: Configure Speed Control (Optional)

If you want users to control animation speed:

```tsx
import { useSpatialSpeed } from "./spatial-flow/hooks/useSpatialSpeed";
import { scaleTransition } from "./spatial-flow/core/scale-transition";

function MyComponent() {
  const { preset, setPreset, speedLabel } = useSpatialSpeed();

  return (
    <div>
      <select value={preset} onChange={e => setPreset(e.target.value)}>
        <option value="zen">Zen (0.5x)</option>
        <option value="normal">Normal (1x)</option>
        <option value="rapide">Fast (2x)</option>
        <option value="ultra">Ultra (10x)</option>
      </select>

      <motion.div
        animate={{ x: 100 }}
        transition={scaleTransition({ duration: 0.5, ease: "easeOut" })}
      >
        This respects the global speed setting.
      </motion.div>
    </div>
  );
}
```

---

## Step 6: Train Your AI Agent (Optional but Recommended)

If you're using an AI coding assistant:

1. Copy `ai/SYSTEM-PROMPT.md` into your AI's system prompt
2. Feed `ai/EXPERT-TRAINING.md` as context at the beginning of each session
3. Use `ai/CODE-REVIEW-CHECKLIST.md` for automated audits

This ensures your AI writes Spatial Flow-compliant code from the start.

---

## Integration with Existing Projects

### Will Spatial Flow break my existing animations?

**No.** Spatial Flow is additive:

- The viewport lock CSS only affects `html`, `body`, and `#root`. Your internal scroll containers work normally with `overflow-y: auto`.
- The Soul Constants are just objects -- they don't override anything.
- The components are opt-in. Use them where you want spatial animations.

### Can I use Spatial Flow with other animation libraries?

**Yes, but with constraints:**

- **Motion (Framer Motion)**: First-class support. All protocols are designed for this library.
- **React Spring**: Compatible for basic springs. No `layoutId` support (no TAF, no LPS).
- **GSAP**: Compatible for tweens. Spring physics require manual implementation.
- **CSS Animations**: Not recommended. Springs cannot be expressed in CSS `@keyframes`.

### Can I use only some protocols?

**Absolutely.** Each protocol is independent:

- Want just Lateral Glide? Copy `KineticItem.tsx` + `soul-constants.ts`.
- Want just Chrysalis Shift? Copy `ChrysalisContainer.tsx` + `useGhostDom.ts` + `soul-constants.ts`.
- Want just the physics? Copy `soul-constants.ts` alone.

---

## Troubleshooting

### "Horizontal scrollbar appears during animations"

Your viewport lock CSS is missing or not applied. Check Step 3.

### "Elements teleport instead of animating"

You're probably using `display: none` or conditional rendering that unmounts the element. Use opacity/position changes instead (see Anchor Protocol in the docs).

### "layoutId causes 'quantum flicker'"

Two elements with the same `layoutId` are mounted simultaneously. Use namespace strategy: `layoutId="avatar-mobile"` vs `layoutId="avatar-desktop"`.

### "Animation freezes when blur is applied"

Your parent element is creating a CSS containing block. Apply the Layout Projection Shield: `layoutId={isAnimating ? undefined : "my-element"}`.

---

## Next Steps

1. Read `docs/00-PHILOSOPHY.md` to understand the "why"
2. Read `docs/01-GETTING-STARTED.md` for your first Spatial Flow component
3. Browse `docs/03-PROTOCOLS.md` for the complete protocol catalog
4. Use `docs/04-DECISION-TREE.md` to choose the right protocol for your use case