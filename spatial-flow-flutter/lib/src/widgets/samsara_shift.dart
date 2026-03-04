/// SPATIAL FLOW -- Flutter -- SamsaraShift
/// ==========================================
/// Samsara Shift Protocol — Direction-Aware Tab Navigation Widget.
///
/// "The Vessel carries the Soul. The Indicator points the way."
///
/// Architecture:
/// - Vessel:    Content container. Uses SAMSARA_VESSEL (heavier spring).
/// - Indicator: Visual tab pointer. Uses SAMSARA_INDICATOR (lighter spring).
/// - Direction: Computed from old→new index. Content flows with attention.
///
/// ```dart
/// SamsaraShift(
///   tabLabels: ['Home', 'Search', 'Profile'],
///   tabViews: [HomeView(), SearchView(), ProfileView()],
///   tabWidth: 120.0,
///   indicatorBuilder: (width) => Container(
///     height: 3.0,
///     width: width,
///     decoration: BoxDecoration(
///       color: Colors.purple,
///       borderRadius: BorderRadius.circular(2),
///     ),
///   ),
/// )
/// ```
///
/// Author: Michel EKANI

import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

/// Direction of flow.
enum _SamsaraDirection { left, none, right }

/// Controller for Samsara Shift navigation.
///
/// Use this for imperative control:
/// ```dart
/// final controller = SamsaraController(tabCount: 3);
/// controller.goTo(2);
/// ```
class SamsaraController extends ChangeNotifier {
  final int tabCount;
  int _activeIndex;
  _SamsaraDirection _direction = _SamsaraDirection.none;

  SamsaraController({
    required this.tabCount,
    int initialIndex = 0,
  }) : _activeIndex = initialIndex;

  int get activeIndex => _activeIndex;
  _SamsaraDirection get direction => _direction;

  void goTo(int index) {
    if (index < 0 || index >= tabCount || index == _activeIndex) return;
    _direction =
        index > _activeIndex ? _SamsaraDirection.right : _SamsaraDirection.left;
    _activeIndex = index;
    notifyListeners();
  }

  void next() {
    if (_activeIndex < tabCount - 1) goTo(_activeIndex + 1);
  }

  void prev() {
    if (_activeIndex > 0) goTo(_activeIndex - 1);
  }
}

// ─── SamsaraShift Widget ──────────────────────────────────────────────────────

class SamsaraShift extends StatefulWidget {
  /// Labels for the tab bar.
  final List<String> tabLabels;

  /// Widgets for each tab content view.
  final List<Widget> tabViews;

  /// Width of each tab.
  final double tabWidth;

  /// Starting index.
  final int initialIndex;

  /// External controller (optional).
  final SamsaraController? controller;

  /// Builder for the indicator widget.
  final Widget Function(double width)? indicatorBuilder;

  /// Callback when tab changes.
  final void Function(int index)? onChanged;

  /// Tab label style.
  final TextStyle? labelStyle;

  /// Active tab label style.
  final TextStyle? activeLabelStyle;

  const SamsaraShift({
    super.key,
    required this.tabLabels,
    required this.tabViews,
    this.tabWidth = 120.0,
    this.initialIndex = 0,
    this.controller,
    this.indicatorBuilder,
    this.onChanged,
    this.labelStyle,
    this.activeLabelStyle,
  }) : assert(tabLabels.length == tabViews.length);

  @override
  State<SamsaraShift> createState() => _SamsaraShiftState();
}

class _SamsaraShiftState extends State<SamsaraShift>
    with TickerProviderStateMixin {
  late int _activeIndex;
  late _SamsaraDirection _direction;

  // Indicator animation
  late AnimationController _indicatorController;
  late Animation<double> _indicatorAnimation;
  double _indicatorFrom = 0.0;
  double _indicatorTo = 0.0;

  // Content animation
  late AnimationController _contentController;
  late Animation<double> _contentOpacity;
  late Animation<double> _contentSlide;

  SamsaraController? _controller;

  @override
  void initState() {
    super.initState();
    _activeIndex = widget.initialIndex;
    _direction = _SamsaraDirection.none;

    // Indicator
    _indicatorFrom = _activeIndex * widget.tabWidth;
    _indicatorTo = _indicatorFrom;
    _indicatorController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _indicatorAnimation =
        AlwaysStoppedAnimation(_indicatorFrom);

    // Content
    _contentController = AnimationController(
      duration: const Duration(milliseconds: 350),
      vsync: this,
    );
    _contentOpacity = const AlwaysStoppedAnimation(1.0);
    _contentSlide = const AlwaysStoppedAnimation(0.0);

    // Listen to external controller
    _controller = widget.controller;
    _controller?.addListener(_onControllerChange);
  }

  @override
  void didUpdateWidget(SamsaraShift oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.controller != oldWidget.controller) {
      _controller?.removeListener(_onControllerChange);
      _controller = widget.controller;
      _controller?.addListener(_onControllerChange);
    }
  }

  void _onControllerChange() {
    final ctrl = _controller!;
    if (ctrl.activeIndex != _activeIndex) {
      _navigateTo(ctrl.activeIndex);
    }
  }

  void _navigateTo(int index) {
    if (index == _activeIndex) return;

    final reduced = SFReducedMotion.of(context);
    final oldIndex = _activeIndex;

    setState(() {
      _direction =
          index > oldIndex ? _SamsaraDirection.right : _SamsaraDirection.left;
      _activeIndex = index;
    });

    widget.onChanged?.call(index);

    if (reduced) return; // Instant swap via setState

    // ── Indicator Animation (SAMSARA_INDICATOR — lighter spring) ──
    final indSpring = scaledSpring(SoulConstants.samsaraIndicator);
    final indDurationMs =
        (4.0 * indSpring.mass / indSpring.damping * 1000).clamp(200.0, 2000.0).round();

    _indicatorFrom = oldIndex * widget.tabWidth;
    _indicatorTo = index * widget.tabWidth;
    _indicatorController.duration = Duration(milliseconds: indDurationMs);

    _indicatorAnimation = Tween<double>(
      begin: _indicatorFrom,
      end: _indicatorTo,
    ).animate(CurvedAnimation(
      parent: _indicatorController,
      curve: Curves.easeOutCubic,
    ));

    _indicatorController.forward(from: 0.0);

    // ── Content Animation (SAMSARA_VESSEL — heavier spring) ──
    final vesselSpring = scaledSpring(SoulConstants.samsaraVessel);
    final vesselDurationMs =
        (4.0 * vesselSpring.mass / vesselSpring.damping * 1000)
            .clamp(200.0, 2000.0)
            .round();

    _contentController.duration = Duration(milliseconds: vesselDurationMs);

    final slideDirection =
        _direction == _SamsaraDirection.right ? -1.0 : 1.0;

    _contentOpacity = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 40),
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.0), weight: 60),
    ]).animate(_contentController);

    _contentSlide = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: slideDirection * 40.0),
        weight: 40,
      ),
      TweenSequenceItem(
        tween: Tween(begin: -slideDirection * 40.0, end: 0.0),
        weight: 60,
      ),
    ]).animate(CurvedAnimation(
      parent: _contentController,
      curve: Curves.easeInOutCubic,
    ));

    _contentController.forward(from: 0.0);
  }

  @override
  void dispose() {
    _controller?.removeListener(_onControllerChange);
    _indicatorController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final defaultLabelStyle = widget.labelStyle ??
        const TextStyle(fontSize: 14, color: Color(0xFFAAAAAA));
    final activeStyle = widget.activeLabelStyle ??
        const TextStyle(fontSize: 14, color: Color(0xFFFFFFFF));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // ── Tab Bar ──────────────────────────────────────────────────
        SizedBox(
          height: 48,
          child: Stack(
            children: [
              // Tab labels
              Row(
                children: List.generate(widget.tabLabels.length, (i) {
                  return GestureDetector(
                    onTap: () => _navigateTo(i),
                    behavior: HitTestBehavior.opaque,
                    child: SizedBox(
                      width: widget.tabWidth,
                      child: Center(
                        child: Text(
                          widget.tabLabels[i],
                          style:
                              i == _activeIndex ? activeStyle : defaultLabelStyle,
                        ),
                      ),
                    ),
                  );
                }),
              ),

              // Animated indicator
              Positioned(
                bottom: 0,
                left: 0,
                child: AnimatedBuilder(
                  animation: _indicatorController,
                  builder: (context, child) {
                    final x = _indicatorController.isAnimating
                        ? _indicatorAnimation.value
                        : _activeIndex * widget.tabWidth;
                    return Transform.translate(
                      offset: Offset(x, 0),
                      child: widget.indicatorBuilder?.call(widget.tabWidth) ??
                          Container(
                            width: widget.tabWidth,
                            height: 3,
                            decoration: BoxDecoration(
                              color: const Color(0xFF8B5CF6),
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),

        // ── Content Vessel ──────────────────────────────────────────
        Expanded(
          child: AnimatedBuilder(
            animation: _contentController,
            builder: (context, child) {
              final opacity = _contentController.isAnimating
                  ? _contentOpacity.value.clamp(0.0, 1.0)
                  : 1.0;
              final slide = _contentController.isAnimating
                  ? _contentSlide.value
                  : 0.0;

              return Opacity(
                opacity: opacity,
                child: Transform.translate(
                  offset: Offset(slide, 0),
                  child: child,
                ),
              );
            },
            child: IndexedStack(
              index: _activeIndex,
              children: widget.tabViews,
            ),
          ),
        ),
      ],
    );
  }
}
