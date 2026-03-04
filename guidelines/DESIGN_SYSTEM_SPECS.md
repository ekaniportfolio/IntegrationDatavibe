# DataVibe Design System Specifications
## Source of Truth for Figma <-> Code Synchronization

---

### 1. Color Palette (Color Tokens)

These colors must be defined as "Styles" in Figma.

#### Brand Identity
| Figma Name | Hex | CSS Variable | Usage |
| :--- | :--- | :--- | :--- |
| **Primary / Streaming** | `#344BFD` | `--datavibe-primary` | Main action, Brand, Buttons |
| **Orange / Data** | `#F68D2B` | `--datavibe-orange` | Key metrics, Warm accents |
| **Green / Success** | `#30B77C` | `--datavibe-green` | Growth, Positive status |
| **Pink / Accent** | `#F4A79D` | `--datavibe-pink` | Gradients, Highlights |
| **Red / Danger** | `#FF2222` | `--datavibe-red` | Errors, Stat drop |
| **Purple / Secondary** | `#6670FF` | `--datavibe-purple` | Graphic elements |

#### Surfaces & Backgrounds
| Figma Name | Hex | CSS Variable | Usage |
| :--- | :--- | :--- | :--- |
| **Background / Default** | `#0a0a0a` | `--background` | Main page background |
| **Surface / Card** | `#141414` | `--card` | Card background |
| **Surface / Muted** | `#1f1f1f` | `--muted` | Secondary backgrounds |
| **Border / Default** | `#27272a` | `--border` | Subtle borders |
| **Text / Foreground** | `#ffffff` | `--foreground` | Main text |
| **Text / Muted** | `#a1a1aa` | `--muted-foreground` | Secondary text |

#### Gradients
*   **App Background:** Linear Gradient (147deg)
    *   Stop 0%: `#161313` (3%)
    *   Stop 50%: `#2B1A4B` (51%)
    *   Stop 100%: `#140432` (95%)

---

### 2. Typography

#### Headings
*   **Family**: `Manrope`
*   **H1 / Display**: 36px (2.25rem) / Bold (700)
*   **H2 / Title**: 30px (1.875rem) / Bold (700)
*   **H3 / Subtitle**: 24px (1.5rem) / Bold (700)
*   **H4 / Card Title**: 18px (1.125rem) / Medium (500)

#### Body
*   **Family**: `Inter`
*   **Body / Regular**: 16px (1rem) / Regular (400)
*   **Body / Medium**: 16px (1rem) / Medium (500)
*   **Caption / Small**: 14px (0.875rem) / Regular (400)
*   **Label / Tiny**: 12px (0.75rem) / Medium (500)

---

### 3. Spacing & Layout

Based on the 4px grid (Tailwind standard).

| Token | px | rem | Usage |
| :--- | :--- | :--- | :--- |
| **Space-1** | 4px | 0.25rem | Minimal spacing |
| **Space-2** | 8px | 0.5rem | Gap icon/text |
| **Space-3** | 12px | 0.75rem | Button padding |
| **Space-4** | 16px | 1rem | Card padding |
| **Space-6** | 24px | 1.5rem | Grid gaps |
| **Space-8** | 32px | 2rem | Sections |

---

### 4. UI Components (Tokens)

#### Borders (Radius)
*   **Radius / LG (Cards)**: 12px (`0.75rem`)
*   **Radius / MD (Inputs)**: 8px (`0.5rem`)
*   **Radius / Full (Pills)**: 9999px

#### Effects
*   **Glassmorphism**:
    *   Bg: `rgba(255, 255, 255, 0.05)`
    *   Blur: `backdrop-filter: blur(12px)`
    *   Border: `rgba(255, 255, 255, 0.1)`

---
---
---

# Spécifications du Design System DataVibe
## Source de Vérité pour la Synchronisation Figma <-> Code

---

### 1. Palette de Couleurs (Jetons Couleur)

Ces couleurs doivent être définies comme "Styles" dans Figma.

#### Identité de Marque
| Nom Figma | Hex | Variable CSS | Usage |
| :--- | :--- | :--- | :--- |
| **Primary / Streaming** | `#344BFD` | `--datavibe-primary` | Action, Marque, Boutons |
| **Orange / Data** | `#F68D2B` | `--datavibe-orange` | Métriques, Accents chauds |
| **Green / Success** | `#30B77C` | `--datavibe-green` | Croissance, Statut positif |
| **Pink / Accent** | `#F4A79D` | `--datavibe-pink` | Dégradés, Highlights |
| **Red / Danger** | `#FF2222` | `--datavibe-red` | Erreurs, Baisse |
| **Purple / Secondary** | `#6670FF` | `--datavibe-purple` | Éléments graphiques |

#### Surfaces & Fonds
| Nom Figma | Hex | Variable CSS | Usage |
| :--- | :--- | :--- | :--- |
| **Background / Default** | `#0a0a0a` | `--background` | Fond de page |
| **Surface / Card** | `#141414` | `--card` | Fond de carte |
| **Surface / Muted** | `#1f1f1f` | `--muted` | Fonds secondaires |
| **Border / Default** | `#27272a` | `--border` | Bordures subtiles |
| **Text / Foreground** | `#ffffff` | `--foreground` | Texte principal |
| **Text / Muted** | `#a1a1aa` | `--muted-foreground` | Texte secondaire |

#### Dégradés
*   **App Background:** Dégradé Linéaire (147deg)
    *   Stop 0%: `#161313` (3%)
    *   Stop 50%: `#2B1A4B` (51%)
    *   Stop 100%: `#140432` (95%)

---

### 2. Typographie

#### Titres (Headings)
*   **Famille** : `Manrope`
*   **H1 / Display** : 36px (2.25rem) / Gras (700)
*   **H2 / Title** : 30px (1.875rem) / Gras (700)
*   **H3 / Subtitle** : 24px (1.5rem) / Gras (700)
*   **H4 / Card Title** : 18px (1.125rem) / Moyen (500)

#### Corps (Body)
*   **Famille** : `Inter`
*   **Body / Regular** : 16px (1rem) / Régulier (400)
*   **Body / Medium** : 16px (1rem) / Moyen (500)
*   **Caption / Small** : 14px (0.875rem) / Régulier (400)
*   **Label / Tiny** : 12px (0.75rem) / Moyen (500)

---

### 3. Espacement & Mise en Page

Basé sur la grille de 4px (Standard Tailwind).

| Jeton | px | rem | Usage |
| :--- | :--- | :--- | :--- |
| **Space-1** | 4px | 0.25rem | Espace minimal |
| **Space-2** | 8px | 0.5rem | Gap icône/texte |
| **Space-3** | 12px | 0.75rem | Padding bouton |
| **Space-4** | 16px | 1rem | Padding carte |
| **Space-6** | 24px | 1.5rem | Gaps grille |
| **Space-8** | 32px | 2rem | Sections |

---

### 4. Composants UI (Jetons)

#### Bordures (Rayon)
*   **Radius / LG (Cartes)** : 12px (`0.75rem`)
*   **Radius / MD (Inputs)** : 8px (`0.5rem`)
*   **Radius / Full (Pillules)** : 9999px

#### Effets
*   **Glassmorphism** :
    *   Fond : `rgba(255, 255, 255, 0.05)`
    *   Flou : `backdrop-filter: blur(12px)`
    *   Bordure : `rgba(255, 255, 255, 0.1)`
