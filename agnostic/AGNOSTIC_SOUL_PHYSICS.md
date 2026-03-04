# SOUL PHYSICS
## Universal Identity & Motion Constants for Spatial Flow

---

> *"Interface is not a picture. It is a place."*
> -- Michel EKANI, Spatial Flow Framework

---

## 1. WHAT IS SOUL PHYSICS?

**Soul Physics** is the foundational layer of Spatial Flow that defines HOW elements move, not WHERE they move. It is the physics engine -- the set of spring constants, easing curves, and identity principles that make digital interfaces feel physical and alive.

Every Spatial Flow protocol (Chrysalis Shift, Reflex Matrix, Portal Expansion Flow, etc.) draws from this shared physics vocabulary. Changing the Soul Physics constants changes the entire personality of the application.

---

## 2. THE IDENTITY PROTOCOLS

### 2.1 TAF (Transmigrated Astral Flow)

**Concept**: In standard DOM, moving an element from `Header` to `Footer` destroys the first instance and creates a second. In TAF, the element *transmigrates* -- it physically morphs, flies, and settles in the new container.

**Implementation**: `layoutId` (Motion) or equivalent shared-identity system.

```tsx
// The element in Header
<motion.div layoutId="search-bar">
    <SearchInput />
</motion.div>

// The SAME element in Footer (different component tree)
<motion.div layoutId="search-bar">
    <SearchInput variant="compact" />
</motion.div>
```

The animation library detects that both elements share the identity `"search-bar"` and automatically animates position, size, and shape between them.

**Real-World Examples**:
- Apple App Store: Card expands into full page
- iOS Settings: Toggle flies from list into header
- Spotify: Album art morphs between mini-player and full player

### 2.2 RAU/SSR (Single Soul Rule)

**Principle**: A component is a single entity across all devices. State is shared between Mobile and Desktop views ("Parallel Worlds"), even if their visual rendering is completely different.

```tsx
// ONE state, TWO renderings
const [isExpanded, setIsExpanded] = useState(false);

// Mobile: vertical stack with swipe gestures
{isMobile && <MobileExperience isExpanded={isExpanded} />}

// Desktop: horizontal grid with hover interactions
{isDesktop && <DesktopExperience isExpanded={isExpanded} />}
```

**Rule**: Never unify the visual code. Mobile and Desktop are separate topologies. But the **soul** (state, data, identity) is always shared.

### 2.3 RIC (Recursive Identity Chain)

**Concept**: When a parent transmigrates (TAF), its children maintain their relative identities. The chain of identity flows recursively.

```tsx
<motion.div layoutId="card-42">
    <motion.div layoutId="card-42-title">Title</motion.div>
    <motion.div layoutId="card-42-image">
        <img src="..." />
    </motion.div>
    <motion.div layoutId="card-42-actions">
        <Button>View</Button>
    </motion.div>
</motion.div>
```

When `card-42` morphs from a grid thumbnail to a detail view, each child (`title`, `image`, `actions`) independently animates to its new position within the new layout.

### 2.4 ANCHOR (Spatial Anchor Points)

**Concept**: Certain elements serve as fixed reference points that do not move during transitions. They are the "ground" of the interface.

**Examples**:
- The navigation bar during page transitions
- The logo during view changes
- The progress indicator during multi-step flows

**Rule**: An ANCHOR element never participates in exit animations. It is always present, always stable.

---

## 3. THE PHYSICS CONSTANTS

### 3.1 SOUL_PHYSICS (Standard Motion)

```typescript
const SOUL_PHYSICS = {
    type: "spring",
    stiffness: 105,
    damping: 18,
    mass: 1,
};
```

**Usage**: General morphing, page transitions, element movement.
**Feel**: Fluid, slightly bouncy, organic. Like a water droplet sliding on glass.

**Behavioral Properties**:
- Settle time: ~600ms
- Overshoot: ~5-8% (barely perceptible)
- Character: Natural, living

### 3.2 REFLEX_PHYSICS (High-Energy Interaction)

```typescript
const REFLEX_PHYSICS = {
    type: "spring",
    stiffness: 350,
    damping: 25,
    mass: 0.7,
};
```

**Usage**: Click responses, button interactions, Reflex Matrix mitosis, quick UI reactions.
**Feel**: Snappy, responsive, energetic. Like tapping a taut drum skin.

**Behavioral Properties**:
- Settle time: ~300ms
- Overshoot: ~3% (crisp)
- Character: Reactive, immediate

### 3.3 DREAM_PHYSICS (Ambient Background)

```typescript
const DREAM_PHYSICS = {
    type: "spring",
    stiffness: 40,
    damping: 20,
    mass: 2,
};
```

**Usage**: Background parallax, ambient floating elements, breathing animations.
**Feel**: Heavy, dreamlike, slow. Like clouds moving across the sky.

**Behavioral Properties**:
- Settle time: ~1200ms
- Overshoot: ~12% (creates gentle sway)
- Character: Atmospheric, cinematic

### 3.4 EXPANSION_PHYSICS (Portal Expansion Flow)

```typescript
const EXPANSION_PHYSICS = {
    type: "spring",
    stiffness: 180,
    damping: 28,
    mass: 1,
};
```

**Usage**: Portal Expansion Flow (fullscreen transitions), Gyroscopic Landscape Shift.
**Feel**: Confident, smooth, no bounce. Like a camera zoom.

**Behavioral Properties**:
- Settle time: ~450ms
- Overshoot: ~1-2% (nearly none)
- Character: Cinematic, professional

### 3.5 CONTROL_PHYSICS (UI Control Animation)

```typescript
const CONTROL_PHYSICS = {
    type: "spring",
    stiffness: 200,
    damping: 25,
};
```

**Usage**: Control layer entry/exit (video player controls, toolbars), hover effects.
**Feel**: Quick but not aggressive. Like a drawer sliding open.

**Behavioral Properties**:
- Settle time: ~350ms
- Overshoot: ~2%
- Character: Functional, reliable

---

## 4. THE EASING VOCABULARY

### 4.1 The Chrysalis Curve

```typescript
const CHRYSALIS_EASE = [0.4, 0, 0.2, 1];
```

**Usage**: All Chrysalis Shift phases (dissolution, breathing, emergence).
**Character**: Starts with moderate acceleration, ends with a long deceleration tail. Feels organic and metamorphic.

### 4.2 The Pendulum Pair

For reversible animations, use inverse easing curves:

| Direction | Ease | Character |
|-----------|------|-----------|
| Forward (opening) | `circOut` | Fast start, slow settle |
| Reverse (closing) | `circIn` | Slow start, fast end |

```typescript
transition={{
    x: {
        duration: 0.6,
        ease: isForward ? "circOut" : "circIn",
    },
}}
```

### 4.3 The Gravity Pair

For vertical movements with physical weight:

| Direction | Ease | Metaphor |
|-----------|------|----------|
| Falling down | `[0.55, 0, 1, 0.45]` | Gravity acceleration |
| Rising up | `[0.45, 1, 0, 0.55]` | Anti-gravity deceleration |

---

## 5. THE MOTION VOCABULARY

### 5.1 Entry Types

| Name | Motion | Usage |
|------|--------|-------|
| **Slide** | `x: [-100, 0]` or `x: [100, 0]` | Lateral Transmigration |
| **Drop** | `y: [-20, 0]` with spring | Sequential Spatial Cascade |
| **Grow** | `scale: [0, 1]` | Mitosis, Reflex Matrix |
| **Weave** | `x: [+/-20, 0]` alternating | Lateral Glide |
| **Emerge** | `y: [8, 0]` + `opacity: [0, 1]` | Chrysalis Shift Phase 3 |
| **Expand** | `width/height: [source, viewport]` | Portal Expansion Flow |

### 5.2 Exit Types

| Name | Motion | Usage |
|------|--------|-------|
| **Dissolve** | `opacity: [1, 0]` + `y: [0, -8]` | Chrysalis Shift Phase 1 |
| **Fall** | `y: [0, 1000]` | Astral Descent Return |
| **Shrink** | `scale: [1, 0]` | Reflex Matrix collapse |
| **Collapse** | `width/height: [viewport, source]` | Portal Expansion reverse |
| **Blur-Out** | `filter: blur(0 -> 10px)` + `opacity: 0` | Soft exit |

### 5.3 Stagger Timing

| Density | Stagger Value | Usage |
|---------|---------------|-------|
| Dense | `0.03s` | Many items (20+), fast cascade |
| Standard | `0.05s` | Typical lists (5-15 items) |
| Dramatic | `0.10s` | Few items (3-5), emphasis |
| Cinematic | `0.15s` | Hero sections, Chrysalis emergence |

---

## 6. ANTI-PATTERNS

### The Opacity Trap
```tsx
// BAD: Lazy entrance
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// GOOD: Spatial entrance with direction
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

Opacity-only animations violate the Conservation of Digital Mass. Elements must enter FROM somewhere.

### The Linear Sin
```tsx
// BAD: Robotic, lifeless
transition={{ duration: 0.3, ease: "linear" }}

// GOOD: Physical, alive
transition={{ type: "spring", stiffness: 105, damping: 18 }}
```

Linear easing has no physical equivalent. Nothing in nature moves at constant velocity.

### The Layout Prop Flood
```tsx
// BAD: Every element has layout
<motion.div layout>
    <motion.p layout>text</motion.p>
    <motion.span layout>more</motion.span>
</motion.div>

// GOOD: Only semantically important elements
<motion.div layoutId="card-42">
    <p>text</p>
    <span>more</span>
</motion.div>
```

The `layout` prop is expensive. Use it only on elements that need to track their position across renders.

---

## 7. CHOOSING THE RIGHT PHYSICS

### Decision Matrix

| Scenario | Physics Constant | Why |
|----------|-----------------|-----|
| Page navigation | SOUL_PHYSICS | Natural, unhurried |
| Button click response | REFLEX_PHYSICS | Immediate feedback |
| Background animation | DREAM_PHYSICS | Atmospheric, non-intrusive |
| Fullscreen expansion | EXPANSION_PHYSICS | Confident, smooth |
| Toolbar show/hide | CONTROL_PHYSICS | Functional, reliable |
| Auth form transition | Chrysalis Curve | Organic metamorphosis |
| Return to home | Gravity pair | Physical weight |

---
---
---

# SOUL PHYSICS
## Constantes Universelles d'Identite & de Mouvement pour le Spatial Flow

---

> *"L'interface n'est pas une image. C'est un lieu."*
> -- Michel EKANI, Framework Spatial Flow

---

## 1. QU'EST-CE QUE LA SOUL PHYSICS ?

La **Soul Physics** est la couche fondatrice du Spatial Flow qui definit COMMENT les elements bougent, pas OU ils bougent. C'est le moteur physique -- l'ensemble des constantes de ressorts, courbes d'easing, et principes d'identite qui rendent les interfaces numeriques physiques et vivantes.

---

## 2. LES CONSTANTES PHYSIQUES

| Nom | Stiffness | Damping | Mass | Usage |
|-----|-----------|---------|------|-------|
| **SOUL_PHYSICS** | 105 | 18 | 1 | Mouvement general, morphing |
| **REFLEX_PHYSICS** | 350 | 25 | 0.7 | Interactions, clics, mitose |
| **DREAM_PHYSICS** | 40 | 20 | 2 | Mouvement ambiant |
| **EXPANSION_PHYSICS** | 180 | 28 | 1 | Portal Expansion Flow |
| **CONTROL_PHYSICS** | 200 | 25 | - | Barres d'outils, controles |

---

## 3. LES PROTOCOLES D'IDENTITE

### TAF (Flux Astral Transmigre)
L'element ne meurt pas ici pour renaitre la-bas. Il **transmigre** physiquement. Implementation via `layoutId`.

### RAU/SSR (Regle de l'Ame Unique)
Un composant est une entite unique sur tous les appareils. L'etat est partage entre Mobile et Desktop.

### RIC (Chaine d'Identite Recursive)
Quand un parent transmigre, ses enfants maintiennent leurs identites relatives.

### ANCHOR (Points d'Ancrage Spatial)
Certains elements servent de points de reference fixes qui ne bougent jamais pendant les transitions.

---

## 4. ANTI-PATTERNS

- **Le Piege de l'Opacite** : `opacity: 0->1` seul est paresseux. Ajoutez toujours une direction spatiale.
- **Le Peche Lineaire** : L'easing lineaire n'a pas d'equivalent physique. Utilisez toujours des springs.
- **L'Inondation Layout** : N'utilisez `layout` que sur les elements semantiquement importants.
