# SPATIAL FLOW FRAMEWORK v3.0

> **"The screen is not a canvas. It is a window into a continuous space."**
> -- Michel EKANI

---

## What is Spatial Flow?

Spatial Flow is a **UI animation architecture** that treats digital interfaces as **continuous physical spaces** rather than stacks of static pages. Every element obeys laws of physics. Every transition preserves spatial continuity. The user never experiences a "cognitive gap" between states.

**One-line summary**: *"Elements never appear or disappear. They travel, morph, divide, or grow."*

### The Post-Flat Era

| Traditional Web | Spatial Flow |
|:---|:---|
| Page A -> [Blank Flash] -> Page B | State A -> [Mutation] -> State B |
| Elements teleport | Elements travel |
| Pages replace | Views transform |
| Static rendering | Living environment |

---

## The Three Laws of Digital Physics

1. **Conservation of Digital Mass** -- An element never vanishes. It moves, shrinks, morphs, or hides behind something.
2. **Continuity of Identity** -- If a "Search Bar" exists in View A and View B, it is the SAME object. It must physically travel between positions (via `layoutId`).
3. **Orthogonal Order** -- Movement follows strict grid lines. Diagonal movement is forbidden. Chaos is never acceptable.

---

## Framework Architecture

```
spatial-flow/
|
+-- package.json                  # npm publishable (npm install @spatial-flow/core)
+-- tsup.config.ts                # Build configuration
|
+-- src/                          # Source code (copy to your project)
|   +-- index.ts                  # Main barrel export
|   +-- core/                     # Physics engine & types
|   |   +-- index.ts              # Core barrel export
|   |   +-- soul-constants.ts     # The 5 Soul types (Standard, Reflex, Dream, Chrysalis, Expansion)
|   |   +-- spatial-speed.ts      # Global speed control module
|   |   +-- scale-transition.ts   # Transition scaling utilities
|   |   +-- reduced-motion.ts     # WCAG prefers-reduced-motion module
|   |   +-- reduced-motion.css    # CSS-level reduced motion safety net
|   |   +-- types.ts              # TypeScript definitions
|   |   +-- viewport-lock.css     # Required CSS for spatial integrity
|   |
|   +-- hooks/                    # React hooks
|   |   +-- index.ts              # Hooks barrel export
|   |   +-- useSpatialSpeed.ts    # Reactive speed control
|   |   +-- useGhostDom.ts        # Invisible measurement before animation
|   |   +-- useFollowFlow.ts      # Direction-aware navigation variants
|   |   +-- useReducedMotion.ts   # WCAG reduced motion detection hook
|   |
|   +-- components/               # Ready-to-use components
|       +-- index.ts              # Components barrel export
|       +-- KineticItem.tsx       # Lateral Glide (Protocol 2)
|       +-- CascadeList.tsx       # Sequential Spatial Cascade (Protocol 1)
|       +-- ChrysalisContainer.tsx # Chrysalis Shift (Protocol 6)
|       +-- SequentialGrid.tsx    # Sequential Grid (Protocol 3)
|       +-- DropWaterContainer.tsx # Drop Water Protocol (Protocol 8)
|       +-- PortalExpansionContainer.tsx # Portal Expansion Flow (Protocol 9)
|       +-- SamsaraShiftContainer.tsx # Samsara Shift (Protocol 7)
|       +-- TransmigratedItem.tsx # Transmigrated Astral Flow (Protocol 4)
|
+-- examples/                     # Complete runnable demos
|   +-- index.ts                  # Examples barrel export
|   +-- 01-cascade-dashboard.tsx  # SSC + Lateral Glide dashboard
|   +-- 02-chrysalis-form.tsx     # Chrysalis Shift auth form
|   +-- 03-spatial-router.tsx     # Follow Flow tab navigation
|   +-- 04-speed-control.tsx      # Speed presets + reduced motion
|   +-- 05-lateral-glide-gallery.tsx # Lateral Glide card gallery
|
+-- docs/                         # Human documentation
|   +-- 00-PHILOSOPHY.md          # Why Spatial Flow exists
|   +-- 01-GETTING-STARTED.md     # Quick start (5 minutes)
|   +-- 02-SOUL-CONSTANTS.md      # Physics engine reference
|   +-- 03-PROTOCOLS.md           # Complete protocol catalog (10 protocols)
|   +-- 04-DECISION-TREE.md       # "Which protocol should I use?"
|   +-- 05-GLOSSARY.md            # Complete terminology reference
|   +-- 06-PROHIBITIONS.md        # Absolute rules & anti-patterns
|
+-- ai/                           # AI Agent training
|   +-- SYSTEM-PROMPT.md          # Drop into any LLM to create an expert
|   +-- EXPERT-TRAINING.md        # Deep knowledge base for AI fine-tuning
|   +-- CODE-REVIEW-CHECKLIST.md  # AI audit checklist for Spatial Flow compliance
|
+-- INSTALL.md                    # Step-by-step installation guide
+-- README.md                     # This file
```

---

## The 10 Protocols

| # | Code | Name | One-liner |
|:--|:-----|:-----|:----------|
| 1 | **SSC** | Sequential Spatial Cascade | Content arrives in timed waves, not all at once |
| 2 | **LG** | Lateral Glide | Lists weave in from alternating sides with motion blur |
| 3 | **SQG** | Sequential Grid | Orthogonal, turn-based reordering (chess logic) |
| 4 | **TAF** | Transmigrated Astral Flow | Elements teleport between DOM positions via `layoutId` |
| 5 | **RM** | Reflex Matrix | Organic mitosis -- a cell divides to reveal options |
| 6 | **CS** | Chrysalis Shift | Container persists, content metamorphoses inside |
| 7 | **SS** | Samsara Shift | Navigation transmigrates across vertical distances |
| 8 | **DWP** | Drop Water Protocol | Avatar-to-authentication gravitational transition |
| 9 | **PEF** | Portal Expansion Flow | Inline content expands to fullscreen from exact position |
| 10 | **LPS** | Layout Projection Shield | Protection against CSS containing block interference |

---

## npm Installation

```bash
# Install from npm
npm install @spatial-flow/core motion

# Import in your project
import {
  SOUL_PHYSICS,
  STANDARD_SOUL,
  useSpatialSpeed,
  useReducedMotion,
  KineticItem,
  CascadeList,
  ChrysalisContainer,
} from "@spatial-flow/core";

# Import CSS
import "@spatial-flow/core/viewport-lock.css";
import "@spatial-flow/core/reduced-motion.css";
```

---

## Quick Start

```bash
# 1. Install the dependency
npm install motion

# 2. Copy the spatial-flow/src directory into your project
cp -r spatial-flow/src/ your-project/src/spatial-flow/

# 3. Add the viewport lock CSS to your global styles
@import "./spatial-flow/core/viewport-lock.css";

# 4. Start using components
```

```tsx
import { SOUL_PHYSICS } from "./spatial-flow/core/soul-constants";
import { KineticItem } from "./spatial-flow/components/KineticItem";
import { CascadeList } from "./spatial-flow/components/CascadeList";

// Your elements now obey the laws of digital physics.
```

See `INSTALL.md` for the complete installation guide.

---

## WCAG Accessibility (prefers-reduced-motion)

Spatial Flow is WCAG 2.1 AAA compliant for motion. Three-tier approach:

### Tier 1: CSS Safety Net
```css
/* Import in your global styles */
@import "@spatial-flow/core/reduced-motion.css";
```
When `prefers-reduced-motion: reduce` is active, ALL CSS transitions and animations are killed instantly.

### Tier 2: React Hook
```tsx
import { useReducedMotion } from "@spatial-flow/core";

function MyComponent() {
  const { prefersReduced, safeTransition, safeSpring } = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={safeSpring(STANDARD_SOUL)}
    />
  );
}
```

### Tier 3: Core Utilities
```tsx
import { safeTransition, safeSpring, getReducedMotion } from "@spatial-flow/core";

// In any context (not just React components)
const transition = safeTransition({ duration: 0.5, ease: SF_EASE });
const spring = safeSpring(STANDARD_SOUL);
const isReduced = getReducedMotion();
```

### Rules
| Scenario | Reduced Motion Behavior |
|:---|:---|
| Spring animations | Instant (critically-damped) |
| Tween animations | `duration: 0` |
| `repeat: Infinity` | Fully stopped |
| Opacity-only fades | Preserved (150ms) -- WCAG-safe |
| Layout shifts | Instant (no spatial disorientation) |

---

## For AI Agents

If you are an AI assistant (Claude, GPT, Gemini, etc.), read:

1. **`ai/SYSTEM-PROMPT.md`** -- Paste this into your system prompt to become a Spatial Flow expert.
2. **`ai/EXPERT-TRAINING.md`** -- Deep training with decision logic, edge cases, and implementation patterns.
3. **`ai/CODE-REVIEW-CHECKLIST.md`** -- Use this to audit any codebase for Spatial Flow compliance.

---

## Philosophy

> *"If it looks like a webpage, you failed. It must feel like a movie."*

Spatial Flow draws inspiration from:
- **Linear** -- Precision of list animations (Lateral Glide)
- **iOS** -- Home screen physics (Sequential Grid)
- **Spotify Mobile** -- Player Bar to Full Screen (TAF)
- **Apple App Store** -- Card-to-page expansion (Visiomorphism)
- **2048** -- Orthogonal tile movement (Sequential Grid)

---

## Author

**Michel EKANI** -- Creator of the Spatial Flow architecture and the Visiomorphism design philosophy.

---

## License

This framework is provided as a design system specification and implementation guide. Use freely in your projects.