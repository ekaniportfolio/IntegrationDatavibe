# DataVibe Design System Guidelines

> **Manifesto v3.0 (Agnostic Unified)**: This document is the absolute source of truth. It dictates not just the *look* of DataVibe, but its *physics*, *spatial logic*, and *implementation strictures*, unified with the Agnostic Spatial Flow protocols.

---

## 1. Visiomorphic Design Philosophy

DataVibe follows a **Visiomorphic** design language: UI elements are not flat planes; they are living objects made of "glass" and "light" that travel through space.

### 1.1 The "Soul Physics" (Physics of the Soul)
All motion must adhere to the **Soul Physics** constants to ensure weight and elasticity.
*   **Standard Soul (RAU/TAF)**: Used for general UI movement.
    *   `stiffness: 105`, `damping: 18`, `mass: 1`
*   **Elastic Soul (Reflex Matrix)**: Used for "popping" elements.
    *   `stiffness: 350`, `damping: 25`, `mass: 0.7`
*   **Expansion Soul**: Used for smooth resizing.
    *   `stiffness: 280`, `damping: 30`

### 1.2 The "Single Soul" Rule (Law of Permanence)
**Conservation of Digital Mass**: An object (e.g., a "Search Bar" or "Opportunity Card") that exists in View A and View B is the *same object*. It cannot vanish; it must physically travel, morph, or divide.

### 1.3 Spatial Flow Speed
The global velocity of the application is controlled by `SPATIAL_FLOW_SPEED` (Default: `2.0`). All durations must be calculated relative to this constant (`baseDuration / SPATIAL_FLOW_SPEED`).

---

## 2. Typography Architecture

### Branding (Logo)
*   **Font**: `Datavibe` (Custom, Bold).
*   **Usage**: EXCLUSIVELY for the main application logo.
*   **Responsive Modes**:
    *   `--text-logo-mobile`: 28px
    *   `--text-logo-tablet`: 36px
    *   `--text-logo-desktop`: 48px
*   **Implementation**: Use `.text-logo-default` (Product) or `.text-logo-splash` (Splash Screen).

### Product (UI)
*   **Font**: `Manrope` (Google Font).
*   **Usage**: All UI elements (Headings, Body, Captions).
*   **Weights**: Medium (500) for body, Bold (700) for emphasis.

---

## 3. Color System & Semantic Tokens

We use a strict **Semantic Token System**. Never use raw hex values.

### 3.1 The "Milky Indigo" Atmosphere (Light Mode)
*   **Background**: `var(--background)` (#FDFBFF) - White with a violet tint.
*   **Primary Action**: `var(--primary)` (#4F39F6) - Indigo-Violet Electric.
*   **Surfaces**: `var(--card)` / `var(--dashboard-card-bg)` (Glassmorphism with `backdrop-blur`).

### 3.2 Dashboard Semantics
Each vertical has a dedicated "Soul Color":
*   **Streaming**: `var(--dashboard-streaming)` (#FF5222 - Orange)
*   **Social**: `var(--dashboard-social)` (#1CB45B - Emerald)
*   **Radio**: `var(--dashboard-radio)` (#1286F3 - Blue)

### 3.3 Gradient Blocks (Reflex Matrix)
*   **Mother Block**: Red/Orange (`rgba(255, 78, 80, 0.1)`).
*   **Emerald Block**: Green (`rgba(16, 185, 129, 0.2)`).
*   **Amber Block**: Orange (`rgba(185, 120, 16, 0.2)`).
*   **Rule**: Backgrounds must be **10% opacity** (`0.1`), Borders **30% opacity** (`0.3`).

---

## 4. Reflex Matrix (RM) Architecture

The Reflex Matrix is the core interaction pattern for "Opportunities", implementing the **Inverse Trapdoor** protocol.

### 4.1 The "Ghost Measurement" Pattern (Virtual Measurement)
*   **Problem**: Animating `height: auto` causes layout shifts.
*   **Solution**: Render a "Ghost" version (`opacity-0`, `pointer-events-none`) of the content, measure its `offsetHeight` via `useLayoutEffect`, and apply that exact pixel value to the visible container.
*   **Constraint**: Never animate height without a target pixel value.

### 4.2 The Mitosis Protocol
*   **Definition**: The separation of the "Mother" block into distinct child segments (Organic Expansion).
*   **Color Morphing**: Segments start as "Mother Color" and morph to their target color (Emerald/Amber) over **4 seconds** (`duration: 4`).
*   **Strict Opacity**: See Section 3.3.

### 4.3 Interaction Sequencing (The Narrative)
1.  **Invitation ("Comment faire") -> "Inverse Trapdoor"**:
    *   **Phase A (Buffer)**: Inject `pb-[100vh]` via state (`isScrolling`) to create space.
    *   **Phase B (Soft Lock)**: Scroll **Top of Component** to 10rem from viewport top.
    *   **Phase C (Mitosis)**: Trigger expansion only AFTER scroll aligns.
2.  **Action ("Juste pour moi") -> "Soft Lock Retraction"**:
    *   **Action**: Triggers Button Retraction.
    *   **Scroll Target**: The **Button Itself** aligns to 10rem from viewport top (using `BUTTON_EJECTION` offset).
    *   **Constraint**: The scroll MUST complete before the button morphs.

---

## 5. Spatial Flow Protocols

### 5.1 The Side Stage Rule (Lateral Entry)
Elements must never just "fade in". They must travel from the "Side Stage".
*   **Offset**: Minimum **+/- 400px** (`x: 400` or `x: -400`).
*   **Blur**: `filter: blur(12px)` -> `blur(0px)`.
*   **Direction**:
    *   `dir > 0`: Content enters from **Right** (-400px start), exits to **Left**.
    *   `dir < 0`: Content enters from **Left** (400px start), exits to **Right**.

### 5.2 Lateral Glide (Kinetic List Entry)
For lists, use alternating lateral slides to "weave" content into reality.
*   **Evens (0, 2, 4)**: Slide from **Left** (`x: -20px` -> `0`).
*   **Odds (1, 3, 5)**: Slide from **Right** (`x: +20px` -> `0`).
*   **Physics**: `stiffness: 140, damping: 18`.

### 5.3 Sequential Spatial Cascade (SSC)
Strict timing for view transitions (Relative to T=0):
*   **T+0.0s**: Architecture (Backgrounds).
*   **T+0.4s**: Navigation/Tabs.
*   **T+0.7s**: Main Container Stabilization.
*   **T+0.8s**: Body Content (Staggered).
*   **T+1.3s**: Footer/Floating Actions.

### 5.4 Sequential Grid (The Checkerboard)
For reordering elements:
*   **Orthogonal Only**: Move ONLY on X axis, THEN on Y axis. Never diagonal.
*   **Turn-Based**: Item A moves, then Item B moves.

### 5.5 DAR (Astral Descent Return)
For "Close", "Back to Home", or "Cancel" actions:
*   **Movement**: Strict Vertical Downward (`y: [0, 1000]`).
*   **Meaning**: "Dropping the context to return to the foundation."

### 5.6 The Anchor Protocol (Layout Thrashing Prevention)
**CRITICAL**: When transitioning between Full Page Views (e.g., Standard Dashboard <-> Full Dashboard), simple `opacity` fading leaves the hidden element in the DOM flow, causing massive whitespace.
*   **Hidden State**: Must use `position: fixed`, `top: 0`, `width: 100%`. This removes the element from the flow while keeping it renderable for exit animations.
*   **Visible State**: Must return to `position: relative` to allow natural scrolling.
*   **Implementation**: Apply these properties directly in the Framer Motion `variants`, NOT via conditional CSS classes (which trigger too late).

---

## 6. Cross-Platform Strategy ("Parallel Worlds")

### 6.1 Two Worlds, One Soul
*   **Mobile & Desktop**: Distinct topologies with their own spatial rules, but sharing the same State and Identity.
*   **Mobile**: Touch-first (Swipe/Carousel).
*   **Desktop**: Mouse-first (Grid/Masonry/Hovers).

### 6.2 Single Source of Truth (SSOT)
*   **Data**: `OPPORTUNITY_DATA` (Object) holds all text, steps, and social proof.
*   **Injection**: Data is passed as props. No hardcoded text in components.

### 6.3 View Bifurcation
*   **Desktop**: Grid / Masonry layout.
*   **Mobile**: Swipe / Carousel interaction using `react-use-gesture`.
*   **Unification**: Both views render the **SAME** `<ReflexOpportunity />` component.

---

## 7. Strict Prohibitions (The "Don'ts")

1.  **No "Group-Hover" Shortcuts**: Use Framer Motion `variants` (`whileHover`) for complex interactions (e.g., expanding circles).
2.  **No Z-Index Wars**: Use proper DOM ordering or specific "Slot" components.
3.  **No Magic Numbers**: Use the "Ghost Measurement" pattern for heights.
4.  **No Fragmented Data**: `OPPORTUNITY_DATA` is the only truth.
5.  **Do Not Modify the Transition Vault**: The `getHorizontalSlideVariants` function in `NewPlatform.tsx` is sacred.
6.  **No Default Styling Reliance**: Always explicitly set styling (gap/typography) to override base component defaults.
7.  **No "Instant" Color Changes in RM**: Mitosis color shifts must take 4 seconds.
8.  **No Diagonal Movement in Grids**: Strictly Orthogonal (X then Y).

## 8. Spacing & Layout Standards

### 8.1 The "Single Truth" Gap (22px)
*   **Definition**: The standard vertical gap between all structural blocks (Segments, Internal Sections) is strictly **22px**.
*   **Implementation**: Use `gap-[22px]` or `style={{ gap: 22 }}`.
*   **Prohibition**: Do not use `gap-5` (20px) or `gap-6` (24px) for block spacing.
*   **Goal**: Ensure consistent "aeration" of the interface.

### 8.2 Form Input Spacing (Label-Input Gap)
*   **Definition**: The vertical gap between a Label and its Input Field is strictly **8px** (0.5rem).
*   **Implementation**: Use `gap-2` in a Flex Column layout.
*   **Goal**: Create a distinct but connected relationship between the label and its input.

## 9. Dashboard Component Architecture (Circular/Legend Blocks)

For components combining a circular visualization (Chart) and a Legend (Text) within a dashboard tile:

1.  **Container Fluidity**:
    *   **Structure**: The root container must be `w-full h-full` to fill its grid cell.
    *   **Prohibition**: Do NOT apply `max-w` or fixed widths on the root component itself. Let the parent grid/layout control the width.
    *   **Centering**: Use `mx-auto` only if explicitly required by a specific layout context, but prefer `w-full` for standard tiles.

2.  **Internal Layout**:
    *   **Flexbox**: Use `flex items-center justify-center gap-[12px]` to align the Chart and Legend.
    *   **Segmentation**: Explicitly separate the "Chart" (Vector/SVG) and "Legend" (Text lists) into distinct sub-components (e.g., `<ChartFrame />`, `<LegendFrame />`).

3.  **Background Strategy**:
    *   **Application**: Apply the background color/opacity (e.g., `bg-[rgba(6,2,13,0.5)]`) directly to the root fluid container.
    *   **Visual Integrity**: Ensure the background stretches to fill the entire available tile space.

## 10. UI Patterns & Data Visualization

### 10.1 Trends & Indicators
*   **Positive/Growth**: Use Green (`#4CAF50` or semantic equivalent) + **Upward Arrow**.
*   **Negative/Decline**: Use Red (`#F44336` or semantic equivalent) + **Downward Arrow**.
*   **Implementation**: Ensure icons are oriented correctly:
    *   Check original SVG direction.
    *   Use `scale-y-100` (normal) or `-scale-y-100` (flipped) as needed to enforce the visual direction.
    *   **Red + Up Arrow** is forbidden (unless specifically "Increase in Bad Thing").
    *   **Green + Down Arrow** is forbidden (unless specifically "Decrease in Bad Thing").

---
---
---

# Lignes Directrices du Design System DataVibe

> **Manifeste v3.0 (Agnostique Unifié)** : Ce document est la source de vérité absolue. Il dicte non seulement l'*apparence* de DataVibe, mais sa *physique*, sa *logique spatiale*, et ses *structures d'implémentation*, unifiées avec les protocoles Spatial Flow Agnostiques.

---

## 1. Philosophie de Design Visiomorphique

DataVibe suit un langage de design **Visiomorphique** : les éléments UI ne sont pas des plans plats ; ce sont des objets vivants faits de "verre" et de "lumière" qui voyagent à travers l'espace.

### 1.1 La "Physique de l'Âme" (Soul Physics)
Tout mouvement doit adhérer aux constantes de la **Physique de l'Âme** pour assurer poids et élasticité.
*   **Âme Standard (RAU/TAF)** : Utilisée pour le mouvement UI général.
    *   `stiffness: 105`, `damping: 18`, `mass: 1`
*   **Âme Élastique (Matrice Réflexe)** : Utilisée pour les éléments qui "pop".
    *   `stiffness: 350`, `damping: 25`, `mass: 0.7`
*   **Âme d'Expansion** : Utilisée pour le redimensionnement fluide.
    *   `stiffness: 280`, `damping: 30`

### 1.2 La Règle de l'"Âme Unique" (Loi de Permanence)
**Conservation de la Masse Numérique** : Un objet (ex: une "Barre de Recherche" ou une "Carte Opportunité") qui existe dans la Vue A et la Vue B est le *même objet*. Il ne peut pas disparaître ; il doit physiquement voyager, se métamorphoser ou se diviser.

### 1.3 Vitesse Spatial Flow (SFS)
La vélocité globale de l'application est contrôlée par `SPATIAL_FLOW_SPEED` (Défaut : `2.0`). Toutes les durées doivent être calculées relativement à cette constante (`baseDuration / SPATIAL_FLOW_SPEED`).

---

## 2. Architecture Typographique

### Branding (Logo)
*   **Police** : `Datavibe` (Personnalisée, Gras).
*   **Usage** : EXCLUSIVEMENT pour le logo principal de l'application.
*   **Modes Responsifs** :
    *   `--text-logo-mobile` : 28px
    *   `--text-logo-tablet` : 36px
    *   `--text-logo-desktop` : 48px
*   **Implémentation** : Utilisez `.text-logo-default` (Produit) ou `.text-logo-splash` (Écran Splash).

### Produit (UI)
*   **Police** : `Manrope` (Google Font).
*   **Usage** : Tous les éléments UI (Titres, Corps, Légendes).
*   **Graisses** : Medium (500) pour le corps, Bold (700) pour l'emphase.

---

## 3. Système de Couleurs & Jetons Sémantiques

Nous utilisons un **Système de Jetons Sémantiques** strict. N'utilisez jamais de valeurs hexadécimales brutes.

### 3.1 L'Atmosphère "Indigo Laiteux" (Mode Clair)
*   **Arrière-plan** : `var(--background)` (#FDFBFF) - Blanc avec une teinte violette.
*   **Action Primaire** : `var(--primary)` (#4F39F6) - Indigo-Violet Électrique.
*   **Surfaces** : `var(--card)` / `var(--dashboard-card-bg)` (Glassmorphism avec `backdrop-blur`).

### 3.2 Sémantique des Dashboards
Chaque verticale a une "Couleur d'Âme" dédiée :
*   **Streaming** : `var(--dashboard-streaming)` (#FF5222 - Orange)
*   **Social** : `var(--dashboard-social)` (#1CB45B - Émeraude)
*   **Radio** : `var(--dashboard-radio)` (#1286F3 - Bleu)

### 3.3 Blocs Dégradés (Matrice Réflexe)
*   **Bloc Mère** : Rouge/Orange (`rgba(255, 78, 80, 0.1)`).
*   **Bloc Émeraude** : Vert (`rgba(16, 185, 129, 0.2)`).
*   **Bloc Ambre** : Orange (`rgba(185, 120, 16, 0.2)`).
*   **Règle** : Les arrière-plans doivent être à **10% d'opacité** (`0.1`), les Bordures à **30% d'opacité** (`0.3`).

---

## 4. Architecture Matrice Réflexe (RM)

La Matrice Réflexe est le modèle d'interaction cœur pour les "Opportunités", implémentant le protocole de **Trappe Inversée**.

### 4.1 Le Motif "Mesure Fantôme" (Mesure Virtuelle)
*   **Problème** : Animer `height: auto` cause des sauts de mise en page.
*   **Solution** : Rendre une version "Fantôme" (`opacity-0`, `pointer-events-none`) du contenu, mesurer sa `offsetHeight` via `useLayoutEffect`, et appliquer cette valeur exacte en pixels au conteneur visible.
*   **Contrainte** : Ne jamais animer la hauteur sans une valeur cible en pixels.

### 4.2 Le Protocole de Mitose
*   **Définition** : La séparation du bloc "Mère" en segments enfants distincts (Expansion Organique).
*   **Morphing de Couleur** : Les segments commencent à la "Couleur Mère" et se métamorphosent vers leur couleur cible (Émeraude/Ambre) sur **4 secondes** (`duration: 4`).
*   **Opacité Stricte** : Voir Section 3.3.

### 4.3 Séquençage d'Interaction (La Narration)
1.  **Invitation ("Comment faire") -> "Trappe Inversée"** :
    *   **Phase A (Tampon)** : Injecter `pb-[100vh]` via l'état (`isScrolling`) pour créer de l'espace.
    *   **Phase B (Verrouillage Doux)** : Faire défiler le **Haut du Composant** à 10rem du haut du viewport.
    *   **Phase C (Mitose)** : Déclencher l'expansion seulement APRÈS l'alignement du scroll.
2.  **Action ("Juste pour moi") -> "Rétraction Verrouillage Doux"** :
    *   **Action** : Déclenche la Rétraction du Bouton.
    *   **Cible de Scroll** : Le **Bouton Lui-même** s'aligne à 10rem du haut du viewport (en utilisant le décalage `BUTTON_EJECTION`).
    *   **Contrainte** : Le scroll DOIT se terminer avant que le bouton ne se métamorphose.

---

## 5. Protocoles Spatial Flow

### 5.1 La Règle de la Scène Latérale (Entrée Latérale)
Les éléments ne doivent jamais juste "apparaître en fondu". Ils doivent voyager depuis la "Scène Latérale".
*   **Décalage** : Minimum **+/- 400px** (`x: 400` ou `x: -400`).
*   **Flou** : `filter: blur(12px)` -> `blur(0px)`.
*   **Direction** :
    *   `dir > 0` : Le contenu entre par la **Droite** (départ -400px), sort vers la **Gauche**.
    *   `dir < 0` : Le contenu entre par la **Gauche** (départ 400px), sort vers la **Droite**.

### 5.2 Glissement Latéral (Entrée de Liste Cinétique)
Pour les listes, utilisez des glissements latéraux alternés pour "tisser" le contenu dans la réalité.
*   **Pairs (0, 2, 4)** : Glissent depuis la **Gauche** (`x: -20px` -> `0`).
*   **Impairs (1, 3, 5)** : Glissent depuis la **Droite** (`x: +20px` -> `0`).
*   **Physique** : `stiffness: 140, damping: 18`.

### 5.3 Cascade Spatiale Séquentielle (SSC)
Timing strict pour les transitions de vue (Relatif à T=0) :
*   **T+0.0s** : Architecture (Arrière-plans).
*   **T+0.4s** : Navigation/Onglets.
*   **T+0.7s** : Stabilisation du Conteneur Principal.
*   **T+0.8s** : Contenu du Corps (Décalé/Staggered).
*   **T+1.3s** : Pied de page/Actions Flottantes.

### 5.4 Grille Séquentielle (Le Damier)
Pour la réorganisation d'éléments :
*   **Orthogonal Seulement** : Bouger UNIQUEMENT sur l'axe X, PUIS sur l'axe Y. Jamais en diagonale.
*   **Tour par Tour** : L'élément A bouge, puis l'élément B bouge.

### 5.5 DAR (Descente Astrale de Retour)
Pour les actions "Fermer", "Retour Accueil", ou "Annuler" :
*   **Mouvement** : Vertical Descendant Strict (`y: [0, 1000]`).
*   **Signification** : "Laisser tomber le contexte pour retourner aux fondations."

### 5.6 Le Protocole d'Ancrage (Prévention du Layout Thrashing)
**CRITIQUE** : Lors de la transition entre des Vues Pleine Page (ex: Dashboard Standard <-> Dashboard Full), un simple fondu d'`opacity` laisse l'élément caché dans le flux du DOM, causant un espace blanc massif.
*   **État Caché** : Doit utiliser `position: fixed`, `top: 0`, `width: 100%`. Cela retire l'élément du flux tout en le gardant rendu pour les animations de sortie.
*   **État Visible** : Doit retourner à `position: relative` pour permettre le défilement naturel.
*   **Implémentation** : Appliquez ces propriétés directement dans les `variants` Framer Motion, PAS via des classes CSS conditionnelles (qui se déclenchent trop tard).

---

## 6. Stratégie Cross-Platform ("Mondes Parallèles")

### 6.1 Deux Mondes, Une Âme
*   **Mobile & Desktop** : Topologies distinctes avec leurs propres règles spatiales, mais partageant le même État et Identité.
*   **Mobile** : Tactile d'abord (Swipe/Carousel).
*   **Desktop** : Souris d'abord (Grille/Masonry/Survols).

### 6.2 Source de Vérité Unique (SSOT)
*   **Données** : `OPPORTUNITY_DATA` (Objet) contient tout le texte, les étapes, et la preuve sociale.
*   **Injection** : Les données sont passées comme props. Pas de texte codé en dur dans les composants.

### 6.3 Bifurcation de Vue
*   **Desktop** : Mise en page Grille / Masonry.
*   **Mobile** : Interaction Swipe / Carousel utilisant `react-use-gesture`.
*   **Unification** : Les deux vues rendent le **MÊME** composant `<ReflexOpportunity />`.

---

## 7. Interdictions Strictes (Les "Ne Pas Faire")

1.  **Pas de Raccourcis "Group-Hover"** : Utilisez les `variants` Framer Motion (`whileHover`) pour les interactions complexes (ex: cercles s'agrandissant).
2.  **Pas de Guerres de Z-Index** : Utilisez un ordonnancement DOM propre ou des composants "Slot" spécifiques.
3.  **Pas de Nombres Magiques** : Utilisez le motif "Mesure Fantôme" pour les hauteurs.
4.  **Pas de Données Fragmentées** : `OPPORTUNITY_DATA` est la seule vérité.
5.  **Ne Pas Modifier le Coffre de Transition** : La fonction `getHorizontalSlideVariants` dans `NewPlatform.tsx` est sacrée.
6.  **Pas de Dépendance au Style par Défaut** : Définissez toujours explicitement le style (gap/typo) pour écraser les défauts des composants de base.
7.  **Pas de Changements de Couleur "Instantanés" dans RM** : Les changements de couleur de la mitose doivent prendre 4 secondes.
8.  **Pas de Mouvement Diagonal dans les Grilles** : Strictement Orthogonal (X puis Y).

## 8. Standards d'Espacement & Mise en Page

### 8.1 L'Écart de "Vérité Unique" (22px)
*   **Définition** : L'écart vertical standard entre tous les blocs structurels (Segments, Sections Internes) est strictement de **22px**.
*   **Implémentation** : Utilisez `gap-[22px]` ou `style={{ gap: 22 }}`.
*   **Interdiction** : N'utilisez pas `gap-5` (20px) ou `gap-6` (24px) pour l'espacement des blocs.
*   **But** : Assurer une "aération" cohérente de l'interface.

### 8.2 Espacement des Champs de Formulaire (Label-Input)
*   **Définition** : L'écart vertical entre un Libellé (Label) et son Champ de Saisie est strictement de **8px** (0.5rem).
*   **Implémentation** : Utilisez `gap-2` dans une disposition Flex Column.
*   **But** : Créer une relation distincte mais connectée entre le libellé et son entrée.

## 9. Architecture de Composant Dashboard (Blocs Circulaire/Légende)

Pour les composants combinant une visualisation circulaire (Chart) et une Légende (Texte) au sein d'une tuile de dashboard :

1.  **Fluidité du Conteneur** :
    *   **Structure** : Le conteneur racine doit être `w-full h-full` pour remplir sa cellule de grille.
    *   **Interdiction** : N'appliquez PAS `max-w` ou des largeurs fixes sur le composant racine lui-même. Laissez la grille/mise en page parente contrôler la largeur.
    *   **Centrage** : Utilisez `mx-auto` seulement si explicitement requis par un contexte de mise en page spécifique, mais préférez `w-full` pour les tuiles standard.

2.  **Mise en Page Interne** :
    *   **Flexbox** : Utilisez `flex items-center justify-center gap-[12px]` pour aligner le Chart et la Légende.
    *   **Segmentation** : Séparez explicitement le "Chart" (Vecteur/SVG) et la "Légende" (Listes de texte) en sous-composants distincts (ex: `<ChartFrame />`, `<LegendFrame />`).

3.  **Stratégie d'Arrière-plan** :
    *   **Application** : Appliquez la couleur/opacité d'arrière-plan (ex: `bg-[rgba(6,2,13,0.5)]`) directement au conteneur fluide racine.
    *   **Intégrité Visuelle** : Assurez-vous que l'arrière-plan s'étire pour remplir tout l'espace de tuile disponible.

## 10. Motifs UI & Visualisation de Données

### 10.1 Tendances & Indicateurs
*   **Positif/Croissance** : Utilisez Vert (`#4CAF50` ou équivalent sémantique) + **Flèche Vers le Haut**.
*   **Négatif/Déclin** : Utilisez Rouge (`#F44336` ou équivalent sémantique) + **Flèche Vers le Bas**.
*   **Implémentation** : Assurez-vous que les icônes sont orientées correctement :
    *   Vérifiez la direction originale du SVG.
    *   Utilisez `scale-y-100` (normal) ou `-scale-y-100` (inversé) selon le besoin pour forcer la direction visuelle.
    *   **Rouge + Flèche Haut** est interdit (sauf si spécifiquement "Augmentation d'une Mauvaise Chose").
    *   **Vert + Flèche Bas** est interdit (sauf si spécifiquement "Diminution d'une Mauvaise Chose").
