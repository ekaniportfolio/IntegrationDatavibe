/**
 * SPATIAL FLOW FRAMEWORK -- useSpatialTransition Hook
 * =====================================================
 * The Unified Pipeline Hook.
 *
 * This is the SINGLE entry point a developer needs to create
 * Spatial Flow-compliant animations. It encapsulates:
 *
 * 1. Speed Scaling   — respects the global Spatial Flow Speed setting
 * 2. Reduced Motion  — WCAG AAA safe, auto-downgrades when needed
 * 3. Reactivity      — re-renders on speed OR reduced-motion changes
 *
 * PHILOSOPHY:
 * "A developer should never have to remember the pipeline.
 *  Import. Call. Animate. The framework handles the rest."
 *
 * @example
 * // With a Soul constant (spring-based):
 * function MyCard({ children }) {
 *   const sf = useSpatialTransition(STANDARD_SOUL);
 *   return (
 *     <motion.div
 *       initial={sf.initial({ opacity: 0, y: 20 })}
 *       animate={sf.animate({ opacity: 1, y: 0 })}
 *       transition={sf.transition}
 *     >
 *       {children}
 *     </motion.div>
 *   );
 * }
 *
 * // With a tween config:
 * function FadePanel() {
 *   const sf = useSpatialTransition({ duration: 0.5, ease: SF_EASE });
 *   return <motion.div transition={sf.transition} />;
 * }
 *
 * // With per-property transitions:
 * function ComplexAnim() {
 *   const sf = useSpatialTransition(STANDARD_SOUL, {
 *     perProperty: {
 *       opacity: { duration: 0.2, ease: "easeOut" },
 *       filter: { duration: 0.3 },
 *     },
 *   });
 *   return <motion.div transition={sf.transition} />;
 * }
 *
 * // With stagger (for parent containers):
 * function List() {
 *   const sf = useSpatialTransition(STANDARD_SOUL, { stagger: 0.05, delayChildren: 0.2 });
 *   return (
 *     <motion.div transition={sf.containerTransition}>
 *       {items.map(item => <Item key={item.id} />)}
 *     </motion.div>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useMemo } from "react";
import type { SpringConfig } from "../core/types";
import {
  getReducedMotion,
  REDUCED_TRANSITION,
  REDUCED_SPRING,
} from "../core/reduced-motion";
import { scaleTransition, scaledSpring } from "../core/scale-transition";
import { getSpeedScale } from "../core/spatial-speed";
import { useReducedMotion } from "./useReducedMotion";
import { useSpatialSpeed } from "./useSpatialSpeed";

// ─── Types ────────────────────────────────────────────────────────────────────

type SoulInput = SpringConfig | Record<string, any>;

interface UseSpatialTransitionOptions {
  /** Per-property transition overrides (e.g., { opacity: { duration: 0.2 } }) */
  perProperty?: Record<string, Record<string, any>>;
  /** Stagger delay between children (for container transitions) */
  stagger?: number;
  /** Delay before first child animates (for container transitions) */
  delayChildren?: number;
  /** Allow opacity fades in reduced motion mode (default: true) */
  allowOpacityInReduced?: boolean;
}

interface SpatialTransitionResult {
  /** The fully-processed transition object — ready for motion.div */
  transition: Record<string, any>;

  /** Container transition with stagger (only if stagger was provided) */
  containerTransition: Record<string, any>;

  /** Whether the user prefers reduced motion */
  isReduced: boolean;

  /** Current speed scale factor */
  speedScale: number;

  /**
   * Sanitize an `initial` state: strips spatial properties if reduced motion.
   * Opacity is preserved (WCAG-safe). Position/filter/scale are zeroed.
   *
   * @example
   * initial={sf.initial({ opacity: 0, x: -20, filter: "blur(4px)" })}
   * // reduced → { opacity: 0 }  (keeps opacity, strips x and filter)
   * // normal  → { opacity: 0, x: -20, filter: "blur(4px)" }
   */
  initial: (state: Record<string, any>) => Record<string, any>;

  /**
   * Sanitize an `animate` state: same logic as initial.
   *
   * @example
   * animate={sf.animate({ opacity: 1, x: 0, filter: "blur(0px)" })}
   * // reduced → { opacity: 1 }
   * // normal  → { opacity: 1, x: 0, filter: "blur(0px)" }
   */
  animate: (state: Record<string, any>) => Record<string, any>;

  /**
   * Scale a raw duration by the current speed factor.
   * Use for setTimeout/setInterval values.
   *
   * @example
   * setTimeout(doSomething, sf.duration(0.4) * 1000);
   */
  duration: (baseDuration: number) => number;
}

// ─── Spatial Properties (stripped in reduced motion) ──────────────────────────

const SPATIAL_KEYS = new Set([
  "x", "y", "z",
  "rotateX", "rotateY", "rotateZ", "rotate",
  "scale", "scaleX", "scaleY",
  "skewX", "skewY",
  "filter",
  "clipPath",
  "transformOrigin",
]);

/**
 * In reduced motion: keep opacity & layout props, strip spatial movement.
 * This preserves the "presence" of elements (they fade in) while removing
 * the spatial displacement that causes vestibular issues.
 */
function sanitizeState(
  state: Record<string, any>,
  isReduced: boolean,
  allowOpacity: boolean
): Record<string, any> {
  if (!isReduced) return state;

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(state)) {
    if (SPATIAL_KEYS.has(key)) {
      // Skip spatial properties in reduced motion
      continue;
    }
    if (key === "opacity" && allowOpacity) {
      result[key] = value;
    } else if (key === "opacity" && !allowOpacity) {
      // Force instant opacity
      result[key] = value;
    } else {
      // Keep non-spatial props (width, height, background, etc.)
      result[key] = value;
    }
  }
  return result;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function isSpringConfig(input: SoulInput): input is SpringConfig {
  return (
    typeof input === "object" &&
    input !== null &&
    input.type === "spring" &&
    typeof input.stiffness === "number" &&
    typeof input.damping === "number"
  );
}

export function useSpatialTransition(
  soul: SoulInput,
  options: UseSpatialTransitionOptions = {}
): SpatialTransitionResult {
  const {
    perProperty,
    stagger,
    delayChildren,
    allowOpacityInReduced = true,
  } = options;

  // Subscribe to reactive changes (triggers re-render)
  const { prefersReduced } = useReducedMotion();
  const { speedScale } = useSpatialSpeed();

  // Build the transition object
  const transition = useMemo(() => {
    if (prefersReduced) {
      // Reduced motion: instant everything, optional opacity fade
      if (allowOpacityInReduced) {
        return {
          ...REDUCED_TRANSITION,
          opacity: { duration: 0.15, ease: "easeOut" },
        };
      }
      return { ...REDUCED_TRANSITION };
    }

    // Normal mode: build and scale
    let base: Record<string, any>;

    if (isSpringConfig(soul)) {
      // Spring-based soul → scale spring physics
      base = scaledSpring(soul.stiffness, soul.damping, soul.mass);
    } else {
      // Tween-based config → scale durations
      base = scaleTransition({ ...soul });
    }

    // Merge per-property overrides (each one also gets scaled)
    if (perProperty) {
      for (const [prop, propTransition] of Object.entries(perProperty)) {
        base[prop] = scaleTransition(propTransition);
      }
    }

    return base;
  }, [soul, perProperty, prefersReduced, speedScale, allowOpacityInReduced]);

  // Container transition (with stagger)
  const containerTransition = useMemo(() => {
    if (prefersReduced) {
      return { ...REDUCED_TRANSITION };
    }

    const result: Record<string, any> = {};
    if (typeof stagger === "number") {
      result.staggerChildren = stagger * (2.0 / (2.0 / speedScale));
    }
    if (typeof delayChildren === "number") {
      result.delayChildren = delayChildren * (2.0 / (2.0 / speedScale));
    }
    return result;
  }, [stagger, delayChildren, prefersReduced, speedScale]);

  // State sanitizers
  const initial = useMemo(
    () => (state: Record<string, any>) =>
      sanitizeState(state, prefersReduced, allowOpacityInReduced),
    [prefersReduced, allowOpacityInReduced]
  );

  const animate = useMemo(
    () => (state: Record<string, any>) =>
      sanitizeState(state, prefersReduced, allowOpacityInReduced),
    [prefersReduced, allowOpacityInReduced]
  );

  // Duration scaler
  const durationFn = useMemo(
    () => (baseDuration: number) => {
      if (prefersReduced) return 0;
      return baseDuration * speedScale;
    },
    [prefersReduced, speedScale]
  );

  return {
    transition,
    containerTransition,
    isReduced: prefersReduced,
    speedScale,
    initial,
    animate,
    duration: durationFn,
  };
}
