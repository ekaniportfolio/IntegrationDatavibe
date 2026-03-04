# DataVibe Motion Tutorials (EN/FR)

This document provides practical implementation guides for the **Spatial Flow** and **Visiomorphism** systems.
*Ce document fournit des guides pratiques d'implémentation pour les systèmes de **Spatial Flow** et de **Visiomorphisme**.*

---

## Tutorial 1: Mastering "Spatial Flow" / Maîtriser le "Spatial Flow"

**Goal:** Create a page transition that feels "Zen" and follows the Peripheral/Center choreography.
*Objectif : Créer une transition de page qui semble "Zen" et suit la chorégraphie Périphérie/Centre.*

### Design Specification (For Designers)
*   **Total Duration:** ~1.0 second.
*   **Exit Curve:** Accelerate out. (*Sortie accélérée*)
*   **Enter Curve:** Decelerate in / Soft landing. (*Entrée décélérée / Atterrissage en douceur*)
*   **Stagger:** Content items should cascade in with 0.1s delay between each. (*Les éléments de contenu doivent apparaître en cascade avec un délai de 0.1s entre chaque.*)

### Code Implementation (For Developers)

We use `motion/react` variants to manage this complexity cleanly.
*Nous utilisons les variants `motion/react` pour gérer cette complexité proprement.*

```tsx
import { motion } from "motion/react";

// 1. Define the Stagger Container
// 1. Définir le Conteneur avec décalage (Stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Zen pacing / Rythme Zen
      delayChildren: 0.3,   // Wait for peripherals to settle / Attendre que les périphériques se stabilisent
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

// 2. Define the Item Animation (Fade + slight Lift)
// 2. Définir l'Animation de l'Élément (Fondu + léger Soulèvement)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
  },
  exit: { opacity: 0, y: -20 }
};

export function ZenPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="p-6"
    >
      <motion.h1 variants={itemVariants}>Zen Title</motion.h1>
      <motion.div variants={itemVariants}>Content Block 1</motion.div>
      <motion.div variants={itemVariants}>Content Block 2</motion.div>
    </motion.div>
  );
}
```

---

## Tutorial 2: Implementing Visiomorphism / Implémenter le Visiomorphisme

**Goal:** Transform a small component (e.g., a Card) into a full-screen view without a "cut" transition.
*Objectif : Transformer un petit composant (ex: une Carte) en une vue plein écran sans transition brusque ("cut").*

### The Logic / La Logique
We use the `layoutId` prop. If two motion components on different screens share the same `layoutId`, React Motion will automatically calculate the transform required to morph A into B.
*Nous utilisons la prop `layoutId`. Si deux composants motion sur des écrans différents partagent le même `layoutId`, React Motion calculera automatiquement la transformation requise pour métamorphoser A en B.*

### Step-by-Step / Pas à Pas

#### 1. The Source (e.g., Artist List) / La Source
This element "sends" the layout.
*Cet élément "envoie" la disposition.*

```tsx
// ArtistCard.tsx
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const ArtistCard = ({ id, image, name }) => {
  return (
    <Link to={`/artist/${id}`}>
      <motion.div 
        // CRITICAL: Unique ID shared with destination
        // CRITIQUE : ID unique partagé avec la destination
        layoutId={`artist-container-${id}`} 
        className="w-40 h-40 rounded-lg overflow-hidden relative"
      >
        <motion.img 
          layoutId={`artist-image-${id}`}
          src={image} 
          className="object-cover w-full h-full"
        />
        <motion.h3 layoutId={`artist-name-${id}`} className="absolute bottom-2 left-2">
          {name}
        </motion.h3>
      </motion.div>
    </Link>
  );
};
```

#### 2. The Destination (e.g., Artist Profile) / La Destination
This element "receives" the layout.
*Cet élément "reçoit" la disposition.*

```tsx
// ArtistProfilePage.tsx
import { motion } from "motion/react";
import { useParams } from "react-router-dom";

export const ArtistProfilePage = () => {
  const { id } = useParams();
  
  return (
    <motion.div 
      // Matches the Source ID / Correspond à l'ID Source
      layoutId={`artist-container-${id}`}
      className="w-full h-screen bg-white" // Different shape/size / Forme/taille différente
    >
      <motion.div 
        layoutId={`artist-image-${id}`}
        className="w-full h-96" // Image is now a hero banner / L'image est maintenant une bannière
      >
        <img src="..." className="w-full h-full object-cover" />
      </motion.div>
      
      <motion.h1 
        layoutId={`artist-name-${id}`}
        className="text-4xl font-bold mt-4" // Text is now a main title / Le texte est maintenant un titre principal
      >
        Artist Name
      </motion.h1>
    </motion.div>
  );
};
```

### Common Pitfalls / Pièges Courants
1.  **Shared Keys**: Ensure the `layoutId` string matches *exactly*. (*Assurez-vous que la chaîne `layoutId` correspond exactement.*)
2.  **Images**: Always ensure the underlying `img` tag has the same aspect ratio logic or `object-fit` setting to avoid warping during the morph. (*Assurez-vous toujours que la balise `img` sous-jacente a la même logique de ratio d'aspect ou de `object-fit` pour éviter les déformations pendant la métamorphose.*)
3.  **Z-Index**: The morphing element needs a higher z-index during transition. React Motion handles this mostly, but sometimes you need `className="z-50"`. (*L'élément en métamorphose a besoin d'un z-index plus élevé pendant la transition.*)

---

## Tutorial 3: Hybrid Approach / Approche Hybride

You can mix both. (*Vous pouvez mélanger les deux.*)

1.  **Morph** the main hero element (Visiomorphism).
2.  **Fade in** the secondary details text (Spatial Flow).

```tsx
<motion.div layoutId="hero-card">
   {/* This morphs / Ceci se métamorphose */}
   <HeroImage /> 
</motion.div>

<motion.div 
   initial={{ opacity: 0 }} 
   animate={{ opacity: 1, transition: { delay: 0.5 } }}
>
   {/* This fades in after the morph is settling / Ceci apparaît en fondu après l'installation de la métamorphose */}
   <DescriptionText />
</motion.div>
```

---

## Tutorial 4: The "Search-to-Loader" Morph / Le Morphing "Barre de Recherche vers Chargeur"

**Goal:** Transform a rectangular input field into a circular loading indicator seamlessly.
*Objectif : Transformer un champ de saisie rectangulaire en un indicateur de chargement circulaire de manière fluide.*

### The Geometry Problem / Le Problème de Géométrie
Morphing a wide rectangle (Aspect Ratio ~6:1) to a perfect circle (1:1) often looks "squashed" if not handled correctly.
*Transformer un rectangle large (Ratio ~6:1) en un cercle parfait (1:1) semble souvent "écrasé" si ce n'est pas géré correctement.*

### The Solution: Keyframe Sequence / La Solution : Séquence d'Images Clés
Instead of a simple spring, we use a linear keyframe sequence for `width`, `height`, and `borderRadius` to guide the shape manually.

```tsx
<motion.div
    layoutId="visiomorphic-container"
    className="bg-card border border-border"
    initial={{ width: "100%", height: 56, borderRadius: 16 }}
    animate={step === 'sync' ? {
        // Precise morphing sequence (Rectangle -> Square-ish -> Circle)
        // Séquence de morphing précise (Rectangle -> Presque Carré -> Cercle)
        width: [null, 274.5, 207, 139.5, 72, 73.6, 75.2, 76.8, 78.4, 80],
        height: [null, 60, 64, 68, 72, 73.6, 75.2, 76.8, 78.4, 80],
        borderRadius: [null, 18.5, 21, 23.5, 26, 28.5, 31, 33.5, 36, 40],
        transition: { duration: 0.5, ease: "linear" }
    } : {
        width: "100%", height: 56, borderRadius: 16
    }}
>
    {/* Content Fading Logic Inside */}
</motion.div>
```

### The SVG Gauge Trick / L'Astuce de la Jauge SVG
Do **NOT** rotate the morphing container. It will wobble.
Instead, keep the container fixed and overlay a rotating SVG or animate the `strokeDashoffset` of a static SVG.
*NE faites PAS tourner le conteneur de morphing. Il vacillera. Gardez plutôt le conteneur fixe et superposez un SVG rotatif ou animez le `strokeDashoffset` d'un SVG statique.*

---

## Tutorial 5: Deep Waterfall Exit & Reverse Morph / Sortie "Chute Profonde" & Morph Inversé

**Goal:** Create a dramatic, physical exit for a dense dashboard and a seamless return to a previous search state.
*Objectif : Créer une sortie physique et dramatique pour un tableau de bord dense et un retour fluide à un état de recherche précédent.*

### 1. The Deep Waterfall Exit / La Sortie "Chute Profonde"
Instead of fading out, elements fall "heavily" off the screen while remaining opaque. This creates a sense of physical departure.
*Au lieu de disparaître en fondu, les éléments tombent "lourdement" hors de l'écran tout en restant opaques. Cela crée une sensation de départ physique.*

```tsx
// Container keeps the stage alive / Le conteneur garde la scène vivante
<motion.div exit={{ opacity: 1, transition: { duration: 1.5 } }}>
  
  {/* Children fall deep / Les enfants tombent bas */}
  <motion.div
     exit={{ 
       y: 1000, 
       rotateX: -10, 
       opacity: 1, // Stay visible! / Restez visible !
       transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] } 
     }}
  >
    <DashboardCard />
  </motion.div>
</motion.div>
```

### 2. The "Ghost" Problem / Le Problème du "Fantôme"
When returning to a screen with a shared `layoutId` component (e.g., Search Circle), the exiting screen's instance must vanish **immediately**. If it waits for the Waterfall exit (1.5s), you will see two circles: one falling, one morphing.
*Lors du retour vers un écran avec un composant `layoutId` partagé (ex: Cercle de Recherche), l'instance de l'écran sortant doit disparaître **immédiatement**. Si elle attend la sortie en Chute (1.5s), vous verrez deux cercles : un qui tombe, un qui se métamorphose.*

```tsx
// Dashboard Screen (Exit)
<motion.div
   layoutId="visiomorphic-container"
   // CRITICAL: Vanish immediately to hand over control to the destination screen
   // CRITIQUE : Disparaître immédiatement pour passer le contrôle à l'écran de destination
   exit={{ opacity: 0, transition: { duration: 0.01 } }} 
/>

// Search Screen (Enter)
<motion.div
   layoutId="visiomorphic-container"
   // Takes over seamlessly / Prend le relais de manière fluide
   initial={{ opacity: 1 }} 
/>
```
