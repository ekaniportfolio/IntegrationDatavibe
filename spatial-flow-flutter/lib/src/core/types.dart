/// SPATIAL FLOW -- Flutter -- Type Definitions
/// ==============================================

/// Spring configuration for physics-based animations.
/// Maps directly to Flutter's SpringDescription.
class SFSpringConfig {
  final double stiffness;
  final double damping;
  final double mass;

  const SFSpringConfig({
    required this.stiffness,
    required this.damping,
    required this.mass,
  });

  SFSpringConfig copyWith({
    double? stiffness,
    double? damping,
    double? mass,
  }) =>
      SFSpringConfig(
        stiffness: stiffness ?? this.stiffness,
        damping: damping ?? this.damping,
        mass: mass ?? this.mass,
      );
}

/// Cubic bezier curve (4 control points).
class SFEaseCurve {
  final double x1, y1, x2, y2;
  const SFEaseCurve(this.x1, this.y1, this.x2, this.y2);
}

/// Tween configuration for duration-based animations.
class SFTweenConfig {
  final int durationMs;
  final SFEaseCurve easing;
  final int delayMs;

  const SFTweenConfig({
    required this.durationMs,
    required this.easing,
    this.delayMs = 0,
  });
}

/// Chrysalis Shift configuration (tween-based metamorphosis).
class SFChrysalisSoulConfig {
  final SFTweenConfig height;
  final _DissolutionConfig dissolution;
  final _EmergenceConfig emergence;
  final _WeavingConfig weaving;

  const SFChrysalisSoulConfig({
    required this.height,
    required this.dissolution,
    required this.emergence,
    required this.weaving,
  });
}

class _DissolutionConfig {
  final int durationMs;
  final int staggerMs;
  final SFEaseCurve easing;
  const _DissolutionConfig({
    required this.durationMs,
    required this.staggerMs,
    required this.easing,
  });
}

class _EmergenceConfig {
  final int delayMs;
  final int durationMs;
  final int staggerMs;
  final SFEaseCurve easing;
  const _EmergenceConfig({
    required this.delayMs,
    required this.durationMs,
    required this.staggerMs,
    required this.easing,
  });
}

class _WeavingConfig {
  final double dissolutionThreshold;
  final double emergenceThreshold;
  const _WeavingConfig({
    required this.dissolutionThreshold,
    required this.emergenceThreshold,
  });
}

/// Directional Momentum for asymmetric timing.
class SFDirectionalMomentum {
  final _MomentumDirection compression;
  final _MomentumDirection unfolding;
  const SFDirectionalMomentum({
    required this.compression,
    required this.unfolding,
  });
}

class _MomentumDirection {
  final double delayReduction;
  final double durationReduction;
  final double staggerReduction;
  const _MomentumDirection({
    required this.delayReduction,
    required this.durationReduction,
    required this.staggerReduction,
  });
}

/// Speed presets.
enum SFSpeedPreset { zen, normal, rapide, ultra }

/// Flow direction for Follow Flow navigation.
enum SFFlowDirection { backward, none, forward }

/// Protocol states for createProtocol.
class SFProtocolStates {
  final Map<String, double> initial;
  final Map<String, double> animate;
  final Map<String, double>? exit;

  const SFProtocolStates({
    required this.initial,
    required this.animate,
    this.exit,
  });
}

/// Spatial properties that should be stripped in reduced motion.
const Set<String> kSpatialProperties = {
  'translateX',
  'translateY',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skewX',
  'skewY',
};
