/**
 * SPATIAL FLOW FRAMEWORK -- useSpatialSpeed Hook
 * =================================================
 * React hook for reactive speed control.
 * Triggers re-renders when the global speed changes.
 *
 * @example
 * function SpeedControl() {
 *   const { preset, setPreset, speedLabel, speedScale } = useSpatialSpeed();
 *   return (
 *     <select value={preset} onChange={e => setPreset(e.target.value as SpeedPreset)}>
 *       {presets.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
 *     </select>
 *   );
 * }
 */

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import type { SpeedPreset } from "../core/types";
import {
  subscribeSpeed,
  updateSpatialFlowSpeed,
  getCurrentPreset,
  getSpeedScale,
  getSpatialFlowSpeed,
  getFlowDuration,
  SPEED_FACTORS,
} from "../core/spatial-speed";

interface UseSpatialSpeedReturn {
  /** Current speed preset */
  preset: SpeedPreset;
  /** Set a new speed preset */
  setPreset: (preset: SpeedPreset) => void;
  /** Human-readable label for current speed */
  speedLabel: string;
  /** Current speed scale factor */
  speedScale: number;
  /** Raw Spatial Flow Speed value */
  spatialFlowSpeed: number;
  /** Scale a base duration by the current speed */
  flowDuration: (baseDuration: number) => number;
  /** All available presets with labels */
  presets: Array<{ value: SpeedPreset; label: string; factor: number }>;
}

const SPEED_LABELS: Record<SpeedPreset, string> = {
  zen: "Zen (0.5x)",
  normal: "Normal (1x)",
  rapide: "Rapide (2x)",
  ultra: "Ultra (10x)",
};

const PRESETS = Object.entries(SPEED_FACTORS).map(([value, factor]) => ({
  value: value as SpeedPreset,
  label: SPEED_LABELS[value as SpeedPreset],
  factor,
}));

export function useSpatialSpeed(): UseSpatialSpeedReturn {
  const [preset, setPresetState] = useState<SpeedPreset>(getCurrentPreset);

  useEffect(() => {
    const unsubscribe = subscribeSpeed((newPreset) => {
      setPresetState(newPreset);
    });
    return unsubscribe;
  }, []);

  const setPreset = useCallback((newPreset: SpeedPreset) => {
    updateSpatialFlowSpeed(newPreset);
  }, []);

  return {
    preset,
    setPreset,
    speedLabel: SPEED_LABELS[preset],
    speedScale: getSpeedScale(),
    spatialFlowSpeed: getSpatialFlowSpeed(),
    flowDuration: getFlowDuration,
    presets: PRESETS,
  };
}
