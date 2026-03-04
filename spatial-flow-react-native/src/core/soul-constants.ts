/**
 * SPATIAL FLOW -- React Native -- Soul Constants
 * =================================================
 * The Physics Engine of the Living Interface.
 *
 * IDENTICAL physics values as @spatial-flow/core (web).
 * Timing values are in MILLISECONDS (RN convention) instead of seconds.
 *
 * RULE: Never use arbitrary durations. Always reference a Soul constant.
 *
 * @author Michel EKANI
 */

import type {
  SpringConfig,
  SoulPhysicsMap,
  ChrysalisSoulConfig,
  DirectionalMomentum,
  EaseCurve,
} from "./types";

// ─── THE SPATIAL FLOW STANDARD CURVE ──────────────────────────────────────────

export const SF_EASE: EaseCurve = [0.4, 0, 0.2, 1];

// ─── SOUL PHYSICS: The 5 Soul Types ──────────────────────────────────────────

/**
 * STANDARD SOUL -- General Movement
 * Feel: Confident, balanced, professional.
 * Use for: Navigation transitions, morphing, general UI movement.
 */
export const STANDARD_SOUL: SpringConfig = {
  stiffness: 105,
  damping: 18,
  mass: 1,
};

/**
 * REFLEX SOUL -- High Energy
 * Feel: Snap, click, toggle, rigid expansion.
 * Use for: Button clicks, toggles, micro-interactions.
 */
export const REFLEX_SOUL: SpringConfig = {
  stiffness: 350,
  damping: 25,
  mass: 0.7,
};

/**
 * DREAM SOUL -- Backgrounds & Ambience
 * Feel: Viscous, dreamy, heavy, slow drift.
 * Use for: Background parallax, ambient floating elements.
 */
export const DREAM_SOUL: SpringConfig = {
  stiffness: 40,
  damping: 20,
  mass: 2,
};

/**
 * CHRYSALIS SOUL -- Content Transmutation
 * Feel: Organic breathing, living metamorphosis.
 * Use for: Chrysalis Shift [CS] transitions.
 * NOTE: Tween-based, not spring-based. Timings in ms.
 */
export const CHRYSALIS_SOUL: ChrysalisSoulConfig = {
  height: {
    durationMs: 400,
    easing: SF_EASE,
  },
  dissolution: {
    durationMs: 600,
    staggerMs: 100,
    easing: SF_EASE,
  },
  emergence: {
    delayMs: 500,
    durationMs: 800,
    staggerMs: 150,
    easing: SF_EASE,
  },
  weaving: {
    dissolutionThreshold: 0.55,
    emergenceThreshold: 0.65,
  },
};

/**
 * EXPANSION SOUL -- Portal & Fullscreen
 * Feel: Powerful, controlled expansion.
 * Use for: Portal Expansion Flow [PEF], fullscreen transitions.
 */
export const EXPANSION_SOUL: SpringConfig = {
  stiffness: 180,
  damping: 28,
  mass: 1,
};

// ─── UNIFIED PHYSICS MAP ─────────────────────────────────────────────────────

export const SOUL_PHYSICS: SoulPhysicsMap = {
  standard: STANDARD_SOUL,
  reflex: REFLEX_SOUL,
  dream: DREAM_SOUL,
  chrysalis: CHRYSALIS_SOUL,
  expansion: EXPANSION_SOUL,
};

// ─── LATERAL GLIDE PHYSICS ───────────────────────────────────────────────────

export const GLIDE_PHYSICS: SpringConfig = {
  stiffness: 140,
  damping: 18,
  mass: 1,
};

// ─── SAMSARA SHIFT PHYSICS ───────────────────────────────────────────────────

export const SAMSARA_VESSEL: SpringConfig = {
  stiffness: 120,
  damping: 20,
  mass: 1,
};

export const SAMSARA_INDICATOR: SpringConfig = {
  stiffness: 200,
  damping: 20,
  mass: 0.8,
};

// ─── DIRECTIONAL MOMENTUM ────────────────────────────────────────────────────

export const DIRECTIONAL_MOMENTUM: DirectionalMomentum = {
  compression: {
    delayReduction: 0.5,
    durationReduction: 0.31,
    staggerReduction: 0.33,
  },
  unfolding: {
    delayReduction: 0.7,
    durationReduction: 0.37,
    staggerReduction: 0.47,
  },
};

// ─── SSC TIMING CONSTANTS (in milliseconds) ─────────────────────────────────

export const SSC_TIMING = {
  structureMs: 0,
  navigationMs: 400,
  bodyMs: 800,
  actionMs: 1300,
  staggerMs: 50,
  maxStaggerIndex: 10,
};

// ─── DROP WATER PROTOCOL TIMING (in milliseconds) ───────────────────────────

export const DROP_WATER_TIMING = {
  avatarDropMs: 350,
  mitosisMs: 400,
  blurCurtainMs: 300,
  storeShutterMs: 550,
  storeEase: [0.32, 0.72, 0, 1] as EaseCurve,
};

// ─── SEQUENTIAL GRID TIMING (in milliseconds) ───────────────────────────────

/** Sokoban turn delay between Item A and Item B moves */
export const SQG_TURN_DELAY_MS = 120;