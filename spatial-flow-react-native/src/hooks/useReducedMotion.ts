/**
 * SPATIAL FLOW -- React Native -- useReducedMotion Hook
 * =======================================================
 * Reactive hook for OS-level "Reduce Motion" detection.
 *
 * @example
 * const { prefersReduced, safeSpring } = useReducedMotion();
 * const spring = safeSpring(STANDARD_SOUL);
 */

import { useState, useEffect, useCallback } from "react";
import type { SpringConfig } from "../core/types";
import {
  getReducedMotion,
  subscribeReducedMotion,
  safeSpring as coreSafeSpring,
  REDUCED_SPRING,
} from "../core/reduced-motion";

interface UseReducedMotionReturn {
  prefersReduced: boolean;
  safeSpring: (spring: SpringConfig) => SpringConfig;
  reducedSpring: SpringConfig;
}

export function useReducedMotion(): UseReducedMotionReturn {
  const [prefersReduced, setPrefersReduced] = useState(getReducedMotion);

  useEffect(() => {
    return subscribeReducedMotion((reduced) => {
      setPrefersReduced(reduced);
    });
  }, []);

  const safeSpring = useCallback(
    (spring: SpringConfig): SpringConfig => coreSafeSpring(spring),
    []
  );

  return {
    prefersReduced,
    safeSpring,
    reducedSpring: REDUCED_SPRING,
  };
}
