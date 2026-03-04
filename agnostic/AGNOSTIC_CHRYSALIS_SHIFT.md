# 🦋 AGNOSTIC CHRYSALIS SHIFT
## Universal Content Transmutation Protocol for Any React/Motion Project

---

> *"The container does not change pages. It sheds its skin."*
> — Michel EKANI, Spatial Flow Framework

---

## 1. WHAT IS CHRYSALIS SHIFT?

The **Chrysalis Shift [CS]** is a Spatial Flow pattern for transforming the content inside a container while the container itself persists. Unlike page transitions (where views replace each other) or modals (where overlays appear), the Chrysalis Shift treats the container as a **living vessel** that breathes and metamorphoses.

### The Biological Metaphor
A caterpillar doesn't disappear so a butterfly can appear. The transformation happens **inside the chrysalis**. The outer shell contracts, reshapes, and a new being emerges.

- **The Chrysalis** = Your card/panel/modal (persists, never unmounts)
- **The Caterpillar** = Current content (exits element by element)
- **The Butterfly** = New content (enters element by element)
- **The Breathing** = Height animation (container reshapes between states)

---

## 2. THE THREE-PHASE WEAVE

The core technique is **Phase Weaving** — three animations that overlap in time to create a seamless continuum.

### Phase 1: DISSOLUTION (Content Exit)
Current content elements exit the stage one by one.
```
opacity: 1 → 0
y: 0 → -8px
timing: each element exits with stagger delay
```

### Phase 2: BREATHING (Height Change)
Container reshapes at **55%** of Phase 1 completion.
```
maxHeight: oldHeight → newHeight
ease: [0.4, 0, 0.2, 1]
duration: 0.4s
```

### Phase 3: EMERGENCE (Content Entry)
New content enters at **65%** of Phase 2 completion.
```
opacity: 0 → 1
y: 8px → 0
timing: delay + index * stagger
```

### Visual Timeline
```
Time ────────────────────────────────────────────────────────>

Phase 1: ██████████████████████████░░░░░░░░░░░░░░░░
          |-- Content Exit (100%) --|
                              55% ─┤
Phase 2:                           ██████████████████████░░░░
                                   |-- Height (100%) --|
                                                 65% ─┤
Phase 3:                                              ████████████████
                                                      |-- Entry --|
```

---

## 3. DIRECTIONAL MOMENTUM

Timings are **asymmetric** based on whether the container shrinks or grows:

### Compression (Large → Small)
The new content has less space, so it arrives faster.
```javascript
delay:    -50%  // Enter earlier
duration: -31%  // Faster animation
stagger:  -33%  // Tighter grouping
```

### Unfolding (Small → Large)
The new content has more room, so it unfolds energetically.
```javascript
delay:    -70%  // Enter much earlier
duration: -37%  // Quick, snap-like
stagger:  -47%  // Machine-gun reveal
```

---

## 4. AGNOSTIC IMPLEMENTATION

### A. The Orchestrator Hook

```tsx
import { useState, useCallback } from 'react';

// Soul Constants
const CHRYSALIS_SOUL = {
    height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    dissolution: { duration: 0.6, stagger: 0.1 },
    emergence: {
        default: { delay: 0.5, duration: 0.8, stagger: 0.15 },
        compression: { delay: 0.25, duration: 0.55, stagger: 0.10 },
        unfolding: { delay: 0.15, duration: 0.5, stagger: 0.08 },
    },
    weaving: { dissolutionAt: 0.55, emergenceAt: 0.65 },
};

function useChrysalisShift(views: Record<string, { height: number; elementCount: number }>) {
    const [currentView, setCurrentView] = useState(Object.keys(views)[0]);
    const [targetHeight, setTargetHeight] = useState(views[Object.keys(views)[0]].height);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [timingOverride, setTimingOverride] = useState<'default' | 'compression' | 'unfolding'>('default');

    const transitionTo = useCallback((nextView: string) => {
        if (isTransitioning || nextView === currentView) return;
        setIsTransitioning(true);

        const current = views[currentView];
        const next = views[nextView];

        // Calculate total dissolution time
        const dissolutionTime = CHRYSALIS_SOUL.dissolution.duration
            + (current.elementCount - 1) * CHRYSALIS_SOUL.dissolution.stagger;

        // Determine direction
        const direction = next.height < current.height ? 'compression' : 'unfolding';

        // Phase 2: Breathing at 55%
        const heightStart = dissolutionTime * CHRYSALIS_SOUL.weaving.dissolutionAt * 1000;
        setTimeout(() => {
            setTargetHeight(next.height);
        }, heightStart);

        // Phase 3: Emergence at 65% of height
        const contentSwitch = heightStart
            + CHRYSALIS_SOUL.height.duration * CHRYSALIS_SOUL.weaving.emergenceAt * 1000;
        setTimeout(() => {
            setTimingOverride(direction);
            setCurrentView(nextView);
            setIsTransitioning(false);
            // Reset timing override after render
            setTimeout(() => setTimingOverride('default'), 100);
        }, contentSwitch);
    }, [currentView, isTransitioning, views]);

    const emergence = CHRYSALIS_SOUL.emergence[timingOverride];

    return {
        currentView,
        targetHeight,
        isTransitioning,
        transitionTo,
        emergence,
        dissolution: CHRYSALIS_SOUL.dissolution,
        heightTransition: CHRYSALIS_SOUL.height,
    };
}
```

### B. The Container Component

```tsx
import { motion } from 'motion/react';

interface ChrysalisContainerProps {
    targetHeight: number;
    heightTransition: { duration: number; ease: number[] };
    children: React.ReactNode;
}

const ChrysalisContainer = ({
    targetHeight,
    heightTransition,
    children,
}: ChrysalisContainerProps) => (
    <motion.div
        className="overflow-hidden rounded-2xl bg-white shadow-xl"
        animate={{ maxHeight: targetHeight }}
        transition={{
            maxHeight: {
                duration: heightTransition.duration,
                ease: heightTransition.ease,
            },
        }}
    >
        {children}
    </motion.div>
);
```

### C. The Content Elements

```tsx
import { motion } from 'motion/react';

interface ChrysalisContentProps {
    elements: React.ReactNode[];
    isClosing: boolean;
    dissolution: { duration: number; stagger: number };
    emergence: { delay: number; duration: number; stagger: number };
}

const ChrysalisContent = ({
    elements,
    isClosing,
    dissolution,
    emergence,
}: ChrysalisContentProps) => (
    <div className="p-6 flex flex-col gap-4">
        {elements.map((el, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={isClosing
                    ? {
                        opacity: 0,
                        y: -8,
                        transition: {
                            duration: dissolution.duration,
                            delay: i * dissolution.stagger,
                            ease: [0.4, 0, 0.2, 1],
                        },
                      }
                    : {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: emergence.duration,
                            delay: emergence.delay + i * emergence.stagger,
                            ease: [0.4, 0, 0.2, 1],
                        },
                      }
                }
            >
                {el}
            </motion.div>
        ))}
    </div>
);
```

### D. Full Usage Example

```tsx
import { useState } from 'react';

const VIEWS = {
    login: { height: 480, elementCount: 6 },
    forgotPassword: { height: 320, elementCount: 4 },
    register: { height: 600, elementCount: 8 },
};

const AuthCard = () => {
    const {
        currentView,
        targetHeight,
        isTransitioning,
        transitionTo,
        emergence,
        dissolution,
        heightTransition,
    } = useChrysalisShift(VIEWS);

    return (
        <ChrysalisContainer
            targetHeight={targetHeight}
            heightTransition={heightTransition}
        >
            {currentView === 'login' && (
                <ChrysalisContent
                    isClosing={isTransitioning}
                    dissolution={dissolution}
                    emergence={emergence}
                    elements={[
                        <h2>Sign In</h2>,
                        <input placeholder="Email" />,
                        <input type="password" placeholder="Password" />,
                        <button onClick={() => transitionTo('forgotPassword')}>
                            Forgot Password?
                        </button>,
                        <button>Sign In</button>,
                        <button onClick={() => transitionTo('register')}>
                            Create Account
                        </button>,
                    ]}
                />
            )}
            {currentView === 'forgotPassword' && (
                <ChrysalisContent
                    isClosing={isTransitioning}
                    dissolution={dissolution}
                    emergence={emergence}
                    elements={[
                        <h2>Reset Password</h2>,
                        <input placeholder="Email" />,
                        <button>Send Reset Link</button>,
                        <button onClick={() => transitionTo('login')}>
                            Back to Sign In
                        </button>,
                    ]}
                />
            )}
            {currentView === 'register' && (
                <ChrysalisContent
                    isClosing={isTransitioning}
                    dissolution={dissolution}
                    emergence={emergence}
                    elements={[
                        <h2>Create Account</h2>,
                        <input placeholder="Full Name" />,
                        <input placeholder="Email" />,
                        <input type="password" placeholder="Password" />,
                        <input type="password" placeholder="Confirm Password" />,
                        <input placeholder="Phone" />,
                        <button>Register</button>,
                        <button onClick={() => transitionTo('login')}>
                            Already have an account?
                        </button>,
                    ]}
                />
            )}
        </ChrysalisContainer>
    );
};
```

---

## 5. REAL-WORLD USE CASES

### Authentication Flows
Sign-In ↔ Forgot Password ↔ Register within a single card.
*The card contracts for simpler forms, expands for complex ones.*

### Multi-Step Forms
Registration Step 1 → Step 2 → Step 3 within a single panel.
*Each step dissolves and the next emerges with the form breathing between steps.*

### Settings Panels
General → Advanced → Developer settings in a single sidebar panel.
*The panel reshapes for each category's different number of options.*

### E-Commerce Checkout
Cart → Shipping → Payment → Confirmation in a single card.
*The checkout flow feels like a single evolving surface, not separate pages.*

### Dashboard Widget Drill-Down
KPI Summary → Detailed Chart → Raw Data Table within a single widget.
*The widget breathes as it reveals progressively deeper information.*

### Chat Interface
Conversation List → Message Detail → User Profile within a single panel.
*Content metamorphoses contextually without breaking spatial continuity.*

### Pricing Tables
Monthly → Annual → Enterprise pricing within the same card container.
*Plans dissolve and reform with different numbers of features listed.*

---

## 6. RULES & PROHIBITIONS

### DO:
- Keep the container mounted at all times (Vessel Persistence)
- Use `maxHeight` + `overflow: hidden` for breathing
- Use the `[0.4, 0, 0.2, 1]` easing curve for all phases
- Apply Directional Momentum (different timings for different directions)
- Ensure Phase Weaving (55%/65% overlap thresholds)

### DO NOT:
- Unmount the container during transition
- Show old and new content simultaneously
- Use linear easing for height changes
- Use symmetric timings for both directions
- Use `display: none` on exiting content
- Leave dead time between phases

---

---
---

# 🦋 CHRYSALIS SHIFT AGNOSTIQUE
## Protocole Universel de Transmutation de Contenu pour Tout Projet React/Motion

---

> *"Le conteneur ne change pas de page. Il mue."*
> — Michel EKANI, Framework Spatial Flow

---

## 1. QU'EST-CE QUE LE CHRYSALIS SHIFT ?

Le **Chrysalis Shift [CS]** est un pattern Spatial Flow pour transformer le contenu à l'intérieur d'un conteneur tandis que le conteneur lui-même persiste. Contrairement aux transitions de page (où les vues se remplacent) ou aux modales (où des overlays apparaissent), le Chrysalis Shift traite le conteneur comme un **vaisseau vivant** qui respire et se métamorphose.

### La Métaphore Biologique
Une chenille ne disparaît pas pour qu'un papillon apparaisse. La transformation se produit **à l'intérieur du chrysalide**. La coque extérieure se contracte, se remodèle, et un nouvel être émerge.

- **Le Chrysalide** = Votre carte/panneau/modale (persiste, ne se démonte jamais)
- **La Chenille** = Le contenu actuel (sort élément par élément)
- **Le Papillon** = Le nouveau contenu (entre élément par élément)
- **La Respiration** = L'animation de hauteur (le conteneur se remodèle entre les états)

---

## 2. LE TISSAGE EN TROIS PHASES

La technique centrale est le **Tissage de Phases** — trois animations qui se chevauchent dans le temps pour créer un continuum sans rupture.

### Phase 1 : DISSOLUTION (Sortie Contenu)
Les éléments du contenu actuel quittent la scène un par un.
```
opacity: 1 → 0
y: 0 → -8px
timing: chaque élément sort avec un délai de stagger
```

### Phase 2 : RESPIRATION (Changement de Hauteur)
Le conteneur se remodèle à **55%** de l'achèvement de la Phase 1.
```
maxHeight: ancienneHauteur → nouvelleHauteur
ease: [0.4, 0, 0.2, 1]
duration: 0.4s
```

### Phase 3 : ÉMERGENCE (Entrée Contenu)
Le nouveau contenu entre à **65%** de l'achèvement de la Phase 2.
```
opacity: 0 → 1
y: 8px → 0
timing: delay + index * stagger
```

### Timeline Visuelle
```
Temps ────────────────────────────────────────────────────────>

Phase 1: ██████████████████████████░░░░░░░░░░░░░░░░
          |-- Sortie Contenu (100%) --|
                              55% ─┤
Phase 2:                           ██████████████████████░░░░
                                   |-- Hauteur (100%) --|
                                                 65% ─┤
Phase 3:                                              ████████████████
                                                      |-- Entrée --|
```

---

## 3. ÉLAN DIRECTIONNEL

Les timings sont **asymétriques** selon que le conteneur rétrécit ou grandit :

### Compression (Grand → Petit)
Le nouveau contenu a moins d'espace, donc il arrive plus vite.
```javascript
delay:    -50%  // Entrer plus tôt
duration: -31%  // Animation plus rapide
stagger:  -33%  // Groupement plus serré
```

### Dépliage (Petit → Grand)
Le nouveau contenu a plus de place, donc il se déplie énergiquement.
```javascript
delay:    -70%  // Entrer beaucoup plus tôt
duration: -37%  // Rapide, type snap
stagger:  -47%  // Révélation mitrailleuse
```

---

## 4. CAS D'USAGE CONCRETS

### Flux d'Authentification
Sign-In ↔ Mot de Passe Oublié ↔ Inscription dans une seule carte.
*La carte se contracte pour les formulaires simples, s'étend pour les complexes.*

### Formulaires Multi-Étapes
Inscription Étape 1 → Étape 2 → Étape 3 dans un seul panneau.
*Chaque étape se dissout et la suivante émerge avec la respiration du formulaire entre les étapes.*

### Panneaux de Paramètres
Général → Avancé → Développeur dans un seul panneau latéral.
*Le panneau se remodèle pour le nombre différent d'options de chaque catégorie.*

### Paiement E-Commerce
Panier → Livraison → Paiement → Confirmation dans une seule carte.
*Le flux de paiement ressemble à une surface unique qui évolue, pas à des pages séparées.*

### Drill-Down de Widget Dashboard
Résumé KPI → Graphique Détaillé → Tableau de Données Brutes dans un seul widget.
*Le widget respire en révélant des informations progressivement plus profondes.*

### Interface Chat
Liste de Conversations → Détail Messages → Profil Utilisateur dans un seul panneau.
*Le contenu se métamorphose contextuellement sans briser la continuité spatiale.*

### Tables de Tarification
Mensuel → Annuel → Enterprise dans le même conteneur carte.
*Les plans se dissolvent et se reforment avec un nombre différent de fonctionnalités listées.*

---

## 5. RÈGLES & INTERDICTIONS

### FAIRE :
- Garder le conteneur monté en permanence (Persistance du Vaisseau)
- Utiliser `maxHeight` + `overflow: hidden` pour la respiration
- Utiliser la courbe d'easing `[0.4, 0, 0.2, 1]` pour toutes les phases
- Appliquer l'Élan Directionnel (timings différents pour chaque direction)
- Assurer le Tissage de Phases (seuils de chevauchement 55%/65%)

### NE PAS FAIRE :
- Démonter le conteneur pendant la transition
- Montrer l'ancien et le nouveau contenu simultanément
- Utiliser un easing linéaire pour les changements de hauteur
- Utiliser des timings symétriques pour les deux directions
- Utiliser `display: none` sur le contenu sortant
- Laisser du temps mort entre les phases
