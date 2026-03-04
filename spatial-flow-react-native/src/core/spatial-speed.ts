/**
 * SPATIAL FLOW -- React Native -- Speed Control Module
 * ======================================================
 * Single source of truth for global animation velocity.
 * Identical architecture to @spatial-flow/core (web).
 *
 * @author Michel EKANI
 */

import type { SpeedPreset, SpeedListener } from "./types";

// ─── Speed Factor Map ────────────────────────────────────────────────────────

export const SPEED_FACTORS: Record<SpeedPreset, number> = {
  zen: 2.0,
  normal: 1.0,
  rapide: 0.5,
  ultra: 0.1,
};

// ─── Mutable Module State ────────────────────────────────────────────────────

let GLOBAL_SPEED_FACTOR = 1.0;
let SPATIAL_FLOW_SPEED = 2.0 / GLOBAL_SPEED_FACTOR;

// ─── Listener System ─────────────────────────────────────────────────────────

const listeners: Set<SpeedListener> = new Set();

export const subscribeSpeed = (fn: SpeedListener): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

// ─── Rebuild Callback ────────────────────────────────────────────────────────

let _onRebuild: (() => void) | null = null;

export const setRebuildCallback = (cb: () => void): void => {
  _onRebuild = cb;
};

// ─── Getters ─────────────────────────────────────────────────────────────────

export const getSpatialFlowSpeed = (): number => SPATIAL_FLOW_SPEED;

export const getSpeedScale = (): number => 2.0 / SPATIAL_FLOW_SPEED;

/**
 * Scale a base duration (in ms) by the current speed.
 * Use for setTimeout/Animated.delay values.
 *
 * @example
 * setTimeout(doSomething, getFlowDurationMs(400));
 */
export const getFlowDurationMs = (baseDurationMs: number): number =>
  baseDurationMs / SPATIAL_FLOW_SPEED;

// ─── Mutator ─────────────────────────────────────────────────────────────────

export const updateSpatialFlowSpeed = (preset: SpeedPreset): void => {
  GLOBAL_SPEED_FACTOR = SPEED_FACTORS[preset];
  SPATIAL_FLOW_SPEED = 2.0 / GLOBAL_SPEED_FACTOR;
  _onRebuild?.();
  listeners.forEach((fn) => fn(preset));
};

export const getCurrentPreset = (): SpeedPreset => {
  const entries = Object.entries(SPEED_FACTORS) as [SpeedPreset, number][];
  const match = entries.find(([, factor]) => factor === GLOBAL_SPEED_FACTOR);
  return match ? match[0] : "normal";
};
