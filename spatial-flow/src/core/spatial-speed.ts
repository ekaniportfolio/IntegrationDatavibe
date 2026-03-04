/**
 * SPATIAL FLOW FRAMEWORK -- Speed Control Module
 * =================================================
 * Single source of truth for the global velocity of all Spatial Flow animations.
 *
 * Architecture:
 * - Module-level mutable state (singleton pattern)
 * - Listener system for React re-renders
 * - Rebuild callback for variant recalculation
 *
 * Speed Presets:
 * - zen:     0.5x speed (2.0 factor -- slower, contemplative)
 * - normal:  1.0x speed (1.0 factor -- default)
 * - rapide:  2.0x speed (0.5 factor -- snappy, efficient)
 * - ultra:  10.0x speed (0.1 factor -- near-instant, debugging)
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

/**
 * Subscribe to speed changes. Returns an unsubscribe function.
 * Used internally by useSpatialSpeed hook.
 */
export const subscribeSpeed = (fn: SpeedListener): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

// ─── Rebuild Callback ────────────────────────────────────────────────────────

let _onRebuild: (() => void) | null = null;

/**
 * Register a callback that fires when speed changes.
 * Used to force rebuild of memoized variants/constants.
 */
export const setRebuildCallback = (cb: () => void): void => {
  _onRebuild = cb;
};

// ─── Getters ─────────────────────────────────────────────────────────────────

/** Get the raw Spatial Flow Speed value */
export const getSpatialFlowSpeed = (): number => SPATIAL_FLOW_SPEED;

/**
 * Get the speed scale factor for duration/delay multiplication.
 * At normal speed: returns 1.0
 * At zen (slower): returns > 1.0 (durations increase)
 * At ultra (faster): returns < 1.0 (durations decrease)
 */
export const getSpeedScale = (): number => 2.0 / SPATIAL_FLOW_SPEED;

/**
 * Scale a base duration by the current speed.
 * Use this for setTimeout/setInterval values.
 *
 * @example
 * setTimeout(() => doSomething(), getFlowDuration(0.4) * 1000);
 */
export const getFlowDuration = (baseDuration: number): number =>
  baseDuration / SPATIAL_FLOW_SPEED;

// ─── Mutator ─────────────────────────────────────────────────────────────────

/**
 * Update the global Spatial Flow speed.
 * Notifies all listeners and triggers rebuild callback.
 */
export const updateSpatialFlowSpeed = (preset: SpeedPreset): void => {
  GLOBAL_SPEED_FACTOR = SPEED_FACTORS[preset];
  SPATIAL_FLOW_SPEED = 2.0 / GLOBAL_SPEED_FACTOR;

  // Notify rebuild callback (for memoized variants)
  _onRebuild?.();

  // Notify React listeners
  listeners.forEach((fn) => fn(preset));
};

/**
 * Get the current preset from the speed factor.
 */
export const getCurrentPreset = (): SpeedPreset => {
  const entries = Object.entries(SPEED_FACTORS) as [SpeedPreset, number][];
  const match = entries.find(([, factor]) => factor === GLOBAL_SPEED_FACTOR);
  return match ? match[0] : "normal";
};
