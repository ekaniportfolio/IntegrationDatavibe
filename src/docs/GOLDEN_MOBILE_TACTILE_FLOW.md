# Golden Mobile Tactile Flow (v1.0)

## The Dashboard-to-Search Transition Protocol

Ce document définit les standards techniques pour la transition visiomorphique "Star" de la plateforme mobile.

### 1. La Trajectoire Rectiligne (Straight Line Path)
La transition entre le Dashboard (Screen 4) et la Recherche (Screen 2) doit suivre une ligne oblique parfaite.

*   **Problème** : Le saut vertical au début de l'animation.
*   **Correction** : Appliquer `initial={{ y: -160 }}` sur le conteneur parent (`motion.div`) lors de l'arrivée du Dashboard.
*   **Logic** : En forçant la coordonnée de départ à correspondre à la destination verticale, on élimine la courbe de Bézier verticale parasite.

### 2. Synchronisation Visiomorphique (The Shape Morph)
L'input de recherche n'est pas un champ texte qui apparaît, c'est le bouton du Dashboard qui "mue".

*   **LayoutId** : `visiomorphic-container`.
*   **States** :
    *   *Dashboard* : Cercle parfait (56x56, borderRadius 28).
    *   *Search* : Rect-Arrondi (W: 100%, H: 56, borderRadius 16).
*   **Timing** : `duration: 0.8s`, `ease: [0.32, 0.72, 0, 1]` (Curbe Custom pour la fluidité).

### 3. Focus & Accessibilité (Functional Flow)
*   **Auto-focus** : L'input doit recevoir le focus *via* `inputRef.current.focus()` dès que `isArrivingFromDashboard` est déclenché.
*   **Clavier Mobile** : La transition doit anticiper l'ouverture du clavier mobile pour éviter le "flicker" de layout.
*   **Sticky Mode** : L'interface doit rester en position `-160px` tant que l'utilisateur n'a pas explicitement validé ou annulé la recherche.

### 4. Code Snippet de Référence
```tsx
<motion.div 
    initial={isArrivingFromDashboard ? { y: -160 } : { y: 0 }}
    animate={(isArrivingFromDashboard || isInputFocused) ? { y: -160 } : { y: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 22 }}
>
    {/* Visiomorphic Container */}
</motion.div>
```
