# Vocabulary Dictionary - DataVibe Platform (V2.0)

Use this vocabulary to precisely designate the pages, states, and spatial flows of the application.

---

## 1. Onboarding Flow (Initial Steps)

| Simple Name | Description | Technical File |
| :--- | :--- | :--- |
| **`ONB_WELCOME`** | The purple welcome screen with the "Start" button and WelcomeCarousel. | `NewPlatform.tsx` (Step 0) |
| **`ONB_SEARCH`** | The artist search screen (Input + List). | `ArtistSearchPage.tsx` |
| **`ONB_SYNC`** | The loading screen with the 3 verification steps. | `SyncingPage.tsx` |
| **`ONB_AUTH`** | The authentication card (Login/SignUp/ForgotPassword) with Chrysalis Shift transitions. | `NewPlatform.tsx` (Step 1-3) |

---

## 2. Dashboard - PREVIEW Mode (Screen 4 / Standard)

This is the default screen after loading. It acts as a summary.
*Always contains 3 small stats cards.*

| Simple Name | Universe | Specific Content |
| :--- | :--- | :--- |
| **`HOME_STREAMING`** | Streaming | Spotify/Youtube Stats + **Opportunity Block** |
| **`HOME_SOCIAL`** | Social | Insta/TikTok Stats + "See Dashboard" Button |
| **`HOME_RADIO`** | Radio | Rotation Stats + "See Dashboard" Button |

---

## 3. Dashboard - FULL Mode (Screen 5 / Focus)

This is the detailed screen that opens when clicking an opportunity or "See Dashboard".
*Contains navigation sub-tabs.*

### Streaming Universe (`FOCUS_STREAMING`)

| Simple Name | Sub-tab | Main Content |
| :--- | :--- | :--- |
| **`STREAM_MAIN`** | Dashboard | Header + Stats + **Playlist Analysis** (`PlaylistAnalysis`) |
| **`STREAM_PERF`** | Activity | Performance Charts (`StreamingPerformanceOverview`) |
| **`STREAM_SONGS`** | Songs | Song List (`SongsTable` / `PlaylistAnalysis`) |

### Social Universe (`FOCUS_SOCIAL`)

| Simple Name | Sub-tab | Main Content |
| :--- | :--- | :--- |
| **`SOCIAL_MAIN`** | Dashboard | Header + Stats + Engagement (`SocialEngagementCard`) |
| **`SOCIAL_SUBS`** | Subscribers | Subscribers Detail (`SocialEngagementCard`) |
| **`SOCIAL_DEMO`** | Demographics | Demographics Charts |

### Radio Universe (`FOCUS_RADIO`)

| Simple Name | Sub-tab | Main Content |
| :--- | :--- | :--- |
| **`RADIO_MAIN`** | Dashboard | Header + Stats + Top Stations (`TopStationsTable`) |
| **`RADIO_STATIONS`** | Stations | Complete Station List |
| **`RADIO_SONGS`** | Songs | Radio Analysis (`RadioPlaylistAnalysis`) |

---

## 4. Overlay Pages

Overlay pages use the `isBilanView` flag as "overlay open" indicator with `overlayPage` for routing.
**No TAF tabs at top, no BilanBottomNav at bottom.**

| Simple Name | Description | Technical File |
| :--- | :--- | :--- |
| **`OVERLAY_BILAN`** | Bilan summary page with TAF tabs and BilanBottomNav. | `BilanContentBlocks.tsx` |
| **`OVERLAY_NIVEAU`** | Niveau/Level detail page. | `NiveauContentBlocks.tsx` |
| **`OVERLAY_CONNEXIONS`** | My connections page. No TAF tabs/BilanBottomNav. | `ConnexionsContentBlocks.tsx` |
| **`OVERLAY_OFFRE`** | Offer/pricing page. No TAF tabs/BilanBottomNav. | `OffreContentBlocks.tsx` |
| **`OVERLAY_LEGAL`** | Legal information page. No TAF tabs/BilanBottomNav. | `LegalContentBlocks.tsx` |
| **`OVERLAY_ABOUT`** | About page. No TAF tabs/BilanBottomNav. | `AboutContentBlocks.tsx` |

---

## 5. Reflex Matrix (RM Lab)

| Simple Name | Description | Technical File |
| :--- | :--- | :--- |
| **`RM_LAB`** | The Reflex Matrix laboratory (development/testing). | `RMLab.tsx` |
| **`RM_OPPORTUNITY`** | The main Reflex Matrix opportunity component with segments. | `ReflexOpportunity.tsx` |
| **`RM_VIDEO`** | The video player overlay with Cinematic Glass Controls. | `VideoPlayerOverlay.tsx` |
| **`RM_VIDEO_FS`** | The fullscreen portal overlay (Portal Expansion Flow). | `VideoPlayerOverlay.tsx` (FullscreenOverlay) |
| **`RM_VIDEO_GLS`** | Mobile fullscreen with Gyroscopic Landscape Shift (90deg rotation). | `VideoPlayerOverlay.tsx` (mobile target) |

---

## 6. Spatial Flow Vocabulary

### Navigation Flows
| Term | Abbreviation | Used In |
| :--- | :--- | :--- |
| Lateral Transmigration | TL | Tab switching, carousel navigation |
| Astral Descent Return | DAR | Overlay close, return to home |
| Follow Flow | FF | Content direction matches user's attention |
| Samsara Shift | SS | Navigation dot transmigration |

### Content Flows
| Term | Abbreviation | Used In |
| :--- | :--- | :--- |
| Chrysalis Shift | CS | Auth card transitions (Login/SignUp/ForgotPassword) |
| Reflex Matrix | RM | Opportunity card expansion (mitosis) |
| Sequential Spatial Cascade | SSC | Dashboard content loading waves |
| Lateral Glide | LG | List rendering with alternating entry |

### Expansion Flows
| Term | Abbreviation | Used In |
| :--- | :--- | :--- |
| Portal Expansion Flow | PEF | Video fullscreen from card position |
| Gyroscopic Landscape Shift | GLS | Mobile video landscape rotation |

### Defense Flows
| Term | Abbreviation | Used In |
| :--- | :--- | :--- |
| Layout Projection Shield | LPS | Visiomorphic circle animations during overlay open/close |

### Aesthetic Flows
| Term | Abbreviation | Used In |
| :--- | :--- | :--- |
| Cinematic Glass Controls | CGC | Video player frosted glass buttons |

---

## 7. Component Architecture Vocabulary

| Term | Definition |
| :--- | :--- |
| **Mother Cell** | The compact state of a Reflex Matrix component before mitosis. |
| **Segments** | The expanded child sections after Reflex Matrix mitosis (1-5). |
| **Side Stage** | The left panel that appears during RM expansion (desktop only). |
| **Running Lights** | The conic-gradient animation on RM badges (`@property --rl-angle`). |
| **Badge Magma** | The glowing badge system with `BADGE_CONFIGS` (orange/red, cyan, violet). |
| **Badge Sequence** | The `BADGE_SEQUENCE` array that maps segment index to badge type. |
| **Ghost DOM** | Invisible content rendered for height measurement before animation. |
| **Buffer Strategy** | Inverse Trapdoor + Soft Lock combined for smooth expansion. |
| **Vessel Persistence** | The Chrysalis container that never unmounts during transitions. |
| **Rect Capture** | `getBoundingClientRect()` call before Portal Expansion Flow. |
| **Parallel Worlds** | Mobile and Desktop as separate topologies (MobileExperience / DesktopExperience). |

---

## 8. State Management Vocabulary

| Term | Definition |
| :--- | :--- |
| **`isBilanView`** | Boolean flag: "an overlay is open" (64+ references). |
| **`overlayPage`** | Current overlay page identifier ('bilan', 'niveau', 'connexions', etc.). |
| **`overlaySwapRef`** | Ref for Spatial Flow directional navigation between overlays. |
| **`getSavedState`** | Read function for persistence. NOT `loadState` (which doesn't exist). |
| **`saveState`** | Write function for persistence. |
| **`isFullscreen`** | Boolean for Portal Expansion Flow active state. |
| **`sourceRect`** | Captured rect for PEF animation origin `{top, left, width, height}`. |

---

## 9. Technical Rules

| Rule | Details |
| :--- | :--- |
| **sw (Parallel Worlds)** | Never unify MobileExperience and DesktopExperience. They are separate topologies. |
| **translate="no"** | All platform names, brand names, and personal names must have `translate="no"` attribute. |
| **Motion import** | Always use `import { motion } from "motion/react"`. Never `"framer-motion"`. |
| **Glass buttons** | Use `style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}` not `bg-white/20` for Motion. |
| **@backend annotation** | All components using future backend data must accept typed props with mock defaults from `mock-backend.ts`. |
| **Overlay close** | `setIsBilanView(false)` WITHOUT `setOverlayPage('bilan')` to avoid TAF tab flash. |
| **No layout in PEF** | Never use `layout` prop on children inside the Portal Expansion Flow portal. |

---

## How to use this vocabulary?

To request a change, use the **Simple Name** or **Abbreviation**.

*Example:* "Add a red button on page **`ONB_SEARCH`**."
*Example:* "Modify the title in **`STREAM_MAIN`**."
*Example:* "The opportunity block disappeared from **`HOME_STREAMING`**, put it back."
*Example:* "Fix the **PEF** animation on **`RM_VIDEO_FS`**."
*Example:* "The **GLS** rotation is wrong on **`RM_VIDEO_GLS`**."
*Example:* "Check the **CS** transition on **`ONB_AUTH`** between Login and ForgotPassword."

---
---
---

# Dictionnaire de Vocabulaire - DataVibe Platform (V2.0)

Utilisez ce vocabulaire pour designer precisement les pages, etats, et flux spatiaux de l'application.

---

## 1. Flux d'Onboarding

| Nom Simple | Description | Fichier |
| :--- | :--- | :--- |
| **`ONB_WELCOME`** | L'ecran d'accueil violet avec WelcomeCarousel. | `NewPlatform.tsx` (Step 0) |
| **`ONB_SEARCH`** | L'ecran de recherche d'artiste. | `ArtistSearchPage.tsx` |
| **`ONB_SYNC`** | L'ecran de chargement avec 3 etapes. | `SyncingPage.tsx` |
| **`ONB_AUTH`** | La carte d'authentification avec transitions Chrysalis Shift. | `NewPlatform.tsx` (Step 1-3) |

---

## 2. Dashboard - Mode APERCU

| Nom Simple | Univers | Contenu |
| :--- | :--- | :--- |
| **`HOME_STREAMING`** | Streaming | Stats + Bloc Opportunite |
| **`HOME_SOCIAL`** | Reseaux | Stats + Bouton "Voir Dashboard" |
| **`HOME_RADIO`** | Radio | Stats Rotations |

---

## 3. Dashboard - Mode COMPLET

### Streaming (`FOCUS_STREAMING`)
`STREAM_MAIN` / `STREAM_PERF` / `STREAM_SONGS`

### Social (`FOCUS_SOCIAL`)
`SOCIAL_MAIN` / `SOCIAL_SUBS` / `SOCIAL_DEMO`

### Radio (`FOCUS_RADIO`)
`RADIO_MAIN` / `RADIO_STATIONS` / `RADIO_SONGS`

---

## 4. Pages Overlay
`OVERLAY_BILAN` / `OVERLAY_NIVEAU` / `OVERLAY_CONNEXIONS` / `OVERLAY_OFFRE` / `OVERLAY_LEGAL` / `OVERLAY_ABOUT`

---

## 5. Reflex Matrix
`RM_LAB` / `RM_OPPORTUNITY` / `RM_VIDEO` / `RM_VIDEO_FS` (PEF) / `RM_VIDEO_GLS` (rotation mobile)

---

## 6. Vocabulaire Spatial Flow

| Terme | Abrev. | Usage |
| :--- | :--- | :--- |
| Transmigration Laterale | TL | Onglets, carrousel |
| Descente Astrale de Retour | DAR | Fermeture overlay |
| Follow Flow | FF | Direction du contenu |
| Chrysalis Shift | CS | Transitions auth |
| Matrice Reflex | RM | Expansion carte |
| Portal Expansion Flow | PEF | Plein ecran video |
| Gyroscopic Landscape Shift | GLS | Rotation paysage mobile |
| Samsara Shift | SS | Navigation qui transmigre |
| Layout Projection Shield | LPS | Protection layoutId |
| Controles Verre Cinematique | CGC | Boutons verre depoli |
| Cascade Spatiale Sequentielle | SSC | Chargement par vagues |
| Glissement Lateral | LG | Entree de listes |
