# Spatial Flow Glossary
## Complete Terminology Reference

---

## Protocols

| Abbreviation | Full Name | French Name | Definition |
|:-------------|:----------|:------------|:-----------|
| **SSC** | Sequential Spatial Cascade | Cascade Spatiale Sequentielle | Timed wave-like reveal of content sections |
| **LG** | Lateral Glide | Glissement Lateral | Alternating left/right entry for list items with motion blur |
| **SQG** | Sequential Grid | Grille Sequentielle | Orthogonal, turn-based reordering |
| **TAF** | Transmigrated Astral Flow | Flux Astral Transmigre | Element physically travels between DOM positions via `layoutId` |
| **RM** | Reflex Matrix | Matrice Reflexe | Organic expansion (mitosis) of a compact container |
| **CS** | Chrysalis Shift | Mue du Chrysalide | Content metamorphosis inside a persistent container |
| **SS** | Samsara Shift | Decalage Samsara | Navigation element transmigration across vertical distances |
| **DWP** | Drop Water Protocol | Protocole Drop Water | Avatar-to-authentication gravitational sequence |
| **PEF** | Portal Expansion Flow | Flux d'Expansion Portal | Fullscreen transition from captured source rect |
| **GLS** | Gyroscopic Landscape Shift | Bascule Gyroscopique Paysage | Mobile rotation to landscape during PEF |
| **LPS** | Layout Projection Shield | Bouclier de Projection Layout | Protection against CSS containing block interference |

## Laws & Principles

| Term | Definition |
|:-----|:-----------|
| **Conservation of Digital Mass** | An element never vanishes. It moves, shrinks, morphs, or hides. |
| **Continuity of Identity** | Same element in two views = same object. It must travel. |
| **Orthogonal Order** | Movement follows grid lines. No diagonals. No chaos. |
| **RAU / Single Soul Rule (SSR)** | A `layoutId` must only exist once in the DOM at any time. |
| **Follow Flow** | Content moves in the direction of user's attention (not opposite). |
| **Vessel Persistence** | Container never unmounts during transitions (Chrysalis Shift). |

## Techniques

| Term | Definition |
|:-----|:-----------|
| **Visiomorphism** | Visual metamorphosis where form follows function mutation. The object doesn't disappear; it *becomes*. |
| **Phase Weaving** | Overlapping exit/height/entry animations at 55%/65% thresholds. |
| **Directional Momentum** | Asymmetric timing profiles based on container size direction. |
| **Cartography Mutation** | Runtime mutation of shared animation constants (Mutate -> Render -> Restore). |
| **Ghost DOM** | Invisible rendering for height measurement before animation. |
| **Parallel Worlds** | Mobile and Desktop as separate topologies with shared state. |
| **Anchor Protocol** | Changing exiting element from `relative` to `fixed` to preserve layout. |
| **Pendulum Return** | Reverse animation uses the exact temporal inverse of forward animation. |
| **Store Shutter Effect** | Menu panels rolling down like a physical boutique shutter. |
| **Triple Lock Reset** | Three redundant mechanisms to ensure state flags always reset. |
| **Layout Thrashing** | DOM reads inside loops/useEffect (prohibited -- use useLayoutEffect). |
| **Quantum Flicker** | Two elements with same `layoutId` mounted simultaneously. |
| **Data Flashbang** | 50+ elements appearing at t=0 causing cognitive overload. |
| **Neverending Cascade** | Uncapped stagger index causing 100th element to wait 10+ seconds. |
| **Glass Cage** | Locked viewport preventing global scrollbars (`overflow: hidden`). |
| **Ghost Scrollbar** | Scrollbar width causing `100vw` to overflow (use `100%` instead). |

## Physics

| Term | Definition |
|:-----|:-----------|
| **Soul Physics** | Calibrated spring constants that define the kinetic personality of elements. |
| **Standard Soul** | `stiffness: 105, damping: 18, mass: 1` -- Confident, balanced. |
| **Reflex Soul** | `stiffness: 350, damping: 25, mass: 0.7` -- Snap, click, toggle. |
| **Dream Soul** | `stiffness: 40, damping: 20, mass: 2` -- Viscous, dreamy. |
| **Chrysalis Soul** | Tween-based (`ease: [0.4, 0, 0.2, 1]`) -- Organic breathing. |
| **Expansion Soul** | `stiffness: 180, damping: 28, mass: 1` -- Powerful expansion. |
| **SF_EASE** | `[0.4, 0, 0.2, 1]` -- The Spatial Flow standard easing curve. |
| **Spatial Tension** | Weight and friction simulated via spring physics. |
| **Ethereal Phase** | Transient state during movement (usually `opacity: 0.4`). |

## Movements

| Term | Direction | Use |
|:-----|:----------|:----|
| **TL (Lateral Transmigration)** | Horizontal (left/right) | Sibling view navigation |
| **DAR (Astral Descent Return)** | Vertical downward | Exit/return to parent |
| **CSD (Sequential Downward Cascade)** | Top to bottom | Initial element materialization |

## Speed Control

| Preset | Factor | Speed | Description |
|:-------|:-------|:------|:------------|
| `zen` | 2.0 | 0.5x | Slow, contemplative |
| `normal` | 1.0 | 1.0x | Default |
| `rapide` | 0.5 | 2.0x | Snappy, efficient |
| `ultra` | 0.1 | 10.0x | Near-instant, debugging |
