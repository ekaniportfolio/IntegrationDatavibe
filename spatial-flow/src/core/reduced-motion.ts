/**
 * SPATIAL FLOW FRAMEWORK -- Reduced Motion Module
 * ==================================================
 * WCAG 2.1 SC 2.3.3 (AAA) & SC 2.3.1 (A) Compliance
 *
 * Architecture:
 * - Module-level detection of `prefers-reduced-motion: reduce`
 * - Reactive listener system (mirrors spatial-speed.ts pattern)
 * - Safe transition/spring factories that auto-disable when needed
 * - CSS-level fallback via reduced-motion.css
 *
 * RULES:
 * - `repeat: Infinity` animations MUST be stopped entirely (not just slowed)
 * - Spring physics are replaced with instant transitions (duration: 0)
 * - Opacity-only fades are ALLOWED (they don't trigger vestibular issues)
 * - Layout shifts still happen, but instantly (no spatial disorientation)
 *
 * @author Michel EKANI
 */

import type { SpringConfig } from "./types";

// ─── Module State ────────────────────────────────────────────────────────────

let _reducedMotion = false;

if (typeof window !== "undefined") {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  _reducedMotion = mq.matches;

  mq.addEventListener("change", (e) => {
    _reducedMotion = e.matches;
    _listeners.forEach((fn) => fn(_reducedMotion));
  });
}

// ─── Listener System ─────────────────────────────────────────────────────────

type ReducedMotionListener = (reduced: boolean) => void;
const _listeners: Set<ReducedMotionListener> = new Set();

/**
 * Subscribe to reduced motion preference changes.
 * Returns an unsubscribe function.
 */
export const subscribeReducedMotion = (
  fn: ReducedMotionListener
): (() => void) => {
  _listeners.add(fn);
  return () => {
    _listeners.delete(fn);
  };
};

// ─── Getter ──────────────────────────────────────────────────────────────────

/** Returns true if the user prefers reduced motion */
export const getReducedMotion = (): boolean => _reducedMotion;

// ─── Safe Transition Factories ───────────────────────────────────────────────

/**
 * A zero-duration tween transition for reduced motion mode.
 * Elements reach their final state instantly with no animation.
 */
export const REDUCED_TRANSITION = {
  duration: 0,
  delay: 0,
} as const;

/**
 * A critically-damped spring that settles instantly.
 * Used as a drop-in replacement for any SpringConfig when reduced motion is on.
 */
export const REDUCED_SPRING: SpringConfig = {
  type: "spring" as const,
  stiffness: 10000,
  damping: 1000,
  mass: 0.01,
};

/**
 * Returns the original transition if motion is allowed,
 * or REDUCED_TRANSITION if the user prefers reduced motion.
 *
 * For opacity-only transitions, pass `allowOpacity: true` to
 * permit a gentle crossfade even in reduced motion mode.
 *
 * @example
 * <motion.div transition={safeTransition({ duration: 0.5, ease: SF_EASE })} />
 *
 * // Allow opacity fade even in reduced motion:
 * <motion.div transition={safeTransition(
 *   { duration: 0.5, ease: SF_EASE },
 *   { allowOpacity: true }
 * )} />
 */
export const safeTransition = (
  transition: Record<string, any>,
  options?: { allowOpacity?: boolean }
): Record<string, any> => {
  if (!_reducedMotion) return transition;

  if (options?.allowOpacity) {
    // Allow a short opacity fade (WCAG-safe: no spatial movement)
    return {
      ...REDUCED_TRANSITION,
      opacity: { duration: 0.15, ease: "easeOut" },
    };
  }

  return { ...REDUCED_TRANSITION };
};

/**
 * Returns the original spring config if motion is allowed,
 * or REDUCED_SPRING if the user prefers reduced motion.
 *
 * @example
 * <motion.div transition={safeSpring(STANDARD_SOUL)} />
 */
export const safeSpring = (spring: SpringConfig): SpringConfig => {
  if (!_reducedMotion) return spring;
  return REDUCED_SPRING;
};
