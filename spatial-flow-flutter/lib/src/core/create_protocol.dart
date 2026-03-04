/// SPATIAL FLOW -- Flutter -- Protocol Factory
/// ===============================================
/// `SpatialProtocol` — The Agnostic Protocol Builder for Flutter.
///
/// Define a Soul + States → get a configuration object that drives
/// `SpatialItem` and `SpatialTransitionBuilder` widgets.
///
/// ```dart
/// final vortex = SpatialProtocol(
///   name: 'vortex',
///   soul: SoulConstants.standard,
///   states: SFProtocolStates(
///     initial: {'opacity': 0.0, 'rotate': -90.0, 'scale': 0.6},
///     animate: {'opacity': 1.0, 'rotate': 0.0, 'scale': 1.0},
///   ),
///   staggerMs: 80,
/// );
///
/// // Use in widget tree:
/// SpatialItem(protocol: vortex, index: 0, child: MyCard())
/// ```
///
/// Author: Michel EKANI

import 'types.dart';

/// A Spatial Flow protocol definition.
///
/// This is a pure data class — it holds the "recipe" for an animation.
/// Widgets like `SpatialItem` consume it to produce actual animations.
class SpatialProtocol {
  /// Human-readable protocol name (used for debugging).
  final String name;

  /// The Soul physics (spring or tween).
  /// Pass a [SFSpringConfig] for spring-based protocols.
  final SFSpringConfig? soul;

  /// Tween config (for duration-based protocols).
  /// Mutually exclusive with [soul] — provide one or the other.
  final SFTweenConfig? tweenSoul;

  /// The animation states.
  final SFProtocolStates states;

  /// Stagger delay between list items (ms).
  final int staggerMs;

  /// Delay before first item animates (ms).
  final int initialDelayMs;

  /// Direction-aware mode (Lateral Glide style).
  final bool directional;

  /// Horizontal offset for directional mode (logical pixels).
  final double xOffset;

  /// Allow opacity fades in reduced motion.
  final bool allowOpacityInReduced;

  const SpatialProtocol({
    required this.name,
    this.soul,
    this.tweenSoul,
    required this.states,
    this.staggerMs = 0,
    this.initialDelayMs = 0,
    this.directional = false,
    this.xOffset = 20.0,
    this.allowOpacityInReduced = true,
  }) : assert(soul != null || tweenSoul != null,
            'Provide either soul (spring) or tweenSoul (tween).');

  /// Whether this protocol uses spring physics.
  bool get isSpring => soul != null;

  /// Get the initial value for a specific property.
  double initialValue(String prop, {int index = 0}) {
    double base = states.initial[prop] ?? _defaultFor(prop);
    if (directional && prop == 'translateX') {
      base += (index.isEven ? -xOffset : xOffset);
    }
    return base;
  }

  /// Get the animate value for a specific property.
  double animateValue(String prop) {
    return states.animate[prop] ?? _defaultFor(prop);
  }

  /// Get the exit value for a specific property.
  double exitValue(String prop, {int index = 0}) {
    final exitStates = states.exit ?? states.initial;
    double base = exitStates[prop] ?? _defaultFor(prop);
    if (directional && prop == 'translateX') {
      base += (index.isEven ? -xOffset : xOffset);
    }
    return base;
  }

  double _defaultFor(String prop) {
    switch (prop) {
      case 'opacity':
        return 1.0;
      case 'scale':
      case 'scaleX':
      case 'scaleY':
        return 1.0;
      default:
        return 0.0;
    }
  }
}
