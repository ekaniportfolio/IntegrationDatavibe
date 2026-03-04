# DataVibe Animation & Motion System
## Technical Implementation Guide

This document provides technical implementation details for the "Visiomorphic" animations and "Spatial Flow" used in DataVibe.

### 1. The Visiomorphic Concept

Visiomorphism implies that UI elements have "physical permanence". They don't just disappear; they transform.

#### Canonical Example: Search to Sync

The transition from the Search Input to the Loading Circle is our flagship animation.

**The Physics:**
1.  **Phase 1: Clearance (Exit)** (0.4s)
    *   Surrounding elements (Buttons, Titles, Results) exit the stage.
    *   *Direction*: Elements leave away from the center or towards their origin.
2.  **Phase 2: Morphing** (0.5s)
    *   The Input container (`motion.div`) changes geometry.
    *   `width`: 100% -> 80px
    *   `borderRadius`: 16px -> 40px (Circle)
    *   *Constraint*: The element MUST NOT be unmounted. It is the same React Component instance.
3.  **Phase 3: The Reveal (Entry)** (0.4s)
    *   The internal content switches (Input fades out, Icon fades in).
    *   The Loading Gauge spins *around* the stable container.

### 2. Implementation Guide (React + Motion)

#### Shared Layout ID
To morph two different components across the DOM tree, use `layoutId`.

```tsx
<motion.div layoutId="shared-element-id">
  {/* Content */}
</motion.div>
```

#### The "Unified State" Pattern
For complex sequences within the same page (like Onboarding), avoid unmounting the container. Use a single component that changes its style props based on state.

```tsx
// ✅ Correct Pattern
<motion.div 
  animate={ step === 'sync' ? { width: 80, borderRadius: 40 } : { width: "100%", borderRadius: 16 } }
/>
```

#### Spatial Flow Coordinates
We use consistent coordinates for exits/entries to build a mental map.

*   **Left Exit**: `x: -200` (Implies moving to "Back")
*   **Right Exit**: `x: 200` (Implies moving to "Next")
*   **Top Exit**: `y: -200` (Implies "Ascension" or "Sending")
*   **Bottom Exit**: `y: 200` (Implies "Dropping" or "Canceling")

### 3. Troubleshooting Common Issues

*   **Distortion on Text**: When a container morphs, its children might squash.
    *   *Fix*: Apply `layout="position"` to children or inverse scale logic (advanced).
    *   *Simple Fix*: Fade out text *before* the morph starts.
*   **Layout Shifts**: Exiting elements cause the page to jump.
    *   *Fix*: Use `position: absolute` for elements that are exiting, or place them in a Grid/Flex container that doesn't collapse.

### 4. Chrysalis Shift (Content Transmutation)

The **Chrysalis Shift [CS]** is used when a container's inner content transforms completely while the container itself persists — like authentication form transitions (Sign-In ↔ Forgot Password).

**The Physics (Three-Phase Weave):**
1.  **Phase 1: Dissolution** (Content Exit)
    *   Elements exit one by one with stagger: `opacity: 1→0`, `y: 0→-8px`.
    *   Duration: `closeDuration + (N-1) * closeStagger`.
2.  **Phase 2: Breathing** (Height Animation)
    *   Starts at **55%** of Phase 1 completion.
    *   `maxHeight` animated with `ease: [0.4, 0, 0.2, 1]`, duration `t(0.4)`.
3.  **Phase 3: Emergence** (Content Entry)
    *   Starts at **65%** of Phase 2 completion.
    *   Elements enter with stagger: `opacity: 0→1`, `y: 8px→0`.
    *   Timings are direction-dependent (Directional Momentum).

**Directional Momentum:**
*   **Compression** (large card → small card): Faster entry (-50% delay, -31% duration, -33% stagger).
*   **Unfolding** (small card → large card): Snappy entry (-70% delay, -37% duration, -47% stagger).

**Implementation (Cartography Mutation):**
```tsx
// Mutate shared timings before view switch
ANIMATION_CARTOGRAPHY.authContent.open.delay = FORGOT_OPEN_DELAY;
ANIMATION_CARTOGRAPHY.authContent.open.duration = FORGOT_OPEN_DURATION;
ANIMATION_CARTOGRAPHY.authContent.open.stagger = FORGOT_OPEN_STAGGER;
setAuthView('forgot');
// Restore after render captures values
setTimeout(() => { /* restore originals */ }, 100);
```

*See `SPATIAL_FLOW_CHRYSALIS_SHIFT.md` for the full protocol.*

---
---
---

# Système d'Animation & Motion DataVibe
## Guide d'Implémentation Technique

Ce document fournit les détails d'implémentation technique pour les animations "Visiomorphiques" et le "Spatial Flow" utilisés dans DataVibe.

### 1. Le Concept Visiomorphique

Le visiomorphisme implique que les éléments d'interface ont une "permanence physique". Ils ne disparaissent pas simplement ; ils se transforment.

#### Exemple Canonique : Recherche vers Synchro

La transition de l'Input de Recherche vers le Cercle de Chargement est notre animation phare.

**La Physique :**
1.  **Phase 1 : Dégagement (Sortie)** (0.4s)
    *   Les éléments environnants (Boutons, Titres, Résultats) quittent la scène.
    *   *Direction* : Les éléments s'éloignent du centre ou vont vers leur origine.
2.  **Phase 2 : Morphing** (0.5s)
    *   Le conteneur Input (`motion.div`) change de géométrie.
    *   `width` : 100% -> 80px
    *   `borderRadius` : 16px -> 40px (Cercle)
    *   *Contrainte* : L'élément NE DOIT PAS être démonté. C'est la même instance de Composant React.
3.  **Phase 3 : La Révélation (Entrée)** (0.4s)
    *   Le contenu interne change (Input disparaît, Icône apparaît).
    *   La Jauge de Chargement tourne *autour* du conteneur stable.

### 2. Guide d'Implémentation (React + Motion)

#### Shared Layout ID (Identifiant de Mise en Page Partagé)
Pour métamorphoser deux composants différents à travers l'arbre DOM, utilisez `layoutId`.

```tsx
<motion.div layoutId="shared-element-id">
  {/* Contenu */}
</motion.div>
```

#### Le Motif "État Unifié"
Pour des séquences complexes au sein de la même page (comme l'Onboarding), évitez de démonter le conteneur. Utilisez un composant unique qui change ses propriétés de style basées sur l'état.

```tsx
// ✅ Motif Correct
<motion.div 
  animate={ step === 'sync' ? { width: 80, borderRadius: 40 } : { width: "100%", borderRadius: 16 } }
/>
```

#### Coordonnées Spatial Flow
Nous utilisons des coordonnées cohérentes pour les sorties/entrées afin de construire une carte mentale.

*   **Sortie Gauche** : `x: -200` (Implique aller vers "Retour")
*   **Sortie Droite** : `x: 200` (Implique aller vers "Suivant")
*   **Sortie Haut** : `y: -200` (Implique "Ascension" ou "Envoi")
*   **Sortie Bas** : `y: 200` (Implique "Chute" ou "Annulation")

### 3. Résolution des Problèmes Courants

*   **Distorsion du Texte** : Quand un conteneur se métamorphose, ses enfants peuvent s'écraser.
    *   *Correctif* : Appliquez `layout="position"` aux enfants ou une logique d'échelle inversée (avancé).
    *   *Correctif Simple* : Faites disparaître le texte *avant* que le morphing ne commence.
*   **Sauts de Mise en Page** : Les éléments sortants font sauter la page.
    *   *Correctif* : Utilisez `position: absolute` pour les éléments qui sortent, ou placez-les dans un conteneur Grid/Flex qui ne s'effondre pas.

### 4. Chrysalis Shift (Transmutation de Contenu)

Le **Chrysalis Shift [CS]** est utilisé quand le contenu intérieur d'un conteneur se transforme complètement tandis que le conteneur lui-même persiste — comme les transitions de formulaires d'authentification (Sign-In ↔ Mot de Passe Oublié).

**La Physique (Tissage en Trois Phases) :**
1.  **Phase 1 : Dissolution** (Sortie Contenu)
    *   Les éléments sortent un par un avec stagger : `opacity: 1→0`, `y: 0→-8px`.
    *   Durée : `closeDuration + (N-1) * closeStagger`.
2.  **Phase 2 : Respiration** (Animation Hauteur)
    *   Démarre à **55%** de l'achèvement de la Phase 1.
    *   `maxHeight` animé avec `ease: [0.4, 0, 0.2, 1]`, durée `t(0.4)`.
3.  **Phase 3 : Émergence** (Entrée Contenu)
    *   Démarre à **65%** de l'achèvement de la Phase 2.
    *   Les éléments entrent avec stagger : `opacity: 0→1`, `y: 8px→0`.
    *   Les timings dépendent de la direction (Élan Directionnel).

**Élan Directionnel :**
*   **Compression** (grande carte → petite carte) : Entrée rapide (-50% délai, -31% durée, -33% stagger).
*   **Dépliage** (petite carte → grande carte) : Entrée snap (-70% délai, -37% durée, -47% stagger).

**Implémentation (Mutation Cartographique) :**
```tsx
// Muter les timings partagés avant le changement de vue
ANIMATION_CARTOGRAPHY.authContent.open.delay = FORGOT_OPEN_DELAY;
ANIMATION_CARTOGRAPHY.authContent.open.duration = FORGOT_OPEN_DURATION;
ANIMATION_CARTOGRAPHY.authContent.open.stagger = FORGOT_OPEN_STAGGER;
setAuthView('forgot');
// Restaurer après que le rendu ait capté les valeurs
setTimeout(() => { /* restaurer les originaux */ }, 100);
```

*Voir `SPATIAL_FLOW_CHRYSALIS_SHIFT.md` pour le protocole complet.*