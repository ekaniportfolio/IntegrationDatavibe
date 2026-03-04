# SAMSARA SHIFT
## Universal Navigation Transmigration Protocol

---

> *"The body moves, the soul follows."*
> -- Michel EKANI, Spatial Flow Framework

---

## 1. WHAT IS THE SAMSARA SHIFT?

The **Samsara Shift** is a Spatial Flow pattern for navigation elements that must traverse large vertical distances to remain contextually relevant. Named after the Buddhist concept of the cycle of rebirth, it treats the navigation container as the "Physical Body" and the navigation indicators (dots, circles, pips) as the "Soul."

### The Problem
In a multi-step vertical flow, navigation dots are typically fixed at the top. When the user reaches the final step (which may be hundreds of pixels below), the dots are no longer visible. Traditional solutions:
- **Sticky positioning**: Feels disconnected from content
- **Duplicating navigation**: Creates two sources of truth
- **Hiding dots**: Loses spatial context

### The Spatial Solution
When the user reaches the final stage, the navigation container physically **transmigrates** from the top to the bottom, like a soul moving to a new body. The container moves first (establishing the new space), then the individual indicators follow (the soul settling into the new vessel).

---

## 2. CORE PHYSICS

### Phase 1: The Vessel (Container Movement)
The container moves first, establishing the new physical space.

```typescript
// Trigger: activePage reaches final index
// Movement: layout spring transition
const VESSEL_PHYSICS = {
    type: "spring",
    stiffness: 120,
    damping: 20,
};
```

**Character**: Heavy, grounded. The vessel is physical mass moving through space.

### Phase 2: The Soul (Indicator Settlement)
The individual dots/indicators follow with their own physics, slightly delayed.

```typescript
const SOUL_PHYSICS = {
    type: "spring",
    stiffness: 200,
    damping: 15,
};
```

**Character**: Lighter, more playful. The soul is ethereal, bouncing slightly as it settles.

### The Sequence
```
T+0.0s: Container begins vertical descent/ascent
T+0.1s: Indicators begin following (stagger: 0.03s each)
T+0.4s: Container settles in new position
T+0.5s: Indicators settle (slight overshoot)
```

---

## 3. IMPLEMENTATION

### 3.1 Layout-Based Approach

```tsx
<motion.div
    layout
    className={`flex gap-2 ${
        isAtFinalStep ? 'fixed bottom-6' : 'fixed top-6'
    }`}
    transition={VESSEL_PHYSICS}
>
    {steps.map((step, i) => (
        <motion.div
            key={step.id}
            layoutId={`nav-dot-${step.id}`}
            className={`w-3 h-3 rounded-full ${
                i === activeStep ? 'bg-primary' : 'bg-muted'
            }`}
            transition={SOUL_PHYSICS}
        />
    ))}
</motion.div>
```

### 3.2 Conditional Position Calculation

```typescript
// Calculate position based on active step
const getNavPosition = (activeStep: number, totalSteps: number) => {
    const isAtEnd = activeStep >= totalSteps - 1;
    return {
        position: 'fixed' as const,
        top: isAtEnd ? 'auto' : '1.5rem',
        bottom: isAtEnd ? '1.5rem' : 'auto',
    };
};
```

---

## 4. THE REBIRTH CYCLE

The Samsara Shift is cyclical:

```
Genesis (Top)     -- User starts flow
  |
  v  (Progress through steps)
Journey (Middle)  -- Dots visible at top
  |
  v  (Reach final step)
Revelation (Bottom) -- Dots transmigrate down
  |
  v  (User goes back)
Rebirth (Top)     -- Dots transmigrate back up
```

Each transition uses the same physics, creating a symmetrical experience.

---

## 5. USE CASES

### Multi-Step Onboarding
Navigation dots move from top to bottom as the user progresses through a vertical onboarding flow.

### Long-Form Wizards
Step indicators relocate to stay near the user's current action area.

### Vertical Story Flows
Progress indicators follow the user's journey through a scrollable narrative.

### Chat Navigation
Conversation markers move to maintain proximity to the active message area.

---

## 6. RULES

### DO:
- Move the vessel (container) BEFORE the soul (indicators)
- Use different physics for vessel vs soul (vessel = heavy, soul = light)
- Maintain `layoutId` on each indicator for smooth identity tracking
- Apply the Rebirth cycle symmetrically (down AND back up)

### DO NOT:
- Move vessel and soul simultaneously (breaks the metaphor)
- Use the same spring constants for both (vessel must feel heavier)
- Teleport indicators (they must physically travel)
- Break the cycle (if it can go down, it must be able to go back up)

---
---
---

# SAMSARA SHIFT
## Protocole Universel de Transmigration de Navigation

---

> *"Le corps bouge, l'ame suit."*
> -- Michel EKANI, Framework Spatial Flow

---

## 1. QU'EST-CE QUE LE SAMSARA SHIFT ?

Le **Samsara Shift** est un pattern Spatial Flow pour les elements de navigation qui doivent traverser de grandes distances verticales pour rester contextuellement pertinents. Le conteneur de navigation est le "Corps Physique" et les indicateurs (points, cercles) sont "l'Ame".

Quand l'utilisateur atteint l'etape finale, la navigation **transmigre** physiquement du haut vers le bas. Le conteneur bouge en premier (etablissant le nouvel espace), puis les indicateurs suivent (l'ame s'installant dans le nouveau vaisseau).

---

## 2. LE CYCLE DE RENAISSANCE

```
Genese (Haut)       -- L'utilisateur commence
  |
  v
Voyage (Milieu)     -- Les points sont visibles en haut
  |
  v
Revelation (Bas)    -- Les points transmigrent en bas
  |
  v
Renaissance (Haut)  -- Les points remontent
```

Chaque transition utilise la meme physique, creant une experience symetrique.
