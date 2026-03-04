/// SPATIAL FLOW -- Flutter -- SpatialItem Widget
/// =================================================
/// The universal protocol-driven animation widget.
///
/// Takes a [SpatialProtocol] and animates its child according to
/// the protocol's Soul physics, states, stagger, and reduced motion rules.
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
/// SpatialItem(protocol: vortex, index: 0, child: MyCard())
/// ```
///
/// Author: Michel EKANI

import 'dart:math' as math;
import 'package:flutter/widgets.dart';
import 'package:flutter/physics.dart';
import '../core/types.dart';
import '../core/create_protocol.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

class SpatialItem extends StatefulWidget {
  /// The protocol driving this animation.
  final SpatialProtocol protocol;

  /// Zero-based index (for stagger timing and directional offset).
  final int index;

  /// The child widget to animate.
  final Widget child;

  const SpatialItem({
    super.key,
    required this.protocol,
    this.index = 0,
    required this.child,
  });

  @override
  State<SpatialItem> createState() => _SpatialItemState();
}

class _SpatialItemState extends State<SpatialItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  // Animated values
  late Animation<double> _opacity;
  late Animation<double> _translateX;
  late Animation<double> _translateY;
  late Animation<double> _scale;
  late Animation<double> _rotate;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
    _setupAnimations();
  }

  void _setupAnimations() {
    final p = widget.protocol;
    final reduced = SFReducedMotion.isReduced;

    // Calculate stagger delay
    final delayMs = scaledDelayMs(
      p.initialDelayMs + widget.index * p.staggerMs,
    );
    final delaySeconds = delayMs / 1000.0;

    if (reduced) {
      // Instant — set final values, maybe allow opacity fade
      _controller.duration = Duration(
        milliseconds: p.allowOpacityInReduced ? 150 : 0,
      );

      _opacity = Tween<double>(
        begin: p.initialValue('opacity', index: widget.index),
        end: p.animateValue('opacity'),
      ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

      _translateX = AlwaysStoppedAnimation(p.animateValue('translateX'));
      _translateY = AlwaysStoppedAnimation(p.animateValue('translateY'));
      _scale = AlwaysStoppedAnimation(p.animateValue('scale'));
      _rotate = AlwaysStoppedAnimation(p.animateValue('rotate'));

      _controller.forward();
      return;
    }

    if (p.isSpring) {
      // Spring-based animation
      final spring = scaledSpring(p.soul!);
      final springDesc = SpringDescription(
        mass: spring.mass,
        stiffness: spring.stiffness,
        damping: spring.damping,
      );

      // Use spring simulation duration estimate (~4 * mass/damping)
      final estimatedDuration = (4.0 * spring.mass / spring.damping * 1000)
          .clamp(200.0, 5000.0)
          .round();

      _controller.duration = Duration(
        milliseconds: estimatedDuration + delayMs,
      );

      final delayed = Interval(
        delaySeconds / (_controller.duration!.inMilliseconds / 1000.0),
        1.0,
        curve: Curves.linear,
      );

      // Create tweens with spring curve approximation
      final curve = CurvedAnimation(
        parent: _controller,
        curve: delayed,
      );

      _opacity = Tween<double>(
        begin: p.initialValue('opacity', index: widget.index),
        end: p.animateValue('opacity'),
      ).animate(curve);

      _translateX = Tween<double>(
        begin: p.initialValue('translateX', index: widget.index),
        end: p.animateValue('translateX'),
      ).animate(curve);

      _translateY = Tween<double>(
        begin: p.initialValue('translateY', index: widget.index),
        end: p.animateValue('translateY'),
      ).animate(curve);

      _scale = Tween<double>(
        begin: p.initialValue('scale', index: widget.index),
        end: p.animateValue('scale'),
      ).animate(curve);

      _rotate = Tween<double>(
        begin: p.initialValue('rotate', index: widget.index),
        end: p.animateValue('rotate'),
      ).animate(curve);
    } else {
      // Tween-based animation
      final durationMs = scaledDurationMs(p.tweenSoul!.durationMs);
      _controller.duration = Duration(
        milliseconds: durationMs + delayMs,
      );

      final totalMs = _controller.duration!.inMilliseconds.toDouble();
      final delayed = Interval(
        delayMs / totalMs,
        1.0,
        curve: Cubic(
          p.tweenSoul!.easing.x1,
          p.tweenSoul!.easing.y1,
          p.tweenSoul!.easing.x2,
          p.tweenSoul!.easing.y2,
        ),
      );

      final curve = CurvedAnimation(parent: _controller, curve: delayed);

      _opacity = Tween<double>(
        begin: p.initialValue('opacity', index: widget.index),
        end: p.animateValue('opacity'),
      ).animate(curve);

      _translateX = Tween<double>(
        begin: p.initialValue('translateX', index: widget.index),
        end: p.animateValue('translateX'),
      ).animate(curve);

      _translateY = Tween<double>(
        begin: p.initialValue('translateY', index: widget.index),
        end: p.animateValue('translateY'),
      ).animate(curve);

      _scale = Tween<double>(
        begin: p.initialValue('scale', index: widget.index),
        end: p.animateValue('scale'),
      ).animate(curve);

      _rotate = Tween<double>(
        begin: p.initialValue('rotate', index: widget.index),
        end: p.animateValue('rotate'),
      ).animate(curve);
    }

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Update reduced motion from context (reactive)
    SFReducedMotion.of(context);

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacity.value.clamp(0.0, 1.0),
          child: Transform(
            transform: Matrix4.identity()
              ..translate(_translateX.value, _translateY.value)
              ..scale(_scale.value)
              ..rotateZ(_rotate.value * math.pi / 180),
            alignment: Alignment.center,
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}
