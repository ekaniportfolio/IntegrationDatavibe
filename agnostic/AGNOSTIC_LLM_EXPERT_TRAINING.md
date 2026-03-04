# LLM EXPERT TRAINING: SPATIAL FLOW ARCHITECT
## Complete Knowledge Base for AI Assistants

---

> This document is designed to be fed to any LLM (Claude, GPT, Gemini, etc.) to transform it into an expert Spatial Flow UI engineer. It contains the complete taxonomy, physics, protocols, and decision logic.

---

## MODULE 1: FOUNDATIONAL KNOWLEDGE

### 1.1 What is Spatial Flow?

Spatial Flow is a UI architecture philosophy that treats digital interfaces as **continuous physical spaces** rather than stacks of static pages. Every element obeys laws of physics (springs, mass, damping). Every transition shows the user WHAT happened (spatial continuity) rather than just the result (instant replacement).

**One-line summary**: "Elements never appear or disappear. They travel, morph, divide, or grow."

### 1.2 The Three Laws of Digital Physics

1. **Conservation of Digital Mass**: An element never vanishes. It moves, shrinks, morphs, or hides behind something.
2. **Continuity of Identity**: If a "Search Bar" exists in View A and View B, it is the SAME object. It must physically travel between positions (via `layoutId`).
3. **Orthogonal Order**: Movement follows strict grid lines. Diagonal movement is forbidden (Sequential Grid). Chaos is never acceptable.

### 1.3 Core Vocabulary (Quick Reference)

| Term | Abbreviation | Definition |
|------|-------------|------------|
| Transmigrated Astral Flow | TAF | Element physically travels between DOM positions via `layoutId` |
| Single Soul Rule | RAU/SSR | One state shared between Mobile and Desktop renderings |
| Lateral Transmigration | TL | Horizontal movement for sibling navigation |
| Astral Descent Return | DAR | Downward movement exclusively for returning to parent/home |
| Sequential Spatial Cascade | SSC | Chronological wave-like reveal of content sections |
| Lateral Glide | LG | Alternating left/right entry for list items with motion blur |
| Chrysalis Shift | CS | Content metamorphosis inside a persistent container |
| Reflex Matrix | RM | Organic expansion (mitosis) of a compact card into segments |
| Portal Expansion Flow | PEF | Fullscreen transition from captured source rect via createPortal |
| Gyroscopic Landscape Shift | GLS | Mobile rotation to landscape during PEF expansion |
| Samsara Shift | SS | Navigation element transmigration across vertical distances |
| Layout Projection Shield | LPS | Protection against CSS containing block interference with layoutId |
| Visiomorphism | VM | Visual metamorphosis where form follows function mutation |
| Ghost DOM | GD | Invisible rendering for dimension measurement before animation |
| Parallel Worlds | PW | Mobile and Desktop as separate topologies with shared state |
| Phase Weaving | PW | Overlapping animation phases at precise percentage thresholds |
| Directional Momentum | DM | Asymmetric timing based on height direction (compression vs unfolding) |
| Vessel Persistence | VP | Container never unmounts during transitions |
| Follow Flow | FF | Content enters from the direction of user's attention |
| Spatial Tension | ST | Weight and friction in animations via spring physics |

---

## MODULE 2: THE COMPLETE PROTOCOL CATALOG

### Protocol 1: Sequential Spatial Cascade [SSC]

**Purpose**: Guide the user's eye through content hierarchy via timed waves.

**Timing Map**:
```
T+0.0s  Architecture (backgrounds, structural elements)
T+0.4s  Navigation elements (tabs, breadcrumbs)
T+0.7s  Main container stabilizes
T+0.8s  Content body begins (with staggerChildren: 0.05)
T+1.3s  Actions (floating buttons, CTAs)
```

**When to use**: Every initial page load, every major view change.
**When NOT to use**: Within an already-loaded view (use Chrysalis Shift instead).

---

### Protocol 2: Lateral Glide [LG]

**Purpose**: Make lists feel "woven" into reality.

**Logic**:
```
Even indices (0, 2, 4): slide from LEFT  (x: -20 -> 0)
Odd indices  (1, 3, 5): slide from RIGHT (x: +20 -> 0)
All: blur(10px) -> blur(0px) during flight
Physics: stiffness: 140, damping: 18
```

**When to use**: List rendering, card grids, feed items.
**When NOT to use**: Single items, hero sections (use SSC instead).

---

### Protocol 3: Sequential Grid [SG]

**Purpose**: Reorder grid elements with mechanical precision.

**Rules**:
1. Orthogonal ONLY (move X, THEN Y, never diagonal)
2. Turn-based (Item A completes, then Item B starts)
3. No rotation during translation (separate step)

**When to use**: Data grids, filter/sort operations, admin panels.
**When NOT to use**: Organic content (use Lateral Glide instead).

---

### Protocol 4: Chrysalis Shift [CS]

**Purpose**: Transform content inside a persistent container.

**The Three-Phase Weave**:
```
Phase 1 (Dissolution):  Content exits (opacity 1->0, y: 0 -> -8px, stagger)
Phase 2 (Breathing):    Container height animates (at 55% of Phase 1)
Phase 3 (Emergence):    New content enters (at 65% of Phase 2)
```

**Directional Momentum**:
- Compression (large -> small): delay -50%, duration -31%, stagger -33%
- Unfolding (small -> large): delay -70%, duration -37%, stagger -47%

**When to use**: Form transitions, multi-step flows, in-place content changes.
**When NOT to use**: Page-level navigation (use TL/DAR instead).

---

### Protocol 5: Reflex Matrix [RM]

**Purpose**: Expand a compact card into a detailed view in-place.

**The Four Phases**:
```
Phase A (Buffer):     Add padding-bottom: 100vh to allow scrolling
Phase B (Soft Lock):  Smooth scroll card to "Headroom" position
Phase C (Ghost DOM):  Measure expanded content invisibly
Phase D (Mitosis):    Animate visible container to measured height, reveal segments
```

**When to use**: Dashboard widgets, expandable cards, detail views within lists.
**When NOT to use**: Simple accordions with small content (overhead too high).

---

### Protocol 6: Portal Expansion Flow [PEF]

**Purpose**: Transition inline content to fullscreen with spatial continuity.

**The Mechanics**:
```
1. Capture: getBoundingClientRect() on source element
2. Portal:  createPortal() to document.body
3. Animate: Spring from source rect to viewport dimensions
4. Reverse: Spring back to source rect on minimize
```

**Mobile Extension (GLS)**:
```
Simultaneously rotate 90deg for landscape orientation
Math: container(width=vh, height=vw) at top=(vh-vw)/2, left=(vw-vh)/2
```

**When to use**: Video players, image galleries, map widgets, document previews.
**When NOT to use**: Simple modals (use standard overlay instead).

---

### Protocol 7: Samsara Shift [SS]

**Purpose**: Transmigrate navigation elements across vertical distances.

**The Cycle**:
```
Genesis (top) -> Journey (middle) -> Revelation (bottom) -> Rebirth (top)
```

**Physics**:
- Vessel (container): stiffness: 120, damping: 20 (heavy, grounded)
- Soul (indicators): stiffness: 200, damping: 15 (light, playful)

**When to use**: Multi-step vertical flows, long wizards, story-like navigation.
**When NOT to use**: Horizontal navigation, tab bars.

---

### Protocol 8: Layout Projection Shield [LPS]

**Purpose**: Protect animations from CSS containing block interference.

**The Pattern**:
```tsx
layoutId={(isAnimating || isClosing) ? undefined : "my-element"}
```

**When to apply**: Any element with `layoutId` whose parent changes `filter`, `transform`, `backdrop-filter`, or `perspective` during animation.

---

### Protocol 9: Astral Descent Return [DAR]

**Purpose**: Return to parent/home state with directional meaning.

**Motion**: Strict vertical downward (`y: 0 -> 1000`).
**Meaning**: "I am dropping this context to return to the foundation."

**When to use**: Close/back actions that return to a parent view.
**When NOT to use**: Forward navigation (use TL instead).

---

### Protocol 10: Follow Flow [FF]

**Purpose**: Content moves in the direction of user's attention.

**Logic**:
```
Navigating "Next" (right):
  Old content exits LEFT  (x: 0 -> -100%)
  New content enters from RIGHT (x: 100% -> 0)

Navigating "Back" (left):
  Old content exits RIGHT (x: 0 -> 100%)
  New content enters from LEFT (x: -100% -> 0)
```

**When to use**: All lateral navigation, carousel-like flows.
**When NOT to use**: Vertical navigation (use SSC or DAR).

---

## MODULE 3: PHYSICS CONSTANTS REFERENCE

```typescript
// Standard motion (general morphing, page transitions)
const SOUL_PHYSICS = { type: "spring", stiffness: 105, damping: 18, mass: 1 };

// High-energy interaction (clicks, button responses, mitosis)
const REFLEX_PHYSICS = { type: "spring", stiffness: 350, damping: 25, mass: 0.7 };

// Ambient background (parallax, floating elements, breathing)
const DREAM_PHYSICS = { type: "spring", stiffness: 40, damping: 20, mass: 2 };

// Fullscreen expansion (Portal Expansion Flow, GLS)
const EXPANSION_PHYSICS = { type: "spring", stiffness: 180, damping: 28, mass: 1 };

// UI controls (toolbars, control layers, hover effects)
const CONTROL_PHYSICS = { type: "spring", stiffness: 200, damping: 25 };

// Chrysalis Shift height change
const CHRYSALIS_EASE = [0.4, 0, 0.2, 1];
```

---

## MODULE 4: DECISION TREES

### "What protocol should I use?"

```
Is the content changing WITHIN a container?
  YES -> Does the container persist?
    YES -> CHRYSALIS SHIFT [CS]
    NO  -> Re-evaluate (container should persist)
  NO

Is content expanding from compact to detailed?
  YES -> Is it staying in-place?
    YES -> REFLEX MATRIX [RM]
    NO  -> Is it going fullscreen?
      YES -> PORTAL EXPANSION FLOW [PEF]
      NO  -> Standard modal/overlay
  NO

Is the user navigating between views?
  YES -> Is it lateral (same level)?
    YES -> FOLLOW FLOW [FF] + TL
    NO  -> Is it going back/up?
      YES -> DAR (Astral Descent Return)
      NO  -> SSC (downward into detail)
  NO

Is content loading for the first time?
  YES -> SSC (Sequential Spatial Cascade)
         + LATERAL GLIDE for lists within SSC
  NO

Is content being reordered/sorted?
  YES -> SEQUENTIAL GRID [SG]
  NO

Is navigation transmigrating vertically?
  YES -> SAMSARA SHIFT [SS]
  NO
```

### "What physics should I use?"

```
Is this a user-initiated action (click, tap)?
  YES -> REFLEX_PHYSICS (snappy, responsive)
  NO

Is this a page/view transition?
  YES -> SOUL_PHYSICS (fluid, organic)
  NO

Is this a fullscreen expansion?
  YES -> EXPANSION_PHYSICS (confident, smooth)
  NO

Is this a background/ambient effect?
  YES -> DREAM_PHYSICS (heavy, dreamlike)
  NO

Is this a toolbar/control appearing?
  YES -> CONTROL_PHYSICS (functional, reliable)
  NO

Default -> SOUL_PHYSICS
```

---

## MODULE 5: COMMON MISTAKES & FIXES

### Mistake 1: Using `opacity: 0 -> 1` alone
**Fix**: Always pair with spatial direction. `{ opacity: 0, y: 20 } -> { opacity: 1, y: 0 }`.

### Mistake 2: Using `linear` easing
**Fix**: Always use springs or the Chrysalis curve `[0.4, 0, 0.2, 1]`.

### Mistake 3: Simultaneous entry of all list items
**Fix**: Use `staggerChildren: 0.05` or manual delay: `index * 0.05`.

### Mistake 4: Diagonal grid movement
**Fix**: Move X axis first, THEN Y axis. Never both simultaneously.

### Mistake 5: Unmounting container during Chrysalis Shift
**Fix**: Container uses `maxHeight` + `overflow: hidden`. NEVER unmounts.

### Mistake 6: `layout` prop on children inside Portal Expansion Flow
**Fix**: Remove `layout` prop from children. CSS width/height is sufficient.

### Mistake 7: Same spring for vessel and soul in Samsara Shift
**Fix**: Vessel = heavier spring (stiffness: 120), Soul = lighter spring (stiffness: 200).

### Mistake 8: Symmetric timings in Chrysalis Shift
**Fix**: Apply Directional Momentum. Compression != Unfolding.

### Mistake 9: Not protecting layoutId during filter changes
**Fix**: Apply Layout Projection Shield: `layoutId={isAnimating ? undefined : "id"}`.

### Mistake 10: Using `display: none` for exiting content
**Fix**: Use `position: absolute` + opacity animation. Element must be in the DOM during exit.

---

## MODULE 6: IMPLEMENTATION CHECKLIST

When implementing any Spatial Flow feature, verify:

- [ ] Physics constants are from the official set (SOUL/REFLEX/DREAM/EXPANSION/CONTROL)
- [ ] No `linear` easing anywhere
- [ ] No bare `opacity: 0 -> 1` without spatial direction
- [ ] All exiting elements use `position: absolute` during exit
- [ ] Container has `overflow: hidden` if content changes height
- [ ] `layoutId` is conditional if parent has filter/transform animations
- [ ] Lists use stagger (0.03-0.15s depending on density)
- [ ] Follow Flow direction matches user's attention direction
- [ ] Mobile and Desktop are Parallel Worlds (no forced unification)
- [ ] `prefers-reduced-motion` is respected (fallback to instant)
- [ ] No `layout` prop inside Portal Expansion Flow content
- [ ] Spring damping is appropriate (no infinite bouncing)

---
---
---

# FORMATION LLM EXPERT : ARCHITECTE SPATIAL FLOW
## Base de Connaissances Complete pour Assistants IA

---

> Ce document est concu pour etre injecte dans n'importe quel LLM afin de le transformer en ingenieur UI expert en Spatial Flow.

---

## RESUME RAPIDE DES PROTOCOLES

| # | Protocole | Acronyme | Cas d'usage principal |
|---|-----------|----------|----------------------|
| 1 | Sequential Spatial Cascade | SSC | Chargement initial de page |
| 2 | Lateral Glide | LG | Rendu de listes |
| 3 | Sequential Grid | SG | Reordonnement de grille |
| 4 | Chrysalis Shift | CS | Metamorphose de contenu in-place |
| 5 | Reflex Matrix | RM | Expansion de carte compacte |
| 6 | Portal Expansion Flow | PEF | Transition plein ecran |
| 7 | Gyroscopic Landscape Shift | GLS | Rotation paysage mobile (extension PEF) |
| 8 | Samsara Shift | SS | Transmigration de navigation |
| 9 | Layout Projection Shield | LPS | Protection contre le containing block |
| 10 | Astral Descent Return | DAR | Retour vers parent/accueil |
| 11 | Follow Flow | FF | Navigation laterale directionnelle |
| 12 | Visiomorphism | VM | Metamorphose visuelle |

## ARBRE DE DECISION RAPIDE

```
Contenu change dans un conteneur ? -> Chrysalis Shift
Contenu s'etend de compact a detaille ? -> Reflex Matrix ou Portal Expansion Flow
Navigation laterale ? -> Follow Flow + TL
Retour en arriere ? -> DAR
Premier chargement ? -> SSC + Lateral Glide
Reordonnement ? -> Sequential Grid
Navigation verticale longue ? -> Samsara Shift
```

## CONSTANTES PHYSIQUES

```
SOUL:      stiffness: 105, damping: 18, mass: 1    (general)
REFLEX:    stiffness: 350, damping: 25, mass: 0.7   (interactions)
DREAM:     stiffness: 40,  damping: 20, mass: 2     (ambiant)
EXPANSION: stiffness: 180, damping: 28, mass: 1     (fullscreen)
CONTROL:   stiffness: 200, damping: 25              (barres d'outils)
```
