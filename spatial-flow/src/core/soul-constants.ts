/**
 * SPATIAL FLOW FRAMEWORK -- Soul Constants
 * ==========================================
 * The Physics Engine of the Living Interface.
 *
 * Every animation in Spatial Flow is governed by calibrated spring/tween
 * constants called "Souls". Each Soul type produces a distinct kinetic
 * personality that the user perceives as a specific physical material.
 *
 * RULE: Never use `transition={{ duration: 0.3 }}` arbitrarily.
 *       Always reference a Soul constant or derive from one.
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
// Used across all tween-based animations. Equivalent to Material Design's
// standard curve but calibrated for Spatial Flow's organic feel.

export const SF_EASE: EaseCurve = [0.4, 0, 0.2, 1];

// ─── SOUL PHYSICS: The 5 Soul Types ──────────────────────────────────────────

/**
 * STANDARD SOUL -- General Movement
 * Feel: Confident, balanced, professional.
 * Use for: Navigation transitions, morphing, general UI movement.
 */
export const STANDARD_SOUL: SpringConfig = {
  type: "spring",
  stiffness: 105,
  damping: 18,
  mass: 1,
};

/**
 * REFLEX SOUL -- High Energy
 * Feel: Snap, click, toggle, rigid expansion.
 * Use for: Button clicks, toggles, Reflex Matrix mitosis, micro-interactions.
 */
export const REFLEX_SOUL: SpringConfig = {
  type: "spring",
  stiffness: 350,
  damping: 25,
  mass: 0.7,
};

/**
 * DREAM SOUL -- Backgrounds & Ambience
 * Feel: Viscous, dreamy, heavy, slow drift.
 * Use for: Background parallax, ambient floating elements, gradient shifts.
 */
export const DREAM_SOUL: SpringConfig = {
  type: "spring",
  stiffness: 40,
  damping: 20,
  mass: 2,
};

/**
 * CHRYSALIS SOUL -- Content Transmutation
 * Feel: Organic breathing, living metamorphosis.
 * Use for: Chrysalis Shift [CS] transitions (form steps, content swaps).
 * NOTE: This is tween-based, not spring-based.
 */
export const CHRYSALIS_SOUL: ChrysalisSoulConfig = {
  height: {
    duration: 0.4,
    ease: SF_EASE,
  },
  dissolution: {
    duration: 0.6,
    stagger: 0.1,
    ease: SF_EASE,
  },
  emergence: {
    delay: 0.5,
    duration: 0.8,
    stagger: 0.15,
    ease: SF_EASE,
  },
  weaving: {
    dissolutionThreshold: 0.55,
    emergenceThreshold: 0.65,
  },
};

/**
 * EXPANSION SOUL -- Portal & Fullscreen
 * Feel: Powerful, controlled expansion.
 * Use for: Portal Expansion Flow [PEF], Gyroscopic Landscape Shift [GLS].
 */
export const EXPANSION_SOUL: SpringConfig = {
  type: "spring",
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

/** Specialized spring for Lateral Glide list items */
export const GLIDE_PHYSICS: SpringConfig = {
  type: "spring",
  stiffness: 140,
  damping: 18,
  mass: 1,
};

// ─── SAMSARA SHIFT PHYSICS ───────────────────────────────────────────────────

/** Heavy spring for the navigation container (Vessel) */
export const SAMSARA_VESSEL: SpringConfig = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1,
};

/** Light spring for navigation indicators (Soul) */
export const SAMSARA_INDICATOR: SpringConfig = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 0.8,
};

// ─── DIRECTIONAL MOMENTUM ────────────────────────────────────────────────────

/**
 * Asymmetric timing adjustments for Chrysalis Shift.
 * When a container shrinks (Compression), timings are tighter.
 * When a container grows (Unfolding), timings are snappier.
 */
export const DIRECTIONAL_MOMENTUM: DirectionalMomentum = {
  compression: {
    delayReduction: 0.5,      // -50%
    durationReduction: 0.31,  // -31%
    staggerReduction: 0.33,   // -33%
  },
  unfolding: {
    delayReduction: 0.7,      // -70%
    durationReduction: 0.37,  // -37%
    staggerReduction: 0.47,   // -47%
  },
};

// ─── SSC TIMING CONSTANTS ────────────────────────────────────────────────────

/** Sequential Spatial Cascade phase delays (relative to T=0) */
export const SSC_TIMING = {
  /** Background, structural elements */
  structure: 0,
  /** Tabs, breadcrumbs, headers */
  navigation: 0.4,
  /** Main data (cascade starts here) */
  body: 0.8,
  /** FABs, footers */
  action: 1.3,
  /** Default stagger between list items */
  stagger: 0.05,
  /** Maximum stagger index (prevents "neverending cascade") */
  maxStaggerIndex: 10,
};

// ─── DROP WATER PROTOCOL TIMING ──────────────────────────────────────────────

export const DROP_WATER_TIMING = {
  /** Avatar gravitational drop duration */
  avatarDrop: 0.35,
  /** Card mitosis animation duration */
  mitosis: 0.4,
  /** Blur curtain transition duration */
  blurCurtain: 0.3,
  /** Store shutter duration (SlideMenu) */
  storeShutter: 0.55,
  /** Store shutter easing curve */
  storeEase: [0.32, 0.72, 0, 1] as EaseCurve,
};

// ─── ANCHOR PROTOCOL ─────────────────────────────────────────────────────────

/**
 * Variants for the Anchor Protocol (layout preservation during page transitions).
 * Active Matter: takes space, scrollable.
 * Dark Matter: floating, invisible, no space.
 */
export const ANCHOR_VARIANTS = {
  hidden: {
    position: "fixed" as const,
    top: 0,
    width: "100%",
    opacity: 0,
    pointerEvents: "none" as const,
  },
  visible: {
    position: "relative" as const,
    opacity: 1,
    pointerEvents: "auto" as const,
  },
};

// ─── SEQUENTIAL GRID TIMING ──────────────────────────────────────────────────

/** Sokoban turn delay: time between Item A's move and Item B's fill (seconds) */
export const SQG_TURN_DELAY = 0.12;