# AGNOSTIC SPATIAL FLOW GLOSSARY
## The Official Lexicon of Organic Interfaces (V2.0)

---

### 1. MOVEMENTS & TRAJECTORIES

*   **TL (Lateral Transmigration)**
    *   **Definition**: Strict horizontal movement (left/right) used for navigation between internal views at the same hierarchical level (e.g., switching from "Settings" to "Profile").
    *   **Physics**: `x: [-100, 0, 100]`.

*   **DAR (Astral Descent Return)**
    *   **Definition**: Exclusive downward vertical movement allowing the user to exit the current state and return to the parent/home screen. This is the only authorized vertical exit.
    *   **Physics**: `y: [0, 1000]`.
    *   **Meaning**: "Dropping" the current context.

*   **CSD / SSC (Sequential Spatial Cascade)**
    *   **Definition**: Chronological appearance order of elements, from top to bottom. Each section "drops" into place with a slight stagger.
    *   **Logic**: `delay: index * 0.05` or `0.1`.

*   **Lateral Glide**
    *   **Definition**: A staggered entry pattern for lists where items slide in from alternating sides (Left/Right) with motion blur.
    *   **Meaning**: Weaving the content into the view.

*   **Follow Flow**
    *   **Definition**: The principle that content must enter from the direction the user is moving towards (e.g., Clicking "Next" moves content from Right to Left).
    *   **Rule**: Old content exits OPPOSITE to navigation direction. New content enters FROM navigation direction.

---

### 2. ARCHITECTURE & CONCEPTS

*   **TAF (Transmigrated Astral Flow)**
    *   **Definition**: Fluid isolation system where components detach from their layout anchor to travel to a new position (e.g., a label becoming a header). Uses `layoutId`.

*   **RAU / SSR (Single Soul Rule)**
    *   **Definition**: Principle that a component, despite radical physical mutations between Mobile and Desktop ("Parallel Worlds"), maintains a single state logic and identity within the DOM.

*   **Visiomorphism**
    *   **Definition**: Visual metamorphosis where form follows function mutation. The object doesn't disappear; it *becomes*.
    *   **Examples**: A button becomes a modal. A thumbnail becomes a fullscreen view. A list item expands into a detail panel.

*   **RM (Reflex Matrix)**
    *   **Definition**: Organic interaction system simulating cellular division. The parent component ("Mother Cell") generates segments via spatial expansion. Requires "Buffer Strategy" for scrolling.

*   **CS (Chrysalis Shift)**
    *   **Definition**: Content transmutation protocol where a container persists while its inner content transforms through three overlapping phases (Dissolution -> Breathing -> Emergence). The container is the chrysalis; the content metamorphoses within. Uses Phase Weaving (55%/65% overlap thresholds), Directional Momentum (asymmetric timings), and Cartography Mutation (runtime timing injection).
    *   **Sub-techniques**: Phase Weaving, Directional Momentum, Cartography Mutation, Vessel Persistence.

*   **PEF (Portal Expansion Flow)**
    *   **Definition**: Fullscreen spatial transition protocol where inline content (video, image, widget) expands from its exact viewport position to fill the entire screen using `createPortal` and spring physics. The source element's `getBoundingClientRect()` is captured before expansion, and the portal animates from that rect to viewport dimensions.
    *   **Key Mechanic**: `createPortal` to `document.body` escapes `overflow: hidden` and `transform` ancestors.
    *   **Reverse**: Same spring animates back to captured source rect on minimize.

*   **GLS (Gyroscopic Landscape Shift)**
    *   **Definition**: Mobile-specific extension of PEF where the expanding content simultaneously rotates 90 degrees to landscape orientation. The container is rendered at dimensions `(vh x vw)` and positioned at `top=(vh-vw)/2, left=(vw-vh)/2` so that after 90-degree rotation, it visually fills the viewport `(vw x vh)`.
    *   **Math**: Container center = viewport center after positioning. Rotation transforms pre-rotation `(vh x vw)` into visual `(vw x vh)`.

*   **SS (Samsara Shift)**
    *   **Definition**: Navigation transmigration protocol where navigation elements physically travel across large vertical distances to remain contextually relevant. Named after the Buddhist cycle of rebirth. The container (vessel) moves first, then individual indicators (soul) follow with lighter physics.
    *   **Cycle**: Genesis (top) -> Journey (middle) -> Revelation (bottom) -> Rebirth (top).

*   **LPS (Layout Projection Shield)**
    *   **Definition**: Defensive pattern against CSS containing block interference. When a parent element gains/loses `filter`, `transform`, `backdrop-filter`, or `perspective`, Motion's `layoutId` system detects phantom layout changes and applies destructive corrective transforms. The shield conditionally removes `layoutId` during the danger period.
    *   **Pattern**: `layoutId={isAnimating ? undefined : "my-element"}`

*   **Ghost DOM**
    *   **Definition**: A technique of rendering content invisibly (`opacity: 0`, `pointer-events: none`) to measure its dimensions (`offsetHeight`) before animating the visible container. Essential for "Reflex Matrix".

*   **Parallel Worlds**
    *   **Definition**: The architectural pattern where Mobile and Desktop layouts are treated as separate topologies that share the same "Soul" (State), but do not try to mimic each other's behavior.

*   **Cinematic Glass Controls**
    *   **Definition**: A frosted-glass aesthetic control layer for media players where controls enter from the flanks (left and right) with spring physics and auto-hide after inactivity. Uses `backdrop-blur` and `rgba(255,255,255,0.2)` for Motion-compatible glass effect (avoids `oklab` color space errors).

---

### 3. STATES & PHYSICS

*   **Ethereal Phase**
    *   **Definition**: Transient state of an element during its movement (usually `opacity: 0.4`, `blur: 10px`). It represents the object "traveling" between states.

*   **Spatial Tension**
    *   **Definition**: The feeling of "weight" in an animation. We never use linear timing. We use Springs to simulate a physical connection.

*   **Phase Weaving**
    *   **Definition**: The art of overlapping exit, height, and entry animations at precise percentages (55% Dissolution Threshold, 65% Emergence Threshold) during a Chrysalis Shift to create seamless continuity.

*   **Directional Momentum**
    *   **Definition**: Asymmetric timing profiles in Chrysalis Shift based on height direction. Compression (large->small) uses tighter timings; Unfolding (small->large) uses snappier timings.

*   **Cartography Mutation**
    *   **Definition**: Runtime mutation of shared animation constants to inject directional timing awareness without deep prop threading. Uses Mutate->Render->Restore cycle with 100ms safety margin.

*   **Vessel Persistence**
    *   **Definition**: Cardinal rule of Chrysalis Shift -- the container never unmounts during transitions. It is the continuous spatial anchor.

*   **Rect Capture**
    *   **Definition**: The act of calling `getBoundingClientRect()` on a source element before entering a spatial transition (PEF, fullscreen). The captured rect becomes the animation origin.

*   **Inverse Trapdoor**
    *   **Definition**: Adding `padding-bottom: 100vh` to a container before expanding an element inside it, ensuring the page has enough scroll space for the Soft Lock to position the element correctly. Removed after animation completes.

*   **Soft Lock**
    *   **Definition**: Smooth scroll animation that positions an expanding element at a "Headroom" zone (e.g., 10rem from viewport top) during Reflex Matrix expansion.

*   **Buffer Strategy**
    *   **Definition**: Combined use of Inverse Trapdoor + Soft Lock to prevent scroll jumps during in-place expansion.

*   **Pendulum Return**
    *   **Definition**: The principle that every forward animation must have an exact temporal inverse for its reverse. Forward uses `circOut` (fast start), reverse uses `circIn` (fast end). Delays swap between start and end of timeline.

*   **Conditional Z-Stratum**
    *   **Definition**: Dynamic z-index values that change based on application state to maintain correct visual layering during complex multi-phase animations.

*   **Stacking Context Isolation**
    *   **Definition**: Extracting elements from animated parents (which create stacking contexts via `opacity`, `transform`, etc.) into sibling positions to prevent z-index trapping.

---

### 4. PHYSICS CONSTANTS

*   **SOUL_PHYSICS**
    *   `{ type: "spring", stiffness: 105, damping: 18, mass: 1 }`
    *   Usage: General motion, morphing, page transitions. Fluid and organic.

*   **REFLEX_PHYSICS**
    *   `{ type: "spring", stiffness: 350, damping: 25, mass: 0.7 }`
    *   Usage: Click responses, interactions, mitosis. Snappy and reactive.

*   **DREAM_PHYSICS**
    *   `{ type: "spring", stiffness: 40, damping: 20, mass: 2 }`
    *   Usage: Background parallax, ambient floating. Heavy and dreamlike.

*   **EXPANSION_PHYSICS**
    *   `{ type: "spring", stiffness: 180, damping: 28, mass: 1 }`
    *   Usage: Portal Expansion Flow, GLS. Confident and smooth.

*   **CONTROL_PHYSICS**
    *   `{ type: "spring", stiffness: 200, damping: 25 }`
    *   Usage: Toolbar entry/exit, control layers. Functional and reliable.

*   **CHRYSALIS_EASE**
    *   `[0.4, 0, 0.2, 1]`
    *   Usage: All Chrysalis Shift phases. Organic metamorphic curve.

---
---
---

# GLOSSAIRE FLUX SPATIAL AGNOSTIQUE
## Le Lexique Officiel des Interfaces Organiques (V2.0)

---

### 1. MOUVEMENTS & TRAJECTOIRES

*   **TL (Transmigration Laterale)**
    *   **Definition** : Mouvement horizontal strict (gauche/droite) pour la navigation entre vues de meme niveau hierarchique.
    *   **Physique** : `x: [-100, 0, 100]`.

*   **DAR (Descente Astrale de Retour)**
    *   **Definition** : Mouvement vertical descendant exclusif pour revenir a l'ecran parent/accueil.
    *   **Physique** : `y: [0, 1000]`.
    *   **Signification** : "Laisser tomber" le contexte actuel.

*   **CSD / SSC (Cascade Spatiale Sequentielle)**
    *   **Definition** : Ordre d'apparition chronologique des elements, de haut en bas avec decalage.
    *   **Logique** : `delay: index * 0.05` ou `0.1`.

*   **Glissement Lateral (Lateral Glide)**
    *   **Definition** : Motif d'entree decale ou les elements glissent de cotes alternes avec flou de mouvement.

*   **Follow Flow**
    *   **Definition** : Le contenu entre depuis la direction vers laquelle l'utilisateur se deplace.

---

### 2. ARCHITECTURE & CONCEPTS

*   **TAF (Flux Astral Transmigre)**
    *   **Definition** : Systeme d'isolation fluide ou les composants se detachent de leur ancrage pour voyager. Utilise `layoutId`.

*   **RAU / SSR (Regle de l'Ame Unique)**
    *   **Definition** : Un composant conserve une logique d'etat unique malgre des mutations physiques radicales entre Mobile et Desktop.

*   **Visiomorphisme**
    *   **Definition** : Metamorphose visuelle ou la forme suit la mutation de la fonction. L'objet ne disparait pas ; il *devient*.

*   **RM (Matrice-Reflex)**
    *   **Definition** : Systeme d'interaction organique simulant la division cellulaire. Necessite la "Strategie Tampon".

*   **CS (Chrysalis Shift / Mue du Chrysalide)**
    *   **Definition** : Protocole de transmutation de contenu avec trois phases chevauchees (Dissolution -> Respiration -> Emergence).

*   **PEF (Portal Expansion Flow)**
    *   **Definition** : Protocole de transition plein ecran spatiale. Le contenu inline s'etend depuis sa position exacte via `createPortal` et physique spring.

*   **GLS (Gyroscopic Landscape Shift)**
    *   **Definition** : Extension mobile du PEF avec rotation simultanee de 90 degres vers le mode paysage. Mathematique : conteneur `(vh x vw)` positionne a `top=(vh-vw)/2, left=(vw-vh)/2`.

*   **SS (Samsara Shift)**
    *   **Definition** : Navigation qui transmigre physiquement a travers de grandes distances verticales. Cycle : Genese -> Voyage -> Revelation -> Renaissance.

*   **LPS (Bouclier de Projection Layout)**
    *   **Definition** : Protection contre l'interference du containing block CSS. `layoutId` rendu conditionnel pendant les periodes dangereuses.

*   **Ghost DOM**
    *   **Definition** : Rendu invisible du contenu pour mesurer ses dimensions avant l'animation visible.

*   **Mondes Paralleles**
    *   **Definition** : Mobile et Desktop sont des topologies separees partageant la meme "Ame" (Etat).

*   **Controles Verre Cinematique**
    *   **Definition** : Couche de controle en verre depoli pour lecteurs media. Entree depuis les flancs avec physique spring, auto-masquage apres inactivite.

---

### 3. ETATS & PHYSIQUE

*   **Phase Etheree** : Etat transitoire d'un element pendant son mouvement.
*   **Tension Spatiale** : Sensation de "poids" via des ressorts, jamais de timing lineaire.
*   **Tissage de Phases** : Chevauchement des animations aux seuils 55%/65%.
*   **Elan Directionnel** : Timings asymetriques selon la direction (Compression vs Depliage).
*   **Mutation Cartographique** : Mutation a l'execution des constantes d'animation.
*   **Persistance du Vaisseau** : Le conteneur ne se demonte jamais.
*   **Capture de Rect** : `getBoundingClientRect()` avant une transition spatiale.
*   **Trappe Inversee** : `padding-bottom: 100vh` temporaire pour permettre le scroll.
*   **Verrouillage Doux** : Scroll anime vers la zone de tete.
*   **Strategie Tampon** : Trappe Inversee + Verrouillage Doux combines.
*   **Retour Pendulaire** : Chaque animation aller a un inverse temporel exact.
*   **Stratum Z Conditionnel** : Z-index dynamiques selon l'etat de l'application.
*   **Isolation de Contexte d'Empilement** : Extraire les elements des parents animes.

---

### 4. CONSTANTES PHYSIQUES

| Nom | Stiffness | Damping | Mass | Usage |
|-----|-----------|---------|------|-------|
| **SOUL_PHYSICS** | 105 | 18 | 1 | General, morphing |
| **REFLEX_PHYSICS** | 350 | 25 | 0.7 | Interactions, clics |
| **DREAM_PHYSICS** | 40 | 20 | 2 | Mouvement ambiant |
| **EXPANSION_PHYSICS** | 180 | 28 | 1 | Portal Expansion Flow |
| **CONTROL_PHYSICS** | 200 | 25 | - | Barres d'outils, controles |
| **CHRYSALIS_EASE** | `[0.4, 0, 0.2, 1]` | | | Courbe Chrysalis Shift |
