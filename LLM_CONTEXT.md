# 🧠 LLM CONTEXT & PRIMER: DATAVIBE SPATIAL FLOW

> **ATTENTION AI AGENT**: This project uses a proprietary animation philosophy called **Spatial Flow**. It differs significantly from standard React/Framer Motion patterns. Read this primer BEFORE writing code.

---

## 📚 KNOWLEDGE BASE (Required Reading)
For complex tasks, refer to these specialized protocols:
*   **[Lists & Results]** -> `SPATIAL_FLOW_LATERAL_GLIDE.md`
*   **[Grid Reordering]** -> `SPATIAL_FLOW_SEQUENTIAL_GRID.md`
*   **[Page Load Timing]** -> `SPATIAL_FLOW_SSC_PROTOCOL.md`
*   **[Component Identity]** -> `SPATIAL_FLOW_SOUL_PHYSICS.md`
*   **[Philosophy]** -> `SPATIAL_FLOW_MANIFESTO.md`

---

## 🚫 STRICT INTERDICTIONS (The "Do Nots")

1.  **DO NOT** use `gap-4` or `gap-5`. The standard structural gap is **22px** (`gap-[22px]`).
2.  **DO NOT** mix standard Tailwind transitions (`transition-all`) with Framer Motion unless strictly necessary.
3.  **DO NOT** hardcode colors. Use semantic tokens:
    *   `bg-background` (not white)
    *   `text-foreground` (not black)
    *   `text-logo-primary` / `text-logo-accent`
4.  **DO NOT** invent new physics. Import `SOUL_PHYSICS` or `mobileSmoothFlow` from constants.
5.  **DO NOT** use `display: none` for page transitions. Use the **Anchor Protocol**.

---

## 🌌 CORE PHILOSOPHY: "THE SANCTUM"

DataVibe is not a series of pages; it is a single **Sanctuary** where data "transmigrates" between containers.
*   **No Page Refreshes**: Everything is a single-page application (SPA).
*   **No "Popping"**: Elements must glide, slide, or morph.
*   **Conservation of Mass**: An element (like a search bar) moving from Header to Body must visually travel there (using `layoutId`), not just disappear and reappear.

---

## 🔑 KEY VOCABULARY

| Term | Definition |
| :--- | :--- |
| **Soul Physics** | The standardized spring constants (`stiffness: 105`, `damping: 18`) used for 90% of animations. |
| **TAF** | *Transmigrated Astral Flow*. The use of `layoutId` to morph components across the DOM. |
| **RAU** | *Règle de l'Âme Unique* (Single Soul Rule). Never have duplicate `layoutId`s mounted simultaneously. |
| **SSC** | *Sequential Spatial Cascade*. The strict order of entry: Tabs -> Container -> Body -> Footer. |
| **Ghost DOM** | Rendering an invisible copy of an element to measure its dimensions before animating the real one. |
| **Anchor Protocol** | The technique of switching `position: fixed` (Hidden) to `position: relative` (Visible) to prevent layout shifts. |

---

## 🛠️ THE "ANCHOR PROTOCOL" (CRUCIAL FOR LAYOUTS)

**Problem**: When animating full-page dashboards (`activeTab` changes), using `display: none` kills the exit animation, but keeping it in the DOM (`opacity: 0`) creates massive whitespace/scrollbars.

**Solution**:
1.  **Hidden State**: `position: fixed`, `width: 100%`, `top: 0`. The element is removed from the document flow but exists for animation.
2.  **Visible State**: `position: relative`. The element re-enters the flow to push content down naturally.

**Code Pattern**:
```typescript
const dashboardVariants = {
  hidden: {
      position: "fixed", top: 0, width: "100%", // Anchored
      x: "-100%", opacity: 0,
      zIndex: 0
  },
  visible: {
      position: "relative", // Flowing
      x: 0, opacity: 1,
      zIndex: 1
  }
};
```

---
---
---

# 🇫🇷 CONTEXTE LLM & AMORCE : DATAVIBE SPATIAL FLOW

> **ATTENTION AGENT IA** : Ce projet utilise une philosophie d'animation propriétaire appelée **Spatial Flow**. Elle diffère significativement des modèles React/Framer Motion standard. Lisez cette amorce AVANT d'écrire du code.

---

## 📚 BASE DE CONNAISSANCES (Lecture Requise)
Pour les tâches complexes, référez-vous à ces protocoles spécialisés :
*   **[Listes & Résultats]** -> `SPATIAL_FLOW_LATERAL_GLIDE.md`
*   **[Réorganisation de Grille]** -> `SPATIAL_FLOW_SEQUENTIAL_GRID.md`
*   **[Temps de Chargement de Page]** -> `SPATIAL_FLOW_SSC_PROTOCOL.md`
*   **[Identité du Composant]** -> `SPATIAL_FLOW_SOUL_PHYSICS.md`
*   **[Philosophie]** -> `SPATIAL_FLOW_MANIFESTO.md`

---

## 🚫 INTERDICTIONS STRICTES (Les "Ne Pas Faire")

1.  **NE PAS** utiliser `gap-4` ou `gap-5`. L'espace structurel standard est de **22px** (`gap-[22px]`).
2.  **NE PAS** mélanger les transitions Tailwind standard (`transition-all`) avec Framer Motion sauf si strictement nécessaire.
3.  **NE PAS** coder en dur les couleurs. Utilisez des jetons sémantiques :
    *   `bg-background` (pas blanc)
    *   `text-foreground` (pas noir)
    *   `text-logo-primary` / `text-logo-accent`
4.  **NE PAS** inventer de nouvelle physique. Importez `SOUL_PHYSICS` ou `mobileSmoothFlow` depuis les constantes.
5.  **NE PAS** utiliser `display: none` pour les transitions de page. Utilisez le **Protocole d'Ancrage**.

---

## 🌌 PHILOSOPHIE CŒUR : "LE SANCTUAIRE"

DataVibe n'est pas une série de pages ; c'est un **Sanctuaire** unique où les données "transmigrent" entre les conteneurs.
*   **Pas de Rechargement de Page** : Tout est une application à page unique (SPA).
*   **Pas de "Popping"** : Les éléments doivent glisser, coulisser ou se métamorphoser.
*   **Conservation de la Masse** : Un élément (comme une barre de recherche) se déplaçant de l'En-tête vers le Corps doit visuellement voyager jusque-là (en utilisant `layoutId`), pas juste disparaître et réapparaître.

---

## 🔑 VOCABULAIRE CLÉ

| Terme | Définition |
| :--- | :--- |
| **Physique de l'Âme** | Les constantes de ressort standardisées (`stiffness: 105`, `damping: 18`) utilisées pour 90% des animations. |
| **TAF** | *Flux Astral Transmigré*. L'utilisation de `layoutId` pour métamorphoser des composants à travers le DOM. |
| **RAU** | *Règle de l'Âme Unique*. Ne jamais avoir de `layoutId` dupliqués montés simultanément. |
| **SSC** | *Cascade Spatiale Séquentielle*. L'ordre strict d'entrée : Onglets -> Conteneur -> Corps -> Pied de page. |
| **Ghost DOM** | Rendu d'une copie invisible d'un élément pour mesurer ses dimensions avant d'animer le vrai. |
| **Protocole d'Ancrage** | La technique de basculement de `position: fixed` (Caché) à `position: relative` (Visible) pour empêcher les décalages de mise en page. |

---

## 🛠️ LE "PROTOCOLE D'ANCRAGE" (CRUCIAL POUR LES MISES EN PAGE)

**Problème** : Lors de l'animation de tableaux de bord complets (changement d'`activeTab`), l'utilisation de `display: none` tue l'animation de sortie, mais le garder dans le DOM (`opacity: 0`) crée un espace blanc massif / des barres de défilement.

**Solution** :
1.  **État Caché** : `position: fixed`, `width: 100%`, `top: 0`. L'élément est retiré du flux du document mais existe pour l'animation.
2.  **État Visible** : `position: relative`. L'élément rentre dans le flux pour pousser le contenu vers le bas naturellement.

**Modèle de Code** :
```typescript
const dashboardVariants = {
  hidden: {
      position: "fixed", top: 0, width: "100%", // Ancré
      x: "-100%", opacity: 0,
      zIndex: 0
  },
  visible: {
      position: "relative", // Flux
      x: 0, opacity: 1,
      zIndex: 1
  }
};
```
