/**
 * SPATIAL FLOW FRAMEWORK -- useTransmigration Hook
 * ==================================================
 * Transmigrated Astral Flow [TAF] Protocol.
 *
 * "The element does not die. It transmigrates."
 *
 * Elements physically travel between DOM positions via `layoutId`.
 * This hook wraps Motion's layoutId with:
 * - RAU (Single Soul Rule) safety: prevents Quantum Flicker
 * - Namespace Strategy for responsive layouts
 * - Layout Projection Shield integration
 * - STANDARD_SOUL physics for the transmigration spring
 *
 * @example
 * function App() {
 *   const [expanded, setExpanded] = useState(false);
 *   const tx = useTransmigration("product-card");
 *
 *   return (
 *     <>
 *       {!expanded && (
 *         <motion.div
 *           {...tx.source}
 *           onClick={() => setExpanded(true)}
 *         >
 *           <img src="..." />
 *         </motion.div>
 *       )}
 *
 *       {expanded && (
 *         <motion.div
 *           {...tx.target}
 *           onClick={() => setExpanded(false)}
 *         >
 *           <img src="..." />
 *           <p>Details...</p>
 *         </motion.div>
 *       )}
 *     </>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useCallback, useMemo } from "react";
import { STANDARD_SOUL } from "../core/soul-constants";
import { scaledSpring } from "../core/scale-transition";
import { getReducedMotion, REDUCED_TRANSITION } from "../core/reduced-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseTransmigrationOptions {
  /** Custom spring physics (default: STANDARD_SOUL) */
  spring?: { stiffness: number; damping: number; mass: number };
  /** Responsive namespace suffix (e.g., "mobile" → layoutId becomes "id-mobile") */
  namespace?: string;
  /** Per-property transition overrides */
  perProperty?: Record<string, Record<string, any>>;
}

interface TransmigrationProps {
  /** layoutId to attach to a motion element */
  layoutId: string | undefined;
  /** layout transition */
  transition: Record<string, any>;
  /** Data attribute for debugging */
  "data-sf-taf": string;
}

interface UseTransmigrationReturn {
  /** Props to spread on the SOURCE element */
  source: TransmigrationProps;
  /** Props to spread on the TARGET element */
  target: TransmigrationProps;
  /** Activate Layout Projection Shield (call when parent gains filter/transform) */
  shield: () => void;
  /** Deactivate Layout Projection Shield */
  unshield: () => void;
  /** Whether the shield is currently active */
  isShielded: boolean;
  /** The resolved layoutId (with namespace if provided) */
  layoutId: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTransmigration(
  id: string,
  options: UseTransmigrationOptions = {}
): UseTransmigrationReturn {
  const {
    spring = STANDARD_SOUL,
    namespace,
    perProperty,
  } = options;

  const [isShielded, setIsShielded] = useState(false);

  // Resolve layoutId with namespace
  const layoutId = namespace ? `${id}-${namespace}` : id;

  // LPS: When shielded, layoutId is undefined → Motion detaches the soul
  const resolvedLayoutId = isShielded ? undefined : layoutId;

  // Shield controls
  const shield = useCallback(() => setIsShielded(true), []);
  const unshield = useCallback(() => setIsShielded(false), []);

  // Transition
  const transition = useMemo(() => {
    if (getReducedMotion()) {
      return { layout: { ...REDUCED_TRANSITION } };
    }

    const base = scaledSpring(
      spring.stiffness,
      spring.damping,
      spring.mass
    );

    const result: Record<string, any> = { layout: base };

    // Merge per-property overrides
    if (perProperty) {
      for (const [prop, config] of Object.entries(perProperty)) {
        result[prop] = config;
      }
    }

    return result;
  }, [spring, perProperty]);

  // Props for source and target (both use the same layoutId → RAU)
  // CRITICAL: Only ONE should be mounted at a time (Single Soul Rule)
  const props: TransmigrationProps = {
    layoutId: resolvedLayoutId,
    transition,
    "data-sf-taf": layoutId,
  };

  return {
    source: props,
    target: props,
    shield,
    unshield,
    isShielded,
    layoutId,
  };
}
