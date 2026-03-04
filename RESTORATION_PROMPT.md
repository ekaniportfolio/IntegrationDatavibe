# RESTORATION PROMPT — DataVibe Spatial Flow
## Document de reconstruction exhaustif post-restauration
### Auteur : Michel EKANI | Dernier etat : Version restauree + docs recrees

---

> **STATUT** : TOUS LES CORRECTIFS CODE SONT EN PLACE.
> Les 3 fichiers .md manquants ont ete recrees.
> Ce fichier sert de reference permanente.

---

## REGLE ABSOLUE N.1 — ZONES INTOUCHABLES

**NE JAMAIS MODIFIER les blocs suivants dans `NewPlatform.tsx` :**

### Cercle Visiomorphique MOBILE (~ligne 2128-2190)
- Le `layoutId`
- Toutes les valeurs `animate` (opacity, scale, width, borderRadius, x)
- Toutes les valeurs `transition` (aller ET retour)
- Le contenu du cercle (Search icon, ChevronLeft, flip rotateY)

### Cercle Visiomorphique DESKTOP (~ligne 3773-3817)
- Le `layoutId`
- Toutes les valeurs `animate` (rotateY, opacity, scale, x)
- Toute la `transition` (layout, rotateY, x, opacity)
- Le `initial` et `exit`

### Transitions entre ecrans (search<->sync<->dashboard)
- Les variants (getHorizontalSlideVariants, containerVariants, childSlideVariants, etc.)
- Les constantes (SOUL_PHYSICS, SPATIAL_FLOW_SPEED, ANIMATION_CARTOGRAPHY)
- Tous les AnimatePresence orchestrant les changements d'etapes

---

## CORRECTIFS EN PLACE (REFERENCE)

| # | Fix | Statut |
|---|-----|--------|
| 1 | SCI — Burger/Avatar hors stacking context | EN PLACE |
| 2 | CZS — Z-index conditionnels (avatar, burger) | EN PLACE |
| 3 | Hello Block cache quand UserPanel ouvert | EN PLACE |
| 4 | UserPanel h-0 collapse quand ferme | EN PLACE |
| 5 | Backdrop UserPanel (blur + click-to-close) | EN PLACE |
| 6 | pointerEvents conditionnel dashboard | EN PLACE |
| 7 | Scroll block quand UserPanel ouvert | EN PLACE |
| 8 | LPS (layoutId conditionnel sur les 4 cercles + transition desktop) | EN PLACE |
| 9 | Burger unifie permanent fixed | EN PLACE |
| 10 | Avatar DWP hors wrapper floute | EN PLACE |
| 11 | HSI — Height Sovereignty Isolation (position:absolute on hidden worlds) | EN PLACE |

## DOCUMENTATION EN PLACE

| Fichier | Statut |
|---------|--------|
| `SPATIAL_FLOW_DROP_WATER_PROTOCOL.md` | RECREE |
| `SPATIAL_FLOW_LAYOUT_PROJECTION_SHIELD.md` | RECREE |
| `agnostic/AGNOSTIC_LAYOUT_PROJECTION_SHIELD.md` | RECREE |
| Tous les autres .md racine | PRESENTS |
| Tous les .md agnostic | PRESENTS |
| Tous les .md src/docs | PRESENTS |

## SOCIAL LOCKED STATE — Architecture dual-mode

Le flag `MOCK_SOCIALS_CONNECTED_TO_SPOTIFY` (mock-backend.ts) sert de valeur INITIALE
pour l'état réactif `socialsConnected` dans `usePlatformController()`.

**Deux modes de déblocage :**
1. **Via le flag mock** : mettre `MOCK_SOCIALS_CONNECTED_TO_SPOTIFY = true` → débloqué au chargement
2. **Via l'UI** : l'utilisateur connecte les 4 plateformes (TikTok, YouTube, Instagram, Deezer)
   dans `SocialPlatformConnect` → `onAllConnected()` → `setSocialsConnected(true)` après 600ms

**Intégration backend :**
- Remplacer la constante mock par un fetch GET /api/v1/artist/:id/social/spotify-linked
- Le `onAllConnected` doit aussi POST /api/v1/artist/:id/social/link-all
- Le `setSocialsConnected(true)` sert d'UI optimiste pendant la résolution du POST
- Zéro refactoring nécessaire : juste swapper la source de la valeur initiale

**Composants impliqués :**
- `SocialLockedOverlay.tsx` : `SocialLockedAlert` (alerte glow) + `SocialPlatformConnect` (rows de connexion)
- `SocialPlatformConnect` accepte `onAllConnected?: () => void` (prop callback)
- Utilise `forwardRef` pour compatibilité avec AnimatePresence de Motion
- Toutes les refs à `MOCK_SOCIALS_CONNECTED_TO_SPOTIFY` dans NewPlatform.tsx ont été remplacées
  par l'état réactif `socialsConnected` (sauf import + useState init)

---

## TACHES RESTANTES

- [ ] Z-index conditionnel cercle desktop (`isDropWaterActive ? 'z-[101]' : 'z-40'`)
- [ ] Largeur blocs sous onglets dashboard
- [ ] Enrichissement docs agnostiques (recettes LPS/DWP/CZS)

---

## REGLE ABSOLUE N.2 — TITRES DE MUSIQUES INVARIANTS

**Les titres de chansons/musiques ne sont JAMAIS traduits.**
Ils restent dans leur langue d'origine (francais, chinois, arabe, anglais, etc.),
quel que soit le parametre de langue actif dans l'application (FR/EN/autre).

- Les titres proviennent des donnees `@backend` (mock-backend.ts) et seront servis tels quels par l'API.
- Ne pas ajouter de cles i18n pour les titres de chansons.
- Appliquer `translate="no"` sur les elements affichant des titres de musiques.
- Cette regle s'applique a tous les composants : `SongsTable`, `ReflexOpportunity`, et tout autre composant affichant des titres musicaux.