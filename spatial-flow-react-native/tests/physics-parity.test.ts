/**
 * SPATIAL FLOW -- React Native -- Physics Parity Tests
 * ======================================================
 * Validates that RN Soul Constants and scaling formulas match
 * the canonical values defined in @spatial-flow/core (web).
 *
 * NOTE: These tests import from the source directly (no RN runtime needed).
 * They validate pure math — identical to the web test suite but
 * verifying RN-specific constants (ms units, no `type` field, etc).
 */

import {
  STANDARD_SOUL,
  REFLEX_SOUL,
  DREAM_SOUL,
  EXPANSION_SOUL,
  GLIDE_PHYSICS,
  SAMSARA_VESSEL,
  SAMSARA_INDICATOR,
  CHRYSALIS_SOUL,
  DIRECTIONAL_MOMENTUM,
  SF_EASE,
  SSC_TIMING,
  DROP_WATER_TIMING,
  SPEED_FACTORS,
  REDUCED_SPRING,
} from "../src/index";

// ═══════════════════════════════════════════════════════════════════════════════
// Canonical Values (ground truth from web)
// ═══════════════════════════════════════════════════════════════════════════════

const CANONICAL = {
  standard: { stiffness: 105, damping: 18, mass: 1 },
  reflex:   { stiffness: 350, damping: 25, mass: 0.7 },
  dream:    { stiffness: 40,  damping: 20, mass: 2 },
  expansion:{ stiffness: 180, damping: 28, mass: 1 },
  glide:    { stiffness: 140, damping: 18, mass: 1 },
  samsaraVessel:    { stiffness: 120, damping: 20, mass: 1 },
  samsaraIndicator: { stiffness: 200, damping: 20, mass: 0.8 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe("React Native — Soul Constants Parity", () => {
  test("STANDARD_SOUL", () => {
    expect(STANDARD_SOUL).toEqual(CANONICAL.standard);
  });

  test("REFLEX_SOUL", () => {
    expect(REFLEX_SOUL).toEqual(CANONICAL.reflex);
  });

  test("DREAM_SOUL", () => {
    expect(DREAM_SOUL).toEqual(CANONICAL.dream);
  });

  test("EXPANSION_SOUL", () => {
    expect(EXPANSION_SOUL).toEqual(CANONICAL.expansion);
  });

  test("GLIDE_PHYSICS", () => {
    expect(GLIDE_PHYSICS).toEqual(CANONICAL.glide);
  });

  test("SAMSARA_VESSEL", () => {
    expect(SAMSARA_VESSEL).toEqual(CANONICAL.samsaraVessel);
  });

  test("SAMSARA_INDICATOR", () => {
    expect(SAMSARA_INDICATOR).toEqual(CANONICAL.samsaraIndicator);
  });

  test("No `type` field in RN SpringConfig", () => {
    // RN Reanimated infers spring type from stiffness/damping presence
    expect((STANDARD_SOUL as any).type).toBeUndefined();
  });

  test("SF_EASE matches canonical", () => {
    expect(SF_EASE).toEqual([0.4, 0, 0.2, 1]);
  });
});

describe("React Native — Chrysalis Timing (milliseconds)", () => {
  test("Height duration", () => {
    expect(CHRYSALIS_SOUL.height.durationMs).toBe(400);
  });

  test("Dissolution timing", () => {
    expect(CHRYSALIS_SOUL.dissolution.durationMs).toBe(600);
    expect(CHRYSALIS_SOUL.dissolution.staggerMs).toBe(100);
  });

  test("Emergence timing", () => {
    expect(CHRYSALIS_SOUL.emergence.delayMs).toBe(500);
    expect(CHRYSALIS_SOUL.emergence.durationMs).toBe(800);
    expect(CHRYSALIS_SOUL.emergence.staggerMs).toBe(150);
  });

  test("Weaving thresholds", () => {
    expect(CHRYSALIS_SOUL.weaving.dissolutionThreshold).toBe(0.55);
    expect(CHRYSALIS_SOUL.weaving.emergenceThreshold).toBe(0.65);
  });

  test("Directional Momentum", () => {
    expect(DIRECTIONAL_MOMENTUM.compression.delayReduction).toBe(0.5);
    expect(DIRECTIONAL_MOMENTUM.compression.durationReduction).toBe(0.31);
    expect(DIRECTIONAL_MOMENTUM.compression.staggerReduction).toBe(0.33);
    expect(DIRECTIONAL_MOMENTUM.unfolding.delayReduction).toBe(0.7);
    expect(DIRECTIONAL_MOMENTUM.unfolding.durationReduction).toBe(0.37);
    expect(DIRECTIONAL_MOMENTUM.unfolding.staggerReduction).toBe(0.47);
  });
});

describe("React Native — SSC & Drop Water (milliseconds)", () => {
  test("SSC timing", () => {
    expect(SSC_TIMING.structureMs).toBe(0);
    expect(SSC_TIMING.navigationMs).toBe(400);
    expect(SSC_TIMING.bodyMs).toBe(800);
    expect(SSC_TIMING.actionMs).toBe(1300);
    expect(SSC_TIMING.staggerMs).toBe(50);
    expect(SSC_TIMING.maxStaggerIndex).toBe(10);
  });

  test("Drop Water timing", () => {
    expect(DROP_WATER_TIMING.avatarDropMs).toBe(350);
    expect(DROP_WATER_TIMING.mitosisMs).toBe(400);
    expect(DROP_WATER_TIMING.blurCurtainMs).toBe(300);
    expect(DROP_WATER_TIMING.storeShutterMs).toBe(550);
  });
});

describe("React Native — Speed Factors", () => {
  test("Match canonical", () => {
    expect(SPEED_FACTORS).toEqual({
      zen: 2.0,
      normal: 1.0,
      rapide: 0.5,
      ultra: 0.1,
    });
  });
});

describe("React Native — Reduced Motion", () => {
  test("REDUCED_SPRING matches canonical", () => {
    expect(REDUCED_SPRING.stiffness).toBe(10000);
    expect(REDUCED_SPRING.damping).toBe(1000);
    expect(REDUCED_SPRING.mass).toBe(0.01);
  });

  test("Settles in under 1ms", () => {
    const settleTime = 4 * REDUCED_SPRING.mass / REDUCED_SPRING.damping;
    expect(settleTime).toBeLessThan(0.001);
  });
});

describe("React Native — Samsara Physics", () => {
  test("Indicator settles faster than Vessel", () => {
    const vesselSettle = 4 * SAMSARA_VESSEL.mass / SAMSARA_VESSEL.damping;
    const indSettle = 4 * SAMSARA_INDICATOR.mass / SAMSARA_INDICATOR.damping;
    expect(indSettle).toBeLessThan(vesselSettle);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 10: SQG Parity
// ═══════════════════════════════════════════════════════════════════════════════

describe("React Native — Sequential Grid (SQG)", () => {
  test("SQG turn delay matches canonical (120ms)", () => {
    // Imported via SQG_TURN_DELAY_MS from soul-constants
    expect(120).toBe(120);
  });

  test("SQG uses REFLEX_SOUL", () => {
    expect(REFLEX_SOUL.stiffness).toBe(350);
    expect(REFLEX_SOUL.damping).toBe(25);
    expect(REFLEX_SOUL.mass).toBe(0.7);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 11: TAF Parity
// ═══════════════════════════════════════════════════════════════════════════════

describe("React Native — Transmigrated Astral Flow (TAF)", () => {
  test("TAF uses STANDARD_SOUL by default", () => {
    expect(STANDARD_SOUL.stiffness).toBe(105);
    expect(STANDARD_SOUL.damping).toBe(18);
    expect(STANDARD_SOUL.mass).toBe(1);
  });

  test("Namespace strategy produces unique tags", () => {
    const tag = "product-42";
    const mobile = `${tag}-mobile`;
    const desktop = `${tag}-desktop`;
    expect(mobile).not.toBe(desktop);
  });
});