# Spatial Flow -- Flutter

> **"The screen is not a canvas. It is a window into a continuous space."**
> -- Michel EKANI

Flutter/Dart port of the [Spatial Flow Framework](../spatial-flow/README.md). Physics-based, accessible, speed-controllable animations for Flutter apps.

---

## Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  spatial_flow:
    path: ../spatial-flow-flutter  # Or from pub.dev when published
```

---

## Architecture

```
lib/
  spatial_flow.dart        # Main barrel export

  src/
    core/                  # Physics engine
      soul_constants.dart  # The 5 Soul types
      spatial_speed.dart   # Global speed control
      scale_transition.dart
      reduced_motion.dart  # MediaQuery + AccessibilityFeatures
      create_protocol.dart # Protocol factory
      types.dart

    widgets/               # Ready-to-use widgets
      cascade_list.dart
      chrysalis_container.dart
      drop_water.dart
      kinetic_item.dart
      portal_expansion.dart
      reflex_matrix.dart
      samsara_shift.dart
      sequential_grid.dart
      spatial_item.dart
      spatial_transition_builder.dart
      transmigrated_item.dart
```

---

## Core Concepts

### Soul Constants (Shared Physics)

Identical physics across all platforms:

| Soul | Stiffness | Damping | Mass | Feel |
|:-----|:----------|:--------|:-----|:-----|
| **Standard** | 105 | 18 | 1.0 | Confident, balanced |
| **Reflex** | 350 | 25 | 0.7 | Snap, click, toggle |
| **Dream** | 40 | 20 | 2.0 | Viscous, dreamy |
| **Expansion** | 180 | 28 | 1.0 | Powerful, controlled |

### WCAG AAA Accessibility (3-Tier)

1. **Tier 1**: Respects `MediaQuery.of(context).disableAnimations`.
2. **Tier 2**: `ReducedMotionNotifier` widget for subtree control.
3. **Tier 3**: `SpatialFlowConfig.reducedMotion` for global override.

### Physics Parity

Cross-platform consistency verified via `test/physics_parity_test.dart`. Spring solver outputs match Web and React Native within acceptable tolerance.

---

## Quick Start

```dart
import 'package:spatial_flow/spatial_flow.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CascadeList(
      stagger: const Duration(milliseconds: 50),
      children: items.asMap().entries.map((entry) =>
        KineticItem(
          index: entry.key,
          child: Card(child: Text(entry.value.name)),
        ),
      ).toList(),
    );
  }
}
```

---

## Relationship to Web Framework

This package shares the **same Soul Constants and physics engine** as `@spatial-flow/core` (Web). Flutter adaptations:

- Uses Flutter's built-in `SpringSimulation` instead of Motion.
- Widgets follow Flutter conventions (`StatefulWidget`, `AnimationController`).
- Respects `MediaQuery.disableAnimations` for accessibility.

---

## Author

**Michel EKANI** -- Creator of Spatial Flow.

## License

[MIT](./LICENSE)
