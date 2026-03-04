/**
 * SPATIAL FLOW -- React Native -- Reduced Motion Module
 * =======================================================
 * WCAG 2.1 SC 2.3.3 (AAA) Compliance for React Native.
 *
 * Uses React Native's AccessibilityInfo API to detect the OS-level
 * "Reduce Motion" setting:
 * - iOS:     Settings → Accessibility → Motion → Reduce Motion
 * - Android: Settings → Accessibility → Remove animations
 *
 * Architecture mirrors @spatial-flow/core (web) exactly.
 *
 * @author Michel EKANI
 */

import { AccessibilityInfo } from "react-native";
import type { SpringConfig } from "./types";

// ─── Module State ────────────────────────────────────────────────────────────

let _reducedMotion = false;
let _initialized = false;

type ReducedMotionListener = (reduced: boolean) => void;
const _listeners: Set<ReducedMotionListener> = new Set();

// ─── Initialization ──────────────────────────────────────────────────────────

/**
 * Initialize reduced motion detection.
 * Call this once at app startup (e.g., in App.tsx useEffect).
 * After this, getReducedMotion() and listeners are live.
 */
export async function initReducedMotion(): Promise<void> {
  if (_initialized) return;

  try {
    _reducedMotion = await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    _reducedMotion = false;
  }

  _initialized = true;

  // Listen for live OS-level changes (iOS/Android)
  const subscription = AccessibilityInfo.addEventListener(
    "reduceMotionChanged",
    (reduced: boolean) => {
      _reducedMotion = reduced;
      _listeners.forEach((fn) => fn(reduced));
    }
  );

  // Note: subscription cleanup is intentionally omitted —
  // this is a singleton that lives for the app's lifetime.
}

// ─── Listener System ─────────────────────────────────────────────────────────

export const subscribeReducedMotion = (
  fn: ReducedMotionListener
): (() => void) => {
  _listeners.add(fn);
  return () => {
    _listeners.delete(fn);
  };
};

// ─── Getter ──────────────────────────────────────────────────────────────────

export const getReducedMotion = (): boolean => _reducedMotion;

// ─── Safe Factories ──────────────────────────────────────────────────────────

/**
 * Instant-settle spring for reduced motion mode.
 * Reanimated's withSpring with these values settles in ~1 frame.
 */
export const REDUCED_SPRING: SpringConfig = {
  stiffness: 10000,
  damping: 1000,
  mass: 0.01,
};

/**
 * Returns the original spring if motion is allowed,
 * or REDUCED_SPRING if the user prefers reduced motion.
 */
export const safeSpring = (spring: SpringConfig): SpringConfig => {
  if (!_reducedMotion) return spring;
  return REDUCED_SPRING;
};

/**
 * Returns the original duration if motion is allowed,
 * or 0 if the user prefers reduced motion.
 * For tween-based animations.
 */
export const safeDurationMs = (durationMs: number): number => {
  if (!_reducedMotion) return durationMs;
  return 0;
};
