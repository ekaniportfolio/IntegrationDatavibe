# DataVibe Best Practices & Conventions

## 1. Architecture Rules

### Parallel Worlds ("sw" Rule)
- `MobileExperience` and `DesktopExperience` are ALWAYS separate components
- Never unify them. They share state but render independently
- Mobile is touch-first (swipes, rotation). Desktop is mouse-first (hovers, precision clicks)

### Component Dependency on Backend
- Any component using future backend data MUST accept typed props with mock defaults
- Mock defaults are imported from `/src/app/data/mock-backend.ts`
- Include `@backend` annotation in JSDoc comments
- Example: `@backend -- videoSrc will come from real video URLs when backend is connected`

### State Persistence
- Use `getSavedState()` for reading (NOT `loadState` -- it doesn't exist)
- Use `saveState()` for writing
- These functions handle localStorage serialization

---

## 2. Overlay Architecture

### The `isBilanView` Pattern
- `isBilanView` is the single boolean flag for "an overlay is open" (64+ references)
- `overlayPage` tracks which overlay page is displayed
- `overlaySwapRef` provides directional reference for Spatial Flow navigation

### Overlay Page Rules
- Pages **Mes connexions**, **Offre**, **Legal**, **A propos**: NO TAF tabs, NO BilanBottomNav
- Closing an overlay: `setIsBilanView(false)` WITHOUT `setOverlayPage('bilan')` to prevent TAF tab flash

---

## 3. Motion / Animation Rules

### Import
```typescript
import { motion, AnimatePresence } from "motion/react";
```
Never use `"framer-motion"` import path. Always use `"motion/react"`.

### Glass Button Colors
```tsx
// CORRECT: Use rgba style prop
style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}

// WRONG: Tailwind class causes oklab error in Motion
className="bg-white/20"
```
This avoids the `oklab` color space error when Motion interpolates colors.

### Layout Prop in Portal Expansion Flow
Never use `layout` prop on children inside a PEF portal. The portal's container animation causes `layout` on children to detect phantom layout changes and apply destructive corrective transforms.

### Protected Animations (ABSOLUTE RULE)
Never touch:
- Transitions and `layoutId` of visiomorphic circles (mobile ~L.2137, desktop ~L.3781)
- Transitions 4->2, 3->4, 1->2

---

## 4. Internationalization Rules

### Brand Names Protection
- All platform names, brand names, and personal names must have `translate="no"` attribute
- For mixed text (e.g., "Connecter Spotify"), use inline `<span translate="no">Spotify</span>`
- Audit: 40 instances across 20 files

### Font Architecture
- **Branding**: `Datavibe` font (Bold only) -- EXCLUSIVELY for the main logo
- **Product UI**: `Manrope` (Google Font) -- all standard UI elements
- Logo sizing: Use `.text-logo-default` or `.text-logo-splash` classes, never arbitrary Tailwind sizes

---

## 5. Color System

### Semantic Tokens Only
Never use hardcoded hex values or primitive variables directly.

| Usage | Token |
|-------|-------|
| Logo primary ("DATA") | `text-logo-primary` |
| Logo accent ("VIBE") | `text-logo-accent` |
| Surfaces | `bg-background`, `bg-card`, `bg-muted` |
| Text | `text-foreground`, `text-muted-foreground` |
| Borders | `border-border`, `border-input` |
| Actions | `bg-primary`, `text-primary-foreground` |

### Namespace Accent Colors
| Namespace | Color | Usage |
|-----------|-------|-------|
| Streaming | `#F28E42` (Orange) | Progress bars, badges, highlights |
| Social | `#1CB45B` (Green) | Progress bars, badges, highlights |
| Radio | `#1286F3` (Blue) | Progress bars, badges, highlights |

---

## 6. File Conventions

### Manually Edited Files (Read Before Modifying)
These files have been manually edited after generation. Always read their current state before making changes:
- `BilanContentBlocks.tsx`
- `BilanBottomNav.tsx`
- `BilanSocialContentBlocks.tsx`
- `BilanMediaContentBlocks.tsx`
- `NiveauContentBlocks.tsx`
- `ConnexionsContentBlocks.tsx`
- `mock-backend.ts`
- `OffreContentBlocks.tsx`
- `LegalContentBlocks.tsx`
- `AboutContentBlocks.tsx`
- `SlideMenu.tsx`
- `ShareBilanButton.tsx`
- `WelcomeCarousel.tsx`
- `SocialLockedOverlay.tsx`

### Data Simulation
- Use `/src/app/utils/dataSimulation.ts` (NOT `/src/utils/dataSimulation.ts`)
- Video thumbnail randomization uses 4 Unsplash pools with Fisher-Yates shuffle

### Logo Component
- Always import and use `<Logo />` from `src/app/components/branding/Logo.tsx`
- Never inline the logo SVG/text markup elsewhere

---

## 7. Reflex Matrix Specifics

### Segment System
- RM uses segments 1-5 with side stage (desktop only)
- Running lights use `conic-gradient` via `@property --rl-angle`
- Badge configs centralized in `BADGE_CONFIGS`:
  - Orange/Red: Priority High
  - Blue/Cyan: Recommended
  - Violet: Bonus
- `BADGE_SEQUENCE` array in `.map()` final of `useMemo pages` overwrites `badgeType` by index

### Desktop Hit-Testing Fix
- `z-[25]` applied dynamically when `isDivided` to fix hover hit-testing bug

---

## 8. Video Player Specifics

### Fullscreen Spatial Flow (PEF)
- Desktop: expand to viewport (no rotation)
- Mobile: expand + rotate 90deg to landscape (GLS)
- Uses `createPortal` to escape overflow:hidden ancestors
- Spring config: `stiffness: 180, damping: 28, mass: 1`
- Escape key and Minimize button both trigger reverse animation

### Controls Architecture
- `ControlsLayer` is shared between inline and fullscreen modes
- `isFullscreen` prop adjusts sizing (larger buttons, thicker progress bar in fullscreen)
- Glass effect: `style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}` (Motion-safe)
- Auto-hide after 3s of inactivity, reset on mouse/touch interaction
