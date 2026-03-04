/**
 * SPATIAL FLOW -- React Native -- Core Barrel Export
 */

// Soul Constants & Physics
export {
  SF_EASE,
  STANDARD_SOUL,
  REFLEX_SOUL,
  DREAM_SOUL,
  CHRYSALIS_SOUL,
  EXPANSION_SOUL,
  SOUL_PHYSICS,
  GLIDE_PHYSICS,
  SAMSARA_VESSEL,
  SAMSARA_INDICATOR,
  DIRECTIONAL_MOMENTUM,
  SSC_TIMING,
  DROP_WATER_TIMING,
  SQG_TURN_DELAY_MS,
} from "./soul-constants";

// Speed Control
export {
  SPEED_FACTORS,
  subscribeSpeed,
  setRebuildCallback,
  getSpatialFlowSpeed,
  getSpeedScale,
  getFlowDurationMs,
  updateSpatialFlowSpeed,
  getCurrentPreset,
} from "./spatial-speed";

// Transition Scaling
export { scaledSpring, scaledDurationMs, scaledDelayMs } from "./scale-transition";

// Protocol Factory
export { createProtocol } from "./create-protocol";

// Reduced Motion
export {
  initReducedMotion,
  getReducedMotion,
  subscribeReducedMotion,
  REDUCED_SPRING,
  safeSpring,
  safeDurationMs,
} from "./reduced-motion";

// Types
export type {
  SpringConfig,
  EaseCurve,
  TweenConfig,
  SoulType,
  SoulPhysicsMap,
  ChrysalisSoulConfig,
  DirectionalMomentum,
  SpeedPreset,
  SpeedFactors,
  SpeedListener,
  FlowDirection,
  ProtocolStates,
  ProtocolConfig,
  AnimatableProperty,
} from "./types";