# PORTAL EXPANSION FLOW [PEF]
## Universal Fullscreen Spatial Transition Protocol

---

> *"The content does not open a new window. It becomes the window."*
> -- Michel EKANI, Spatial Flow Framework

---

## 1. WHAT IS THE PORTAL EXPANSION FLOW?

The **Portal Expansion Flow [PEF]** is a Spatial Flow protocol for transitioning any inline content (video, image, card, widget) from its embedded position within a scrollable layout to a fullscreen viewport overlay, using a physics-based animation that preserves spatial continuity.

Unlike traditional fullscreen implementations (which destroy the inline element and render a new fullscreen element), the PEF **captures the exact geometric coordinates** of the source element and animates a portal from that precise position to fill the entire viewport.

### The Physical Metaphor
Imagine a photograph pinned to a corkboard. Instead of picking it up and replacing it with a projector screen, the photograph itself *grows* from its pinned position until it fills the entire wall. When you're done, it *shrinks* back to its exact pin location.

### Why "Portal"?
The animation uses `createPortal` (React) or equivalent DOM escape mechanisms to render the fullscreen element at the document root, escaping any `overflow: hidden`, `transform`, or `z-index` constraints from parent containers.

---

## 2. THE PROBLEM IT SOLVES

### Traditional Fullscreen
```
User clicks "Expand"
  -> Inline element disappears (opacity: 0)
  -> Fullscreen overlay fades in (opacity: 0 -> 1)
  -> User loses spatial context: "Where did this come from?"
```

### Portal Expansion Flow
```
User clicks "Expand"
  -> Source rect captured via getBoundingClientRect()
  -> Portal renders at EXACT source position (top, left, width, height)
  -> Portal animates with spring physics to (0, 0, 100vw, 100vh)
  -> User sees the content GROW from its origin: spatial continuity preserved
```

---

## 3. CORE MECHANICS

### Phase 1: Rect Capture
Before entering fullscreen, capture the source element's exact viewport position.

```typescript
interface SourceRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

// Capture on expand click
const rect = containerRef.current.getBoundingClientRect();
setSourceRect({
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
});
```

### Phase 2: Portal Rendering
The fullscreen element renders via `createPortal` at the document body, starting at the captured rect.

```tsx
createPortal(
    <motion.div
        className="fixed z-[9999] overflow-hidden"
        initial={{
            top: sourceRect.top,
            left: sourceRect.left,
            width: sourceRect.width,
            height: sourceRect.height,
            borderRadius: 8,
        }}
        animate={{
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            borderRadius: 0,
        }}
        exit={{
            top: sourceRect.top,
            left: sourceRect.left,
            width: sourceRect.width,
            height: sourceRect.height,
            borderRadius: 8,
        }}
        transition={EXPANSION_SPRING}
    >
        {children}
    </motion.div>,
    document.body
);
```

### Phase 3: Spring Physics
The expansion uses a physics spring, not a duration-based tween.

```typescript
const EXPANSION_SPRING = {
    type: "spring",
    stiffness: 180,
    damping: 28,
    mass: 1,
};
```

**Why these values?**
- `stiffness: 180` -- Fast enough to feel responsive, slow enough to be trackable
- `damping: 28` -- Minimal overshoot (content shouldn't "bounce" past viewport)
- `mass: 1` -- Standard weight, no artificial heaviness

### Phase 4: Reverse Animation
Clicking minimize (or pressing Escape) triggers the `exit` animation, which uses the same spring to animate back to the original `sourceRect`. The user sees the content shrink back to its exact origin.

---

## 4. THE GYROSCOPIC LANDSCAPE SHIFT [GLS]

### Mobile-Specific Extension

On mobile devices, video content benefits from landscape orientation. The PEF extends with a **simultaneous rotation** during expansion:

```
Desktop: Expand (position + size only)
Mobile:  Expand + Rotate 90deg (position + size + rotation)
```

### The Mathematics

When a container of dimensions `(vh x vw)` is rotated 90deg around its center, it visually appears as `(vw x vh)` -- exactly filling the viewport.

```typescript
const vw = window.innerWidth;   // e.g., 390
const vh = window.innerHeight;  // e.g., 844

const mobileFullscreenTarget = {
    // Position so that center = viewport center after rotation
    top: (vh - vw) / 2,    // e.g., (844 - 390) / 2 = 227
    left: (vw - vh) / 2,   // e.g., (390 - 844) / 2 = -227
    // Pre-rotation dimensions (will appear swapped after 90deg)
    width: vh,              // 844
    height: vw,             // 390
    borderRadius: 0,
    rotate: 90,
};
```

### Verification
- Container center after positioning: `(left + width/2, top + height/2)` = `(-227 + 422, 227 + 195)` = `(195, 422)` = viewport center
- After 90deg rotation: `844 x 390` becomes visually `390 x 844` = viewport dimensions

### The Reverse
Minimizing reverses both the position/size AND the rotation:

```typescript
exit: {
    top: sourceRect.top,
    left: sourceRect.left,
    width: sourceRect.width,
    height: sourceRect.height,
    borderRadius: 8,
    rotate: 0,  // Unrotate back to portrait
}
```

The user sees the video simultaneously shrink AND rotate back to portrait as it returns to its card position.

---

## 5. BACKDROP SYNCHRONIZATION

The portal includes a synchronized backdrop that fades in during expansion:

```tsx
{/* Backdrop -- fades simultaneously */}
<motion.div
    className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
/>
```

**Critical**: The backdrop uses a simple `duration` tween (not a spring) because:
- Springs on opacity can cause micro-oscillation (visible flicker)
- The backdrop is a mood element, not a spatial element -- it doesn't need physical behavior

---

## 6. INLINE-TO-PORTAL STATE SHARING

### The Controls Problem
When switching from inline to fullscreen, controls (play, pause, progress, volume) must remain functional without state reset.

### The Solution: Shared Controls Props

```typescript
// Single source of truth for all control state
const controlsProps = {
    showControls,
    isPaused,
    progress,
    isMuted,
    volume,
    // ... all handlers
    onPlayPause: handlePlayPause,
    onStop: handleStop,
    // ...
};

// Inline mode
{!isFullscreen && (
    <InlineOverlay>
        <ControlsLayer {...controlsProps} isFullscreen={false} />
    </InlineOverlay>
)}

// Fullscreen mode (portal)
{isFullscreen && (
    <FullscreenPortal>
        <ControlsLayer {...controlsProps} isFullscreen={true} />
    </FullscreenPortal>
)}
```

The `isFullscreen` prop adjusts sizing (larger buttons, thicker progress bar) without duplicating logic.

---

## 7. ESCAPE HATCH PATTERN

The fullscreen portal registers a keyboard listener for the Escape key:

```typescript
useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onMinimize();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
}, [onMinimize]);
```

This provides a universal exit mechanism that doesn't require visual UI interaction.

---

## 8. Z-INDEX ARCHITECTURE

The PEF uses a two-layer z-index strategy:

| Layer | z-index | Purpose |
|-------|---------|---------|
| Backdrop | `9998` | Dark overlay behind content |
| Content | `9999` | The expanding video/content |

These values are intentionally high to escape any application z-index context.

---

## 9. MOTION PROPERTY ISOLATION

### The Layout Prop Trap

**Critical Warning**: Do NOT use `layout` prop on child elements inside the expanding portal.

When the portal's container animates its dimensions (width/height), any child with `layout` prop will independently detect a "layout change" and apply its own corrective transforms. This causes visual glitches (e.g., a progress bar fill expanding to fill the entire screen).

```tsx
// BAD -- layout prop causes glitch during portal expansion
<motion.div
    style={{ width: `${progress}%` }}
    layout  // THIS CAUSES BUGS
    transition={{ duration: 0.1 }}
/>

// GOOD -- CSS-only width, no layout interference
<motion.div
    style={{
        width: `${progress}%`,
        backgroundColor: accent.solid,
    }}
/>
```

This is an instance of the broader **Layout Projection Shield [LPS]** pattern.

---

## 10. REAL-WORLD USE CASES

### Video Players
Inline video card expands to cinematic fullscreen with landscape rotation on mobile.
*The user sees the video grow from its card, maintaining complete spatial awareness.*

### Image Galleries
Thumbnail grows to fill viewport for detail viewing.
*Combined with Gyroscopic Landscape Shift for panoramic images on mobile.*

### Data Dashboards
A KPI widget expands to show detailed charts in fullscreen.
*The widget grows from its grid position, making it clear which data point is being explored.*

### Map Widgets
An embedded map expands to fullscreen for exploration.
*The map grows from its card position, and on mobile rotates to landscape for better geographic viewing.*

### Document Previews
A document thumbnail expands to a readable fullscreen preview.
*The document grows from the file list, maintaining the user's position context.*

### Code Editors
An inline code snippet expands to a fullscreen editor.
*The editor grows from the snippet position, preserving the spatial relationship to the surrounding content.*

---

## 11. RULES & PROHIBITIONS

### DO:
- Capture `getBoundingClientRect()` BEFORE entering fullscreen state
- Use `createPortal` to escape `overflow: hidden` ancestors
- Use spring physics (not duration tweens) for the expansion
- Keep the source element hidden (not unmounted) during fullscreen
- Provide Escape key as universal exit
- Use separate z-index layers for backdrop and content

### DO NOT:
- Use `layout` prop on children inside the expanding portal
- Use duration-based tweens for the expansion (springs only)
- Forget to reverse the animation on exit (no instant close)
- Hardcode viewport dimensions at component mount (recalculate on expand)
- Mix backdrop spring with content spring (backdrop uses tween)
- Unmount the source element during fullscreen

---
---
---

# PORTAL EXPANSION FLOW [PEF]
## Protocole Universel de Transition Spatiale Plein Ecran

---

> *"Le contenu n'ouvre pas une nouvelle fenetre. Il devient la fenetre."*
> -- Michel EKANI, Framework Spatial Flow

---

## 1. QU'EST-CE QUE LE PORTAL EXPANSION FLOW ?

Le **Portal Expansion Flow [PEF]** est un protocole Spatial Flow pour transitionner tout contenu inline (video, image, carte, widget) de sa position incrustee dans un layout scrollable vers un overlay plein ecran, en utilisant une animation basee sur la physique qui preserve la continuite spatiale.

Contrairement aux implementations fullscreen traditionnelles (qui detruisent l'element inline et rendent un nouvel element fullscreen), le PEF **capture les coordonnees geometriques exactes** de l'element source et anime un portail depuis cette position precise pour remplir le viewport entier.

### La Metaphore Physique
Imaginez une photographie epinglee a un tableau de liege. Au lieu de la retirer et de la remplacer par un ecran de projection, la photographie elle-meme *grandit* depuis sa position epinglee jusqu'a remplir le mur entier. Quand vous avez fini, elle *retrecit* a son emplacement exact.

---

## 2. LE GYROSCOPIC LANDSCAPE SHIFT [GLS]

### Extension Specifique Mobile

Sur mobile, le PEF s'etend avec une **rotation simultanee** pendant l'expansion :

```
Desktop : Expansion (position + taille uniquement)
Mobile  : Expansion + Rotation 90deg (position + taille + rotation)
```

### Les Mathematiques

Quand un conteneur de dimensions `(vh x vw)` est tourne de 90deg autour de son centre, il apparait visuellement comme `(vw x vh)` -- remplissant exactement le viewport.

```typescript
const vw = window.innerWidth;   // ex: 390
const vh = window.innerHeight;  // ex: 844

const cibleFullscreenMobile = {
    top: (vh - vw) / 2,    // Centre vertical
    left: (vw - vh) / 2,   // Centre horizontal
    width: vh,              // Dimensions pre-rotation
    height: vw,
    borderRadius: 0,
    rotate: 90,             // Rotation paysage
};
```

L'utilisateur voit le contenu grandir ET pivoter simultanement -- une seule animation spring orchestre les deux transformations.

---

## 3. REGLES & INTERDICTIONS

### FAIRE :
- Capturer `getBoundingClientRect()` AVANT d'entrer en mode fullscreen
- Utiliser `createPortal` pour echapper aux ancetres `overflow: hidden`
- Utiliser la physique spring (pas des tweens de duree) pour l'expansion
- Garder l'element source cache (pas demonte) pendant le fullscreen
- Fournir la touche Escape comme sortie universelle
- Utiliser des couches z-index separees pour le backdrop et le contenu

### NE PAS FAIRE :
- Utiliser le prop `layout` sur les enfants a l'interieur du portail
- Utiliser des tweens bases sur la duree pour l'expansion (springs uniquement)
- Oublier d'inverser l'animation a la sortie (pas de fermeture instantanee)
- Coder en dur les dimensions du viewport au montage du composant
- Melanger le spring du backdrop avec celui du contenu (le backdrop utilise un tween)
- Demonter l'element source pendant le fullscreen
