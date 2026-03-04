# AGNOSTIC SPATIAL FLOW TUTORIALS (V2.0)
## Real-World Examples of Organic Interfaces

This document provides step-by-step logic for building common UI patterns using Spatial Flow principles.

---

### TUTORIAL 1: THE SPATIAL LOGIN (The "Morphing Button")

**The Old Way**: User clicks "Login" button -> Modal pops up (disconnect) or redirects to new page (flash).
**The Spatial Way**: The "Login" button *physically transforms* into the form.

#### Step-by-Step Logic
1.  **State**: `isOpen` (boolean).
2.  **Component Structure**:
    ```jsx
    <LayoutGroup>
      {isOpen ? (
        <motion.div layoutId="container" className="bg-white p-8 rounded-xl shadow-xl">
           <motion.input ... />
           <motion.input ... />
        </motion.div>
      ) : (
        <motion.button layoutId="container" onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full">
           Login
        </motion.button>
      )}
    </LayoutGroup>
    ```
3.  **The Magic**: The `layoutId="container"` tells Motion that the blue button and the white card are the *same soul*.

---

### TUTORIAL 2: THE MAGIC GALLERY (Grid to Detail)

**The Old Way**: Grid of images. Click one -> Full screen lightbox pops over.
**The Spatial Way**: The image *flies* from its grid position to fill the screen.

#### Step-by-Step Logic
1.  **The Grid (Parent)**:
    *   Map through items.
    *   Each thumbnail needs `<motion.img layoutId={`img-${id}`} />`.
2.  **The Detail View (Overlay)**:
    *   When an item is selected, render a fixed overlay.
    *   Inside the overlay, render the *same* image with the *same* `layoutId={`img-${id}`}`.
3.  **The Physics**:
    *   Use `transition: { type: "spring", stiffness: 300, damping: 30 }`.

---

### TUTORIAL 3: THE SEQUENTIAL GRID (The Checkerboard)

**Scenario**: You want to reorder items in a grid or filter them.
**The Old Way**: Items fly randomly to their new spots (Chaos).
**The Spatial Way**: Items move like rooks on a chessboard (Order).

#### Step-by-Step Logic
1.  **The Constraint**: An item cannot move diagonally. It must move X, then Y (or Y then X).
2.  **Implementation**:
    *   You need to know the *current* position (x1, y1) and the *target* position (x2, y2).
    *   Calculate the delta: `dx = x2 - x1`, `dy = y2 - y1`.
3.  **The Animation Sequence**:
    ```javascript
    const [scope, animate] = useAnimate();
    
    const moveItem = async () => {
       await animate(scope.current, { x: dx }, { duration: 0.3 });
       await animate(scope.current, { y: dy }, { duration: 0.3 });
    }
    ```
4.  **Result**: The grid feels like a mechanical machine, distinct from the fluid "organic" feel of other components. Useful for "Admin" or "Data" modes.

---

### TUTORIAL 4: THE MITOSIS DASHBOARD (The "Buffer" Trick)

**Scenario**: You have a widget at the bottom of the dashboard. Clicking it expands it to show a graph.
**Problem**: The page ends there. Expanding it creates a scroll bar, but the user is still looking at the bottom.

#### Step-by-Step Logic
1.  **Click Event**:
    *   Set `isExpanded(true)`.
    *   Set `isBuffering(true)`.
2.  **Apply Buffer**:
    *   Add `padding-bottom: 50vh` to the main dashboard container based on `isBuffering`.
3.  **Auto-Scroll (Soft Lock)**:
    *   Use `window.scrollTo` to scroll the widget to the "Headroom" zone (e.g., 100px from top).
4.  **Cleanup**:
    *   Wait 800ms (animation duration).
    *   Set `isBuffering(false)`.
    *   The expanded widget now naturally occupies the space. No jump!

---

### TUTORIAL 5: THE CHRYSALIS SHIFT (Content Transmutation)

**Scenario**: You have a Sign-In card that can switch to a "Forgot Password" card. Both live in the same container.
**The Old Way**: Instant switch or full page redirect. Context is lost.
**The Spatial Way**: The card's content dissolves, the card breathes (contracts/expands), and new content emerges within.

#### Step-by-Step Logic
1.  **Container**: A single `motion.div` with `overflow: hidden` and animated `maxHeight`. Never unmounts.
2.  **Content Components**: Each view (SignIn, ForgotPassword) renders elements individually with stagger animation.
3.  **Transition Handler**:
    ```javascript
    const handleSwitch = (nextView, nextHeight) => {
        setIsClosing(true); // Phase 1: Dissolution starts

        // Phase 2: Height breathing at 55% of content exit
        const heightStart = CONTENT_CLOSE_TIME * 0.55 * 1000;
        setTimeout(() => setTargetHeight(nextHeight), heightStart);

        // Phase 3: Emergence at 65% of height animation
        const contentSwitch = heightStart + 0.4 * 0.65 * 1000;
        setTimeout(() => {
            // Apply directional momentum
            if (nextHeight < currentHeight) {
                setTimings({ delay: 0.25, duration: 0.55, stagger: 0.10 });
            } else {
                setTimings({ delay: 0.15, duration: 0.5, stagger: 0.08 });
            }
            setCurrentView(nextView);
            setIsClosing(false);
            setTimeout(() => setTimings(DEFAULTS), 100);
        }, contentSwitch);
    };
    ```
4.  **Result**: The card feels alive -- it breathes between forms, and the user never loses spatial context.

---

### TUTORIAL 6: THE PORTAL EXPANSION FLOW (Fullscreen Video)

**Scenario**: You have a video player embedded in a card. Clicking "Expand" should make it fullscreen with spatial continuity.
**The Old Way**: The video opens in a new fullscreen modal (fade in). The user doesn't know where it came from.
**The Spatial Way**: The video physically GROWS from its card position to fill the entire viewport.

#### Step-by-Step Logic
1.  **Capture Source Rect**: On expand click, grab the card's exact position.
    ```typescript
    const handleExpand = () => {
        const rect = cardRef.current.getBoundingClientRect();
        setSourceRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
        setIsFullscreen(true);
    };
    ```

2.  **Render Portal**: Use `createPortal` to render at document body (escapes overflow:hidden).
    ```tsx
    {isFullscreen && createPortal(
        <>
            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Expanding container */}
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
                    top: 0, left: 0,
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
                transition={{ type: "spring", stiffness: 180, damping: 28 }}
            >
                <VideoContent />
                <Controls />
            </motion.div>
        </>,
        document.body
    )}
    ```

3.  **Minimize**: Click minimize or press Escape -> `setIsFullscreen(false)`. The `exit` animation reverses the portal back to the source rect.

4.  **Critical Rule**: Do NOT put `layout` prop on any child inside the portal. It will cause visual glitches (progress bars expanding incorrectly, etc.).

---

### TUTORIAL 7: THE GYROSCOPIC LANDSCAPE SHIFT (Mobile Fullscreen with Rotation)

**Scenario**: Same as Tutorial 6, but on mobile the video should also rotate to landscape.
**The Spatial Way**: The video simultaneously GROWS and ROTATES 90 degrees in a single spring animation.

#### Step-by-Step Logic
1.  **Detect Device**: Use a `useIsDesktop` hook (window.innerWidth >= 768).

2.  **Calculate Mobile Target**: 
    ```typescript
    const vw = window.innerWidth;   // e.g., 390
    const vh = window.innerHeight;  // e.g., 844

    const mobileTarget = {
        top: (vh - vw) / 2,    // 227
        left: (vw - vh) / 2,   // -227
        width: vh,             // 844 (pre-rotation)
        height: vw,            // 390 (pre-rotation)
        borderRadius: 0,
        rotate: 90,            // Landscape rotation
    };
    ```

3.  **Why This Math Works**:
    - Container center after positioning: `(-227 + 844/2, 227 + 390/2)` = `(195, 422)` = viewport center
    - After 90-degree rotation around center: visual dimensions become `390 x 844` = viewport!

4.  **Conditional Animation**:
    ```tsx
    animate={isDesktop ? desktopTarget : mobileTarget}
    ```

5.  **Exit**: Both position/size AND rotation reverse simultaneously.
    ```tsx
    exit={{
        top: sourceRect.top,
        left: sourceRect.left,
        width: sourceRect.width,
        height: sourceRect.height,
        borderRadius: 8,
        rotate: 0,  // Back to portrait
    }}
    ```

6.  **Result**: On mobile, the user sees the video grow from its card AND rotate to landscape in one fluid motion. Minimizing reverses both transformations.

---

### TUTORIAL 8: THE SAMSARA NAVIGATION (Vertical Transmigration)

**Scenario**: You have a multi-step onboarding flow. Navigation dots are at the top, but the last step is far below.
**The Old Way**: Dots are fixed at top (disconnected from content) or invisible.
**The Spatial Way**: Dots physically travel from top to bottom when the user reaches the final step.

#### Step-by-Step Logic
1.  **State**: `activeStep` (number), `totalSteps` (number).
2.  **Position Logic**:
    ```typescript
    const isAtEnd = activeStep >= totalSteps - 1;
    ```
3.  **Container with Layout**:
    ```tsx
    <motion.div
        layout
        className={`fixed flex gap-2 ${
            isAtEnd ? 'bottom-6 left-1/2 -translate-x-1/2' 
                    : 'top-6 left-1/2 -translate-x-1/2'
        }`}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
        {steps.map((step, i) => (
            <motion.div
                key={step.id}
                layoutId={`dot-${step.id}`}
                className={`w-3 h-3 rounded-full ${
                    i === activeStep ? 'bg-primary' : 'bg-muted'
                }`}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />
        ))}
    </motion.div>
    ```
4.  **Two Physics**: Container moves heavily (stiffness: 120), dots follow lightly (stiffness: 200). This creates the "body moves, soul follows" effect.

---

### TUTORIAL 9: THE CINEMATIC GLASS CONTROLS (Video Player UI)

**Scenario**: You need a video player overlay with controls that feel premium and cinematic.
**The Old Way**: Controls always visible, or fade in/out with opacity.
**The Spatial Way**: Controls slide in from the flanks (left/right, top/bottom) with spring physics and auto-hide after 3 seconds.

#### Step-by-Step Logic
1.  **Control Groups**:
    *   Top bar: Slides from TOP (`y: -40 -> 0`). Contains expand/minimize.
    *   Center: Scales from center (`scale: 0.8 -> 1`). Contains play/pause/skip.
    *   Bottom: Slides from BOTTOM (`y: 50 -> 0`). Contains progress, volume, settings.
    *   Within bottom: Left group slides from LEFT (`x: -40 -> 0`), right group from RIGHT (`x: 40 -> 0`).

2.  **Auto-Hide Timer**:
    ```typescript
    const resetHideTimer = useCallback(() => {
        setShowControls(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        if (!isPaused && isPlaying) {
            hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [isPaused, isPlaying]);
    ```

3.  **Glass Effect** (Motion-compatible):
    ```tsx
    // Use rgba style, NOT Tailwind bg-white/20 (avoids oklab errors in Motion)
    <motion.button
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        className="backdrop-blur-sm border border-white/30 rounded-full"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.35)' }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
        <PlayIcon />
    </motion.button>
    ```

4.  **Namespace-Aware Accent**: Progress bar color changes based on content type.
    ```typescript
    const getAccent = (namespace: string) => {
        switch (namespace) {
            case 'streaming': return { solid: '#F28E42', rgb: '242,142,66' };
            case 'social':    return { solid: '#1CB45B', rgb: '28,180,91' };
            case 'radio':     return { solid: '#1286F3', rgb: '18,134,243' };
            default:          return { solid: '#10B981', rgb: '16,185,129' };
        }
    };
    ```

---
---
---

# TUTORIELS FLUX SPATIAL AGNOSTIQUE (V2.0)
## Exemples Concrets d'Interfaces Organiques

---

### TUTORIEL 1 : LE LOGIN SPATIAL
Le bouton "Login" se transforme physiquement en formulaire via `layoutId`.

### TUTORIEL 2 : LA GALERIE MAGIQUE
L'image vole de sa position grille pour remplir l'ecran via `layoutId`.

### TUTORIEL 3 : LA GRILLE SEQUENTIELLE
Les elements bougent comme des tours sur un echiquier -- orthogonal uniquement.

### TUTORIEL 4 : LE DASHBOARD MITOSE
Le widget s'etend in-place avec Trappe Inversee + Verrouillage Doux.

### TUTORIEL 5 : LE CHRYSALIS SHIFT
La carte respire entre les formulaires -- Dissolution -> Respiration -> Emergence.

### TUTORIEL 6 : LE PORTAL EXPANSION FLOW
La video grandit physiquement de sa carte vers le plein ecran via `createPortal`.

### TUTORIEL 7 : LE GYROSCOPIC LANDSCAPE SHIFT
Sur mobile, la video grandit ET pivote 90deg simultanement vers le mode paysage.
Mathematique : conteneur `(width=vh, height=vw)` a `top=(vh-vw)/2, left=(vw-vh)/2, rotate: 90`.

### TUTORIEL 8 : LE SAMSARA SHIFT
Les points de navigation transmigrent physiquement du haut vers le bas quand l'utilisateur atteint la derniere etape.

### TUTORIEL 9 : LES CONTROLES VERRE CINEMATIQUE
Les controles du lecteur video glissent depuis les flancs avec physique spring, auto-masquage apres 3s, et effet verre depoli compatible Motion.
