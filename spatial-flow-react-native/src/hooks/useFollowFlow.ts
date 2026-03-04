/**
 * SPATIAL FLOW -- React Native -- useFollowFlow Hook
 * =====================================================
 * Direction-aware navigation for React Native.
 *
 * "Elements follow the direction of attention displacement."
 *
 * @example
 * const { direction, navigateTo } = useFollowFlow();
 * // On tab press: navigateTo(currentIndex, newIndex);
 * // direction is now -1 or 1 → drive your Animated transitions
 *
 * @author Michel EKANI
 */

import { useState, useCallback } from "react";
import type { FlowDirection } from "../core/types";

interface UseFollowFlowReturn {
  direction: FlowDirection;
  setDirection: (d: FlowDirection) => void;
  paginate: (newDirection: FlowDirection) => void;
  navigateTo: (fromIndex: number, toIndex: number) => FlowDirection;
}

export function useFollowFlow(): UseFollowFlowReturn {
  const [direction, setDirection] = useState<FlowDirection>(0);

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

  return { direction, setDirection, paginate, navigateTo };
}
