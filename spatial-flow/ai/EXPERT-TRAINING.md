# Spatial Flow -- AI Expert Training
## Complete Knowledge Base for Deep AI Specialization

> This document transforms any LLM into a Spatial Flow expert capable of making autonomous architectural decisions, debugging animation bugs, and writing production-quality spatial code.

---

## MODULE 1: PATTERN RECOGNITION

### 1.1 Identifying the Correct Protocol

Train yourself to recognize these UI patterns and instantly map them to protocols:

| When you see... | Think... | Protocol |
|:----------------|:---------|:---------|
| "Page loads" / "Initial render" | Timed wave reveal | SSC |
| "List of cards/items appearing" | Alternating side entry | LG |
| "Tabs" / "Swipe between views" | Direction-aware slide | Follow Flow |
| "Same element in two views" | Identity preservation | TAF |
| "Card expanding to detail" | Organic cell division | RM |
| "Form steps" / "Wizard" | Content metamorphosis | CS |
| "Settings panel switching" | Content metamorphosis | CS |
| "Navigation dots relocating" | Two-phase transmigration | SS |
| "Video going fullscreen" | Portal from source rect | PEF |
| "Avatar click -> login form" | Gravitational drop sequence | DWP |
| "Animation freezes on blur" | Containing block interference | LPS |
| "Grid reordering / drag-drop" | Orthogonal turn-based | SQG |
| "Background parallax" | Heavy slow drift | DREAM_SOUL |
| "Button click feedback" | Instant snap response | REFLEX_SOUL |

### 1.2 Combination Detection

Real-world UIs often require MULTIPLE protocols. Learn to decompose:

**Example: "Build a dashboard with tabs, each containing a card list"**
- Tab switching -> Follow Flow (direction-aware)
- Page content -> SSC (cascade entry)
- Card list within tab -> LG (lateral glide)
- **Combined**: Follow Flow wraps SSC which contains LG items.

**Example: "Auth card that morphs between signin and forgot password"**
- Avatar click -> DWP (drop water)
- Card expansion -> Part of DWP (mitosis)
- Signin <-> Forgot -> CS (chrysalis shift)
- Circle animation during blur -> LPS (shield)
- **Combined**: DWP orchestrates the opening, CS handles the internal metamorphosis, LPS protects during blur.

### 1.3 Anti-Pattern Detection

When reviewing code, flag these immediately:

| Code Pattern | Violation | Fix |
|:-------------|:----------|:----|
| `transition={{ duration: 0.3 }}` (no spring, no named constant) | Hardcoded timing | Use `SOUL_PHYSICS.standard` |
| `display: isActive ? "block" : "none"` | Kills exit animation | Use opacity + Anchor Protocol |
| `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` (no spatial origin) | Teleportation | Add `y: 20` or `x` offset |
| `className="w-[100vw]"` | Ghost scrollbar | Use `w-full` |
| `ease: "linear"` | Robotic movement | Use SF_EASE or spring |
| Two `layoutId="same"` rendered simultaneously | Quantum Flicker | Namespace or conditional render |
| `delay: index * 0.1` without cap | Neverending cascade | `Math.min(index, 10) * 0.05` |
| `useEffect(() => { ref.offsetHeight })` | Layout thrashing | Use `useLayoutEffect` |

---

## MODULE 2: IMPLEMENTATION PATTERNS

### 2.1 The Correct Way to Write a Spatial Flow Component

```tsx
// 1. Import from motion/react (NEVER framer-motion)
import { motion, AnimatePresence } from "motion/react";

// 2. Import Soul constants (NEVER hardcode springs)
import { SOUL_PHYSICS, STANDARD_SOUL } from "../spatial-flow/core/soul-constants";

// 3. Import speed scaling (if applicable)
import { scaleTransition } from "../spatial-flow/core/scale-transition";

// 4. Define variants with named constants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: STANDARD_SOUL, // Named constant, not hardcoded
  },
};

// 5. Cap stagger for lists
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};
```

### 2.2 Speed-Scaled Transitions

```tsx
// IN JSX PROPS: Use scaleTransition()
<motion.div
  transition={scaleTransition({ duration: 0.5, ease: "easeOut" })}
/>

// IN VARIANTS: Use raw values (they get scaled at render time)
// Do NOT wrap variant transitions in scaleTransition() -- this causes double-scaling
const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }, // Raw value, scaled by the component
  },
};

// FOR SETTIMEOUT: Use getFlowDuration()
setTimeout(() => {
  doSomething();
}, getFlowDuration(0.4) * 1000);

// PURE SPRINGS: Do NOT scale (self-timing)
<motion.div
  transition={{ type: "spring", stiffness: 105, damping: 18, mass: 1 }}
  // This is correct -- springs don't need scaleTransition()
/>

// INFINITE LOOPS: Do NOT scale
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
  // This is correct -- infinite loops are ambient
/>
```

### 2.3 Chrysalis Shift Implementation Checklist

When implementing a Chrysalis Shift, verify:

- [ ] Container uses `maxHeight` animation (not `height: auto`)
- [ ] Container NEVER unmounts (conditional rendering is on content, not container)
- [ ] Content elements have individual `opacity`/`y` animations with stagger
- [ ] Dissolution phase uses `y: 0 -> -8px` exit direction
- [ ] Emergence phase uses `y: 8px -> 0` entry direction
- [ ] Height breathing starts at 55% of dissolution completion
- [ ] Content emergence starts at 65% of height animation completion
- [ ] Directional Momentum is applied (compression vs unfolding timings)
- [ ] Easing is `[0.4, 0, 0.2, 1]` for all tweens
- [ ] No phase gap (dead time) between dissolution and emergence

### 2.4 Layout Projection Shield Checklist

When implementing any animation near a blur/transform parent:

- [ ] Identify all elements with `layoutId` inside the affected parent
- [ ] Identify ALL moments when parent's filter/transform changes
- [ ] Apply shield: `layoutId={isAnimating ? undefined : "my-id"}`
- [ ] Shield covers BOTH directions (acquisition AND removal of filter)
- [ ] Shield cleanup happens AFTER animation completes (`setTimeout + 200ms`)
- [ ] Tested with all speed presets (zen through ultra)

---

## MODULE 3: DEBUGGING SPATIAL FLOW

### 3.1 Common Bugs and Diagnosis

**Bug: "Element jumps to wrong position then animates"**
- **Cause**: Layout projection interference (parent filter/transform change)
- **Fix**: Apply LPS to the element's layoutId

**Bug: "Animation plays but feels wrong/robotic"**
- **Cause**: Using tween instead of spring, or wrong Soul constant
- **Fix**: Match Soul to intent. Navigation = Standard. Click = Reflex. Background = Dream.

**Bug: "Horizontal scrollbar appears during animation"**
- **Cause**: Missing viewport lock CSS, or using `100vw`
- **Fix**: Apply viewport-lock.css. Replace `100vw` with `100%`.

**Bug: "Content flickers between two positions"**
- **Cause**: Two same `layoutId` mounted simultaneously (Quantum Flicker)
- **Fix**: Ensure only ONE instance with that layoutId is in the React tree at any time.

**Bug: "Exit animation doesn't play"**
- **Cause**: Element is unmounted before animation can run (no AnimatePresence), or `display: none` is used
- **Fix**: Wrap in `<AnimatePresence>` and use `exit` prop. Never use `display: none`.

**Bug: "Speed control doesn't affect this animation"**
- **Cause**: Transition is not wrapped in `scaleTransition()`, or it's a pure spring
- **Fix**: Wrap tween transitions in `scaleTransition()`. Pure springs are self-timing (correct behavior).

**Bug: "Chrysalis content overlap during transition"**
- **Cause**: Phase weaving thresholds are wrong, or isClosing state isn't propagated
- **Fix**: Verify 55%/65% thresholds. Ensure isClosing triggers dissolution before emergence.

### 3.2 The Debugging Flowchart

```
Animation Bug?
|
+-- Does it JUMP/SNAP?
|   +-- Is there a layoutId? --> LPS needed
|   +-- Is there AnimatePresence? --> Check exit timing
|   +-- Is layout changing? --> Check for layout thrashing
|
+-- Does it FREEZE?
|   +-- Is parent getting blur/filter? --> LPS needed
|   +-- Is the component unmounting? --> Check conditional rendering
|   +-- Is state being batched wrong? --> Check React 18 batching
|
+-- Does it FLICKER?
|   +-- Two same layoutId? --> Namespace or conditional mount
|   +-- AnimatePresence mode? --> Try mode="popLayout"
|
+-- Does it feel WRONG?
|   +-- Wrong Soul constant? --> Match Soul to intent
|   +-- Linear easing? --> Replace with spring or SF_EASE
|   +-- Too fast/slow? --> Adjust spring values or check speed scaling
|
+-- Does it create SCROLLBARS?
    +-- Missing viewport lock? --> Add viewport-lock.css
    +-- Using 100vw? --> Replace with 100%
    +-- Content overflow during animation? --> Add overflow:hidden to parent
```

---

## MODULE 4: ARCHITECTURAL DECISIONS

### 4.1 When to Use Spring vs Tween

| Use Case | Type | Reasoning |
|:---------|:-----|:----------|
| UI movement (slides, morphs) | **Spring** | Physics-based = natural feel |
| Content opacity transitions | **Tween** | Opacity doesn't have "weight" |
| Height breathing | **Tween** with SF_EASE | Predictable timing for phase weaving |
| Background parallax | **Spring** (Dream) | Heavy, continuous motion |
| Button press feedback | **Spring** (Reflex) | Instant snap response |
| Stagger delays | **Tween** (delay values) | Precise timing control |

### 4.2 When to Use `layout` vs `layoutId`

| Feature | `layout` | `layoutId` |
|:--------|:---------|:-----------|
| Same element, same mount point | Yes | Not needed |
| Element moves between containers | No | Yes |
| Responsive resize animation | Yes | Not needed |
| Element identity across routes | No | Yes |
| Performance impact | Lower | Higher |

### 4.3 State Architecture for Complex Animations

For multi-protocol orchestrations (e.g., DWP + CS + LPS):

```
State Layers:
1. ANIMATION STATE (isDropWaterActive, isClosingAuth, isViewSwitching)
   -> Controls which protocol is active
   
2. VIEW STATE (activeView, targetHeight)
   -> Controls what content is rendered
   
3. PROTECTION STATE (layoutId conditions)
   -> Controls LPS shield up/down
   
4. TIMING STATE (setTimeout chains)
   -> Orchestrates phase weaving
```

**Rule**: Animation state changes should be batched in React 18 (`unstable_batchedUpdates` is automatic). View state changes should be deferred via setTimeout to respect phase weaving timelines.

---

## MODULE 5: QUALITY CHECKLIST

Before declaring any Spatial Flow implementation complete, verify:

### Animation Quality
- [ ] Every entering element has a spatial origin (not just opacity fade)
- [ ] Every Soul constant matches its intent
- [ ] No hardcoded spring values (all reference named constants)
- [ ] Stagger is capped at index 10 for lists
- [ ] No linear easing anywhere

### Performance
- [ ] No layout thrashing (`useLayoutEffect` for measurements)
- [ ] No `will-change` on non-animating elements
- [ ] Blur transitions use CSS transitions, not Motion springs
- [ ] `overflow: hidden` on animated parents to prevent reflow

### Viewport Integrity
- [ ] viewport-lock.css is imported globally
- [ ] No `100vw` usage (all `100%`)
- [ ] Meta viewport has `user-scalable=no, maximum-scale=1.0`
- [ ] Internal scrollers use `.no-scrollbar` class

### Speed Control
- [ ] All tween transitions wrapped in `scaleTransition()` (in JSX props)
- [ ] All setTimeout values use `getFlowDuration()`
- [ ] Infinite loops excluded from scaling
- [ ] Pure springs not wrapped in `scaleTransition()`
- [ ] No double-scaling (raw values in variants, scaled in props)

### Protocol Compliance
- [ ] Correct protocol selected per Decision Tree
- [ ] All protocol-specific prohibitions respected
- [ ] LPS applied where needed
- [ ] Chrysalis containers never unmount
- [ ] Follow Flow direction matches user attention

### [END TRAINING]
