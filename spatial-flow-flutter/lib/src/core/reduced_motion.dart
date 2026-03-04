/// SPATIAL FLOW -- Flutter -- Reduced Motion Module
/// ===================================================
/// WCAG 2.1 SC 2.3.3 (AAA) Compliance for Flutter.
///
/// Uses [MediaQuery.disableAnimations] to detect the OS-level
/// "Reduce Motion" setting on iOS/Android/macOS/Windows.
///
/// Two access patterns:
/// 1. Widget tree: `SFReducedMotion.of(context)` — reactive via MediaQuery
/// 2. Singleton:   `SFReducedMotion.isReduced` — for use outside widgets
///
/// Author: Michel EKANI

import 'package:flutter/widgets.dart';
import 'types.dart';

/// Reduced motion detection and safe animation factories.
class SFReducedMotion {
  SFReducedMotion._();

  /// Module-level cache (updated by widgets, read by non-widget code).
  static bool _isReduced = false;

  /// Get the current reduced motion state.
  /// Prefer `of(context)` in widgets for reactivity.
  static bool get isReduced => _isReduced;

  /// Reactive detection via the widget tree.
  /// Call this in your build methods.
  ///
  /// ```dart
  /// final reduced = SFReducedMotion.of(context);
  /// ```
  static bool of(BuildContext context) {
    final reduced = MediaQuery.of(context).disableAnimations;
    _isReduced = reduced; // Sync the singleton cache
    return reduced;
  }

  /// Instant-settle spring for reduced motion mode.
  static const SFSpringConfig reducedSpring = SFSpringConfig(
    stiffness: 10000,
    damping: 1000,
    mass: 0.01,
  );

  /// Returns the original spring if motion is allowed,
  /// or [reducedSpring] if the user prefers reduced motion.
  static SFSpringConfig safeSpring(SFSpringConfig spring) {
    if (!_isReduced) return spring;
    return reducedSpring;
  }

  /// Returns the original duration if motion is allowed,
  /// or Duration.zero if the user prefers reduced motion.
  static Duration safeDuration(Duration duration) {
    if (!_isReduced) return duration;
    return Duration.zero;
  }

  /// Returns 0ms if reduced, else the original value.
  static int safeDurationMs(int durationMs) {
    if (!_isReduced) return durationMs;
    return 0;
  }
}
