# AGNOSTIC SPATIAL FLOW PATTERNS (V2.0)
## Implementation Recipes for Generic React/Motion Projects

This document outlines the core coding patterns required to achieve Spatial Flow in any React application.

---

### 1. REFLEX MATRIX PROTOCOL (Organic Mitosis)

**Goal**: Transform a compact summary card into a detailed view without leaving the context, using biological expansion physics.

#### The Problem
Standard accordions jerk the scroll position and push content off-screen.

#### The Solution: "Inverse Trapdoor" & "Soft Lock"

1.  **State 1 (Mother Cell)**: The card is compact.
2.  **Interaction**: User clicks "Expand".
3.  **Phase A - The Buffer (Inverse Trapdoor)**:
    *   **Action**: Immediately add `padding-bottom: 100vh` to the main container.
    *   **Why?**: Ensures the page is tall enough to scroll the card to the top.
4.  **Phase B - The Soft Lock**:
    *   **Action**: Animate `window.scrollY` to align the card's top edge to a fixed "Headroom" (e.g., 10rem from top).
    *   **Physics**: `REFLEX_PHYSICS` (stiffness: 350).
5.  **Phase C - Ghost DOM Measurement**:
    *   **Action**: Render *expanded* content in a hidden `div` (`opacity: 0`, `position: absolute`, `pointer-events: none`).
    *   **Measure**: Use `useLayoutEffect` to grab `offsetHeight`.
    *   **Apply**: Animate visible container height to this value.
6.  **Phase D - Mitosis**:
    *   **Action**: Fade in internal segments.
    *   **Cleanup**: Remove `100vh` padding after animation.

---

### 2. LATERAL GLIDE (Kinetic List Entry)

**Goal**: Make lists feel like they are being "woven" into reality.

#### The Pattern
Alternating lateral slides with motion blur.

*   **Logic**:
    *   Index 0, 2, 4 (Evens): Slide from Left (`x: -20px` -> `0`).
    *   Index 1, 3, 5 (Odds): Slide from Right (`x: +20px` -> `0`).
*   **Visuals**:
    *   Start: `filter: blur(10px)`, `opacity: 0`.
    *   End: `filter: blur(0px)`, `opacity: 1`.
*   **Physics**: `stiffness: 140, damping: 18`.

---

### 3. SEQUENTIAL GRID (The Checkerboard)

**Goal**: Reorder or move elements with robotic precision, avoiding the "swarm of bees" chaos.

#### The Rules
1.  **Orthogonal Only**: Move ONLY on X axis, THEN on Y axis. Never diagonal.
2.  **Turn-Based**: Item A moves. Then Item B moves.
3.  **No Rotation**: Rotation is a separate step.

#### Implementation
```javascript
// Pseudo-code for a grid reorder
await animate(itemA, { x: 100 }, { duration: 0.3 }); // Step 1: Slide Right
await animate(itemA, { y: 50 }, { duration: 0.3 });  // Step 2: Slide Down
await animate(itemB, { scale: 1.1 }, { duration: 0.2 }); // Step 3: Grow
```

---

### 4. SSC (Sequential Spatial Cascade)

**Goal**: Guide the user's eye by revealing information in waves.

#### The Timing (Relative to T=0)
1.  **T+0.0s**: Architecture (Backgrounds).
2.  **T+0.4s (T_Tabs)**: Navigation/Tabs.
3.  **T+0.7s (T_Container)**: Main Container Stabilizes.
4.  **T+0.8s (T_Body)**: Content begins (Staggered).
5.  **T+1.3s (T_Action)**: Footer/Floating Buttons.

*Tip*: Use `staggerChildren: 0.05` for list items within T_Body.

---

### 5. FOLLOW FLOW (Navigation Physics)

**Goal**: Content moves in the direction of the user's attention.

#### The Logic
*   **Navigating "Next" (Right)**:
    *   Old Content: Exits to **Left** (`x: -100%`).
    *   New Content: Enters from **Right** (`x: 100%`).
*   **Navigating "Back" (Left)**:
    *   Old Content: Exits to **Right** (`x: 100%`).
    *   New Content: Enters from **Left** (`x: -100%`).

#### Critical Implementation Detail
*   Exiting elements MUST be `position: absolute`, `top: 0`, `left: 0`, `width: 100%`.
*   Container must have `overflow: hidden`.

---

### 6. DAR (Astral Descent Return)

**Goal**: A specific exit gesture for returning to a "Home" or "Search" state.

*   **Trigger**: Clicking "Close", "Back to Home", or swiping down.
*   **Movement**: Strict Vertical Downward (`y: [0, 1000]`).
*   **Meaning**: "I am dropping this context to return to the foundation."

---

### 7. CHRYSALIS SHIFT [CS] (Content Transmutation)

**Goal**: Transform the content inside a persistent container through three overlapping phases, creating a seamless metamorphosis.

#### The Metaphor
The container is a chrysalis. Its inner content dissolves and reforms as a new being, while the vessel itself reshapes (breathes) to accommodate the new form.

#### The Three-Phase Weave
1.  **Dissolution** (55%): Content exits element by element with stagger (`opacity: 1->0`, `y: 0->-8px`).
2.  **Breathing** (at 55% of Dissolution): Container `maxHeight` animates to new target. `ease: [0.4, 0, 0.2, 1]`, `duration: 0.4s`.
3.  **Emergence** (at 65% of Breathing): New content enters with stagger (`opacity: 0->1`, `y: 8px->0`).

#### Directional Momentum
Timings are asymmetric based on direction:
*   **Compression** (Large->Small): delay -50%, duration -31%, stagger -33%.
*   **Unfolding** (Small->Large): delay -70%, duration -37%, stagger -47%.

#### Implementation
```javascript
const heightStart   = CONTENT_CLOSE_TIME * 0.55 * 1000;
const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;

// Phase 2: Height breathing
setTimeout(() => setTargetHeight(newHeight), heightStart);

// Phase 3: Content switch with directional timings
setTimeout(() => {
    applyDirectionalTimings(direction);
    setView(nextView);
    setTimeout(() => restoreOriginalTimings(), 100);
}, contentSwitch);
```

#### Use Cases
*   Auth form transitions (Sign-In <-> Forgot Password)
*   Multi-step forms, checkout flows
*   Settings panels, dashboard widget drill-downs

---

### 8. PORTAL EXPANSION FLOW [PEF] (Fullscreen Spatial Transition)

**Goal**: Transition inline content to fullscreen viewport with perfect spatial continuity.

#### The Problem
Traditional fullscreen: element disappears, overlay fades in. No spatial relationship.

#### The Solution: Rect Capture + Portal + Spring

1.  **Capture**: `getBoundingClientRect()` on source element before expansion.
2.  **Portal**: `createPortal` to `document.body` (escapes overflow:hidden).
3.  **Animate**: Spring from captured rect to viewport dimensions.
4.  **Reverse**: Same spring back to captured rect on minimize.

#### Implementation
```tsx
// Step 1: Capture
const rect = containerRef.current.getBoundingClientRect();
setSourceRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });

// Step 2: Portal with spring animation
createPortal(
    <motion.div
        className="fixed z-[9999] overflow-hidden"
        initial={{ ...sourceRect, borderRadius: 8 }}
        animate={{ top: 0, left: 0, width: vw, height: vh, borderRadius: 0 }}
        exit={{ ...sourceRect, borderRadius: 8 }}
        transition={{ type: "spring", stiffness: 180, damping: 28 }}
    >
        {children}
    </motion.div>,
    document.body
);
```

#### Critical Rules
*   Do NOT use `layout` prop on children inside the portal.
*   Backdrop uses tween (not spring) for opacity.
*   Escape key should trigger minimize.

---

### 9. GYROSCOPIC LANDSCAPE SHIFT [GLS] (Mobile Rotation)

**Goal**: On mobile, fullscreen video rotates to landscape orientation simultaneously with expansion.

#### The Math
```typescript
const vw = window.innerWidth;
const vh = window.innerHeight;

// Pre-rotation dimensions that become (vw x vh) after 90deg rotation
const mobileTarget = {
    top: (vh - vw) / 2,
    left: (vw - vh) / 2,
    width: vh,
    height: vw,
    borderRadius: 0,
    rotate: 90,
};
```

#### Why It Works
- Container center after positioning = viewport center.
- After 90-degree rotation: `(vh x vw)` becomes `(vw x vh)` visually = fills viewport.
- Single spring animates position + size + rotation simultaneously.

---

### 10. SAMSARA SHIFT [SS] (Navigation Transmigration)

**Goal**: Navigation elements physically travel vertically to stay near the user's action area.

#### The Two-Phase Physics
*   **Vessel** (container): `stiffness: 120, damping: 20` (heavy, grounded).
*   **Soul** (indicators): `stiffness: 200, damping: 15` (light, playful).

#### The Pattern
```tsx
<motion.div
    layout
    className={`fixed ${isAtEnd ? 'bottom-6' : 'top-6'}`}
    transition={{ type: "spring", stiffness: 120, damping: 20 }}
>
    {steps.map((step, i) => (
        <motion.div
            key={step.id}
            layoutId={`dot-${step.id}`}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
    ))}
</motion.div>
```

---

### 11. LAYOUT PROJECTION SHIELD [LPS] (Animation Protection)

**Goal**: Protect layoutId animations from CSS containing block interference.

#### The Pattern
```tsx
<motion.div
    layoutId={(isAnimating || isClosing) ? undefined : "my-element"}
    animate={{ x: targetX }}
    transition={springConfig}
/>
```

#### When to Apply
*   Parent gains/loses `filter`, `transform`, `backdrop-filter`, or `perspective`.
*   Shield must cover BOTH forward AND reverse directions.
*   Drop shield only after ALL animations complete.

---

### 12. CINEMATIC GLASS CONTROLS (Media Player UI)

**Goal**: Premium frosted-glass controls for video/audio players.

#### Entry Pattern
*   Top bar: `y: -40 -> 0` (slides from top).
*   Center controls: `scale: 0.8 -> 1` (grows from center).
*   Bottom bar: `y: 50 -> 0` (slides from bottom).
*   Left group: `x: -40 -> 0`, Right group: `x: 40 -> 0` (flank entry with delay).

#### Glass Button (Motion-compatible)
```tsx
<motion.button
    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
    className="backdrop-blur-sm border border-white/30 rounded-full"
    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.35)' }}
    whileTap={{ scale: 0.92 }}
/>
```

**Important**: Use `rgba()` in `style`, not Tailwind `bg-white/20`, to avoid `oklab` color space errors in Motion.

#### Auto-Hide
Controls auto-hide after 3 seconds of inactivity. Mouse/touch interaction resets the timer. Paused state keeps controls permanently visible.

---
---
---

# MODELES DE FLUX SPATIAL AGNOSTIQUE (V2.0)
## Recettes d'Implementation pour Projets React/Motion Generiques

---

### Resume des 12 Patterns

| # | Pattern | Acronyme | Objectif |
|---|---------|----------|----------|
| 1 | Reflex Matrix | RM | Expansion organique in-place |
| 2 | Lateral Glide | LG | Entree cinetique de listes |
| 3 | Sequential Grid | SG | Reordonnement orthogonal |
| 4 | SSC | SSC | Revelation par vagues |
| 5 | Follow Flow | FF | Navigation directionnelle |
| 6 | DAR | DAR | Retour vertical descendant |
| 7 | Chrysalis Shift | CS | Metamorphose de contenu |
| 8 | Portal Expansion Flow | PEF | Transition plein ecran spatiale |
| 9 | Gyroscopic Landscape Shift | GLS | Rotation paysage mobile |
| 10 | Samsara Shift | SS | Transmigration de navigation |
| 11 | Layout Projection Shield | LPS | Protection d'animation |
| 12 | Cinematic Glass Controls | CGC | Controles media premium |
