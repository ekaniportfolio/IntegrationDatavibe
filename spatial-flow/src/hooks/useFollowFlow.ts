/**
 * SPATIAL FLOW FRAMEWORK -- useFollowFlow Hook
 * ===============================================
 * Generates direction-aware animation variants for Follow Flow navigation.
 *
 * Follow Flow Philosophy:
 * "Elements follow the direction of attention displacement."
 *
 * If the user clicks a tab to the RIGHT:
 * - Old content exits to the RIGHT
 * - New content enters from the LEFT
 *
 * This is the OPPOSITE of the standard "Push" pattern used in mobile apps.
 *
 * @example
 * function TabContent({ activeTab, tabs }) {
 *   const { direction, setDirection, variants, paginate } = useFollowFlow();
 *
 *   return (
 *     <div className="relative overflow-hidden">
 *       <AnimatePresence initial={false} custom={direction}>
 *         <motion.div
 *           key={activeTab}
 *           custom={direction}
 *           variants={variants}
 *           initial="enter"
 *           animate="center"
 *           exit="exit"
 *           transition={{
 *             x: { type: "spring", stiffness: 300, damping: 30 },
 *             opacity: { duration: 0.2 }
 *           }}
 *         >
 *           {tabs[activeTab]}
 *         </motion.div>
 *       </AnimatePresence>
 *     </div>
 *   );
 * }
 */

import { useState, useCallback, useMemo } from "react";
import type { FlowDirection, FollowFlowVariants } from "../core/types";

interface UseFollowFlowOptions {
  /** Horizontal displacement in pixels (default: 1000) */
  xDistance?: number;
  /** Whether to include opacity transitions (default: true) */
  withOpacity?: boolean;
  /** Whether to include blur during flight (default: false) */
  withBlur?: boolean;
  /** Blur amount in pixels (default: 8) */
  blurAmount?: number;
}

interface UseFollowFlowReturn {
  /** Current direction: -1 (left), 0 (none), 1 (right) */
  direction: FlowDirection;
  /** Set direction manually */
  setDirection: (d: FlowDirection) => void;
  /** Direction-aware animation variants */
  variants: FollowFlowVariants;
  /** Navigate by direction (+1 or -1) */
  paginate: (newDirection: FlowDirection) => void;
  /** Navigate to a specific index from a current index */
  navigateTo: (fromIndex: number, toIndex: number) => FlowDirection;
}

export function useFollowFlow(
  options: UseFollowFlowOptions = {}
): UseFollowFlowReturn {
  const {
    xDistance = 1000,
    withOpacity = true,
    withBlur = false,
    blurAmount = 8,
  } = options;

  const [direction, setDirection] = useState<FlowDirection>(0);

  const variants = useMemo<FollowFlowVariants>(() => ({
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
  }), [xDistance, withOpacity, withBlur, blurAmount]);

  const paginate = useCallback((newDirection: FlowDirection) => {
    setDirection(newDirection);
  }, []);

  const navigateTo = useCallback(
    (fromIndex: number, toIndex: number): FlowDirection => {
      const d: FlowDirection = toIndex > fromIndex ? 1 : toIndex < fromIndex ? -1 : 0;
      setDirection(d);
      return d;
    },
    []
  );

  return {
    direction,
    setDirection,
    variants,
    paginate,
    navigateTo,
  };
}
