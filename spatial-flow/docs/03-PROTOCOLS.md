# Complete Protocol Catalog
## The 10 Protocols of Spatial Flow

---

## 1. SSC -- Sequential Spatial Cascade
**"Nothing appears instantly in nature."**

Content arrives in timed waves to guide the eye through the information hierarchy.

**Timing Map**:
| Phase | Delay | Content |
|:------|:------|:--------|
| I. Structure | T+0.0s | Backgrounds, grid, panel borders |
| II. Navigation | T+0.4s | Tabs, breadcrumbs, headers |
| III. Body | T+0.8s | Main data (cascade starts) |
| IV. Action | T+1.3s | FABs, footers |

**Stagger**: `delay: Math.min(index, 10) * 0.05` (cap at 10 to prevent "neverending cascade")

**When to use**: Every initial page load, every major view change.
**When NOT to use**: Within an already-loaded view.

---

## 2. LG -- Lateral Glide
**"Reality is not downloaded; it is woven."**

List items weave in from alternating sides with motion blur.

**Logic**:
- Even indices (0, 2, 4): slide from LEFT (`x: -20`)
- Odd indices (1, 3, 5): slide from RIGHT (`x: +20`)
- All items: `filter: blur(4px)` -> `blur(0px)` during flight

**Physics**: `stiffness: 140, damping: 18, mass: 1`

**When to use**: Lists, grids, cards that arrive sequentially.
**When NOT to use**: Text paragraphs (ruins readability), single items.

---

## 3. SQG -- Sequential Grid
**"Chaos is analog. Order is digital."**

Strict orthogonal, turn-based reordering. Elements move like chess pieces.

**Rules**:
- Move X **OR** Y. Never diagonal. Never simultaneous.
- Turn-based: Item A moves, then Item B fills the void (Sokoban timing).
- Scale and opacity changes allowed during movement. Rotation forbidden.

**When to use**: Drag-and-drop reordering, grid layouts, Kanban boards.
**When NOT to use**: Free-form layouts, decorative animations.

---

## 4. TAF -- Transmigrated Astral Flow
**"The element does not die. It transmigrates."**

Elements physically travel between DOM positions via `layoutId`.

**Implementation**: `<motion.div layoutId="my-soul" />`
As long as the string matches, Motion treats them as the same entity.

**Critical Rules**:
- **RAU (Single Soul Rule)**: Two elements with the same `layoutId` must NEVER be mounted simultaneously. This causes "Quantum Flicker".
- **Namespace Strategy**: Use `layoutId="avatar-mobile"` vs `layoutId="avatar-desktop"` for responsive layouts.
- **Layout Projection Shield**: If a parent acquires `filter`/`transform`, temporarily remove `layoutId` to prevent interference.

**When to use**: Cards expanding to pages, thumbnails to lightboxes, FABs to sidebars.
**When NOT to use**: Simple show/hide (use opacity instead).

---

## 5. RM -- Reflex Matrix
**"The Organic Cell"**

A container that undergoes mitosis (biological division) to reveal options.

**Key Patterns**:
- **Inverse Trapdoor**: Add `pb-[100vh]` immediately on expansion to enable scrolling.
- **Soft Lock**: Smooth-scroll to "Headroom" position (10rem from top).
- **Ghost DOM**: Measure target height via invisible copy before animating.

**Physics**: `stiffness: 350, damping: 25, mass: 0.7` (Reflex Soul)

**When to use**: Compact cards expanding to reveal details, action menus.
**When NOT to use**: Content that exists at the same hierarchy level (use TAF).

---

## 6. CS -- Chrysalis Shift
**"The container does not change pages. It sheds its skin."**

A container persists while its inner content completely transforms through three overlapping phases.

**Three-Phase Weave**:
1. **Dissolution** (Phase 1): Old content exits element by element (`opacity: 1->0, y: 0->-8px`)
2. **Breathing** (Phase 2): Container height animates. Starts at **55%** of Phase 1 completion.
3. **Emergence** (Phase 3): New content enters element by element. Starts at **65%** of Phase 2 completion.

**Directional Momentum**:
| Direction | Type | Delay | Duration | Stagger |
|:----------|:-----|:------|:---------|:--------|
| Large -> Small | Compression | -50% | -31% | -33% |
| Small -> Large | Unfolding | -70% | -37% | -47% |

**Cartography Mutation**: Mutate shared timing constants -> React renders with new values -> Restore originals after 100ms.

**Cardinal Rule**: The container NEVER unmounts (Vessel Persistence).

**When to use**: Form step transitions, settings panels, auth flows, any content swap in a persistent container.
**When NOT to use**: Content moving between different containers (use TAF), expanding detail views (use RM).

---

## 7. SS -- Samsara Shift
**"The body moves, the soul follows."**

Navigation elements physically transmigrate across large vertical distances.

**Two-Phase Physics**:
1. **Vessel** (container): Heavy spring (`stiffness: 120, damping: 20`) moves first.
2. **Soul** (indicators): Light spring (`stiffness: 200`) arrives with stagger after vessel settles.

**When to use**: Navigation dots/indicators that must travel from top to bottom of viewport.
**When NOT to use**: Standard fixed-position navigation.

---

## 8. DWP -- Drop Water Protocol
**"The avatar does not open a modal. It BECOMES the portal."**

Complete animation sequence transforming an avatar click into an authentication experience.

**Five-Act Sequence**:
1. **Trigger** (T=0ms): Avatar begins gravitational drop, circle begins lateral glide.
2. **Blur Curtain** (T=350ms): Background receives blur filter.
3. **Mitosis** (T=350-750ms): Auth card performs keyframe expansion (seed -> pill -> card).
4. **Content Emergence** (T=500-1200ms): Form elements stagger-enter.
5. **Backdrop** (T=0-350ms): Dark scrim fades in.

**Reverse**: All five acts in reverse order, simultaneously batched via React 18 state batching.

---

## 9. PEF -- Portal Expansion Flow
**"Inline content expands to fullscreen from its exact position."**

**Architecture**:
1. **Rect Capture**: `getBoundingClientRect()` captures source element position.
2. **Portal**: `createPortal(content, document.body)` escapes overflow/transform ancestors.
3. **Animation**: Spring from `sourceRect` to `{ top: 0, left: 0, width: vw, height: vh }`.
4. **Reverse**: Same spring animates back to captured `sourceRect`.

**GLS Extension** (Mobile): Simultaneously grows AND rotates 90 degrees to landscape.

**Critical**: Do NOT use `layout` prop on children inside the portal.

---

## 10. LPS -- Layout Projection Shield
**"When the chrysalis blurs, the soul must shed its tether."**

Protection against CSS containing block interference with `layoutId` animations.

**The Problem**: When a parent acquires `filter: blur()`, it creates a new CSS containing block. This shifts `getBoundingClientRect()` for all `position: fixed` descendants, causing Motion's layout projection to apply unwanted corrective transforms that "freeze" ongoing animations.

**The Solution**:
```tsx
layoutId={isAnimating ? undefined : "my-element"}
```

**Bidirectional**: Shield must be active for BOTH filter acquisition AND filter removal.

**Diagnostic Checklist**:
1. Does the element have `layoutId`? If no, LPS doesn't apply.
2. Is a parent changing `filter`/`transform`/`backdrop-filter`?
3. Does the timing overlap with the element's animation?
4. If all YES: Apply the Layout Projection Shield.
