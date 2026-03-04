/**
 * SPATIAL FLOW -- React Native -- useSpatialSpeed Hook
 * ======================================================
 * Reactive hook for global speed control.
 *
 * @example
 * const { preset, setPreset, speedScale } = useSpatialSpeed();
 */

import { useState, useEffect, useCallback } from "react";
import type { SpeedPreset } from "../core/types";
import {
  subscribeSpeed,
  updateSpatialFlowSpeed,
  getCurrentPreset,
  getSpeedScale,
  getSpatialFlowSpeed,
  getFlowDurationMs,
  SPEED_FACTORS,
} from "../core/spatial-speed";

interface UseSpatialSpeedReturn {
  preset: SpeedPreset;
  setPreset: (preset: SpeedPreset) => void;
  speedLabel: string;
  speedScale: number;
  spatialFlowSpeed: number;
  flowDurationMs: (baseDurationMs: number) => number;
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
    return subscribeSpeed((newPreset) => {
      setPresetState(newPreset);
    });
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
    flowDurationMs: getFlowDurationMs,
    presets: PRESETS,
  };
}
