/// SPATIAL FLOW -- Flutter -- DropWater
/// =======================================
/// Drop Water Protocol [DWP] — Complete 5-Act Sequence Widget.
///
/// "The avatar does not open a modal. It BECOMES the portal."
///
/// Five-Act Sequence:
/// Act 1 — Trigger:           Avatar gravitational drop
/// Act 2 — Backdrop:          Dark scrim fades in
/// Act 3 — Blur Curtain:      Background blur
/// Act 4 — Mitosis:           Card keyframe expansion (seed → pill → card)
/// Act 5 — Content Emergence: Form elements stagger-enter
///
/// ```dart
/// DropWaterTrigger(
///   avatar: CircleAvatar(backgroundImage: NetworkImage(url)),
///   portalBuilder: (context, reverse) => AuthForm(onClose: reverse),
///   cardWidth: 350.0,
///   cardHeight: 480.0,
/// )
/// ```
///
/// Author: Michel EKANI

import 'dart:async';
import 'dart:ui';
import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

/// The phase of the Drop Water sequence.
enum DWPhase { idle, dropping, expanding, open, reversing }

class DropWaterTrigger extends StatefulWidget {
  /// The avatar widget that triggers the sequence.
  final Widget avatar;

  /// Builder for the portal content (auth form, etc.).
  /// Receives a `reverse` callback to close.
  final Widget Function(BuildContext context, VoidCallback reverse) portalBuilder;

  /// Card dimensions.
  final double cardWidth;
  final double cardHeight;

  /// Backdrop color.
  final Color backdropColor;

  /// Callback when sequence completes (fully open).
  final VoidCallback? onComplete;

  /// Callback when reverse completes (fully closed).
  final VoidCallback? onReversed;

  const DropWaterTrigger({
    super.key,
    required this.avatar,
    required this.portalBuilder,
    this.cardWidth = 350.0,
    this.cardHeight = 480.0,
    this.backdropColor = const Color(0x99000000),
    this.onComplete,
    this.onReversed,
  });

  @override
  State<DropWaterTrigger> createState() => _DropWaterTriggerState();
}

class _DropWaterTriggerState extends State<DropWaterTrigger>
    with TickerProviderStateMixin {
  final GlobalKey _avatarKey = GlobalKey();

  DWPhase _phase = DWPhase.idle;
  Offset? _avatarCenter;

  // Controllers
  late AnimationController _avatarController;     // Act 1: Drop
  late AnimationController _backdropController;   // Act 2: Backdrop
  late AnimationController _mitosisController;    // Act 4: Mitosis
  late AnimationController _reverseController;    // Reverse

  // Animations
  late Animation<double> _avatarDropY;
  late Animation<double> _avatarOpacity;
  late Animation<double> _backdropOpacity;
  late Animation<double> _cardScale;
  late Animation<double> _cardOpacity;
  late Animation<double> _cardRadius;

  OverlayEntry? _overlayEntry;

  Timer? _expandTimer;
  Timer? _openTimer;
  Timer? _reverseTimer;

  @override
  void initState() {
    super.initState();
    _avatarController = AnimationController(vsync: this);
    _backdropController = AnimationController(vsync: this);
    _mitosisController = AnimationController(vsync: this);
    _reverseController = AnimationController(vsync: this);
  }

  void _trigger() {
    if (_phase != DWPhase.idle) return;

    // Capture avatar position
    final RenderBox? box =
        _avatarKey.currentContext?.findRenderObject() as RenderBox?;
    if (box == null) return;

    final pos = box.localToGlobal(Offset.zero);
    _avatarCenter = Offset(
      pos.dx + box.size.width / 2,
      pos.dy + box.size.height / 2,
    );

    final reduced = SFReducedMotion.of(context);
    final screenH = MediaQuery.of(context).size.height;

    if (reduced) {
      setState(() => _phase = DWPhase.open);
      _showOverlay();
      widget.onComplete?.call();
      return;
    }

    setState(() => _phase = DWPhase.dropping);

    // ── Act 1: Avatar Drop ──────────────────────────────────────────
    final dropMs = scaledDurationMs(DropWaterTiming.avatarDropMs);
    _avatarController.duration = Duration(milliseconds: dropMs);

    _avatarDropY = Tween(begin: 0.0, end: screenH * 0.4).animate(
      CurvedAnimation(
        parent: _avatarController,
        curve: const Cubic(0.55, 0, 1, 0.45), // Gravity
      ),
    );
    _avatarOpacity = Tween(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _avatarController,
        curve: const Interval(0.0, 0.5, curve: Curves.easeOut),
      ),
    );

    // ── Act 2: Backdrop ─────────────────────────────────────────────
    final blurMs = scaledDurationMs(DropWaterTiming.blurCurtainMs);
    _backdropController.duration = Duration(milliseconds: blurMs);

    _backdropOpacity = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _backdropController, curve: Curves.easeOut),
    );

    // ── Act 4: Mitosis ──────────────────────────────────────────────
    final mitosisMs = scaledDurationMs(DropWaterTiming.mitosisMs);
    _mitosisController.duration = Duration(milliseconds: mitosisMs);

    final storeEase = Cubic(
      DropWaterTiming.storeEase.x1,
      DropWaterTiming.storeEase.y1,
      DropWaterTiming.storeEase.x2,
      DropWaterTiming.storeEase.y2,
    );

    _cardScale = TweenSequence([
      TweenSequenceItem(tween: Tween(begin: 0.05, end: 0.3), weight: 40),
      TweenSequenceItem(tween: Tween(begin: 0.3, end: 1.0), weight: 60),
    ]).animate(CurvedAnimation(parent: _mitosisController, curve: storeEase));

    _cardOpacity = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _mitosisController,
        curve: const Interval(0.0, 0.5, curve: Curves.easeOut),
      ),
    );

    _cardRadius = TweenSequence([
      TweenSequenceItem(tween: Tween(begin: 100.0, end: 24.0), weight: 40),
      TweenSequenceItem(tween: Tween(begin: 24.0, end: 16.0), weight: 60),
    ]).animate(CurvedAnimation(
      parent: _mitosisController,
      curve: Cubic(sfEase.x1, sfEase.y1, sfEase.x2, sfEase.y2),
    ));

    // Start Act 1 & 2
    _avatarController.forward(from: 0.0);
    _backdropController.forward(from: 0.0);

    // Act 4 starts after avatar drop
    _expandTimer?.cancel();
    _expandTimer = Timer(Duration(milliseconds: dropMs), () {
      if (mounted) {
        setState(() => _phase = DWPhase.expanding);
        _showOverlay();
        _mitosisController.forward(from: 0.0);
      }
    });

    // Fully open
    _openTimer?.cancel();
    _openTimer = Timer(Duration(milliseconds: dropMs + mitosisMs), () {
      if (mounted) {
        setState(() => _phase = DWPhase.open);
        widget.onComplete?.call();
      }
    });
  }

  void _reverse() {
    if (_phase == DWPhase.idle || _phase == DWPhase.reversing) return;

    final reduced = SFReducedMotion.of(context);

    if (reduced) {
      _removeOverlay();
      _resetAll();
      setState(() => _phase = DWPhase.idle);
      widget.onReversed?.call();
      return;
    }

    setState(() => _phase = DWPhase.reversing);

    // Reverse all simultaneously
    _mitosisController.reverse();
    _backdropController.reverse();

    final reverseMs = scaledDurationMs(
      DropWaterTiming.mitosisMs + DropWaterTiming.blurCurtainMs,
    );

    // Avatar return (delayed)
    Future.delayed(
      Duration(milliseconds: scaledDelayMs((DropWaterTiming.mitosisMs * 0.5).round())),
      () {
        if (mounted) _avatarController.reverse();
      },
    );

    _reverseTimer?.cancel();
    _reverseTimer = Timer(Duration(milliseconds: reverseMs), () {
      if (mounted) {
        _removeOverlay();
        _resetAll();
        setState(() => _phase = DWPhase.idle);
        widget.onReversed?.call();
      }
    });
  }

  void _showOverlay() {
    _overlayEntry?.remove();

    final screenSize = MediaQuery.of(context).size;

    _overlayEntry = OverlayEntry(
      builder: (context) => Stack(
        children: [
          // Backdrop
          AnimatedBuilder(
            animation: _backdropController,
            builder: (context, _) {
              return GestureDetector(
                onTap: _reverse,
                child: Container(
                  width: screenSize.width,
                  height: screenSize.height,
                  color: widget.backdropColor
                      .withOpacity((_backdropOpacity.value).clamp(0.0, 1.0) * 0.6),
                ),
              );
            },
          ),

          // Card (Mitosis)
          AnimatedBuilder(
            animation: _mitosisController,
            builder: (context, child) {
              return Positioned(
                left: (screenSize.width - widget.cardWidth) / 2,
                top: (screenSize.height - widget.cardHeight) / 2,
                child: Transform.scale(
                  scale: _cardScale.value.clamp(0.01, 2.0),
                  child: Opacity(
                    opacity: _cardOpacity.value.clamp(0.0, 1.0),
                    child: ClipRRect(
                      borderRadius:
                          BorderRadius.circular(_cardRadius.value.clamp(0.0, 200.0)),
                      child: SizedBox(
                        width: widget.cardWidth,
                        height: widget.cardHeight,
                        child: widget.portalBuilder(context, _reverse),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  void _resetAll() {
    _avatarController.value = 0.0;
    _backdropController.value = 0.0;
    _mitosisController.value = 0.0;
    _avatarCenter = null;
  }

  @override
  void dispose() {
    _expandTimer?.cancel();
    _openTimer?.cancel();
    _reverseTimer?.cancel();
    _removeOverlay();
    _avatarController.dispose();
    _backdropController.dispose();
    _mitosisController.dispose();
    _reverseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isAnimating = _phase != DWPhase.idle;

    if (!isAnimating) {
      return GestureDetector(
        key: _avatarKey,
        onTap: _trigger,
        child: widget.avatar,
      );
    }

    // Avatar with drop animation
    return AnimatedBuilder(
      key: _avatarKey,
      animation: _avatarController,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _avatarDropY.value),
          child: Opacity(
            opacity: _avatarOpacity.value.clamp(0.0, 1.0),
            child: GestureDetector(
              onTap: _phase == DWPhase.idle ? _trigger : null,
              child: widget.avatar,
            ),
          ),
        );
      },
    );
  }
}
