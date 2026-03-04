/**
 * SPATIAL FLOW FRAMEWORK -- useSamsaraShift Hook
 * =================================================
 * Samsara Shift Protocol — Direction-Aware Tab Navigation.
 *
 * "The Vessel carries the Soul. The Indicator points the way."
 *
 * Philosophy:
 * Unlike standard tab switching (instant swap), Samsara Shift encodes
 * the DIRECTION of navigation into the transition. Content flows
 * in the direction of the user's attention, while an indicator
 * (underline, pill, dot) follows with lighter, faster physics.
 *
 * Architecture:
 * - Vessel:    The content container. Uses SAMSARA_VESSEL (heavier spring).
 * - Indicator: The visual pointer (tab underline). Uses SAMSARA_INDICATOR (lighter spring).
 * - Direction: Computed from old→new index. Drives Follow Flow variants.
 *
 * This hook provides:
 * - `activeIndex`:      Current tab index
 * - `direction`:        -1 | 0 | 1
 * - `goTo(index)`:      Navigate to a tab
 * - `vesselTransition`:  Ready transition for the content container
 * - `indicatorTransition`: Ready transition for the indicator
 * - `contentVariants`:  Follow Flow enter/center/exit variants
 * - `indicatorStyle`:   Animated translateX for the indicator
 *
 * @example
 * function TabLayout({ tabs }) {
 *   const samsara = useSamsaraShift({
 *     tabCount: tabs.length,
 *     tabWidth: 120,
 *   });
 *
 *   return (
 *     <div>
 *       {/* Tab Bar *\/}
 *       <div className="relative flex">
 *         {tabs.map((tab, i) => (
 *           <button key={i} onClick={() => samsara.goTo(i)}>
 *             {tab.label}
 *           </button>
 *         ))}
 *         <motion.div
 *           className="absolute bottom-0 h-0.5 bg-primary"
 *           style={{ width: 120 }}
 *           animate={{ x: samsara.indicatorX }}
 *           transition={samsara.indicatorTransition}
 *         />
 *       </div>
 *
 *       {/* Content *\/}
 *       <AnimatePresence initial={false} custom={samsara.direction}>
 *         <motion.div
 *           key={samsara.activeIndex}
 *           custom={samsara.direction}
 *           variants={samsara.contentVariants}
 *           initial="enter"
 *           animate="center"
 *           exit="exit"
 *           transition={samsara.vesselTransition}
 *         >
 *           {tabs[samsara.activeIndex].content}
 *         </motion.div>
 *       </AnimatePresence>
 *     </div>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useCallback, useMemo } from "react";
import type { FlowDirection, FollowFlowVariants } from "../core/types";
import { SAMSARA_VESSEL, SAMSARA_INDICATOR } from "../core/soul-constants";
import { scaledSpring } from "../core/scale-transition";
import { getReducedMotion, REDUCED_TRANSITION } from "../core/reduced-motion";

// ─── Options ──────────────────────────────────────────────────────────────────

interface UseSamsaraShiftOptions {
  /** Total number of tabs */
  tabCount: number;
  /** Width of each tab in pixels (for indicator position calculation) */
  tabWidth?: number;
  /** Starting tab index (default: 0) */
  initialIndex?: number;
  /** Horizontal displacement for content slide in pixels (default: 300) */
  xDistance?: number;
  /** Include opacity transitions on content (default: true) */
  withOpacity?: boolean;
  /** Include blur during flight (default: false) */
  withBlur?: boolean;
  /** Blur amount in pixels (default: 6) */
  blurAmount?: number;
  /** Callback when tab changes */
  onChange?: (index: number, direction: FlowDirection) => void;
}

// ─── Return Type ──────────────────────────────────────────────────────────────

interface UseSamsaraShiftReturn {
  /** Current active tab index */
  activeIndex: number;
  /** Current flow direction: -1 (left), 0 (initial), 1 (right) */
  direction: FlowDirection;
  /** Navigate to a specific tab index */
  goTo: (index: number) => void;
  /** Navigate to next tab */
  next: () => void;
  /** Navigate to previous tab */
  prev: () => void;
  /** Ready transition for the content Vessel */
  vesselTransition: Record<string, any>;
  /** Ready transition for the Indicator */
  indicatorTransition: Record<string, any>;
  /** Follow Flow variants for AnimatePresence */
  contentVariants: FollowFlowVariants;
  /** Computed translateX for the indicator */
  indicatorX: number;
  /** Whether the user prefers reduced motion */
  isReduced: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSamsaraShift(
  options: UseSamsaraShiftOptions
): UseSamsaraShiftReturn {
  const {
    tabCount,
    tabWidth = 120,
    initialIndex = 0,
    xDistance = 300,
    withOpacity = true,
    withBlur = false,
    blurAmount = 6,
    onChange,
  } = options;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<FlowDirection>(0);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= tabCount || index === activeIndex) return;
      const d: FlowDirection = index > activeIndex ? 1 : -1;
      setDirection(d);
      setActiveIndex(index);
      onChange?.(index, d);
    },
    [activeIndex, tabCount, onChange]
  );

  const next = useCallback(() => {
    if (activeIndex < tabCount - 1) goTo(activeIndex + 1);
  }, [activeIndex, tabCount, goTo]);

  const prev = useCallback(() => {
    if (activeIndex > 0) goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Vessel transition (heavier spring → content slides)
  const vesselTransition = useMemo(() => {
    if (getReducedMotion()) {
      return { ...REDUCED_TRANSITION };
    }
    const spring = scaledSpring(
      SAMSARA_VESSEL.stiffness,
      SAMSARA_VESSEL.damping,
      SAMSARA_VESSEL.mass
    );
    return {
      x: spring,
      ...(withOpacity && { opacity: { duration: 0.15, ease: "easeOut" } }),
      ...(withBlur && { filter: { duration: 0.2, ease: "easeOut" } }),
    };
  }, [withOpacity, withBlur]);

  // Indicator transition (lighter spring → snappier)
  const indicatorTransition = useMemo(() => {
    if (getReducedMotion()) {
      return { ...REDUCED_TRANSITION };
    }
    return scaledSpring(
      SAMSARA_INDICATOR.stiffness,
      SAMSARA_INDICATOR.damping,
      SAMSARA_INDICATOR.mass
    );
  }, []);

  // Follow Flow variants for content enter/exit
  const contentVariants = useMemo<FollowFlowVariants>(
    () => ({
      enter: (d: FlowDirection) => ({
        x: d > 0 ? xDistance : -xDistance,
        ...(withOpacity && { opacity: 0 }),
        ...(withBlur && { filter: `blur(${blurAmount}px)` }),
      }),
      center: {
        zIndex: 1,
        x: 0,
        ...(withOpacity && { opacity: 1 }),
        ...(withBlur && { filter: "blur(0px)" }),
      },
      exit: (d: FlowDirection) => ({
        zIndex: 0,
        x: d < 0 ? xDistance : -xDistance,
        ...(withOpacity && { opacity: 0 }),
        ...(withBlur && { filter: `blur(${blurAmount}px)` }),
      }),
    }),
    [xDistance, withOpacity, withBlur, blurAmount]
  );

  // Indicator position
  const indicatorX = activeIndex * tabWidth;

  return {
    activeIndex,
    direction,
    goTo,
    next,
    prev,
    vesselTransition,
    indicatorTransition,
    contentVariants,
    indicatorX,
    isReduced: getReducedMotion(),
  };
}
