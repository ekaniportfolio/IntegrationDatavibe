/// SPATIAL FLOW -- Flutter -- ReflexMatrix Widget
/// =================================================
/// Reflex Matrix [RM] Protocol — "The Organic Cell"
///
/// A container that undergoes mitosis (biological division) to reveal options.
///
/// Key Patterns (adapted from web):
/// - Inverse Trapdoor: expansion via AnimatedContainer
/// - Soft Lock: Scrollable.ensureVisible to headroom position
/// - Ghost DOM: GlobalKey measurement of target height before animating
///
/// Physics: REFLEX_SOUL (stiffness: 350, damping: 25, mass: 0.7)
///
/// ```dart
/// ReflexMatrix(
///   isExpanded: _isExpanded,
///   onToggle: () => setState(() => _isExpanded = !_isExpanded),
///   collapsed: CompactCard(),
///   expanded: DetailView(),
/// )
/// ```
///
/// Author: Michel EKANI

import 'dart:async';
import 'package:flutter/widgets.dart';
import 'package:flutter/physics.dart';
import '../core/soul_constants.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

/// Headroom offset for Soft Lock (px from top).
const double reflexHeadroomPx = 160.0;

class ReflexMatrix extends StatefulWidget {
  /// Whether the cell is expanded.
  final bool isExpanded;

  /// Toggle callback.
  final VoidCallback onToggle;

  /// Compact/collapsed content.
  final Widget collapsed;

  /// Expanded detail content.
  final Widget expanded;

  /// Headroom position for Soft Lock (default: 160).
  final double headroomOffset;

  /// Custom spring config (default: SoulConstants.reflex).
  final SFSpringConfig? spring;

  const ReflexMatrix({
    super.key,
    required this.isExpanded,
    required this.onToggle,
    required this.collapsed,
    required this.expanded,
    this.headroomOffset = reflexHeadroomPx,
    this.spring,
  });

  @override
  State<ReflexMatrix> createState() => _ReflexMatrixState();
}

class _ReflexMatrixState extends State<ReflexMatrix>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _heightAnimation;

  final GlobalKey _collapsedKey = GlobalKey();
  final GlobalKey _expandedKey = GlobalKey();
  final GlobalKey _containerKey = GlobalKey();

  double _collapsedHeight = 0;
  double _expandedHeight = 0;
  bool _measured = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
    _heightAnimation = _controller.drive(Tween<double>(begin: 0, end: 1));

    // Measure after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
  }

  @override
  void didUpdateWidget(ReflexMatrix oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isExpanded != oldWidget.isExpanded) {
      _animateTransition();
    }
  }

  void _measure() {
    final collapsedBox =
        _collapsedKey.currentContext?.findRenderObject() as RenderBox?;
    if (collapsedBox != null && collapsedBox.hasSize) {
      _collapsedHeight = collapsedBox.size.height;
    }

    // Ghost DOM measurement happens via the hidden expanded widget
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final expandedBox =
          _expandedKey.currentContext?.findRenderObject() as RenderBox?;
      if (expandedBox != null && expandedBox.hasSize) {
        _expandedHeight = expandedBox.size.height;
        _measured = true;
        if (mounted) setState(() {});
      }
    });
  }

  void _animateTransition() {
    final reduced = SFReducedMotion.of(context);
    final spring = scaledSpring(widget.spring ?? SoulConstants.reflex);

    // Approximate spring duration
    final durationMs = reduced
        ? 1
        : (4.0 * spring.mass / spring.damping * 1000).clamp(100.0, 1500.0).round();

    _controller.duration = Duration(milliseconds: durationMs);

    if (widget.isExpanded) {
      _controller.forward(from: 0);
      // Soft Lock: scroll to make this widget visible with headroom
      _softLock();
    } else {
      _controller.reverse(from: 1);
    }
  }

  void _softLock() {
    final context = _containerKey.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
        alignment: 0.1, // ~10% from top = headroom
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onToggle,
      child: Stack(
        key: _containerKey,
        children: [
          // Main animated container
          AnimatedBuilder(
            animation: _heightAnimation,
            builder: (context, child) {
              final targetHeight = widget.isExpanded
                  ? _expandedHeight
                  : _collapsedHeight;
              final currentHeight = _measured && targetHeight > 0
                  ? _collapsedHeight +
                      (_expandedHeight - _collapsedHeight) *
                          _heightAnimation.value
                  : null;

              return SizedBox(
                height: currentHeight,
                child: ClipRect(
                  child: widget.isExpanded
                      ? KeyedSubtree(
                          key: _expandedKey,
                          child: widget.expanded,
                        )
                      : KeyedSubtree(
                          key: _collapsedKey,
                          child: widget.collapsed,
                        ),
                ),
              );
            },
          ),

          // Ghost DOM: hidden expanded content for measurement
          if (!_measured && !widget.isExpanded)
            Positioned(
              left: 0,
              right: 0,
              child: Opacity(
                opacity: 0,
                child: IgnorePointer(
                  child: KeyedSubtree(
                    key: _expandedKey,
                    child: widget.expanded,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
