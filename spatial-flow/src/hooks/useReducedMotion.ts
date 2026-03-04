/**
 * SPATIAL FLOW FRAMEWORK -- useReducedMotion Hook
 * ==================================================
 * WCAG 2.1 SC 2.3.3 (AAA) -- React hook for reduced motion detection.
 *
 * This hook is reactive: it re-renders your component when the user
 * toggles "Reduce motion" in their OS settings (live, no page reload).
 *
 * Architecture:
 * - Reads from the core reduced-motion module (singleton state)
 * - Subscribes to OS-level MediaQueryList changes
 * - Returns a simple boolean + helpers
 *
 * RULES:
 * - ALL motion components MUST check this before animating
 * - `repeat: Infinity` animations MUST be fully stopped
 * - Opacity-only fades are permitted (no vestibular trigger)
 * - Springs are replaced with instant transitions
 *
 * @example
 * function AnimatedCard({ children }) {
 *   const { prefersReduced, safeTransition, safeSpring } = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
 *       animate={{ opacity: 1, y: 0 }}
 *       transition={safeSpring(STANDARD_SOUL)}
 *     >
 *       {children}
 *     </motion.div>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useEffect, useCallback } from "react";
import type { SpringConfig } from "../core/types";
import {
  getReducedMotion,
  subscribeReducedMotion,
  safeTransition as coreSafeTransition,
  safeSpring as coreSafeSpring,
  REDUCED_TRANSITION,
  REDUCED_SPRING,
} from "../core/reduced-motion";

interface UseReducedMotionReturn {
  /** True if the user prefers reduced motion */
  prefersReduced: boolean;

  /**
   * Wraps a transition object: returns original if motion is OK,
   * or instant transition if reduced motion is on.
   */
  safeTransition: (
    transition: Record<string, any>,
    options?: { allowOpacity?: boolean }
  ) => Record<string, any>;

  /**
   * Wraps a spring config: returns original if motion is OK,
   * or critically-damped instant spring if reduced motion is on.
   */
  safeSpring: (spring: SpringConfig) => SpringConfig;

  /** Pre-built instant transition for direct use */
  reducedTransition: typeof REDUCED_TRANSITION;

  /** Pre-built instant spring for direct use */
  reducedSpring: SpringConfig;
}

export function useReducedMotion(): UseReducedMotionReturn {
  const [prefersReduced, setPrefersReduced] = useState(getReducedMotion);

  useEffect(() => {
    return subscribeReducedMotion((reduced) => {
      setPrefersReduced(reduced);
    });
  }, []);

  const safeTransition = useCallback(
    (
      transition: Record<string, any>,
      options?: { allowOpacity?: boolean }
    ): Record<string, any> => {
      return coreSafeTransition(transition, options);
    },
    []
  );

  const safeSpring = useCallback(
    (spring: SpringConfig): SpringConfig => {
      return coreSafeSpring(spring);
    },
    []
  );

  return {
    prefersReduced,
    safeTransition,
    safeSpring,
    reducedTransition: REDUCED_TRANSITION,
    reducedSpring: REDUCED_SPRING,
  };
}
