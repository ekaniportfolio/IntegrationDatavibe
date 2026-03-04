/// SPATIAL FLOW -- Flutter -- ChrysalisContainer
/// =================================================
/// Chrysalis Shift [CS] Protocol Widget.
///
/// "The container does not change pages. It sheds its skin."
///
/// Three-Phase Weave:
/// Phase 1 (Dissolution): Old content exits element by element
/// Phase 2 (Breathing):   Container height animates (starts at 55% of Phase 1)
/// Phase 3 (Emergence):   New content enters element by element (starts at 65% of Phase 2)
///
/// ```dart
/// ChrysalisContainer(
///   activeView: _currentView,
///   views: {
///     'signin': SignInForm(onForgot: () => setState(() => _currentView = 'forgot')),
///     'forgot': ForgotForm(onBack: () => setState(() => _currentView = 'signin')),
///   },
///   viewHeights: {'signin': 700.0, 'forgot': 420.0},
/// )
/// ```
///
/// Author: Michel EKANI

import 'dart:async';
import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/spatial_speed.dart';
import '../core/scale_transition.dart';

// ─── Timing Calculator ───────────────────────────────────────────────────────

class _ChrysalisTimings {
  final int contentCloseTimeMs;
  final int heightStartMs;
  final int contentSwitchMs;
  final int heightDurationMs;
  final int openDelayMs;
  final int openDurationMs;
  final int openStaggerMs;
  final int closeDurationMs;
  final int closeStaggerMs;

  const _ChrysalisTimings({
    required this.contentCloseTimeMs,
    required this.heightStartMs,
    required this.contentSwitchMs,
    required this.heightDurationMs,
    required this.openDelayMs,
    required this.openDurationMs,
    required this.openStaggerMs,
    required this.closeDurationMs,
    required this.closeStaggerMs,
  });
}

_ChrysalisTimings _calculateTimings(
  int elementCount,
  int closeDurationMs,
  int closeStaggerMs,
  String direction, // "compression" | "unfolding" | "default"
) {
  final contentCloseTimeMs = closeDurationMs + (elementCount - 1) * closeStaggerMs;
  final heightStartMs =
      (contentCloseTimeMs * chrysalisSoul.weaving.dissolutionThreshold).round();
  final heightDurationMs = SpatialSpeed.instance.flowDurationMs(
    chrysalisSoul.height.durationMs,
  );
  final contentSwitchMs =
      (heightStartMs + heightDurationMs * chrysalisSoul.weaving.emergenceThreshold)
          .round();

  // Apply Directional Momentum
  var openDelay = chrysalisSoul.emergence.delayMs.toDouble();
  var openDuration = chrysalisSoul.emergence.durationMs.toDouble();
  var openStagger = chrysalisSoul.emergence.staggerMs.toDouble();

  if (direction == 'compression') {
    openDelay *= 1 - directionalMomentum.compression.delayReduction;
    openDuration *= 1 - directionalMomentum.compression.durationReduction;
    openStagger *= 1 - directionalMomentum.compression.staggerReduction;
  } else if (direction == 'unfolding') {
    openDelay *= 1 - directionalMomentum.unfolding.delayReduction;
    openDuration *= 1 - directionalMomentum.unfolding.durationReduction;
    openStagger *= 1 - directionalMomentum.unfolding.staggerReduction;
  }

  return _ChrysalisTimings(
    contentCloseTimeMs: contentCloseTimeMs,
    heightStartMs: heightStartMs,
    contentSwitchMs: contentSwitchMs,
    heightDurationMs: heightDurationMs,
    openDelayMs: SpatialSpeed.instance.flowDurationMs(openDelay.round()),
    openDurationMs: SpatialSpeed.instance.flowDurationMs(openDuration.round()),
    openStaggerMs: SpatialSpeed.instance.flowDurationMs(openStagger.round()),
    closeDurationMs: SpatialSpeed.instance.flowDurationMs(closeDurationMs),
    closeStaggerMs: SpatialSpeed.instance.flowDurationMs(closeStaggerMs),
  );
}

// ─── ChrysalisContainer ──────────────────────────────────────────────────────

class ChrysalisContainer extends StatefulWidget {
  /// Current active view key.
  final String activeView;

  /// Map of view keys to their widgets.
  final Map<String, Widget> views;

  /// Height for each view in logical pixels.
  final Map<String, double> viewHeights;

  /// Number of animatable elements per view (default: 6).
  final Map<String, int>? viewElementCounts;

  /// Callback when transition completes.
  final VoidCallback? onTransitionComplete;

  const ChrysalisContainer({
    super.key,
    required this.activeView,
    required this.views,
    required this.viewHeights,
    this.viewElementCounts,
    this.onTransitionComplete,
  });

  @override
  State<ChrysalisContainer> createState() => _ChrysalisContainerState();
}

class _ChrysalisContainerState extends State<ChrysalisContainer>
    with SingleTickerProviderStateMixin {
  late String _currentView;
  late double _targetHeight;
  bool _isTransitioning = false;
  String? _previousView;

  Timer? _heightTimer;
  Timer? _switchTimer;

  @override
  void initState() {
    super.initState();
    _currentView = widget.activeView;
    _targetHeight = widget.viewHeights[widget.activeView] ?? 500.0;
    _previousView = widget.activeView;
  }

  @override
  void didUpdateWidget(ChrysalisContainer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.activeView != _previousView && !_isTransitioning) {
      _performTransition(widget.activeView);
    }
  }

  void _performTransition(String newView) {
    final reduced = SFReducedMotion.of(context);

    if (reduced) {
      setState(() {
        _targetHeight = widget.viewHeights[newView] ?? 500.0;
        _currentView = newView;
        _previousView = newView;
      });
      widget.onTransitionComplete?.call();
      return;
    }

    setState(() => _isTransitioning = true);

    final prevHeight = widget.viewHeights[_previousView ?? _currentView] ?? 500.0;
    final nextHeight = widget.viewHeights[newView] ?? 500.0;
    final direction = nextHeight < prevHeight
        ? 'compression'
        : nextHeight > prevHeight
            ? 'unfolding'
            : 'default';

    final elementCount =
        widget.viewElementCounts?[_previousView ?? _currentView] ?? 6;
    final timings = _calculateTimings(
      elementCount,
      chrysalisSoul.dissolution.durationMs,
      chrysalisSoul.dissolution.staggerMs,
      direction,
    );

    // Phase 2: Height breathing
    _heightTimer?.cancel();
    _heightTimer = Timer(Duration(milliseconds: timings.heightStartMs), () {
      if (mounted) {
        setState(() => _targetHeight = nextHeight);
      }
    });

    // Phase 3: Content swap
    _switchTimer?.cancel();
    _switchTimer = Timer(Duration(milliseconds: timings.contentSwitchMs), () {
      if (mounted) {
        setState(() {
          _currentView = newView;
          _previousView = newView;
          _isTransitioning = false;
        });
        widget.onTransitionComplete?.call();
      }
    });
  }

  @override
  void dispose() {
    _heightTimer?.cancel();
    _switchTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduced = SFReducedMotion.of(context);
    final heightDurationMs = reduced
        ? 0
        : SpatialSpeed.instance.flowDurationMs(chrysalisSoul.height.durationMs);

    return AnimatedContainer(
      duration: Duration(milliseconds: heightDurationMs),
      curve: Cubic(sfEase.x1, sfEase.y1, sfEase.x2, sfEase.y2),
      constraints: BoxConstraints(maxHeight: _targetHeight),
      clipBehavior: Clip.hardEdge,
      decoration: const BoxDecoration(),
      child: widget.views[_currentView] ?? const SizedBox.shrink(),
    );
  }
}

// ─── ChrysalisElement ────────────────────────────────────────────────────────

/// Wrap each child element inside a Chrysalis view to get automatic
/// enter/exit animations based on element index.
///
/// ```dart
/// ChrysalisElement(
///   index: 0,
///   isClosing: _isClosing,
///   child: Text('Title'),
/// )
/// ```
class ChrysalisElement extends StatefulWidget {
  final int index;
  final bool isClosing;
  final Widget child;
  final int? openDelayMs;
  final int? openDurationMs;
  final int? openStaggerMs;
  final int? closeDurationMs;
  final int? closeStaggerMs;

  const ChrysalisElement({
    super.key,
    required this.index,
    required this.isClosing,
    required this.child,
    this.openDelayMs,
    this.openDurationMs,
    this.openStaggerMs,
    this.closeDurationMs,
    this.closeStaggerMs,
  });

  @override
  State<ChrysalisElement> createState() => _ChrysalisElementState();
}

class _ChrysalisElementState extends State<ChrysalisElement>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<double> _translateY;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
    _setupAnimation();
  }

  @override
  void didUpdateWidget(ChrysalisElement oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isClosing != oldWidget.isClosing) {
      _setupAnimation();
    }
  }

  void _setupAnimation() {
    final reduced = SFReducedMotion.isReduced;

    final openDelayMs =
        widget.openDelayMs ?? chrysalisSoul.emergence.delayMs;
    final openDurationMs =
        widget.openDurationMs ?? chrysalisSoul.emergence.durationMs;
    final openStaggerMs =
        widget.openStaggerMs ?? chrysalisSoul.emergence.staggerMs;
    final closeDurationMs =
        widget.closeDurationMs ?? chrysalisSoul.dissolution.durationMs;
    final closeStaggerMs =
        widget.closeStaggerMs ?? chrysalisSoul.dissolution.staggerMs;

    final sfCurve = Cubic(sfEase.x1, sfEase.y1, sfEase.x2, sfEase.y2);

    if (reduced) {
      _controller.duration = const Duration(milliseconds: 0);
      _opacity = AlwaysStoppedAnimation(widget.isClosing ? 0.0 : 1.0);
      _translateY = const AlwaysStoppedAnimation(0.0);
      return;
    }

    if (widget.isClosing) {
      final delayMs = scaledDelayMs(widget.index * closeStaggerMs);
      final durationMs = scaledDurationMs(closeDurationMs);
      _controller.duration = Duration(milliseconds: delayMs + durationMs);

      final totalMs = (delayMs + durationMs).toDouble();
      final delayed = totalMs > 0
          ? Interval(delayMs / totalMs, 1.0, curve: sfCurve)
          : sfCurve;

      final curved = CurvedAnimation(parent: _controller, curve: delayed);

      _opacity = Tween<double>(begin: 1.0, end: 0.0).animate(curved);
      _translateY = Tween<double>(begin: 0.0, end: -8.0).animate(curved);
    } else {
      final delayMs = scaledDelayMs(openDelayMs + widget.index * openStaggerMs);
      final durationMs = scaledDurationMs(openDurationMs);
      _controller.duration = Duration(milliseconds: delayMs + durationMs);

      final totalMs = (delayMs + durationMs).toDouble();
      final delayed = totalMs > 0
          ? Interval(delayMs / totalMs, 1.0, curve: sfCurve)
          : sfCurve;

      final curved = CurvedAnimation(parent: _controller, curve: delayed);

      _opacity = Tween<double>(begin: 0.0, end: 1.0).animate(curved);
      _translateY = Tween<double>(begin: 8.0, end: 0.0).animate(curved);
    }

    _controller.forward(from: 0.0);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacity.value.clamp(0.0, 1.0),
          child: Transform.translate(
            offset: Offset(0, _translateY.value),
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}
