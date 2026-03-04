# Reflex Matrix Protocol (v1.1)

The **Reflex Matrix** protocol defines an organic interaction where a parent component (the Matrix) generates child components through spatial expansion and reabsorbs them via inverse flow. This is a cornerstone of the "Glass Sanctuary" aesthetic.

## 1. Core Principles

### A. Fixity and Physics
*   **Y-Axis**: Absolute spatial fixity. Movement must be perceived as growth/decay rather than arbitrary displacement.
*   **SOUL_PHYSICS**: Mandatory use of spring physics.
    *   `stiffness`: 200 (Instant structural lock).
    *   `damping`: 25 (Prevents parasitic oscillations).
    *   `mass`: 1.

### B. The Connective Tissue (Gooey Membrane)
Visual fusion between the Matrix and its Children is achieved via a SVG filter applied to the parent:
*   `feGaussianBlur` (stdDeviation: 8-12): Creates edge fusion.
*   `feColorMatrix` (Alpha Matrix): Re-contracts edges to simulate a viscous membrane.
*   **Golden Rule**: The parent MUST have sufficient padding (min 8px) to prevent blur clipping.

## 2. Matrix States

1.  **Compression (Absorption)**:
    *   Children are stored within the internal structure.
    *   **Hull (z-20)** is active with `backdrop-blur-md`.
    *   **Synaptic Strokes** (borders) are shared or masked to give the illusion of a single unit.
2.  **Expansion (Birth/Reflex)**:
    *   The parent stretches.
    *   **Centering**: Auto-scroll offset 152px.
    *   A new **Matrix Cell** emerges, deforming the parent's membrane (Metaballs effect).
3.  **Independence (Detachment)**:
    *   The viscous link breaks.
    *   The **Hull** vanishes.
    *   **Segments (z-10)** activate their own `backdrop-blur`.
    *   The child acquires its own shadow and depth.

## 3. Trigger Mechanism
The **Trigger** is usually a high-intent action. Upon activation, the Matrix undergoes a "Reflex Action":
*   The parent expands to accommodate new information cells.
*   Existing cells reposition themselves using `MATRICE_PHYSICS` to maintain structural integrity.

## 4. Reverse Spatial Flow
Every birth must be reversible. Reabsorption must follow the exact inverse path, with `layoutId` ensuring the entity "returns to its place" in the Matrix tissue.

## 5. Use Case: The Opportunity Matrix

When a critical opportunity appears, it is "expelled" by the navigation matrix.

### Opportunity Card Architecture
1.  **Reflex Matrix Parent**: Carries the Gooey Filter (`#opportunity-gooey`).
2.  **Matrix Cells (Initial: x3)**: 
    *   *Header Cell*: Icon and "URGENT" badge.
    *   *Body Cell*: Title and description.
    *   *Action Cell*: Call to action button.
3.  **Reflex Transformation**: Upon clicking the Action Cell, the Matrix expels secondary **Matrix Cells** (Steps) between the Body and the Action Cell.

## 6. Master Prompt for Reflex Matrix Generation

"Generate a React component using the Reflex Matrix protocol. The parent must be a `motion.div` with `layout` and a SVG Gooey Filter (stdDeviation 10, feColorMatrix). Include 3 background `Matrix Cells` with segmented borders. The entry animation must use `SOUL_PHYSICS` (stiffness 200) on the Y-axis only. Texts must remain sharp via a `feComposite atop` operation."

## 7. Spatial Flow Manifesto (Enriched)

*   **Void is Tension**: Between each Matrix Cell, space is not empty; it is waiting for fusion.
*   **Information is Organic**: Text is not just placed; it inhabits a Matrix Cell.
*   **Total Reversibility**: If a user dismisses an opportunity, the Matrix must "inhale" the segments in reverse order.
*   **Synaptic Strokes**: Borders are not frames, but synapses. They thin during stretch and thicken during compression.
*   **The Matrix is Omnipresent**: Any static container is an anomaly. Every content block should be treated as a potential segment of a larger Mother Matrix.

---
---
---

# Protocole Matrice Réflexe (v1.1)

Le protocole **Matrice Réflexe** définit une interaction organique où un composant parent (la Matrice) génère des composants enfants par expansion spatiale et les réabsorbe via un flux inverse. C'est une pierre angulaire de l'esthétique "Sanctuaire de Verre".

## 1. Principes Fondamentaux

### A. Fixité et Physique
*   **Axe Y** : Fixité spatiale absolue. Le mouvement doit être perçu comme croissance/décroissance plutôt que déplacement arbitraire.
*   **SOUL_PHYSICS** : Usage obligatoire de la physique des ressorts.
    *   `stiffness` (Raideur) : 200 (Verrouillage structurel instantané).
    *   `damping` (Amortissement) : 25 (Empêche les oscillations parasites).
    *   `mass` (Masse) : 1.

### B. Le Tissu Connectif (Membrane Visqueuse)
La fusion visuelle entre la Matrice et ses Enfants est réalisée via un filtre SVG appliqué au parent :
*   `feGaussianBlur` (stdDeviation: 8-12) : Crée la fusion des bords.
*   `feColorMatrix` (Alpha Matrix) : Re-contracte les bords pour simuler une membrane visqueuse.
*   **Règle d'Or** : Le parent DOIT avoir un padding suffisant (min 8px) pour éviter la coupure du flou.

## 2. États de la Matrice

1.  **Compression (Absorption)** :
    *   Les enfants sont stockés dans la structure interne.
    *   **Coque (Hull, z-20)** est active avec `backdrop-blur-md`.
    *   **Traits Synaptiques** (bordures) sont partagés ou masqués pour donner l'illusion d'une unité unique.
2.  **Expansion (Naissance/Réflexe)** :
    *   Le parent s'étire.
    *   **Centrage** : Auto-scroll offset 152px.
    *   Une nouvelle **Cellule Matrice** émerge, déformant la membrane du parent (effet Metaballs).
3.  **Indépendance (Détachement)** :
    *   Le lien visqueux se rompt.
    *   La **Coque** disparaît.
    *   **Segments (z-10)** activent leur propre `backdrop-blur`.
    *   L'enfant acquiert sa propre ombre et profondeur.

## 3. Mécanisme de Déclenchement
Le **Déclencheur** est généralement une action à haute intention. À l'activation, la Matrice subit une "Action Réflexe" :
*   Le parent s'étend pour accueillir de nouvelles cellules d'information.
*   Les cellules existantes se repositionnent en utilisant `MATRICE_PHYSICS` pour maintenir l'intégrité structurelle.

## 4. Flux Spatial Inversé
Toute naissance doit être réversible. La réabsorption doit suivre le chemin inverse exact, avec `layoutId` assurant que l'entité "retourne à sa place" dans le tissu de la Matrice.

## 5. Cas d'Usage : La Matrice d'Opportunité

Lorsqu'une opportunité critique apparaît, elle est "expulsée" par la matrice de navigation.

### Architecture de la Carte Opportunité
1.  **Parent Matrice Réflexe** : Porte le Filtre Visqueux (`#opportunity-gooey`).
2.  **Cellules Matrices (Initial : x3)** :
    *   *Cellule En-tête* : Icône et badge "URGENT".
    *   *Cellule Corps* : Titre et description.
    *   *Cellule Action* : Bouton d'appel à l'action.
3.  **Transformation Réflexe** : Au clic sur la Cellule Action, la Matrice expulse des **Cellules Matrices** secondaires (Étapes) entre le Corps et la Cellule Action.

## 6. Prompt Maître pour Génération de Matrice Réflexe

"Génère un composant React utilisant le protocole Matrice Réflexe. Le parent doit être un `motion.div` avec `layout` et un filtre SVG Gooey (stdDeviation 10, feColorMatrix). Inclus 3 `Cellules Matrices` d'arrière-plan avec bordures segmentées. L'animation d'entrée doit utiliser `SOUL_PHYSICS` (stiffness 200) sur l'axe Y uniquement. Les textes doivent rester nets via une opération `feComposite atop`."

## 7. Manifeste Spatial Flow (Enrichi)

*   **Le Vide est Tension** : Entre chaque Cellule Matrice, l'espace n'est pas vide ; il attend la fusion.
*   **L'Information est Organique** : Le texte n'est pas juste placé ; il habite une Cellule Matrice.
*   **Réversibilité Totale** : Si un utilisateur rejette une opportunité, la Matrice doit "inhaler" les segments dans l'ordre inverse.
*   **Traits Synaptiques** : Les bordures ne sont pas des cadres, mais des synapses. Elles s'affinent pendant l'étirement et s'épaississent pendant la compression.
*   **La Matrice est Omniprésente** : Tout conteneur statique est une anomalie. Chaque bloc de contenu doit être traité comme un segment potentiel d'une Matrice Mère plus grande.
