# Spatial Flow -- React Native

> **"The screen is not a canvas. It is a window into a continuous space."**
> -- Michel EKANI

React Native port of the [Spatial Flow Framework](../spatial-flow/README.md). Physics-based, accessible, speed-controllable animations for native mobile apps.

---

## Installation

```bash
npm install @spatial-flow/react-native react-native-reanimated
```

### Peer Dependencies

- `react` >= 18.0.0
- `react-native` >= 0.72.0
- `react-native-reanimated` >= 3.0.0

---

## Architecture

```
src/
  core/              # Soul Constants, speed control, reduced motion (shared physics)
    soul-constants.ts
    spatial-speed.ts
    scale-transition.ts
    reduced-motion.ts
    create-protocol.tsx
    types.ts

  hooks/             # React Native hooks
    useDropWater.ts
    useFollowFlow.ts
    usePortalExpansion.ts
    useReducedMotion.ts
    useSamsaraShift.ts
    useSequentialGrid.ts
    useSpatialSpeed.ts
    useSpatialTransition.ts
    useTransmigration.ts

  components/        # Ready-to-use components
    CascadeList.tsx
    ChrysalisContainer.tsx
    KineticItem.tsx
    ReflexMatrix.tsx

  index.ts           # Main barrel export
```

---

## Core Concepts

### Soul Constants (Shared Physics)

The same Soul Constants govern all platforms:

| Soul | Feel | Use Case |
|:-----|:-----|:---------|
| **Standard** | Confident, balanced | Navigation, morphing |
| **Reflex** | Snap, click, toggle | Buttons, toggles, micro-interactions |
| **Dream** | Viscous, dreamy | Backgrounds, parallax |
| **Chrysalis** | Organic breathing | Content transmutation |
| **Expansion** | Powerful, controlled | Fullscreen transitions |

### WCAG AAA Accessibility (3-Tier)

1. **Tier 1**: Respects `AccessibilityInfo.isReduceMotionEnabled()` (iOS/Android).
2. **Tier 2**: `useReducedMotion()` hook for component-level control.
3. **Tier 3**: Core utilities for non-component contexts.

### Physics Parity

Cross-platform physics consistency is verified via `tests/physics-parity.test.ts`. The same spring constants produce visually identical animations on Web, iOS, and Android.

---

## Quick Start

```tsx
import {
  SOUL_PHYSICS,
  STANDARD_SOUL,
  useSpatialSpeed,
  useReducedMotion,
  KineticItem,
  CascadeList,
} from "@spatial-flow/react-native";

function Dashboard({ items }) {
  return (
    <CascadeList stagger={0.05}>
      {items.map((item, i) => (
        <KineticItem key={item.id} index={i}>
          <Card>{item.name}</Card>
        </KineticItem>
      ))}
    </CascadeList>
  );
}
```

---

## Relationship to Web Framework

This package shares the **same Soul Constants and physics engine** as `@spatial-flow/core` (Web). The only differences are:

- Uses `react-native-reanimated` instead of `motion/react`.
- Adapts to native gesture systems (`react-native-gesture-handler`).
- Respects platform-specific reduced motion settings.

---

## Author

**Michel EKANI** -- Creator of Spatial Flow.

## License

[MIT](./LICENSE)
