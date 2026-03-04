/**
 * SPATIAL FLOW -- React Native -- Transition Scaling
 * =====================================================
 * Scales Reanimated spring/timing configs by the global speed factor.
 *
 * For springs: stiffness ÷ scale, mass × scale → faster settle at higher speed.
 * For tweens:  durationMs × scale → shorter at higher speed.
 *
 * @author Michel EKANI
 */

import type { SpringConfig } from "./types";
import { getSpeedScale } from "./spatial-speed";

/**
 * Scale a spring config by the current speed factor.
 *
 * @example
 * const spring = scaledSpring(STANDARD_SOUL);
 * // Use with: withSpring(targetValue, spring)
 */
export const scaledSpring = (config: SpringConfig): SpringConfig => {
  const s = getSpeedScale();
  if (s === 1.0) return config;
  return {
    stiffness: config.stiffness / s,
    damping: config.damping,
    mass: config.mass * s,
  };
};

/**
 * Scale a duration in ms by the current speed factor.
 *
 * @example
 * withTiming(targetValue, { duration: scaledDurationMs(400) })
 */
export const scaledDurationMs = (durationMs: number): number => {
  const s = getSpeedScale();
  return durationMs * s;
};

/**
 * Scale a delay in ms by the current speed factor.
 *
 * @example
 * setTimeout(doSomething, scaledDelayMs(200))
 */
export const scaledDelayMs = (delayMs: number): number => {
  const s = getSpeedScale();
  return delayMs * s;
};
