# AGNOSTIC LAYOUT PROJECTION SHIELD [LPS]
## Protecting Animations from CSS Containing Block Interference

---

> **Universal Principle**: When CSS `filter`, `transform`, `backdrop-filter`, or `perspective` is applied to (or removed from) a parent element, Framer Motion's `layoutId` system detects a phantom "layout change" and applies corrective transforms that destroy ongoing animations.

---

## 1. THE UNIVERSAL PROBLEM

### 1.1 The Containing Block Trap

In CSS, these properties create a **new containing block** for `position: fixed` descendants:
- `filter` (including `blur()`, `brightness()`, `contrast()`, `drop-shadow()`, `grayscale()`, `hue-rotate()`, `invert()`, `opacity()`, `saturate()`, `sepia()`)
- `backdrop-filter`
- `transform` (even `transform: none` if previously set, or `translateZ(0)`)
- `perspective`
- `contain: paint` or `contain: layout`
- `will-change: filter`, `will-change: transform`

When ANY of these is applied to a parent, all `position: fixed` descendants recalculate their position relative to that parent instead of the viewport.

### 1.2 The Framer Motion Collision

Framer Motion's `layoutId` system continuously monitors elements via `getBoundingClientRect()`. When a containing block change causes `getBoundingClientRect()` to return different values, the layout projection system:

1. Detects a "layout change"
2. Calculates a corrective `transform` 
3. Applies it to maintain the element's "projected" position
4. This corrective transform CONFLICTS with any ongoing `x`, `y`, `scale`, or `rotate` animation
5. The animation appears to "freeze", "snap", or "jump"

### 1.3 Trigger Scenarios

This bug occurs whenever:
- A modal backdrop applies `backdrop-filter: blur()`
- A parent receives `filter: blur()` for a "frosted glass" effect
- CSS `transform` is applied for GPU acceleration
- A drawer/panel adds `transform: translateX()` to a parent
- `will-change` is added or removed dynamically

---

## 2. THE SOLUTION: CONDITIONAL layoutId

### 2.1 Core Pattern

```tsx
<motion.div 
    layoutId={isUnsafe ? undefined : "my-element"} 
    animate={{ x: targetX, opacity: targetOpacity }}
    transition={transitionConfig}
/>
```

`isUnsafe` is `true` during the ENTIRE period when a parent's containing-block properties might change.

### 2.2 Bidirectional Protection

The shield must be active in BOTH directions:

```tsx
// Application of filter (parent gains filter)
const isFilterApplying = modalOpen;

// Removal of filter (parent loses filter)  
const isFilterRemoving = modalClosing;

// Shield covers BOTH transitions
layoutId={(isFilterApplying || isFilterRemoving) ? undefined : "my-element"}
```

### 2.3 Shield Lifecycle

```
[IDLE]         layoutId = "my-element"  (FLIP available)
     |
     v  (user triggers animation)
[ANIMATION]    layoutId = undefined     (Shield UP)
     |
     v  (parent filter applies/removes)
[FILTER CHANGE] layoutId = undefined    (Shield still UP)
     |
     v  (all animations complete, cleanup timer fires)
[CLEANUP]      layoutId = "my-element"  (Shield DOWN, FLIP restored)
```

---

## 3. COMPLETE RECIPE

### 3.1 Scenario: Expanding Card with Blurred Background

```tsx
function ExpandableCard({ id, isExpanded, onClose }) {
    const [isClosing, setIsClosing] = useState(false);
    
    const handleClose = () => {
        setIsClosing(true);
        setIsExpanded(false);
        
        setTimeout(() => setIsClosing(false), 800); // After all animations
    };
    
    return (
        <>
            {/* The card with Layout Projection Shield */}
            <motion.div
                layoutId={(isExpanded || isClosing) ? undefined : `card-${id}`}
                animate={{
                    x: isExpanded ? "calc(50vw - 200px)" : 0,
                    width: isExpanded ? 400 : 200,
                    height: isExpanded ? 600 : 150,
                }}
                transition={{
                    x: { duration: 0.5, ease: isExpanded ? "circOut" : "circIn" },
                    width: { duration: 0.5 },
                    height: { duration: 0.5 },
                }}
            >
                <CardContent />
            </motion.div>
            
            {/* The parent that gains/loses filter */}
            <div className={`transition-[filter] duration-300 ${
                isExpanded ? "blur-md pointer-events-none" : ""
            }`}>
                <OtherContent />
            </div>
        </>
    );
}
```

### 3.2 Scenario: Modal with Backdrop Blur

```tsx
function Modal({ isOpen, onClose, children }) {
    const [isClosingModal, setIsClosingModal] = useState(false);
    
    const close = () => {
        setIsClosingModal(true);
        setIsOpen(false);
        setTimeout(() => setIsClosingModal(false), 500);
    };
    
    return (
        <div className={`transition-[filter] duration-200 ${
            isOpen ? "blur-sm" : ""
        }`}>
            {/* Elements with layoutId inside this wrapper need the shield */}
            <motion.div 
                layoutId={(isOpen || isClosingModal) ? undefined : "nav-item"}
                animate={{ x: someValue }}
            />
        </div>
    );
}
```

---

## 4. THE PENDULUM RETURN

### 4.1 Principle

Every forward animation must have an **exact temporal inverse** for its reverse:

| Property | Forward | Reverse |
|----------|---------|---------| 
| `opacity` delay | End (delay: 0.6s) | Start (delay: 0) |
| `x` ease | circOut (fast start) | circIn (fast end) |
| `scale` ease | easeOut | easeIn |
| `y` ease | [0.55, 0, 1, 0.45] gravity | [0.45, 1, 0, 0.55] anti-gravity |

### 4.2 Pattern

```tsx
transition={
    isForward
    ? { 
        x: { duration: 0.6, ease: "circOut" },
        opacity: { duration: 0.1, delay: 0.6 }  // Disappear at END
    }
    : {
        opacity: { duration: 0.1, delay: 0 },     // Appear at START
        x: { duration: 0.6, ease: "circIn" }       // Return with inverse ease
    }
}
```

---

## 5. DIAGNOSTIC FLOWCHART

```
Animation freezes/snaps unexpectedly?
    |
    +-- Does the element have layoutId? 
    |       |
    |       NO --> Not this bug. Check other issues.
    |       |
    |       YES
    |       |
    +-- Does a PARENT change filter/transform/backdrop-filter during animation?
    |       |
    |       NO --> Not this bug. Check z-index, AnimatePresence, or timing.
    |       |
    |       YES
    |       |
    +-- APPLY THE LAYOUT PROJECTION SHIELD:
            1. Make layoutId conditional: {isAnimating ? undefined : "id"}
            2. Ensure shield covers BOTH forward AND reverse
            3. Drop shield only after ALL animations complete + cleanup
```

---

## 6. ADVANCED: THE STACKING CONTEXT ISOLATION PATTERN

### 6.1 Problem

When a parent `<motion.div>` has an `opacity` animation (even `opacity: 1`), it creates a stacking context. Children with `position: fixed` and high `z-index` are TRAPPED inside this stacking context.

### 6.2 Solution

Extract the element from the animated parent into a sibling position:

```tsx
// BEFORE (trapped):
<motion.div animate={{ opacity: isExiting ? 0 : 1 }}>
    <Header />
    <Content />
    <FixedButton className="fixed z-[100]" /> {/* TRAPPED! */}
</motion.div>

// AFTER (free):
<motion.div animate={{ opacity: isExiting ? 0 : 1 }}>
    <Header />
    <Content />
</motion.div>
<FixedButton className="fixed z-[100]" /> {/* FREE! */}
```

### 6.3 When to Apply

Apply Stacking Context Isolation when:
- A `position: fixed` element needs to appear ABOVE a sibling's content
- The element's parent has an `opacity`, `transform`, `filter`, or `will-change` animation
- The element's `z-index` seems to be "ignored" despite being high

---

## 7. CONDITIONAL Z-STRATUM

### 7.1 Concept

Dynamic z-index values that change based on application state to maintain correct visual layering during complex multi-phase animations.

### 7.2 Pattern

```tsx
className={`fixed ${
    stateA ? 'z-[highest]' :    // During animation A, must be on top
    stateB ? 'z-[lowest]' :     // During state B, must be behind
    'z-[default]'                // Normal state
}`}
```

### 7.3 Rules

1. **Never use a single z-index** for elements that participate in overlay animations
2. **Map each state** to its required z-level
3. **Consider ALL overlapping elements** when choosing values
4. **Document the complete z-stack** for each animation phase

---
---
---

# BOUCLIER DE PROJECTION LAYOUT AGNOSTIQUE [LPS]
## Proteger les Animations de l'Interference du Containing Block CSS

---

> **Principe Universel** : Quand CSS `filter`, `transform`, `backdrop-filter`, ou `perspective` est applique (ou retire) d'un element parent, le systeme `layoutId` de Framer Motion detecte un "changement de layout" fantome et applique des transforms correctifs qui detruisent les animations en cours.

---

## 1. LE PROBLEME UNIVERSEL

### 1.1 Le Piege du Containing Block

En CSS, ces proprietes creent un **nouveau containing block** pour les descendants `position: fixed` :
- `filter`, `backdrop-filter`, `transform`, `perspective`, `contain`, `will-change`

Quand l'une de ces proprietes est appliquee a un parent, tous les descendants `position: fixed` recalculent leur position par rapport a ce parent au lieu du viewport.

### 1.2 La Collision Framer Motion

Le systeme `layoutId` surveille continuellement les elements via `getBoundingClientRect()`. Quand un changement de containing block modifie les valeurs retournees, le systeme de projection layout detecte un "changement de layout", calcule un transform correctif, et l'applique -- ce qui ENTRE EN CONFLIT avec toute animation en cours.

---

## 2. LA SOLUTION : layoutId CONDITIONNEL

```tsx
layoutId={(estEnAnimation || estEnFermeture) ? undefined : "mon-element"}
```

Le bouclier doit etre actif dans les DEUX directions (application et retrait du filtre).

---

## 3. LE RETOUR PENDULAIRE

Chaque animation aller doit avoir un inverse temporel exact pour le retour. Si l'aller utilise `ease: "circOut"` avec un delai en fin, le retour utilise `ease: "circIn"` avec le delai au debut.

---

## 4. CHECKLIST DE DIAGNOSTIC

1. L'element a-t-il un `layoutId` ?
2. Un parent change-t-il `filter`/`transform`/`backdrop-filter` pendant l'animation ?
3. Si oui aux deux : appliquer le Bouclier de Projection Layout.
