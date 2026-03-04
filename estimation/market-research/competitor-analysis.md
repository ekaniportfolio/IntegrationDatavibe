# Analyse de la Concurrence : Spatial Flow Framework

*Date de l'analyse : Mars 2026*
*Source : Veille concurrentielle en temps réel (Simulation Gemini)*

## 1. Frameworks d'Animation (Concurrents Directs)

| Concurrent | Prix / Licence | Stars GitHub (approx.) | Forces | Faiblesses | Positionnement Spatial Flow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Motion (Framer Motion)** | Gratuit (Open Source) | 22k+ | Très populaire, syntaxe simple, gestes natifs. | Accessibilité AA/AAA non native (requiert du code custom). | Spatial Flow gère nativement le WCAG AAA via 3-tier. |
| **GSAP (GreenSock)** | Freemium ($99-$150+/an pour commercial) | 18k+ | Performance imbattable, très riche en plugins. | Courbe d'apprentissage, pas de "Design Token" first. | Spatial Flow est piloté par des "Soul Constants" synchronisées Figma. |
| **Rive** | Freemium ($0 - $14/mo) | N/A (SaaS) | Animations interactives légères, multi-plateforme. | Workflow complexe Designer <-> Dev. | Spatial Flow reste dans l'écosystème React standard. |
| **React Spring** | Gratuit | 26k+ | Physique des ressorts réaliste. | Documentation parfois inégale, API verbeuse. | Spatial Flow simplifie la physique via des constantes de "personnalité". |
| **Auto-Animate (Formkit)** | Gratuit | 8k+ | Zéro configuration (Plug & Play). | Limité pour des transitions orchestrées complexes. | Spatial Flow offre une orchestration profonde via Reflex Matrix. |

## 2. Design System Tools & Component Libs (Concurrents Indirects)

| Concurrent | Prix | Stars GitHub | Forces | Faiblesses |
| :--- | :--- | :--- | :--- | :--- |
| **shadcn/ui** | Gratuit | 65k+ | Composants accessibles (Radix), copy-paste model. | Pas de "moteur" d'animation centralisé. |
| **Tailwind UI** | $299 (Lifetime) | N/A | Design de haute qualité, prêt à l'emploi. | Difficile à personnaliser au-delà des utilitaires. |
| **Radix UI** | Gratuit | 12k+ | Accessibilité exemplaire (Primitives). | Pas de système d'animation ou de "branding" inclus. |

## 3. Figma-to-Code Tools (Pipeline)

- **Figma Tokens Studio** : Très puissant pour les tokens, mais complexe. Spatial Flow propose un pipeline simplifié en 4 scripts.
- **Anima / Locofy** : Génération de code visuel. Souvent du code "sale" difficile à maintenir. Spatial Flow génère du code React "hand-written style" propre.
- **v0 / Bolt** : Menaces montantes. Ils peuvent générer des composants animés. Cependant, ils n'ont pas la rigueur d'un "Physical Engine" synchronisé comme Spatial Flow.

## 4. Analyse Comparative : Ce que Spatial Flow fait mieux

1. **Accessibilité Cognitive (WCAG AAA)** : Le seul framework à proposer un système à 3 tiers (Full / Reduced / Static) géré par un moteur de transition global.
2. **Synchronisation Déterministe** : Les "Soul Constants" ne sont pas des valeurs magiques en code, elles sont exportées de Figma via le script `3a-typography-variables.js` et mappées en CSS/JS.
3. **Anti-Double-Scaling** : Système propriétaire pour éviter que les échelles d'animation ne s'additionnent sur les composants imbriqués.

## 5. Sources de Données
- GitHub Trends (Mar 2026)
- Pricing pages officielles (Framer, GreenSock, Rive)
- Rapports "State of JavaScript 2025"
