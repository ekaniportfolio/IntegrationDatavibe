/// SPATIAL FLOW -- Flutter -- Speed Control Module
/// ==================================================
/// Single source of truth for global animation velocity.
/// Singleton pattern with ChangeNotifier for Flutter reactivity.
///
/// Author: Michel EKANI

import 'package:flutter/foundation.dart';
import 'types.dart';

/// Speed factor map.
const Map<SFSpeedPreset, double> kSpeedFactors = {
  SFSpeedPreset.zen: 2.0,
  SFSpeedPreset.normal: 1.0,
  SFSpeedPreset.rapide: 0.5,
  SFSpeedPreset.ultra: 0.1,
};

/// Speed labels.
const Map<SFSpeedPreset, String> kSpeedLabels = {
  SFSpeedPreset.zen: 'Zen (0.5x)',
  SFSpeedPreset.normal: 'Normal (1x)',
  SFSpeedPreset.rapide: 'Rapide (2x)',
  SFSpeedPreset.ultra: 'Ultra (10x)',
};

/// Global speed controller — singleton with ChangeNotifier.
///
/// ```dart
/// // Listen for changes (in a StatefulWidget):
/// SpatialSpeed.instance.addListener(_rebuild);
///
/// // Change speed:
/// SpatialSpeed.instance.setPreset(SFSpeedPreset.rapide);
///
/// // Get scaled duration:
/// final ms = SpatialSpeed.instance.flowDurationMs(400);
/// ```
class SpatialSpeed extends ChangeNotifier {
  SpatialSpeed._();

  static final SpatialSpeed instance = SpatialSpeed._();

  double _globalFactor = 1.0;
  double _spatialFlowSpeed = 2.0;
  SFSpeedPreset _preset = SFSpeedPreset.normal;

  /// Current preset.
  SFSpeedPreset get preset => _preset;

  /// Human-readable label.
  String get label => kSpeedLabels[_preset] ?? 'Normal (1x)';

  /// Raw Spatial Flow Speed value.
  double get spatialFlowSpeed => _spatialFlowSpeed;

  /// Speed scale factor for duration multiplication.
  /// normal = 1.0, zen > 1.0, ultra < 1.0.
  double get speedScale => 2.0 / _spatialFlowSpeed;

  /// Scale a base duration (ms) by the current speed.
  int flowDurationMs(int baseDurationMs) =>
      (baseDurationMs / _spatialFlowSpeed).round();

  /// Scale a base duration (double ms) by the current speed.
  double flowDurationMsDouble(double baseDurationMs) =>
      baseDurationMs / _spatialFlowSpeed;

  /// Update the global speed preset.
  void setPreset(SFSpeedPreset newPreset) {
    _preset = newPreset;
    _globalFactor = kSpeedFactors[newPreset] ?? 1.0;
    _spatialFlowSpeed = 2.0 / _globalFactor;
    notifyListeners();
  }
}
