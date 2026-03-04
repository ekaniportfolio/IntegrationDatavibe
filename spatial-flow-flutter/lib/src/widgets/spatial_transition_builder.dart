/// SPATIAL FLOW -- Flutter -- SpatialTransitionBuilder
/// =====================================================
/// The equivalent of `useSpatialTransition()` for Flutter.
///
/// A builder widget that gives you full control over animation values
/// while the framework handles speed scaling + reduced motion.
///
/// ```dart
/// SpatialTransitionBuilder(
///   soul: SoulConstants.dream,
///   from: {'opacity': 0.0, 'translateY': 30.0},
///   to: {'opacity': 1.0, 'translateY': 0.0},
///   builder: (context, values) {
///     return Opacity(
///       opacity: values['opacity']!,
///       child: Transform.translate(
///         offset: Offset(0, values['translateY']!),
///         child: MyWidget(),
///       ),
///     );
///   },
/// )
/// ```
///
/// Author: Michel EKANI

import 'dart:math' as math;
import 'package:flutter/widgets.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

class SpatialTransitionBuilder extends StatefulWidget {
  /// Spring soul (provide this OR [tweenDurationMs]).
  final SFSpringConfig? soul;

  /// Tween duration in ms (provide this OR [soul]).
  final int? tweenDurationMs;

  /// Tween easing curve.
  final SFEaseCurve? tweenEasing;

  /// Initial property values.
  final Map<String, double> from;

  /// Target property values.
  final Map<String, double> to;

  /// Delay before animation starts (ms).
  final int delayMs;

  /// Allow opacity fades in reduced motion.
  final bool allowOpacityInReduced;

  /// Builder that receives the interpolated values.
  final Widget Function(
    BuildContext context,
    Map<String, double> values,
  ) builder;

  const SpatialTransitionBuilder({
    super.key,
    this.soul,
    this.tweenDurationMs,
    this.tweenEasing,
    required this.from,
    required this.to,
    this.delayMs = 0,
    this.allowOpacityInReduced = true,
    required this.builder,
  }) : assert(soul != null || tweenDurationMs != null,
            'Provide either soul (spring) or tweenDurationMs (tween).');

  @override
  State<SpatialTransitionBuilder> createState() =>
      _SpatialTransitionBuilderState();
}

class _SpatialTransitionBuilderState extends State<SpatialTransitionBuilder>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final Map<String, Animation<double>> _animations = {};

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
    _setup();
  }

  void _setup() {
    final reduced = SFReducedMotion.isReduced;
    final delayMs = scaledDelayMs(widget.delayMs);

    if (reduced) {
      _controller.duration = Duration(
        milliseconds: widget.allowOpacityInReduced ? 150 : 0,
      );

      for (final key in {...widget.from.keys, ...widget.to.keys}) {
        final fromVal = widget.from[key] ?? _defaultFor(key);
        final toVal = widget.to[key] ?? _defaultFor(key);

        if (key == 'opacity' && widget.allowOpacityInReduced) {
          _animations[key] = Tween<double>(begin: fromVal, end: toVal).animate(
            CurvedAnimation(parent: _controller, curve: Curves.easeOut),
          );
        } else if (kSpatialProperties.contains(key)) {
          // Strip spatial — jump to final
          _animations[key] = AlwaysStoppedAnimation(toVal);
        } else {
          _animations[key] = AlwaysStoppedAnimation(toVal);
        }
      }

      _controller.forward();
      return;
    }

    // Full animation
    int totalMs;
    Curve curve;

    if (widget.soul != null) {
      final spring = scaledSpring(widget.soul!);
      totalMs = (4.0 * spring.mass / spring.damping * 1000)
          .clamp(200.0, 5000.0)
          .round();
      curve = Curves.easeOutCubic; // Approximation of spring
    } else {
      totalMs = scaledDurationMs(widget.tweenDurationMs!);
      final e = widget.tweenEasing;
      curve = e != null ? Cubic(e.x1, e.y1, e.x2, e.y2) : Curves.easeInOut;
    }

    _controller.duration = Duration(milliseconds: totalMs + delayMs);

    final delayed = delayMs > 0
        ? Interval(
            delayMs / (totalMs + delayMs).toDouble(),
            1.0,
            curve: curve,
          )
        : curve;

    final curvedAnim = CurvedAnimation(parent: _controller, curve: delayed);

    for (final key in {...widget.from.keys, ...widget.to.keys}) {
      final fromVal = widget.from[key] ?? _defaultFor(key);
      final toVal = widget.to[key] ?? _defaultFor(key);

      _animations[key] = Tween<double>(begin: fromVal, end: toVal).animate(
        curvedAnim,
      );
    }

    _controller.forward();
  }

  double _defaultFor(String key) {
    switch (key) {
      case 'opacity':
      case 'scale':
      case 'scaleX':
      case 'scaleY':
        return 1.0;
      default:
        return 0.0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    SFReducedMotion.of(context); // Sync singleton

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        final values = <String, double>{};
        for (final entry in _animations.entries) {
          values[entry.key] = entry.value.value;
        }
        return widget.builder(context, values);
      },
    );
  }
}
