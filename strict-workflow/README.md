# Strict Workflow: The Universal Figma-to-Code Bridge

This folder contains the methodology and tools necessary to implement a **Strict Workflow** on any Web/Mobile project.

## 🏗 Workflow Structure

The Strict Workflow relies on an immutable hierarchy of tokens and components, ensuring that the code is an exact mirror of the design.

### 1. Foundations (Figma Variables)
*   **Primitives**: Raw values (Hex, Pixels). Never used directly in components.
*   **Semantics**: Design intentions (Surface, Foreground, Action). Mapped to primitives.
*   **Typography**: Responsive scales managed by modes (Mobile, Tablet, Desktop).

### 2. Software Architecture (React + Tailwind)
*   **Theme Engine**: Synchronization of Figma variables to CSS (:root).
*   **Visiomorphic Logic**: Fluid spatial transitions between states.
*   **Parallel Worlds (Behavioral Independence)**:
    *   **UI Isolation**: Mobile and Desktop layouts are distinct universes.
    *   **Zero Automatic Unification**: Never merge UI behaviors or structures between mobile and desktop without express request.
    *   **State Persistence**: Only data state is shared; user experience (UX) is specific to each "world".

## 📂 Folder Contents

*   `docs/`: Detailed guides on spatial navigation and atomic design.
*   `scripts/`: Scripter scripts for Figma (Automatic variable generation).
*   `templates/`: Base files (`theme.css`, `Logo.tsx`) to start a project.

## 🚀 Quick Implementation

1.  **Figma**: Run the scripts in order (1-5) in the Scripter plugin.
2.  **Code**: Import the generated `theme.css`.
3.  **Animation**: Use Framer Motion with the "Straight Line Path" logic for transitions.

---
---
---

# Strict Workflow : Le Pont Universel Figma-vers-Code

Ce dossier contient la méthodologie et les outils nécessaires pour implémenter un **Strict Workflow** sur n'importe quel projet Web/Mobile.

## 🏗 Structure du Workflow

Le Strict Workflow repose sur une hiérarchie immuable de tokens et de composants, garantissant que le code est le miroir exact du design.

### 1. Fondations (Figma Variables)
*   **Primitives** : Valeurs brutes (Hex, Pixels). Jamais utilisées directement dans les composants.
*   **Semantics** : Intentions de design (Surface, Foreground, Action). Mappées sur les primitives.
*   **Typography** : Échelles responsives gérées par des modes (Mobile, Tablet, Desktop).

### 2. Architecture Logicielle (React + Tailwind)
*   **Theme Engine** : Synchronisation des variables Figma vers CSS (:root).
*   **Visiomorphic Logic** : Transitions spatiales fluides entre états.
*   **Mondes Parallèles (Indépendance Comportementale)** :
    *   **Isolation des UI** : Les layouts Mobile et Desktop sont des univers distincts.
    *   **Zéro Unification Automatique** : Ne jamais fusionner les comportements ou les structures UI entre mobile et desktop sans demande expresse.
    *   **Persistance de l'État** : Seul l'état de données est partagé, l'expérience utilisateur (UX) est spécifique à chaque "monde".

## 📂 Contenu de ce dossier

*   `docs/` : Guides détaillés sur la navigation spatiale et le design atomique.
*   `scripts/` : Scripts Scripter pour Figma (Génération automatique des variables).
*   `templates/` : Fichiers de base (`theme.css`, `Logo.tsx`) pour démarrer un projet.

## 🚀 Mise en œuvre rapide

1.  **Figma** : Exécuter les scripts dans l'ordre (1-5) dans le plugin Scripter.
2.  **Code** : Importer le `theme.css` généré.
3.  **Animation** : Utiliser Framer Motion avec la logique de "Straight Line Path" pour les transitions.
