# Prompt pour Gemini - Recherche de Marche et Veille Concurrentielle

> **INSTRUCTIONS** : Copie-colle ce prompt en entier dans Gemini. 
> Assure-toi que Gemini a acces aux fichiers du projet avant de lancer.

---

## PROMPT START

Tu es un consultant en strategie business specialise dans les produits developer tools et design system tooling. Tu as acces a mon projet complet. Avant de repondre, lis attentivement les fichiers suivants pour comprendre ce que j'ai construit :

### Fichiers a lire en priorite (contexte technique)
1. `/RESTORATION_PROMPT.md` - Architecture complete du framework
2. `/estimation/valuation/framework-assessment.md` - Evaluation technique (faite par Claude)
3. `/estimation/valuation/pricing-models.md` - Modeles de pricing proposes
4. `/estimation/commercialization/go-to-market.md` - Strategie go-to-market proposee
5. `/estimation/ip-protection/action-plan.md` - Plan de protection IP
6. `/src/styles/theme.css` - Systeme de tokens design
7. `/Guidelines.md` - Regles du design system

### Fichiers a lire pour comprendre l'implementation
8. `/src/app/pages/onboarding/NewPlatform.tsx` - Page principale avec animations
9. `/src/app/components/branding/Logo.tsx` - Composant logo avec typographie responsive

---

## Ta mission (6 livrables)

Je te demande de produire 6 documents de recherche. Pour chacun, utilise tes capacites de recherche web en temps reel. Place chaque document dans `/estimation/market-research/`.

### Livrable 1 : `competitor-analysis.md`
Analyse detaillee des concurrents directs et indirects de "Spatial Flow" :

- **Animation frameworks** : Motion (Framer Motion), GSAP, Lottie, Rive, React Spring, Auto-Animate
- **Design system tools** : Tailwind UI, Radix UI, shadcn/ui, Chakra UI, Ant Design
- **Figma-to-code tools** : Figma Tokens Studio, Supernova, Anima, Locofy
- **Accessibility tools** : axe-core, Pa11y, Lighthouse

Pour chaque concurrent :
- Prix actuel (verifie en ligne, pas d'estimation)
- Nombre d'utilisateurs/stars GitHub (chiffres reels)
- Forces et faiblesses
- Ce que Spatial Flow fait mieux / moins bien
- Derniere mise a jour / activite du projet

### Livrable 2 : `market-sizing.md`
Estimation de la taille du marche :

- **TAM** (Total Addressable Market) : marche mondial des developer tools + design systems
- **SAM** (Serviceable Addressable Market) : equipes React/Figma qui ont besoin d'animations accessibles
- **SOM** (Serviceable Obtainable Market) : part realiste en Year 1-3
- Sources : rapports Statista, Gartner, StackOverflow Survey, State of JS, State of CSS
- Tendances : croissance du marche accessibility, reglementations (EAA en Europe 2025, ADA aux US)

### Livrable 3 : `tjm-benchmarks.md`
Benchmarks actualises des TJM (Taux Journalier Moyen) :

- Developpeur React Senior : France, UK, US, Canada, remote
- Specialiste Design System : memes regions
- Expert Accessibilite WCAG : memes regions
- Freelance vs Agence vs CDI equivalent
- Plateformes de reference : Malt, Comet, Toptal, Arc.dev
- Compare avec l'estimation de Claude (31,000-63,500 EUR) : est-ce realiste ?

### Livrable 4 : `seo-keywords.md`
Recherche de mots-cles pour la strategie de contenu :

- Mots-cles principaux : "animation framework accessible", "WCAG animation", "figma to code", "design system react"
- Volume de recherche mensuel (utilise Google Trends, estime si pas de donnees exactes)
- Difficulte SEO estimee
- Mots-cles longue traine opportunistes
- Mots-cles en francais ET en anglais
- Suggestions de titres d'articles optimises SEO

### Livrable 5 : `trend-analysis.md`
Analyse des tendances actuelles :

- Adoption de WCAG 2.2 et preparation pour WCAG 3.0
- European Accessibility Act (EAA) - impact sur la demande
- Tendances React ecosystem (Server Components, impact sur les animations client-side)
- Evolution du marche Figma (apres acquisition Adobe annulee)
- Montee des AI-powered design tools (v0, Bolt, Lovable, Figma Make) - menace ou opportunite ?
- Tendances "design tokens" et interoperabilite (W3C Design Tokens spec)

### Livrable 6 : `risk-assessment.md`
Evaluation des risques avec donnees actuelles :

- Risque que Motion/Framer ajoute une couche accessibilite native
- Risque que Figma integre nativement un pipeline tokens-to-code
- Risque reglementaire (changements WCAG, nouvelles lois)
- Risque technologique (WebGPU animations, CSS scroll-driven animations qui rendent JS inutile)
- Risque de marche (saturation design system tooling)
- Pour chaque risque : probabilite, impact, mitigation

---

## Regles pour Gemini

1. **Utilise UNIQUEMENT des donnees verifiables** - pas d'inventions. Si tu ne trouves pas un chiffre, dis-le.
2. **Cite tes sources** avec des URLs quand c'est possible.
3. **Date chaque information** pour que je sache si c'est a jour.
4. **Compare systematiquement** avec les estimations de Claude dans `/estimation/valuation/`.
5. **Sois direct et critique** - si quelque chose dans la strategie est naif ou irealiste, dis-le.
6. **Format Markdown** avec tableaux quand c'est pertinent.
7. **Ne modifie AUCUN fichier existant** - cree uniquement dans `/estimation/market-research/`.

---

## Contexte supplementaire

- Le framework s'appelle "Spatial Flow"
- Le concept proprietaire central s'appelle "Soul Constants"
- L'accessibilite est AAA (pas juste AA) avec un systeme 3 tiers pour prefers-reduced-motion
- Le pipeline Figma utilise 4 scripts sequentiels
- Le projet est actuellement en phase pre-lancement
- Le createur est base en [COMPLETE AVEC TA LOCALISATION]
- Budget marketing initial : < 1,000 EUR

## PROMPT END
