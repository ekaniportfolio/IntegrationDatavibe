# Changelog

All notable changes to the Spatial Flow Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2026-03-03

### Added
- **`createProtocol()` API** -- Agnostic protocol factory for creating custom animation protocols without writing hooks from scratch.
- **`useSpatialTransition()` hook** -- Generic transition hook powered by `createProtocol()`.
- **New components**: `SequentialGrid`, `DropWaterContainer`, `PortalExpansionContainer`, `SamsaraShiftContainer`, `TransmigratedItem`.
- **CONTRIBUTING.md** -- Community contribution guide.
- **CHANGELOG.md** -- Version history.
- **LICENSE** -- MIT license file.

### Changed
- Updated `components/index.ts` to export all 8 components (3 original + 5 new).

## [3.0.0] - 2026-02-15

### Added
- **10 Protocols**: SSC, LG, SQG, TAF, RM, CS, SS, DWP, PEF, LPS -- complete animation vocabulary.
- **11 Hooks**: `useSpatialSpeed`, `useReducedMotion`, `useFollowFlow`, `useGhostDom`, `useSequentialGrid`, `useDropWater`, `usePortalExpansion`, `useSamsaraShift`, `useTransmigration`, `useLayoutProjectionShield`, `useSpatialTransition`.
- **3-Tier WCAG AAA accessibility**: CSS safety net + React hook + Core utilities.
- **Anti-Double-Scaling**: `_RAW` constants and `scaledSpring()` utility prevent nested animation scale accumulation.
- **`reduced-motion.css`**: CSS-level kill switch for all transitions and animations when `prefers-reduced-motion: reduce` is active.
- **`viewport-lock.css`**: Required CSS for spatial integrity in overflow-hidden parents.
- **AI Training Suite**: `ai/SYSTEM-PROMPT.md`, `ai/EXPERT-TRAINING.md`, `ai/CODE-REVIEW-CHECKLIST.md`.
- **10 runnable examples** covering every protocol.
- **Full documentation**: Philosophy, Getting Started, Soul Constants reference, Protocol catalog, Decision Tree, Glossary, Prohibitions.
- **tsup build config**: ESM + CJS dual output with tree-shaking and sourcemaps.
- **GitHub Actions**: `physics-parity.yml` for cross-platform physics consistency tests.

### Changed
- Migrated from `framer-motion` imports to `motion/react` (Motion v12+).
- `SOUL_PHYSICS` map now includes all 5 Soul types (previously 3).

## [2.0.0] - 2026-01-10

### Added
- **Soul Constants system**: 5 Soul types (Standard, Reflex, Dream, Chrysalis, Expansion).
- **Spatial Speed module**: Global speed control with 4 presets (`zen`, `normal`, `rapide`, `ultra`).
- **Scale Transition utilities**: `scaleTransition()` and `scaledSpring()` for speed-aware transitions.
- **Directional Momentum**: Asymmetric timing for Chrysalis Shift compression/unfolding.
- **Drop Water Protocol timing constants**.
- **Samsara Shift physics**: Separate Vessel (heavy) and Indicator (light) springs.

### Changed
- All spring values recalibrated based on user testing sessions.
- `SF_EASE` standardized as `[0.4, 0, 0.2, 1]` across the framework.

## [1.0.0] - 2025-11-20

### Added
- Initial release of Spatial Flow Framework.
- **Core physics engine**: `STANDARD_SOUL`, `REFLEX_SOUL`, `DREAM_SOUL` spring constants.
- **3 Components**: `CascadeList`, `KineticItem`, `ChrysalisContainer`.
- **`useReducedMotion` hook**: WCAG-compliant reduced motion detection.
- **`useSpatialSpeed` hook**: Reactive global speed control.
- **`useFollowFlow` hook**: Direction-aware navigation variants.
- **`useGhostDom` hook**: Invisible DOM measurement before animation.
- **SSC Timing system**: 4-phase cascade (structure, navigation, body, action).
- **README.md** with full architecture documentation.
- **INSTALL.md** with step-by-step setup guide.
