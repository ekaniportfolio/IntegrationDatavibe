/**
 * SPATIAL FLOW FRAMEWORK -- useGhostDom Hook
 * =============================================
 * Measures the natural height of content before animating.
 *
 * The Problem:
 * CSS cannot animate to `height: auto`. You need the pixel value.
 *
 * The Solution:
 * Render an invisible copy (the "Ghost") and measure it with
 * useLayoutEffect before the browser paints.
 *
 * Used by: Chrysalis Shift, Reflex Matrix, any height animation.
 *
 * @example
 * function ExpandableCard({ content }) {
 *   const { height, ghostRef, measured } = useGhostDom(content);
 *   return (
 *     <>
 *       <div ref={ghostRef} className="invisible absolute">{content}</div>
 *       <motion.div animate={{ height: measured ? height : 0 }}>
 *         {content}
 *       </motion.div>
 *     </>
 *   );
 * }
 */

import { useRef, useState, useLayoutEffect } from "react";

interface UseGhostDomOptions {
  /** Dependencies that trigger re-measurement */
  deps?: any[];
  /** Debounce delay in ms (default: 0) */
  debounce?: number;
}

interface UseGhostDomReturn {
  /** Measured height in pixels */
  height: number;
  /** Ref to attach to the invisible ghost container */
  ghostRef: React.RefObject<HTMLDivElement | null>;
  /** Whether measurement has completed at least once */
  measured: boolean;
  /** Force a re-measurement */
  remeasure: () => void;
}

export function useGhostDom(options: UseGhostDomOptions = {}): UseGhostDomReturn {
  const { deps = [], debounce = 0 } = options;
  const ghostRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [measured, setMeasured] = useState(false);

  const measure = () => {
    if (ghostRef.current) {
      const newHeight = ghostRef.current.offsetHeight;
      setHeight(newHeight);
      setMeasured(true);
    }
  };

  useLayoutEffect(() => {
    if (debounce > 0) {
      const timer = setTimeout(measure, debounce);
      return () => clearTimeout(timer);
    }
    measure();
  }, deps);

  return {
    height,
    ghostRef,
    measured,
    remeasure: measure,
  };
}
