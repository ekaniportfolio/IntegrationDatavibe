# Contributing to Spatial Flow

Thank you for your interest in contributing to Spatial Flow! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

By participating in this project, you agree to maintain a welcoming, inclusive, and harassment-free environment. Be respectful, constructive, and patient with fellow contributors.

---

## Getting Started

1. **Read the documentation** in `/docs/` -- especially `00-PHILOSOPHY.md` and `06-PROHIBITIONS.md`.
2. **Understand Soul Constants** -- Every animation must reference a Soul constant. No arbitrary values.
3. **Check the AI training** -- `ai/EXPERT-TRAINING.md` contains the deep knowledge base.

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/spatial-flow/spatial-flow.git
cd spatial-flow

# Install dependencies
npm install

# Build
npm run build

# Watch mode (for development)
npm run dev

# Type check
npm run typecheck
```

### Prerequisites

- Node.js >= 18.0.0
- React >= 18.0.0
- Motion >= 12.0.0 (peer dependency)

---

## Architecture Overview

```
src/
  core/          # Physics engine (Soul Constants, speed, transitions, reduced motion)
  hooks/         # React hooks (one per protocol + utility hooks)
  components/    # Ready-to-use React components (one per protocol)
```

### The Three Laws (Non-Negotiable)

1. **Conservation of Digital Mass** -- Elements never vanish. They travel, morph, or hide.
2. **Continuity of Identity** -- Same data = same `layoutId`. The element physically travels.
3. **Orthogonal Order** -- X or Y movement only. Never diagonal. Never chaotic.

### Absolute Prohibitions

- No `transition={{ duration: 0.3 }}` without a Soul constant reference.
- No diagonal movement in Sequential Grid.
- No `AnimatePresence` without `initial={false}`.
- No `repeat: Infinity` springs without WCAG kill switch.
- No inline spring values -- always use exported constants.

---

## Contribution Guidelines

### What We Accept

- **Bug fixes** with tests or clear reproduction steps.
- **New hooks** that implement a documented protocol pattern.
- **New components** that wrap existing hooks for common use cases.
- **Documentation improvements** (typos, clarity, examples).
- **Accessibility improvements** that maintain or improve WCAG AAA compliance.
- **Performance optimizations** that don't change animation behavior.

### What We Don't Accept

- Arbitrary animation values not derived from Soul Constants.
- Changes that break the 3-Tier reduced motion system.
- CSS-only animations that bypass the Spatial Speed module.
- Components that don't handle `prefers-reduced-motion`.
- Diagonal movement in any grid-based protocol.

### Code Style

- TypeScript strict mode.
- JSDoc comments on all exported functions and types.
- `data-sf-*` attributes on all component root elements (for debugging/testing).
- Use `getReducedMotion()` or `useReducedMotion()` in every animation component.
- Import Motion from `motion/react`, not `framer-motion`.

---

## Pull Request Process

1. **Fork** the repository and create a feature branch from `main`.
2. **Write your code** following the guidelines above.
3. **Add/update tests** if applicable.
4. **Run type checking**: `npm run typecheck`.
5. **Build successfully**: `npm run build`.
6. **Write a clear PR description** explaining:
   - What protocol or pattern this relates to.
   - How reduced motion is handled.
   - Any new Soul Constants or timing values (with rationale).
7. **Request review** from a maintainer.

### Commit Messages

Use conventional commits:

```
feat(hooks): add useReflexMatrix hook for RM protocol
fix(chrysalis): correct height timing in compression direction
docs(philosophy): clarify Conservation of Digital Mass
perf(cascade): reduce re-renders in CascadeList
```

---

## Reporting Bugs

Please include:

1. **Framework version** (check `package.json`).
2. **Motion version** (peer dependency).
3. **React version**.
4. **Browser and OS**.
5. **Reduced motion setting** (on or off).
6. **Minimal reproduction** (CodeSandbox or code snippet).
7. **Expected vs actual behavior**.

---

## Requesting Features

Before requesting a feature:

1. Check if it fits within the [10 Protocols](../docs/03-PROTOCOLS.md).
2. Check if it aligns with the [Philosophy](../docs/00-PHILOSOPHY.md).
3. Consider if it can be built with `createProtocol()` instead of a new hook.

If it's a new protocol pattern, provide:

- **Name and code** (e.g., "Tidal Sweep [TS]").
- **One-liner** description.
- **Physical metaphor** (what real-world motion does it mimic?).
- **WCAG reduced motion strategy** (what happens when motion is reduced?).
- **Use cases** (minimum 2 real-world scenarios).

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

*"The screen is not a canvas. It is a window into a continuous space."*
