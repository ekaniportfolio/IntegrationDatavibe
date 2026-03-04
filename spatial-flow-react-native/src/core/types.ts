/**
 * SPATIAL FLOW -- React Native -- Type Definitions
 * ==================================================
 * Core TypeScript types for the Spatial Flow physics engine.
 * Mirrored from @spatial-flow/core (web) with RN-specific additions.
 */

// ─── Spring Configuration ─────────────────────────────────────────────────────
// Maps directly to react-native-reanimated's withSpring config

export interface SpringConfig {
  /** Spring stiffness coefficient */
  stiffness: number;
  /** Damping ratio */
  damping: number;
  /** Point mass */
  mass: number;
}

// ─── Tween Configuration ──────────────────────────────────────────────────────

export type EaseCurve = [number, number, number, number];

export interface TweenConfig {
  /** Duration in milliseconds */
  durationMs: number;
  /** Cubic bezier control points */
  easing: EaseCurve;
  /** Delay in milliseconds */
  delayMs?: number;
}

// ─── Soul Physics ─────────────────────────────────────────────────────────────

export type SoulType = "standard" | "reflex" | "dream" | "chrysalis" | "expansion";

export interface SoulPhysicsMap {
  standard: SpringConfig;
  reflex: SpringConfig;
  dream: SpringConfig;
  chrysalis: ChrysalisSoulConfig;
  expansion: SpringConfig;
}

// ─── Chrysalis Shift ──────────────────────────────────────────────────────────

export interface ChrysalisSoulConfig {
  height: {
    durationMs: number;
    easing: EaseCurve;
  };
  dissolution: {
    durationMs: number;
    staggerMs: number;
    easing: EaseCurve;
  };
  emergence: {
    delayMs: number;
    durationMs: number;
    staggerMs: number;
    easing: EaseCurve;
  };
  weaving: {
    dissolutionThreshold: number;
    emergenceThreshold: number;
  };
}

export interface DirectionalMomentum {
  compression: {
    delayReduction: number;
    durationReduction: number;
    staggerReduction: number;
  };
  unfolding: {
    delayReduction: number;
    durationReduction: number;
    staggerReduction: number;
  };
}

// ─── Speed Control ────────────────────────────────────────────────────────────

export type SpeedPreset = "zen" | "normal" | "rapide" | "ultra";

export interface SpeedFactors {
  zen: number;
  normal: number;
  rapide: number;
  ultra: number;
}

export type SpeedListener = (preset: SpeedPreset) => void;

// ─── Follow Flow ──────────────────────────────────────────────────────────────

export type FlowDirection = -1 | 0 | 1;

// ─── Protocol Factory ─────────────────────────────────────────────────────────

export interface ProtocolStates {
  initial: Record<string, number>;
  animate: Record<string, number>;
  exit?: Record<string, number>;
}

export interface ProtocolConfig {
  name: string;
  soul: SpringConfig | TweenConfig;
  states: ProtocolStates;
  staggerMs?: number;
  initialDelayMs?: number;
  directional?: boolean;
  xOffset?: number;
  allowOpacityInReduced?: boolean;
}

// ─── Animated Properties ──────────────────────────────────────────────────────
// RN-specific: properties that can be animated with Reanimated

export type AnimatableProperty =
  | "opacity"
  | "translateX"
  | "translateY"
  | "scale"
  | "scaleX"
  | "scaleY"
  | "rotate"
  | "rotateX"
  | "rotateY"
  | "rotateZ"
  | "skewX"
  | "skewY";

export const SPATIAL_PROPERTIES: Set<AnimatableProperty> = new Set([
  "translateX",
  "translateY",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
]);
