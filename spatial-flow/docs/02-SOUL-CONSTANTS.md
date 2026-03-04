# Soul Constants -- Physics Engine Reference

> *"Every animation needs a soul. Without it, motion is just noise."*

---

## The 5 Soul Types

### 1. STANDARD SOUL -- General Movement
```ts
{ type: "spring", stiffness: 105, damping: 18, mass: 1 }
```
**Feel**: Confident, balanced, professional.
**Use for**: Navigation transitions, page morphing, general UI movement, Follow Flow.
**Real-world analog**: A well-oiled drawer sliding open.

### 2. REFLEX SOUL -- High Energy
```ts
{ type: "spring", stiffness: 350, damping: 25, mass: 0.7 }
```
**Feel**: Snap, click, toggle. Instant response with controlled overshoot.
**Use for**: Button clicks, toggles, Reflex Matrix mitosis, micro-interactions.
**Real-world analog**: A spring-loaded button clicking.

### 3. DREAM SOUL -- Backgrounds
```ts
{ type: "spring", stiffness: 40, damping: 20, mass: 2 }
```
**Feel**: Viscous, dreamy, heavy, slow drift.
**Use for**: Background parallax, ambient floating elements, gradient shifts.
**Real-world analog**: Honey flowing on a tilted surface.

### 4. CHRYSALIS SOUL -- Content Transmutation
```ts
{
  height:      { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  dissolution: { duration: 0.6, stagger: 0.1, ease: [0.4, 0, 0.2, 1] },
  emergence:   { delay: 0.5, duration: 0.8, stagger: 0.15, ease: [0.4, 0, 0.2, 1] },
  weaving:     { dissolutionThreshold: 0.55, emergenceThreshold: 0.65 }
}
```
**Feel**: Organic breathing, living metamorphosis.
**Use for**: Form step transitions, content swaps inside persistent containers.
**Note**: Tween-based (not spring). The only Soul that uses duration/ease instead of spring physics.
**Real-world analog**: A caterpillar transforming inside its chrysalis.

### 5. EXPANSION SOUL -- Portal & Fullscreen
```ts
{ type: "spring", stiffness: 180, damping: 28, mass: 1 }
```
**Feel**: Powerful, controlled expansion. Authoritative.
**Use for**: Portal Expansion Flow, Gyroscopic Landscape Shift, fullscreen transitions.
**Real-world analog**: A telescope extending to full length.

---

## Specialized Physics

### GLIDE_PHYSICS -- Lateral Glide Lists
```ts
{ type: "spring", stiffness: 140, damping: 18, mass: 1 }
```
Tighter than Standard Soul -- items arrive with precision, not drift.

### SAMSARA_VESSEL -- Navigation Container
```ts
{ type: "spring", stiffness: 120, damping: 20, mass: 1 }
```
Heavy, grounded movement for the physical container.

### SAMSARA_INDICATOR -- Navigation Dots
```ts
{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }
```
Light, snappy movement for indicator dots arriving after the vessel.

---

## The SF_EASE Curve

```ts
[0.4, 0, 0.2, 1]
```

This cubic-bezier is the Spatial Flow standard easing curve. It's equivalent to Material Design's standard curve but calibrated for the organic feel of Visiomorphism.

**Used in**: All tween-based animations (Chrysalis Shift height breathing, content dissolution/emergence, Anchor Protocol).

**Never use**: `linear`, `ease`, or `ease-in-out` for Spatial Flow animations. These feel robotic and break the organic metaphor.

---

## Spring Physics: How to Think About It

| Property | Effect | Higher Value = |
|:---------|:-------|:---------------|
| `stiffness` | How fast the element reaches target | Snappier, more rigid |
| `damping` | How quickly oscillation stops | Less bounce, more controlled |
| `mass` | How heavy the element feels | Slower, more deliberate |

### Common Calibrations

| Use Case | stiffness | damping | mass | Feel |
|:---------|:----------|:--------|:-----|:-----|
| Quick toggle | 350 | 25 | 0.7 | Instant snap |
| Navigation slide | 105 | 18 | 1.0 | Confident glide |
| Background drift | 40 | 20 | 2.0 | Heavy float |
| List item entry | 140 | 18 | 1.0 | Precise weave |
| Fullscreen expand | 180 | 28 | 1.0 | Powerful growth |

---

## Rules for Using Soul Constants

1. **Never hardcode spring values** -- Always reference a Soul constant or create a new named constant.
2. **Never use `duration` for springs** -- Springs are self-timing. Adding `duration` to a spring config changes it to a tween-emulated spring.
3. **Never use linear easing** -- Nothing in nature moves linearly.
4. **Match Soul to intent** -- A background parallax should not use Reflex Soul. A toggle should not use Dream Soul.
5. **Speed scaling** -- If using the speed control module, wrap transitions in `scaleTransition()`. Exception: infinite loop animations (`repeat: Infinity`) should NOT be scaled.
