/**
 * SPATIAL FLOW FRAMEWORK -- Core Barrel Export
 * ==============================================
 * All physics, constants, types, and utilities.
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
  ANCHOR_VARIANTS,
  SQG_TURN_DELAY,
} from "./soul-constants";

// Speed Control
export {
  SPEED_FACTORS,
  subscribeSpeed,
  setRebuildCallback,
  getSpatialFlowSpeed,
  getSpeedScale,
  getFlowDuration,
  updateSpatialFlowSpeed,
  getCurrentPreset,
} from "./spatial-speed";

// Transition Scaling
export { scaleTransition, scaledSpring } from "./scale-transition";

// Protocol Factory
export { createProtocol } from "./create-protocol";

// Reduced Motion
export {
  getReducedMotion,
  subscribeReducedMotion,
  REDUCED_TRANSITION,
  REDUCED_SPRING,
  safeTransition,
  safeSpring,
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
  FollowFlowVariants,
  KineticItemProps,
  CascadeListProps,
  CascadeItemProps,
  ChrysalisContainerProps,
  GhostDomResult,
  ScalableTransition,
  ProtocolStates,
  ProtocolConfig,
  ProtocolItemProps,
  ProtocolListProps,
} from "./types";