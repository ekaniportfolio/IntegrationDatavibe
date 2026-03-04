# Protocole "Verrouillage des Acquis" (VA) - Reflex Matrix

Ce document constitue la source unique de vérité technique (Single Source of Truth) pour l'implémentation du système **Reflex Matrix (RM)**. Il définit les lois physiques, les séquences temporelles et les stratégies de rendu qui garantissent l'expérience "Glassmorphism Organique".

## 1. Philosophie du "Soft Lock" (Positionnement Absolu)

Le Reflex Matrix ne se contente pas de s'ouvrir ; il prend le contrôle du Viewport.

*   **Règle d'Or (10rem)** : Lors de la mitose (activation), le bord supérieur du composant mère DOIT s'aligner précisément à **10rem (160px)** du bord supérieur du viewport.
*   **Objectif** : Créer un "Sanctuaire Visuel" où le contenu est parfaitement cadré, ni trop haut (écrasé), ni trop bas (perdu).
*   **Contrainte** : Ce mouvement doit être fluide (Soft UI), sans saut brusque (Jank), quel que soit l'état initial du scroll ou la hauteur de la page.

## 2. Physique du Scroll : La Stratégie du "Buffer Temporaire"

C'est l'innovation technique majeure (v2.4) pour éviter le "glitch du bas de page".

### Le Problème
Sur une page courte, essayer de scroller un élément vers le haut échoue car le bas du document heurte le bas du viewport ("Scroll Clamping"). Cela crée un "petit pas" frustrant au lieu d'une remontée franche.

### La Solution : Buffer Temporaire (Inverse Trapdoor)
1.  **Phase d'Amorce (Click)** : Dès l'interaction, nous injectons artificiellement un padding massif (`pb-[100vh]`) au conteneur.
    *   *Effet* : La page double virtuellement de hauteur. Le scroll devient libre.
2.  **Calcul de Trajectoire** :
    ```typescript
    const targetOffset = 10 * rem; // 160px
    const targetScrollY = Math.max(0, currentScrollY + elementClientTop - targetOffset);
    ```
3.  **Phase de Vol (Scroll)** : L'animation de scroll s'exécute librement vers la cible exacte.
4.  **Phase de Stabilisation (Mitosis Complete)** : Une fois la mitose terminée (et le contenu agrandi), le padding est retiré. Le contenu réel soutient désormais la position de scroll.

## 3. Orchestration Temporelle (Timeline Critique)

L'expérience repose sur une synchronisation millimétrée entre le Scroll et la Mitose.

| Temps (ms) | Action | État Technique |
| :--- | :--- | :--- |
| **T=0** | Click Utilisateur | `isScrolling = true` (Buffer actif), `requestAnimationFrame` |
| **T+16** | Début Scroll | Calcul de `targetScrollY`, début `animate(scrollY)` |
| **T+500** | **Déclenchement Mitose** | `setIsDivided(true)` : Les segments s'ouvrent, hauteur réelle augmente |
| **T+800** | Fin Scroll | Le viewport est à 10rem. L'inertie visuelle continue via la mitose. |
| **T+1600** | **Stabilisation** | `mitosisComplete = true`, `isScrolling = false` (Buffer retiré) |

## 4. Esthétique & Mouvement (Design System)

### A. Opacités & Hiérarchie
*   **Mother (Segment 1)** : Doit toujours avoir un fond à **10% d'opacité** (`bg-color/10`) et une bordure à **30%** (`border-color/30`). C'est un fantôme, pas un mur.
*   **Enfants (Segments 2-4)** : Héritent de cette transparence. Pas de fonds opaques.

### B. Entrées Latérales (Lateral Transmigration)
*   **Loi de l'Impact** : Les segments enfants ne doivent pas apparaître en fondu (fade-in) simple.
*   **Vecteurs** :
    *   Segment 2 & 4 : Entrée depuis la gauche/droite avec un offset de **+/- 400px minimum**.
    *   Segment 3 (Insight) : Entrée opposée ou retardée.
*   **Flou Cinétique** : Utiliser `filter: blur(10px)` -> `blur(0px)` synchronisé avec le mouvement latéral.

## 5. Master Prompt pour LLM (Génération de Code)

Pour générer ou itérer sur un composant RM, utiliser ce contexte strict :

> "Tu agis en tant qu'Architecte Reflex Matrix. Le composant que tu génères est une entité organique, pas une simple carte UI.
>
> 1. **Structure** : Utilise `framer-motion` pour tout. Le parent est une 'Mother Cell' qui subit une mitose en 4 segments.
> 2. **Scroll Physics** : IMPLÉMENTE OBLIGATOIREMENT la stratégie du 'Buffer Temporaire'. Au clic, ajoute `pb-[100vh]`, calcule la position cible (Top élément - 10rem), scrolle, et retire le buffer UNIQUEMENT à la fin de la séquence (1.6s).
> 3. **Visuel** : Respecte les opacités (Fond 0.1, Bordure 0.3). Utilise des dégradés linéaires diagonaux (Top-Left -> Bottom-Right).
> 4. **Motion** : Les segments internes (2, 3, 4) doivent entrer latéralement (+/- 400px) avec un flou de mouvement.
> 5. **Typographie** : Utilise 'Manrope' partout. Pas de polices système."

## 6. Maintenance & Évolution

*   **Règle de Non-Régression** : Ne jamais supprimer le buffer de scroll (`isScrolling`) avant la fin explicite de l'animation (`mitosisComplete`). C'est la garantie anti-glitch.
*   **Ghost DOM** : Toujours utiliser un Ghost DOM invisible pour mesurer la hauteur future des segments avant l'animation, afin de garantir des transitions fluides (`layout` prop de Framer Motion ne suffit pas toujours pour des calculs complexes).
