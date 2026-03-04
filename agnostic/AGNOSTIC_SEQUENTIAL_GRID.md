# SEQUENTIAL GRID [SG]
## Universal Orthogonal Reordering Protocol

---

> *"Chaos is forbidden. Movement follows strict grid lines."*
> -- Michel EKANI, Spatial Flow Framework

---

## 1. WHAT IS THE SEQUENTIAL GRID?

The **Sequential Grid** is a Spatial Flow protocol for reordering, filtering, or rearranging elements within a grid layout. Unlike traditional approaches where items fly chaotically to their new positions ("swarm of bees"), the Sequential Grid enforces **strict orthogonal movement** -- items move like rooks on a chessboard.

### The Problem
When a user applies a filter or sorts a grid, traditional animation libraries move all items simultaneously along diagonal paths. The result is visual chaos -- the user cannot track any individual item, and the transition communicates nothing meaningful.

### The Solution: Mechanical Precision
1. **Orthogonal Only**: Items move on the X axis, THEN on the Y axis. Never diagonally.
2. **Turn-Based**: Item A completes its movement before Item B begins.
3. **No Rotation**: Rotation is a separate step, never combined with translation.

---

## 2. THE RULES

### Rule 1: Orthogonal Decomposition
Every movement is decomposed into its X and Y components, executed sequentially.

```
Diagonal path (FORBIDDEN):
  (x1, y1) -----> (x2, y2)

Orthogonal path (REQUIRED):
  (x1, y1) ---> (x2, y1) ---> (x2, y2)
  OR
  (x1, y1) ---> (x1, y2) ---> (x2, y2)
```

### Rule 2: Turn-Based Execution
Items do not move simultaneously. Each item completes its full orthogonal path before the next begins.

```
T+0.0s: Item A moves X
T+0.3s: Item A moves Y (A complete)
T+0.6s: Item B moves X
T+0.9s: Item B moves Y (B complete)
```

### Rule 3: Rotation Isolation
If an item needs to rotate, rotation happens AFTER translation is complete.

```
Step 1: Move X (translation)
Step 2: Move Y (translation)
Step 3: Rotate (rotation)
```

---

## 3. IMPLEMENTATION

```typescript
const [scope, animate] = useAnimate();

const moveItem = async (
    element: HTMLElement,
    dx: number,
    dy: number,
    rotation?: number
) => {
    // Step 1: Horizontal translation
    if (dx !== 0) {
        await animate(element, { x: dx }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        });
    }

    // Step 2: Vertical translation
    if (dy !== 0) {
        await animate(element, { y: dy }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        });
    }

    // Step 3: Rotation (if needed)
    if (rotation) {
        await animate(element, { rotate: rotation }, {
            duration: 0.2,
            ease: "easeInOut",
        });
    }
};

// Reorder sequence
const reorderGrid = async (items: ReorderItem[]) => {
    for (const item of items) {
        await moveItem(item.element, item.dx, item.dy, item.rotation);
    }
};
```

---

## 4. VISUAL CHARACTER

The Sequential Grid intentionally feels **mechanical** and **precise**, in contrast to the organic feel of other Spatial Flow protocols. This distinction is meaningful:

| Context | Protocol | Feel |
|---------|----------|------|
| Content browsing | Lateral Glide | Organic, woven |
| Content transformation | Chrysalis Shift | Biological, breathing |
| Data manipulation | Sequential Grid | Mechanical, robotic |
| Content expansion | Reflex Matrix | Cellular, mitotic |

The mechanical feel communicates to the user: "This is a data operation, not a content navigation."

---

## 5. USE CASES

### Data Tables
Sorting columns causes rows to rearrange orthogonally.

### Dashboard Widgets
Rearranging dashboard layout uses grid-based movement.

### File Managers
Moving files between folders uses orthogonal paths.

### Kanban Boards
Moving cards between columns: horizontal first, then vertical to position.

### Admin Panels
Reordering menu items, priority lists, or configuration options.

---

## 6. RULES & PROHIBITIONS

### DO:
- Decompose every movement into X then Y (or Y then X)
- Execute items turn-by-turn
- Isolate rotation from translation
- Use the `[0.4, 0, 0.2, 1]` easing for translation steps
- Apply consistent timing per step (0.3s recommended)

### DO NOT:
- Move diagonally
- Move multiple items simultaneously
- Combine rotation with translation
- Use spring physics (this protocol uses duration easing for mechanical feel)
- Apply to organic content (use Lateral Glide or SSC instead)

---
---
---

# GRILLE SEQUENTIELLE [SG]
## Protocole Universel de Reordonnement Orthogonal

---

> *"Le chaos est interdit. Le mouvement suit des lignes de grille strictes."*

---

## RESUME

La **Grille Sequentielle** impose un mouvement **orthogonal strict** pour le reordonnement. Les elements bougent comme des tours sur un echiquier -- jamais en diagonale.

### Les 3 Regles
1. **Orthogonal uniquement** : Bouger X, PUIS Y. Jamais en diagonale.
2. **Tour par tour** : Item A finit avant que Item B commence.
3. **Rotation isolee** : La rotation est une etape separee apres la translation.

### Caractere Visuel
Intentionnellement **mecanique** et **precis**, en contraste avec le caractere organique des autres protocoles. Communique : "ceci est une operation sur les donnees."
