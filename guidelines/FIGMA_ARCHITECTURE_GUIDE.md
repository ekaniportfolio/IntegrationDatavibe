# DataVibe Figma Architecture Guide
> "Pixel Perfect" construction guide for Code <-> Design synchronization.

## 1. Figma File Structure

Organize your `.fig` file with the following pages for clear navigation:

*   **Cover** (Project Thumbnail)
*   **01 Foundations** (Primitives, Semantics, Grids)
*   **02 Components** (Buttons, Inputs, SmartCards)
*   **03 Patterns** (Sidebar, Header, Complex Modules)
*   **04 Layouts** (Final Screens)
*   **99 Archive**

---

## 2. Variable Collections

### Collection: `Color/Primitives`
Raw hex values, organized by hue family.
- `Brand/50` through `Brand/950`
- `Neutral/0` through `Neutral/950`
- `Success/400`, `Warning/400`, `Danger/400`

### Collection: `Color/Semantics`
Mapped to Primitives, with Light/Dark modes.
- `Logo/Primary` -> Light: `Neutral/900`, Dark: `Neutral/0`
- `Logo/Accent` -> Light: `Brand/600`, Dark: `Brand/400`
- `Surface/Background` -> Light: `Neutral/0`, Dark: `Neutral/950`
- `Surface/Card` -> Light: `Neutral/50`, Dark: `Neutral/900`
- `Text/Foreground` -> Light: `Neutral/900`, Dark: `Neutral/0`
- `Text/Muted` -> Light: `Neutral/500`, Dark: `Neutral/400`

### Collection: `Typography/Variables`
Responsive sizes with 3 modes: Mob, Tab, Desk.
- `Logo/Default`: 28px (Mob) -> 36px (Tab) -> 48px (Desk)
- `Logo/Splash`: 48px (Mob) -> 64px (Tab) -> 80px (Desk)

---

## 3. Component Architecture

### Atoms
- `Button` (Primary, Secondary, Ghost, Destructive)
- `Input` (Text, Password, Search)
- `Badge` (Default, Outline, Priority)
- `Avatar` (SM, MD, LG)

### Molecules
- `SmartCard` (uses Glassmorphism effect)
- `StatCard` (Icon + Value + Label + Trend)
- `NavItem` (Icon + Label + Active state)

### Organisms
- `Header` (Logo + Nav + UserPanel)
- `Sidebar` (NavItems + Collapse state)
- `DashboardGrid` (SmartCards in responsive grid)

---

## 4. Auto Layout Rules

- **Cards**: Padding `16px`, Gap `12px`, Fill container
- **Buttons**: Padding `12px 24px`, Hug contents
- **Lists**: Gap `8px`, Fill container, Stagger-ready

---

## 5. Naming Convention

```
Component/Variant/State
Example: Button/Primary/Hover
Example: Card/Streaming/Expanded
Example: Nav/Item/Active
```

---

## 6. Export Rules

- **Icons**: SVG, 24x24, stroke-based, `currentColor`
- **Images**: PNG @2x for raster, SVG for vectors
- **Tokens**: Export via Tokens Studio plugin -> `figma-tokens.json`

---
---
---

# Guide d'Architecture Figma DataVibe
> Guide de construction "Pixel Perfect" pour la synchronisation Code <-> Design.

## 1. Structure du Fichier Figma

*   **Cover** (Vignette du Projet)
*   **01 Fondations** (Primitives, Semantiques, Grilles)
*   **02 Composants** (Boutons, Inputs, SmartCards)
*   **03 Patterns** (Sidebar, Header, Modules Complexes)
*   **04 Layouts** (Ecrans Finaux)
*   **99 Archive**

---

## 2. Collections de Variables

### Collection : `Color/Primitives`
Valeurs hex brutes, organisees par famille de teinte.

### Collection : `Color/Semantics`
Mappees aux Primitives, avec modes Light/Dark.

### Collection : `Typography/Variables`
Tailles responsives avec 3 modes : Mob, Tab, Desk.

---

## 3. Architecture des Composants

### Atomes
`Button`, `Input`, `Badge`, `Avatar`

### Molecules
`SmartCard`, `StatCard`, `NavItem`

### Organismes
`Header`, `Sidebar`, `DashboardGrid`

---

## 4. Convention de Nommage

```
Composant/Variante/Etat
Exemple : Button/Primary/Hover
Exemple : Card/Streaming/Expanded
```
