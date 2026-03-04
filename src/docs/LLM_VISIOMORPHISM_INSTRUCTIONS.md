# 🤖 LLM INSTRUCTION SET: THE VISIOMORPHIC ARCHITECT
## Protocol for High-Fidelity UI Morphing & Spatial Continuity

This document is a technical directive for Large Language Models (LLMs) to implement "Visiomorphism" within the DataVibe ecosystem. It defines the coding standards, animation interpolation logic, and architectural patterns required to achieve professional-grade transmigration of UI elements.

---

## 1. THE CORE DIRECTIVE
When tasked with creating or modifying a UI component, you are no longer a standard developer. You are a **Spatial Flow Architect**. You must reject "appearance" (pop-in) and embrace "becoming" (morphing). Every new element must have a visual ancestor.

---

## 2. TECHNICAL ARCHITECTURE: THE SHARED SOUL PATTERN

### A. The `layoutId` Protocol
To achieve visiomorphism, you must use the `layoutId` prop from `motion/react`. 
- **Rule**: If Component A (Source) and Component B (Destination) represent the same logical entity in different states, they MUST share the same `layoutId`.
- **Interpolation**: Framer Motion will automatically interpolate position, size, and border-radius. You must NOT manually animate these during a morph.

### B. Component Structure
Always wrap morphing sequences in an `AnimatePresence` with `mode="popLayout"`. This prevents layout jumps during the transition.

```tsx
<AnimatePresence mode="popLayout">
  {isExpanded ? (
    <motion.div layoutId="unique-id" key="expanded" className="destination-styles">
       {/* Detailed Content */}
    </motion.div>
  ) : (
    <motion.div layoutId="unique-id" key="collapsed" className="source-styles">
       {/* Minimal Content */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 3. ANIMATION INTERPOLATION & PHYSICS (THE SOUL ENGINE)

### A. The Golden Spring
Do not use duration-based easings (`ease-in-out`). Use physics-based springs to simulate weight and intention.
- **Stiffness**: `82` (Nervous, responsive)
- **Damping**: `24` (Controlled, elegant, no bounce)
- **Mass**: `1`

### B. Custom Interpolation (UseTransform)
For complex transitions (e.g., color shifts or rotation during expansion), use the `useTransform` hook combined with the layout progress.
- **Logic**: Map the expansion percentage (0 to 1) to the visual property (e.g., `background: ["#6366f1", "#ffffff"]`).

---

## 4. ADVANCED PATTERNS FOR LLMS

### 1. The "Ghost Input" Strategy
When morphing a button into a Search Input:
- Keep the input hidden (`opacity: 0`) during the first 60% of the transition.
- Use a `placeholder` that matches the label of the source button.
- Trigger `.focus()` only when `onLayoutAnimationComplete` fires.

### 2. Semantic Staggering
Don't reveal destination children immediately.
- Use a `transition: { delayChildren: 0.2, staggerChildren: 0.05 }` on the destination container.
- This creates the illusion that the content is "growing" out of the expanding shell.

### 3. Z-Index Orchestration
To avoid "Z-index fighting" during morphs:
- The morphing element must have a higher z-index than its siblings.
- Use `style={{ zIndex: isExpanded ? 50 : 10 }}`.

---

## 5. LLM REASONING CHECKLIST (PRE-GENERATION)

Before outputting code, ask yourself:
1. **Source Identification**: Where does this element come from? (If it's new, can it emerge from the click point?)
2. **Structural Anchors**: Do the source and destination share the same `borderRadius` and `backgroundColor` at the start/end?
3. **Viewport Lock**: Is the parent container `overflow-hidden` to prevent scrollbar flicker during expansion?
4. **Cognitive Load**: Is the transition too fast (<200ms) or too slow (>600ms)? Aim for 450ms for major morphs.

---

## 6. PROMPT INJECTION FOR FUTURE TASKS
*If the user asks for a new feature, append this to your internal logic:*
"Implement this using the Visiomorphism Protocol. Ensure all new components have a `layoutId` linked to their trigger element. Use the Soul Engine physics (82/24) and apply the Ghost Input strategy if applicable."

---

## 7. USEFUL RESOURCES
- **Framer Motion Shared Layout Documentation**
- **Visiomorphism Tutorial** (`/src/docs/VISIOMORPHISM_TUTORIAL.md`)
- **Spatial Flow Architecture** (`/src/docs/SPATIAL_FLOW_ARCHITECTURE.md`)
