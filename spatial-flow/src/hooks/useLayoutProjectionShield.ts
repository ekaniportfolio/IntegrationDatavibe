/**
 * SPATIAL FLOW FRAMEWORK -- useLayoutProjectionShield Hook
 * ==========================================================
 * Layout Projection Shield [LPS] Protocol.
 *
 * "When the chrysalis blurs, the soul must shed its tether."
 *
 * The Problem:
 * When a parent acquires `filter: blur()`, it creates a new CSS
 * containing block. This shifts `getBoundingClientRect()` for all
 * `position: fixed` descendants, causing Motion's layout projection
 * to apply unwanted corrective transforms → "animation freeze".
 *
 * The Solution:
 * Temporarily remove `layoutId` from affected elements while the
 * parent's filter/transform is being applied or removed.
 *
 * This hook provides:
 * - `isActive`:   Whether the shield is currently deployed
 * - `activate()`: Deploy the shield (removes layoutId from children)
 * - `deactivate()`: Remove the shield (restores layoutId)
 * - `wrap(layoutId)`: Returns undefined if shielded, layoutId otherwise
 * - `autoShield(filterElement, duration)`: Auto-activate during filter transition
 *
 * @example
 * function BlurCurtain({ children, isBlurred }) {
 *   const lps = useLayoutProjectionShield();
 *
 *   useEffect(() => {
 *     if (isBlurred) {
 *       lps.autoShield(0.3); // Shield for 300ms (filter transition duration)
 *     }
 *   }, [isBlurred]);
 *
 *   return (
 *     <motion.div
 *       animate={{ filter: isBlurred ? "blur(8px)" : "blur(0px)" }}
 *       transition={{ duration: 0.3 }}
 *     >
 *       {children.map(child => (
 *         <motion.div layoutId={lps.wrap(`item-${child.id}`)}>
 *           {child.content}
 *         </motion.div>
 *       ))}
 *     </motion.div>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useCallback, useRef } from "react";
import { getFlowDuration } from "../core/spatial-speed";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseLayoutProjectionShieldReturn {
  /** Whether the shield is currently active */
  isActive: boolean;
  /** Deploy the shield (all wrapped layoutIds become undefined) */
  activate: () => void;
  /** Remove the shield (layoutIds restored) */
  deactivate: () => void;
  /** Wrap a layoutId — returns undefined when shielded */
  wrap: (layoutId: string) => string | undefined;
  /**
   * Auto-shield: activate for the duration of a filter/transform transition.
   * Adds a small buffer (50ms) on both ends for safety.
   *
   * @param durationSec - Duration of the filter transition in seconds
   * @param delaySec    - Delay before the transition starts (default: 0)
   */
  autoShield: (durationSec: number, delaySec?: number) => void;
  /** Cancel any pending auto-shield timer */
  cancel: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Buffer added before and after the shield window (ms) */
const LPS_BUFFER_MS = 50;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLayoutProjectionShield(): UseLayoutProjectionShieldReturn {
  const [isActive, setIsActive] = useState(false);
  const activateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deactivateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  const wrap = useCallback(
    (layoutId: string): string | undefined => {
      return isActive ? undefined : layoutId;
    },
    [isActive]
  );

  const cancel = useCallback(() => {
    if (activateTimer.current) {
      clearTimeout(activateTimer.current);
      activateTimer.current = null;
    }
    if (deactivateTimer.current) {
      clearTimeout(deactivateTimer.current);
      deactivateTimer.current = null;
    }
  }, []);

  const autoShield = useCallback(
    (durationSec: number, delaySec = 0) => {
      cancel();

      const scaledDuration = getFlowDuration(durationSec) * 1000;
      const scaledDelay = getFlowDuration(delaySec) * 1000;

      // Activate shield BEFORE the filter starts (buffer)
      const activateAt = Math.max(0, scaledDelay - LPS_BUFFER_MS);

      activateTimer.current = setTimeout(() => {
        setIsActive(true);

        // Deactivate AFTER the filter settles (duration + buffer)
        deactivateTimer.current = setTimeout(() => {
          setIsActive(false);
        }, scaledDuration + LPS_BUFFER_MS * 2);
      }, activateAt);
    },
    [cancel]
  );

  return {
    isActive,
    activate,
    deactivate,
    wrap,
    autoShield,
    cancel,
  };
}

export { LPS_BUFFER_MS };
