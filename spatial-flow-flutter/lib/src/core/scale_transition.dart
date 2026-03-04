/// SPATIAL FLOW -- Flutter -- Transition Scaling
/// ================================================
/// Scales spring/timing configs by the global speed factor.
///
/// Author: Michel EKANI

import 'types.dart';
import 'spatial_speed.dart';

/// Scale a spring config by the current speed factor.
///
/// ```dart
/// final spring = scaledSpring(SoulConstants.standard);
/// ```
SFSpringConfig scaledSpring(SFSpringConfig config) {
  final s = SpatialSpeed.instance.speedScale;
  if (s == 1.0) return config;
  return SFSpringConfig(
    stiffness: config.stiffness / s,
    damping: config.damping,
    mass: config.mass * s,
  );
}

/// Scale a duration (ms) by the current speed factor.
int scaledDurationMs(int durationMs) {
  final s = SpatialSpeed.instance.speedScale;
  return (durationMs * s).round();
}

/// Scale a delay (ms) by the current speed factor.
int scaledDelayMs(int delayMs) {
  final s = SpatialSpeed.instance.speedScale;
  return (delayMs * s).round();
}

/// Scale a duration (double ms) by the current speed factor.
double scaledDurationMsDouble(double durationMs) {
  return durationMs * SpatialSpeed.instance.speedScale;
}
