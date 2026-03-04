# Absolute Prohibitions
## What NEVER to Do in Spatial Flow

> *"These rules are not suggestions. They are laws of physics."*

---

## Universal Prohibitions

### 1. No Linear Easing
Nothing in nature moves linearly. Always use springs or the SF_EASE curve `[0.4, 0, 0.2, 1]`.

**Bad**: `transition={{ duration: 0.3, ease: "linear" }}`
**Good**: `transition={SOUL_PHYSICS.standard}`

### 2. No `display: none`
This kills the exit animation instantly. The element vanishes without trace, violating Conservation of Digital Mass.

**Bad**: `style={{ display: isHidden ? "none" : "block" }}`
**Good**: Use the Anchor Protocol (`position: fixed` + `opacity: 0`).

### 3. No Layout Thrashing
Never read layout properties (`offsetHeight`, `getBoundingClientRect`) inside `useEffect` or inside loops. Use `useLayoutEffect` to measure before paint.

### 4. No Teleportation
Elements must never appear at a position without traveling there. `opacity: 0->1` without spatial origin is forbidden.

**Bad**: `initial={{ opacity: 0 }} animate={{ opacity: 1 }}`
**Good**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`

### 5. No `width: 100vw`
On desktop, a scrollbar takes physical width. `100vw` = viewport + scrollbar = horizontal overflow. Always use `width: 100%`.

---

## Protocol-Specific Prohibitions

### SSC (Sequential Spatial Cascade)

1. **No Reverse Cascade**: Never stagger from bottom to top (unless loading chat history). Reading direction is top-down.

2. **No Neverending Cascade**: Cap the stagger index at 10.
   - **Bad**: `delay: index * 0.1` (Item 100 = 10 seconds)
   - **Good**: `delay: Math.min(index, 10) * 0.05`

3. **No Interaction Blocking**: Elements MUST be clickable the moment they are visible. Never use `pointer-events: none` during cascade.

### LG (Lateral Glide)

1. **No Over-Distance**: `x: 100px` makes users dizzy. Max `x: 20-30px`.
2. **No Zero Stagger**: All items at `delay: 0` = messy shake, not weaving.
3. **No Text Paragraphs**: Apply Lateral Glide to cards/rows only. Never to lines of text.

### SQG (Sequential Grid)

1. **No Diagonal Movement**: Even if it's the shortest path. X first, then Y. Or Y first, then X.
2. **No Swarm Animations**: Never let 50+ items move freely simultaneously.
3. **No Overlapping Physics**: Two solid objects must never visually overlap during transition.
4. **No Rotation During Movement**: Rotation implies state change, not position change. Rotate before or after movement, never during.

### TAF (Transmigrated Astral Flow)

1. **No Dual Souls (RAU)**: Two `layoutId="same-id"` mounted simultaneously = Quantum Flicker.
2. **No Unnamespaced Responsive**: Mobile and Desktop must use different layoutId namespaces.

### CS (Chrysalis Shift)

1. **No Container Unmount**: The chrysalis MUST persist. Unmounting destroys the spatial anchor.
2. **No Simultaneous Content**: Old and new content must NEVER coexist visually.
3. **No Linear Height**: Height breathing MUST use SF_EASE. Linear height = robotic.
4. **No Symmetric Timings**: Compression and Unfolding MUST have different profiles.
5. **No Deep Prop Threading**: Use Cartography Mutation instead of passing props through 4+ levels.
6. **No Instant Height**: Never `height: auto` with instant transition.
7. **No `display: none` on Exiting Content**: Content dissolves via opacity, never cut.
8. **No Phase Gap**: Zero "dead time" between phases. Overlap is mandatory.

### LPS (Layout Projection Shield)

1. **No Forgotten Return Shield**: Shield must be active during BOTH filter acquisition AND removal.
2. **No 0ms Restore**: Cartography Mutation restore must use `setTimeout(fn, 100)`, never `setTimeout(fn, 0)`.
3. **No `requestAnimationFrame` Restore**: Too early -- render hasn't committed yet.

---

## Speed Control Prohibitions

1. **No Scaling Infinite Loops**: Animations with `repeat: Infinity` must NOT be scaled. They are ambient and should remain constant.

2. **No Double-Scaling**: If a constant is pre-scaled (e.g., `HEIGHT_ANIM_DURATION = getFlowDuration(0.4)`), do NOT wrap it again in `scaleTransition()`. Use raw values in variant spreads, scaled values in JSX props.

3. **No Scaling Pure Springs**: Spring configs with only `stiffness/damping/mass` (no `duration/delay`) are self-timing. They don't need `scaleTransition()`.

---

## Performance Prohibitions

1. **No `will-change` on everything**: Only add `will-change: transform` to elements that are actively animating. Remove it after.

2. **No blur on large areas during animation**: `filter: blur()` on full-viewport elements during active spring animations can cause frame drops. Use CSS transitions for blur, not Motion springs.

3. **No `useEffect` for animation triggers**: `useEffect` runs after paint. Use `useLayoutEffect` for measurement, and state changes in event handlers for animation triggers.

---

## The Meta-Prohibition

> **If you have to ask "should I animate this?", the answer is probably "yes, but with the correct protocol".**
>
> The question is never "should I animate?" It is "which protocol is correct?"
