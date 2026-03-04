/**
 * SPATIAL FLOW FRAMEWORK -- Transition Scaling
 * ==============================================
 * Scales Motion transition objects by the current global speed factor.
 *
 * This module allows users to control the overall speed of all
 * Spatial Flow animations via a single "Spatial Flow Speed" setting.
 *
 * RULES:
 * - Infinite loop animations (repeat: Infinity) must NOT be scaled.
 * - Pure spring configs (stiffness/damping/mass without duration/delay)
 *   don't need wrapping -- springs are self-timing.
 * - Use scaleTransition() in JSX transition props.
 * - Use getFlowDuration() for setTimeout/setInterval values.
 * - To avoid double-scaling, use raw constants in variant spreads
 *   and scaled constants in JSX props.
 *
 * @author Michel EKANI
 */

import { getSpeedScale } from "./spatial-speed";

/**
 * Scale a Motion transition object by the current speed factor.
 *
 * Affected properties:
 * - duration, delay, staggerChildren, delayChildren: multiplied by speedScale
 * - stiffness: divided by speedScale (higher = faster settle)
 * - mass: multiplied by speedScale (lower = faster settle)
 *
 * Per-property sub-transitions (x, y, opacity, filter, etc.) are recursed into.
 *
 * @example
 * // In JSX:
 * <motion.div transition={scaleTransition({ duration: 0.5, ease: "easeOut" })} />
 *
 * // With per-property transitions:
 * <motion.div transition={scaleTransition({
 *   x: { duration: 0.3, ease: "circOut" },
 *   opacity: { duration: 0.2 }
 * })} />
 */
export const scaleTransition = (transition: Record<string, any>): Record<string, any> => {
  const s = getSpeedScale();
  if (s === 1.0) return transition; // No-op at default speed

  const result: Record<string, any> = { ...transition };

  // Scale timing properties
  if (typeof result.duration === "number") result.duration *= s;
  if (typeof result.delay === "number") result.delay *= s;
  if (typeof result.staggerChildren === "number") result.staggerChildren *= s;
  if (typeof result.delayChildren === "number") result.delayChildren *= s;

  // Scale spring properties
  if (typeof result.stiffness === "number") result.stiffness /= s;
  if (typeof result.mass === "number") result.mass *= s;

  // Recurse into per-property transition objects
  const ANIMATABLE_PROPS = [
    "x", "y", "opacity", "filter", "gap", "scale",
    "width", "height", "maxHeight", "minHeight",
    "top", "left", "right", "bottom",
    "borderRadius", "padding", "margin",
    "rotateX", "rotateY", "rotateZ",
  ];

  for (const key of ANIMATABLE_PROPS) {
    if (result[key] && typeof result[key] === "object") {
      result[key] = scaleTransition(result[key]);
    }
  }

  // times array: don't scale (normalized 0-1)
  // ease: don't scale (curve name or array)

  return result;
};

/**
 * Create a scaled spring config.
 * Higher speed = stiffer spring, lower mass = faster settle.
 *
 * @example
 * <motion.div transition={scaledSpring(105, 18)} />
 */
export const scaledSpring = (
  stiffness: number,
  damping: number,
  mass = 1
): Record<string, any> => {
  const s = getSpeedScale();
  return {
    type: "spring" as const,
    stiffness: stiffness / s,
    damping,
    mass: mass * s,
  };
};
