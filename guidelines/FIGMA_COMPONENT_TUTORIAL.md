# Figma Tutorial: Building "Theme-Ready" Components
This guide explains how to assemble components in Figma that automatically react to mode changes (Light / Dark) thanks to our token architecture.

---

## 1. The Golden Rule
**NEVER use the eyedropper or manual color picker (Hex).**

If you choose a color manually (e.g., `#FFFFFF`), it will stay "stuck" on that color regardless of the mode. For the system to work, you must "connect" your layers to the system variables.

---

## 2. Connecting a Fill to a Variable

### Step-by-Step
1.  Select the layer (rectangle, frame, text).
2.  In the **Fill** section (right panel), click the color swatch.
3.  Click the **small icon** at the bottom-left of the color picker (the "variable" icon, looks like a hexagon).
4.  Browse the `Color/Semantics` collection.
5.  Select the appropriate token (e.g., `Surface/Card` for a card background).

### Result
The fill now says `Surface/Card` instead of `#141414`. When you switch to Light mode, it automatically updates.

---

## 3. Connecting Text Color

Same process, but for the **text fill**:
1.  Select the text layer.
2.  Open the fill color picker.
3.  Connect to `Text/Foreground` or `Text/Muted`.

---

## 4. Building a "SmartCard" Component

### Layer Structure
```
SmartCard (Frame, Auto Layout: Vertical, Padding: 16)
  |-- Header (Frame, Auto Layout: Horizontal, Gap: 8)
  |   |-- Icon (Instance of Icon component)
  |   |-- Title (Text, connected to Text/Foreground)
  |-- Divider (Rectangle, 1px, connected to Border/Default)
  |-- Content (Frame, Auto Layout: Vertical, Gap: 12)
  |   |-- Stat Value (Text, connected to Text/Foreground)
  |   |-- Stat Label (Text, connected to Text/Muted)
```

### Fills
- SmartCard background: `Surface/Card`
- SmartCard border: `Border/Default`, 1px
- SmartCard border-radius: `12px` (Radius/LG)

### Glassmorphism Effect
- Background: `rgba(255, 255, 255, 0.05)` (apply as fill with 5% opacity)
- Backdrop blur: Add "Layer Blur" effect, value `12`
- Border: `rgba(255, 255, 255, 0.1)` (apply as stroke with 10% opacity)

---

## 5. Creating Component Variants

### Using Component Properties
1.  Select your component.
2.  Add a **Variant** property (e.g., `Namespace`).
3.  Create variants: `Streaming`, `Social`, `Radio`.
4.  For each variant, swap the accent color:
    -   Streaming: `#F28E42` (Orange)
    -   Social: `#1CB45B` (Green)
    -   Radio: `#1286F3` (Blue)

### Boolean Properties
Add toggles like:
- `Show Badge`: true/false
- `Is Active`: true/false
- `Has Trend`: true/false

---

## 6. Responsive Typography (Logo)

### Connecting to Typography Variables
1.  Select the Logo text layer.
2.  In **Text** properties, click the variable icon next to "Size".
3.  Browse `Typography/Variables` collection.
4.  Select `Logo/Default` or `Logo/Splash`.

### Result
- In "Mob" mode: Logo text = 28px (Default) or 48px (Splash)
- In "Tab" mode: Logo text = 36px (Default) or 64px (Splash)
- In "Desk" mode: Logo text = 48px (Default) or 80px (Splash)

---

## 7. Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using hex color directly | Connect to semantic variable |
| Using `Auto` for text size | Connect to typography variable |
| Not setting Auto Layout | Always use Auto Layout for responsive behavior |
| Hardcoding spacing values | Use consistent spacing tokens (4px grid) |
| Missing dark mode check | Test both modes before publishing |

---
---
---

# Tutoriel Figma : Construire des Composants "Theme-Ready"
Ce guide explique comment assembler des composants dans Figma qui reagissent automatiquement aux changements de mode (Light / Dark) grace a notre architecture de tokens.

---

## 1. La Regle d'Or
**NE JAMAIS utiliser la pipette ou le selecteur de couleur manuel (Hex).**

Si vous choisissez une couleur manuellement, elle restera "figee" sur cette couleur quel que soit le mode.

---

## 2. Connecter un Remplissage a une Variable

1.  Selectionnez le calque.
2.  Dans la section **Remplissage**, cliquez sur la pastille de couleur.
3.  Cliquez sur l'icone "variable" en bas a gauche du selecteur.
4.  Parcourez la collection `Color/Semantics`.
5.  Selectionnez le jeton appropriate.

---

## 3. Construire un Composant "SmartCard"

### Structure
```
SmartCard (Frame, Auto Layout: Vertical, Padding: 16)
  |-- Header (Horizontal, Gap: 8)
  |-- Divider (1px, Border/Default)
  |-- Content (Vertical, Gap: 12)
```

### Effet Glassmorphism
- Fond : `rgba(255, 255, 255, 0.05)`
- Flou : Layer Blur `12`
- Bordure : `rgba(255, 255, 255, 0.1)`

---

## 4. Typographie Responsive (Logo)

Connectez la taille du texte logo aux variables `Typography/Variables` :
- Mode Mob : 28px / 48px
- Mode Tab : 36px / 64px
- Mode Desk : 48px / 80px
