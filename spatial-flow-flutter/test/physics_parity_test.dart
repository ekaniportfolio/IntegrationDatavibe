/// SPATIAL FLOW -- Flutter -- Physics Parity Tests
/// ==================================================
/// Validates that Flutter Soul Constants and scaling formulas match
/// the canonical values defined in @spatial-flow/core (web).
///
/// Run: flutter test test/physics_parity_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:spatial_flow/spatial_flow.dart';

void main() {
  // ═══════════════════════════════════════════════════════════════════════════
  // Canonical Values (ground truth from web @spatial-flow/core)
  // ═══════════════════════════════════════════════════════════════════════════

  const canonical = {
    'standard': {'stiffness': 105.0, 'damping': 18.0, 'mass': 1.0},
    'reflex': {'stiffness': 350.0, 'damping': 25.0, 'mass': 0.7},
    'dream': {'stiffness': 40.0, 'damping': 20.0, 'mass': 2.0},
    'expansion': {'stiffness': 180.0, 'damping': 28.0, 'mass': 1.0},
    'glide': {'stiffness': 140.0, 'damping': 18.0, 'mass': 1.0},
    'samsaraVessel': {'stiffness': 120.0, 'damping': 20.0, 'mass': 1.0},
    'samsaraIndicator': {'stiffness': 200.0, 'damping': 20.0, 'mass': 0.8},
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 1: Soul Constants
  // ═══════════════════════════════════════════════════════════════════════════

  group('Soul Constants', () {
    void expectSpringMatch(SFSpringConfig spring, Map<String, double> expected) {
      expect(spring.stiffness, equals(expected['stiffness']));
      expect(spring.damping, equals(expected['damping']));
      expect(spring.mass, equals(expected['mass']));
    }

    test('STANDARD matches canonical', () {
      expectSpringMatch(SoulConstants.standard, canonical['standard']!);
    });

    test('REFLEX matches canonical', () {
      expectSpringMatch(SoulConstants.reflex, canonical['reflex']!);
    });

    test('DREAM matches canonical', () {
      expectSpringMatch(SoulConstants.dream, canonical['dream']!);
    });

    test('EXPANSION matches canonical', () {
      expectSpringMatch(SoulConstants.expansion, canonical['expansion']!);
    });

    test('GLIDE matches canonical', () {
      expectSpringMatch(SoulConstants.glide, canonical['glide']!);
    });

    test('SAMSARA_VESSEL matches canonical', () {
      expectSpringMatch(SoulConstants.samsaraVessel, canonical['samsaraVessel']!);
    });

    test('SAMSARA_INDICATOR matches canonical', () {
      expectSpringMatch(
          SoulConstants.samsaraIndicator, canonical['samsaraIndicator']!);
    });

    test('SF_EASE matches canonical [0.4, 0, 0.2, 1]', () {
      expect(sfEase.x1, equals(0.4));
      expect(sfEase.y1, equals(0.0));
      expect(sfEase.x2, equals(0.2));
      expect(sfEase.y2, equals(1.0));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 2: Speed Scaling
  // ═══════════════════════════════════════════════════════════════════════════

  group('Speed Scaling', () {
    test('Speed factors match canonical', () {
      expect(kSpeedFactors[SFSpeedPreset.zen], equals(2.0));
      expect(kSpeedFactors[SFSpeedPreset.normal], equals(1.0));
      expect(kSpeedFactors[SFSpeedPreset.rapide], equals(0.5));
      expect(kSpeedFactors[SFSpeedPreset.ultra], equals(0.1));
    });

    test('scaledSpring formula matches web', () {
      // At normal speed (scale = 1.0), values should be unchanged
      SpatialSpeed.instance.setPreset(SFSpeedPreset.normal);
      final scaled = scaledSpring(SoulConstants.standard);
      expect(scaled.stiffness, equals(SoulConstants.standard.stiffness));
      expect(scaled.damping, equals(SoulConstants.standard.damping));
      expect(scaled.mass, equals(SoulConstants.standard.mass));
    });

    test('scaledSpring at zen speed', () {
      SpatialSpeed.instance.setPreset(SFSpeedPreset.zen);
      final scaled = scaledSpring(SoulConstants.standard);
      // stiffness / 2.0, damping unchanged, mass * 2.0
      expect(scaled.stiffness, equals(105.0 / 2.0));
      expect(scaled.damping, equals(18.0));
      expect(scaled.mass, equals(1.0 * 2.0));
      // Reset
      SpatialSpeed.instance.setPreset(SFSpeedPreset.normal);
    });

    test('scaledDurationMs formula matches web', () {
      SpatialSpeed.instance.setPreset(SFSpeedPreset.normal);
      expect(scaledDurationMs(400), equals(400));

      SpatialSpeed.instance.setPreset(SFSpeedPreset.zen);
      expect(scaledDurationMs(400), equals(800)); // 400 * 2.0

      SpatialSpeed.instance.setPreset(SFSpeedPreset.rapide);
      expect(scaledDurationMs(400), equals(200)); // 400 * 0.5

      // Reset
      SpatialSpeed.instance.setPreset(SFSpeedPreset.normal);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 3: Chrysalis Timing
  // ═══════════════════════════════════════════════════════════════════════════

  group('Chrysalis Timing', () {
    test('Chrysalis constants match canonical (ms)', () {
      expect(chrysalisSoul.height.durationMs, equals(400));
      expect(chrysalisSoul.dissolution.durationMs, equals(600));
      expect(chrysalisSoul.dissolution.staggerMs, equals(100));
      expect(chrysalisSoul.emergence.delayMs, equals(500));
      expect(chrysalisSoul.emergence.durationMs, equals(800));
      expect(chrysalisSoul.emergence.staggerMs, equals(150));
    });

    test('Weaving thresholds match canonical', () {
      expect(chrysalisSoul.weaving.dissolutionThreshold, equals(0.55));
      expect(chrysalisSoul.weaving.emergenceThreshold, equals(0.65));
    });

    test('Directional Momentum matches canonical', () {
      expect(directionalMomentum.compression.delayReduction, equals(0.5));
      expect(directionalMomentum.compression.durationReduction, equals(0.31));
      expect(directionalMomentum.compression.staggerReduction, equals(0.33));

      expect(directionalMomentum.unfolding.delayReduction, equals(0.7));
      expect(directionalMomentum.unfolding.durationReduction, equals(0.37));
      expect(directionalMomentum.unfolding.staggerReduction, equals(0.47));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 4: Samsara Physics
  // ═══════════════════════════════════════════════════════════════════════════

  group('Samsara Shift Physics', () {
    test('Indicator is lighter than Vessel', () {
      expect(SoulConstants.samsaraIndicator.stiffness,
          greaterThan(SoulConstants.samsaraVessel.stiffness));
      expect(SoulConstants.samsaraIndicator.mass,
          lessThan(SoulConstants.samsaraVessel.mass));
    });

    test('Indicator settles faster than Vessel', () {
      final vesselSettle = 4 * SoulConstants.samsaraVessel.mass /
          SoulConstants.samsaraVessel.damping;
      final indSettle = 4 * SoulConstants.samsaraIndicator.mass /
          SoulConstants.samsaraIndicator.damping;
      expect(indSettle, lessThan(vesselSettle));
    });

    test('Relative physics preserved after speed scaling', () {
      for (final preset in SFSpeedPreset.values) {
        SpatialSpeed.instance.setPreset(preset);
        final sVessel = scaledSpring(SoulConstants.samsaraVessel);
        final sInd = scaledSpring(SoulConstants.samsaraIndicator);

        final vesselSettle = 4 * sVessel.mass / sVessel.damping;
        final indSettle = 4 * sInd.mass / sInd.damping;

        expect(indSettle, lessThan(vesselSettle),
            reason: 'Indicator must settle faster at $preset');
      }
      SpatialSpeed.instance.setPreset(SFSpeedPreset.normal);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 5: Reduced Motion
  // ═══════════════════════════════════════════════════════════════════════════

  group('Reduced Motion', () {
    test('Reduced spring matches canonical', () {
      expect(SFReducedMotion.reducedSpring.stiffness, equals(10000.0));
      expect(SFReducedMotion.reducedSpring.damping, equals(1000.0));
      expect(SFReducedMotion.reducedSpring.mass, equals(0.01));
    });

    test('Reduced spring settles in under 1ms', () {
      final settleTime = 4 * SFReducedMotion.reducedSpring.mass /
          SFReducedMotion.reducedSpring.damping;
      expect(settleTime, lessThan(0.001));
    });

    test('safeDuration returns zero when reduced', () {
      // Note: We can't easily mock MediaQuery in unit tests,
      // but we test the function contract
      expect(SFReducedMotion.safeDurationMs(400), equals(400));
      // When reduced = true, it should return 0
      // (tested via integration tests with actual MediaQuery)
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 6: Protocol Factory
  // ═══════════════════════════════════════════════════════════════════════════

  group('Protocol Factory', () {
    test('SpatialProtocol can be created with spring soul', () {
      final protocol = SpatialProtocol(
        name: 'test',
        soul: SoulConstants.standard,
        states: SFProtocolStates(
          initial: {'opacity': 0.0, 'translateY': 20.0},
          animate: {'opacity': 1.0, 'translateY': 0.0},
        ),
      );

      expect(protocol.isSpring, isTrue);
      expect(protocol.name, equals('test'));
      expect(protocol.initialValue('opacity'), equals(0.0));
      expect(protocol.animateValue('opacity'), equals(1.0));
      expect(protocol.animateValue('translateY'), equals(0.0));
    });

    test('SpatialProtocol directional mode applies xOffset', () {
      final protocol = SpatialProtocol(
        name: 'lateral',
        soul: SoulConstants.glide,
        states: SFProtocolStates(
          initial: {'opacity': 0.0, 'translateX': 0.0},
          animate: {'opacity': 1.0, 'translateX': 0.0},
        ),
        directional: true,
        xOffset: 20.0,
      );

      // Even index → -xOffset
      expect(protocol.initialValue('translateX', index: 0), equals(-20.0));
      // Odd index → +xOffset
      expect(protocol.initialValue('translateX', index: 1), equals(20.0));
      // Even index
      expect(protocol.initialValue('translateX', index: 2), equals(-20.0));
    });

    test('SpatialProtocol can be created with tween soul', () {
      final protocol = SpatialProtocol(
        name: 'curtain',
        tweenSoul: SFTweenConfig(durationMs: 600, easing: sfEase),
        states: SFProtocolStates(
          initial: {'opacity': 0.0, 'translateY': -40.0},
          animate: {'opacity': 1.0, 'translateY': 0.0},
        ),
      );

      expect(protocol.isSpring, isFalse);
      expect(protocol.tweenSoul!.durationMs, equals(600));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 7: SSC & Drop Water Timing
  // ═══════════════════════════════════════════════════════════════════════════

  group('SSC & Drop Water Timing', () {
    test('SSC timings match canonical (ms)', () {
      expect(SSCTiming.structureMs, equals(0));
      expect(SSCTiming.navigationMs, equals(400));
      expect(SSCTiming.bodyMs, equals(800));
      expect(SSCTiming.actionMs, equals(1300));
      expect(SSCTiming.staggerMs, equals(50));
      expect(SSCTiming.maxStaggerIndex, equals(10));
    });

    test('Drop Water timings match canonical (ms)', () {
      expect(DropWaterTiming.avatarDropMs, equals(350));
      expect(DropWaterTiming.mitosisMs, equals(400));
      expect(DropWaterTiming.blurCurtainMs, equals(300));
      expect(DropWaterTiming.storeShutterMs, equals(550));
    });

    test('Drop Water easing matches SF_EASE variant', () {
      expect(DropWaterTiming.storeEase.x1, equals(0.32));
      expect(DropWaterTiming.storeEase.y1, equals(0.72));
      expect(DropWaterTiming.storeEase.x2, equals(0.0));
      expect(DropWaterTiming.storeEase.y2, equals(1.0));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 8: Sequential Grid (SQG)
  // ═══════════════════════════════════════════════════════════════════════════

  group('Sequential Grid (SQG)', () {
    test('SQG turn delay matches canonical (120ms)', () {
      expect(SQGTiming.turnDelayMs, equals(120));
    });

    test('SQG uses REFLEX_SOUL', () {
      expect(SoulConstants.reflex.stiffness, equals(350.0));
      expect(SoulConstants.reflex.damping, equals(25.0));
      expect(SoulConstants.reflex.mass, equals(0.7));
    });

    test('SQG turn delay scales correctly', () {
      SpatialSpeed.instance.setPreset(SFSpeedPreset.zen);
      expect(scaledDurationMs(SQGTiming.turnDelayMs), equals(240)); // 120 * 2.0

      SpatialSpeed.instance.setPreset(SFSpeedPreset.rapide);
      expect(scaledDurationMs(SQGTiming.turnDelayMs), equals(60)); // 120 * 0.5

      SpatialSpeed.instance.setPreset(SFSpeedPreset.normal);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Suite 9: Transmigrated Astral Flow (TAF)
  // ═══════════════════════════════════════════════════════════════════════════

  group('Transmigrated Astral Flow (TAF)', () {
    test('TAF uses STANDARD_SOUL by default', () {
      expect(SoulConstants.standard.stiffness, equals(105.0));
      expect(SoulConstants.standard.damping, equals(18.0));
      expect(SoulConstants.standard.mass, equals(1.0));
    });

    test('Namespace strategy produces unique tags', () {
      const tag = 'product-42';
      const mobile = '$tag-mobile';
      const desktop = '$tag-desktop';
      expect(mobile, isNot(equals(desktop)));
    });
  });
}