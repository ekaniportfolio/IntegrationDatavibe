# Getting Started with Spatial Flow
## Your First Living Interface in 5 Minutes

---

## Prerequisite: Mental Model Shift

Before writing code, internalize this:

> **You are not building a website. You are directing a movie.**

Every element is an actor. Every transition is a scene change. The viewport is your stage.

---

## Step 1: Your First Soul Physics Animation

```tsx
import { motion } from "motion/react";
import { SOUL_PHYSICS } from "./spatial-flow/core/soul-constants";

function WelcomeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SOUL_PHYSICS.standard}
      className="p-6 bg-white rounded-xl shadow-lg"
    >
      <h1>Welcome to the Living Interface</h1>
    </motion.div>
  );
}
```

**What you'll see**: The card rises into view with a spring animation that has weight and personality. Not a generic `ease-in-out` -- a physics-based spring with `stiffness: 105`, `damping: 18`, `mass: 1`.

---

## Step 2: Lateral Glide List

```tsx
import { KineticItem } from "./spatial-flow/components/KineticItem";

function FeatureList() {
  const features = [
    "Conservation of Mass",
    "Continuity of Identity",
    "Orthogonal Order",
    "Visiomorphism",
  ];

  return (
    <div className="space-y-4 p-8">
      {features.map((feature, i) => (
        <KineticItem key={feature} index={i}>
          <div className="p-4 bg-gray-50 rounded-lg border">
            {feature}
          </div>
        </KineticItem>
      ))}
    </div>
  );
}
```

**What you'll see**: Items weave in from alternating sides (left, right, left, right) with motion blur. The brain instantly perceives them as distinct entities.

---

## Step 3: Sequential Spatial Cascade

```tsx
import { CascadeList, CascadeItem } from "./spatial-flow/components/CascadeList";

function Dashboard() {
  return (
    <CascadeList stagger={0.08} initialDelay={0.3} className="space-y-4">
      <CascadeItem><header>Dashboard Header</header></CascadeItem>
      <CascadeItem><nav>Navigation Tabs</nav></CascadeItem>
      <CascadeItem><main>Main Content Area</main></CascadeItem>
      <CascadeItem><aside>Sidebar Widget</aside></CascadeItem>
      <CascadeItem><footer>Action Buttons</footer></CascadeItem>
    </CascadeList>
  );
}
```

**What you'll see**: Elements materialize in a top-to-bottom cascade, each delayed by 80ms. The user's eye is guided through the hierarchy. No "Data Flashbang".

---

## Step 4: Direction-Aware Navigation (Follow Flow)

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFollowFlow } from "./spatial-flow/hooks/useFollowFlow";
import { SOUL_PHYSICS } from "./spatial-flow/core/soul-constants";

const TABS = ["Home", "Search", "Profile"];

function SpatialTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const { direction, variants, navigateTo } = useFollowFlow();

  const handleTabClick = (newIndex: number) => {
    navigateTo(activeTab, newIndex);
    setActiveTab(newIndex);
  };

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-2 p-4">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => handleTabClick(i)}
            className={activeTab === i ? "font-bold" : "opacity-50"}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content with Follow Flow */}
      <div className="relative overflow-hidden h-64">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: SOUL_PHYSICS.standard,
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 p-8"
          >
            <h2>{TABS[activeTab]}</h2>
            <p>Content for the {TABS[activeTab]} tab.</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

**What you'll see**: Click "Profile" (right of current) -- content slides right. Click "Home" (left of current) -- content slides left. The user builds a mental spatial map.

---

## Step 5: Speed Control

```tsx
import { useSpatialSpeed } from "./spatial-flow/hooks/useSpatialSpeed";
import { scaleTransition } from "./spatial-flow/core/scale-transition";

function SpeedDemo() {
  const { preset, setPreset, presets } = useSpatialSpeed();

  return (
    <div className="p-8">
      <select
        value={preset}
        onChange={(e) => setPreset(e.target.value as any)}
      >
        {presets.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <motion.div
        animate={{ x: [0, 200, 0] }}
        transition={scaleTransition({
          duration: 2,
          repeat: 0,
          ease: "easeInOut",
        })}
        className="mt-8 w-16 h-16 bg-blue-500 rounded-lg"
      />
    </div>
  );
}
```

**What you'll see**: Change the speed preset and the animation duration scales accordingly. Zen = slow and contemplative. Ultra = near-instant.

---

## Next Steps

You've learned the basics. Now go deeper:

1. **`docs/02-SOUL-CONSTANTS.md`** -- Understand the physics engine
2. **`docs/03-PROTOCOLS.md`** -- Learn all 10 protocols
3. **`docs/04-DECISION-TREE.md`** -- Know which protocol to use when
4. **`docs/06-PROHIBITIONS.md`** -- Learn what NEVER to do
