# Decision Tree -- Which Protocol Should I Use?

> Follow this flowchart to select the correct Spatial Flow protocol for any UI situation.

---

## The Master Decision Tree

```
START: "I need to animate something"
|
+-- Is it a PAGE LOAD or MAJOR VIEW CHANGE?
|   |
|   YES --> SSC (Sequential Spatial Cascade)
|           Stagger content in timed waves: Structure -> Nav -> Body -> Actions
|
+-- Is it a LIST of items appearing?
|   |
|   YES --> Does the list have distinct, separable items?
|           |
|           YES --> LG (Lateral Glide)
|                   Even from left, odd from right, with blur
|           |
|           NO --> SSC with staggerChildren
|
+-- Is an ELEMENT MOVING between two DOM positions?
|   |
|   YES --> Does it need to PHYSICALLY TRAVEL?
|           |
|           YES --> TAF (Transmigrated Astral Flow)
|                   Use layoutId to transport identity
|           |
|           NO --> Simple opacity/position transition
|
+-- Is CONTENT CHANGING inside a PERSISTENT CONTAINER?
|   |
|   YES --> Are both states at the SAME hierarchy level?
|           |
|           YES --> CS (Chrysalis Shift)
|                   Three-Phase Weave: Dissolve -> Breathe -> Emerge
|           |
|           NO --> Is it EXPANDING from compact to detailed?
|                   |
|                   YES --> RM (Reflex Matrix)
|                           Organic mitosis expansion
|                   |
|                   NO --> Follow Flow (directional slide)
|
+-- Is it NAVIGATION DOTS/INDICATORS changing position?
|   |
|   YES --> SS (Samsara Shift)
|           Vessel moves first, soul (dots) follows with stagger
|
+-- Is INLINE CONTENT going FULLSCREEN?
|   |
|   YES --> PEF (Portal Expansion Flow)
|           Capture rect -> Portal -> Spring to fullscreen
|           |
|           +-- Is it on MOBILE and needs ROTATION?
|               YES --> GLS (Gyroscopic Landscape Shift)
|
+-- Is a GRID being REORDERED?
|   |
|   YES --> SQG (Sequential Grid)
|           Orthogonal only (no diagonals), turn-based
|
+-- Is there a PARENT with filter/transform CHANGING during animation?
|   |
|   YES --> Does the animated element have layoutId?
|           |
|           YES --> LPS (Layout Projection Shield)
|                   Temporarily remove layoutId during interference period
|
+-- Is it an AVATAR -> AUTH transition?
    |
    YES --> DWP (Drop Water Protocol)
            Five-act gravitational sequence
```

---

## Quick Reference Matrix

| Situation | Protocol | Soul Type |
|:----------|:---------|:----------|
| Page loads for the first time | SSC | Standard |
| User switches tabs | Follow Flow + SSC | Standard |
| Card list appears | LG (Lateral Glide) | Glide (140/18/1) |
| Grid items reorder | SQG (Sequential Grid) | Standard |
| Card expands to page | TAF | Standard |
| FAB becomes sidebar | TAF | Standard |
| Form step 1 -> step 2 | CS (Chrysalis Shift) | Chrysalis |
| Settings panel content swap | CS | Chrysalis |
| Compact card -> detail view | RM (Reflex Matrix) | Reflex |
| Navigation dots relocate | SS (Samsara Shift) | Samsara |
| Inline video goes fullscreen | PEF | Expansion |
| Mobile video rotates landscape | PEF + GLS | Expansion |
| Avatar click -> auth card | DWP (Drop Water) | Mixed |
| Parent applies blur during anim | LPS | N/A (protection) |
| Background parallax | Direct spring | Dream |
| Button click feedback | Direct spring | Reflex |

---

## Common Mistakes: Wrong Protocol Selection

### Mistake 1: Using TAF when CS is correct
**Symptom**: Content "flies" from one container to another, but both containers are actually the same card.
**Fix**: If the container persists and only the content changes, use Chrysalis Shift.

### Mistake 2: Using SSC for everything
**Symptom**: Every interaction triggers a full cascade from scratch.
**Fix**: SSC is for initial loads and major view changes. For in-view content changes, use CS or simple transitions.

### Mistake 3: Using RM when TAF is correct
**Symptom**: A card "splits" when it should "travel" to a new location.
**Fix**: Reflex Matrix is for in-place expansion. TAF is for cross-DOM movement.

### Mistake 4: Forgetting LPS during Drop Water
**Symptom**: Visiomorphic circle animation freezes when blur is applied.
**Fix**: Apply Layout Projection Shield before the blur arrives.

---

## Combination Patterns

Some UI patterns require MULTIPLE protocols working together:

| Pattern | Protocols Combined |
|:--------|:-------------------|
| Dashboard initial load | SSC (page cascade) + LG (list items within) |
| Auth flow | DWP (avatar->card) + CS (signin<->forgot) + LPS (circle protection) |
| Tab-based dashboard | Follow Flow (tab direction) + SSC (content cascade) + LG (list items) |
| Mobile video expansion | PEF (fullscreen) + GLS (rotation) |
| Onboarding wizard | CS (step transitions) + SSC (content within each step) |
