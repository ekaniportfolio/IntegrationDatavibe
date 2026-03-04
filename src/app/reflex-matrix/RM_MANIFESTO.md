# Manifeste du Système Reflex Matrix (RM)

Ce document constitue la spécification technique et philosophique de l'interaction phare de l'écosystème **Mondes Parallèles**.

## 1. Philosophie : L'Interface Organique
Le RM n'est pas un composant UI standard ; c'est une entité vivante. Il repose sur le concept de **mitose cellulaire**.
- **Repos** : Une cellule unique, protégée par une "Peau" (Hull) monolithique.
- **Action** : Une division traumatique mais fluide où la membrane disparaît pour laisser place à des segments autonomes.
- **Éjection** : L'énergie de la division propulse le bouton principal vers l'extérieur pour libérer l'espace d'interaction.

## 2. Spécifications Techniques (The "Golden Rules")

### Architecture des Couches (Strict z-index)
1.  **Hull (z-20)** : La membrane monolithique (Peau). Elle possède un `borderRadius` de 16px et un `backdrop-blur-md` (12px). Elle s'efface instantanément au sommet de la courbe d'éjection (`Peak Time`).
2.  **Segments (z-10)** : Trois blocs physiques. Au repos, ils sont invisibles (opacité 0). En division, ils s'autonomisent : ils s'écartent (GAP: 20px), retrouvent leur propre radius de 16px et activent leur propre `backdrop-blur-md`.
    *   *Règle d'Or du Flou* : Le flou des segments ne s'active que lorsque celui de la Hull disparaît pour éviter toute superposition chromatique (assombrissement).
3.  **Backstage (z-10)** : Zone située derrière le bouton. Contient la **Recall Arrow** (Chevron).
4.  **Ejector (z-30)** : Le bouton de contrôle. Il suit une trajectoire parabolique complexe.

### Physique & Timing
- **Auto-Centrage** : Le RM impose un scroll doux (offset 152px) 150ms avant la mitose pour garantir une scène visuelle parfaite.
- **Séquence de Mitose** : 1.0s totale.
- **Peak Time (0.8)** : Le moment où le bouton atteint son apogée avant de redescendre à sa position "Divided".
- **Transition** : Utilisation de ressorts : `stiffness: 350, damping: 25, mass: 0.7`.
- **Recall Arrow** : Rotation de 180° à 0° (easing `[0.34, 1.56, 0.64, 1]`).

## 3. Tutoriel d'Implémentation : Créer un Reflex Segment

Pour ajouter un nouveau segment à la matrice :
1.  **Définir la Hauteur** : Chaque segment doit avoir une hauteur fixe au repos (`SEGMENT_H_JOINED`) et une hauteur cible après division.
2.  **Calculer l'Offset du Gradient** : Le `backgroundPosition` du gradient doit être décalé pour maintenir l'illusion d'unité au repos.
3.  **Synchroniser le Flou** : Utiliser `motion.div` pour l'overlay de flou interne du segment, avec une animation d'opacité liée à `isDivided` pour éviter la superposition avec la Hull.

## 4. Spécimen RM Lab (Environnement de Test)

L'espace de laboratoire (RM Lab) est conçu pour une visibilité maximale du spécimen :
- **Background** : `bg-white/[0.04]` pour un contraste doux.
- **Gradients** : Gradients de gravité (Violet/Indigo) à 20% d'opacité.
- **Backlight** : Halo central `white/5` (blur 150px) pour détacher les segments de l'ombre.

## 5. Prompt Master pour LLM (Copier-Coller pour itérations)

> "Tu travailles sur le composant Reflex Matrix (RM). C'est une interface organique simulant une mitose. 
> 1. Hiérarchie : Hull (20), Segments (10), Ejector (30). 
> 2. Continuité du Flou : La Hull a un backdrop-blur ; les segments activent le leur UNIQUEMENT quand la Hull disparaît (évite la superposition de couleurs).
> 3. Trajectoire : Bouton parabolique (Ejection) avec Peak Time à 0.8s. 
> 4. Centrage : Déclenche un scroll auto (offset 152px) 150ms avant la division.
> 5. Recall Arrow : Seul déclencheur de fusion, rotation 180° fluide.
> 6. Physique : Pas de linéaire. Springs (`350, 25, 0.7`) ou Bézier `[0.34, 1.56, 0.64, 1]`."

## 6. Maintenance des États
- `isDivided` : État maître. Doit être remonté dans le Lab parent pour coordonner les animations de page.
- `buttonLabel` : Géré via `useEffect` pour garantir le timing exact par rapport à la physique, et non par rapport au déclenchement du clic.
