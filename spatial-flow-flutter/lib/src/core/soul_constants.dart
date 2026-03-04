/// SPATIAL FLOW -- Flutter -- Soul Constants
/// ============================================
/// The Physics Engine of the Living Interface.
///
/// IDENTICAL physics values as @spatial-flow/core (web).
/// Timing values in MILLISECONDS.
///
/// RULE: Never use arbitrary durations. Always reference a Soul constant.
///
/// Author: Michel EKANI

import 'types.dart';

/// The Spatial Flow standard cubic bezier curve.
const SFEaseCurve sfEase = SFEaseCurve(0.4, 0, 0.2, 1);

/// All Soul types accessible via `SoulConstants.*`.
abstract final class SoulConstants {
  // ─── STANDARD SOUL -- General Movement ──────────────────────────────
  /// Feel: Confident, balanced, professional.
  /// Use for: Navigation transitions, morphing, general UI movement.
  static const SFSpringConfig standard = SFSpringConfig(
    stiffness: 105,
    damping: 18,
    mass: 1,
  );

  // ─── REFLEX SOUL -- High Energy ────────────────────────────────────
  /// Feel: Snap, click, toggle, rigid expansion.
  /// Use for: Button clicks, toggles, micro-interactions.
  static const SFSpringConfig reflex = SFSpringConfig(
    stiffness: 350,
    damping: 25,
    mass: 0.7,
  );

  // ─── DREAM SOUL -- Backgrounds & Ambience ──────────────────────────
  /// Feel: Viscous, dreamy, heavy, slow drift.
  /// Use for: Background parallax, ambient floating elements.
  static const SFSpringConfig dream = SFSpringConfig(
    stiffness: 40,
    damping: 20,
    mass: 2,
  );

  // ─── EXPANSION SOUL -- Portal & Fullscreen ─────────────────────────
  /// Feel: Powerful, controlled expansion.
  /// Use for: Portal Expansion Flow, fullscreen transitions.
  static const SFSpringConfig expansion = SFSpringConfig(
    stiffness: 180,
    damping: 28,
    mass: 1,
  );

  // ─── LATERAL GLIDE PHYSICS ─────────────────────────────────────────
  static const SFSpringConfig glide = SFSpringConfig(
    stiffness: 140,
    damping: 18,
    mass: 1,
  );

  // ─── SAMSARA SHIFT PHYSICS ─────────────────────────────────────────
  static const SFSpringConfig samsaraVessel = SFSpringConfig(
    stiffness: 120,
    damping: 20,
    mass: 1,
  );

  static const SFSpringConfig samsaraIndicator = SFSpringConfig(
    stiffness: 200,
    damping: 20,
    mass: 0.8,
  );
}

/// Chrysalis Soul -- Content Transmutation (tween-based).
const SFChrysalisSoulConfig chrysalisSoul = SFChrysalisSoulConfig(
  height: SFTweenConfig(durationMs: 400, easing: sfEase),
  dissolution: _DissolutionConfig(
    durationMs: 600,
    staggerMs: 100,
    easing: sfEase,
  ),
  emergence: _EmergenceConfig(
    delayMs: 500,
    durationMs: 800,
    staggerMs: 150,
    easing: sfEase,
  ),
  weaving: _WeavingConfig(
    dissolutionThreshold: 0.55,
    emergenceThreshold: 0.65,
  ),
);

/// Directional Momentum for Chrysalis Shift.
const SFDirectionalMomentum directionalMomentum = SFDirectionalMomentum(
  compression: _MomentumDirection(
    delayReduction: 0.5,
    durationReduction: 0.31,
    staggerReduction: 0.33,
  ),
  unfolding: _MomentumDirection(
    delayReduction: 0.7,
    durationReduction: 0.37,
    staggerReduction: 0.47,
  ),
);

/// SSC Timing Constants (in milliseconds).
abstract final class SSCTiming {
  static const int structureMs = 0;
  static const int navigationMs = 400;
  static const int bodyMs = 800;
  static const int actionMs = 1300;
  static const int staggerMs = 50;
  static const int maxStaggerIndex = 10;
}

/// Drop Water Protocol Timing (in milliseconds).
abstract final class DropWaterTiming {
  static const int avatarDropMs = 350;
  static const int mitosisMs = 400;
  static const int blurCurtainMs = 300;
  static const int storeShutterMs = 550;
  static const SFEaseCurve storeEase = SFEaseCurve(0.32, 0.72, 0, 1);
}

/// Sequential Grid Timing (in milliseconds).
abstract final class SQGTiming {
  /// Sokoban turn delay between Item A and Item B moves.
  static const int turnDelayMs = 120;
}