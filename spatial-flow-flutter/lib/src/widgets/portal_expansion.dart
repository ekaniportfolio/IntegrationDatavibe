/// SPATIAL FLOW -- Flutter -- PortalExpansion
/// =============================================
/// Portal Expansion Flow [PEF] Protocol Widget.
///
/// "Inline content expands to fullscreen from its exact position."
///
/// Architecture:
/// 1. GlobalKey captures source widget position via RenderBox.
/// 2. Overlay entry escapes widget tree constraints.
/// 3. EXPANSION_SOUL spring animates from sourceRect to fullscreen.
/// 4. Reverse: Same spring back to captured sourceRect.
///
/// ```dart
/// PortalExpansion(
///   child: Card(child: Text('Tap to expand')),
///   expandedBuilder: (context, collapse) => Scaffold(
///     appBar: AppBar(
///       leading: IconButton(icon: Icon(Icons.close), onPressed: collapse),
///     ),
///     body: Center(child: Text('Fullscreen content')),
///   ),
/// )
/// ```
///
/// Author: Michel EKANI

import 'dart:ui';
import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

class PortalExpansion extends StatefulWidget {
  /// The trigger widget (e.g., a card, thumbnail, etc.)
  final Widget child;

  /// Builder for the expanded content.
  /// Receives a `collapse` callback to trigger reverse animation.
  final Widget Function(BuildContext context, VoidCallback collapse) expandedBuilder;

  /// Custom spring physics (default: SoulConstants.expansion).
  final SFSpringConfig? spring;

  /// Border radius of the source widget (default: 12).
  final double borderRadius;

  /// Callback when fully expanded.
  final VoidCallback? onExpanded;

  /// Callback when fully collapsed.
  final VoidCallback? onCollapsed;

  const PortalExpansion({
    super.key,
    required this.child,
    required this.expandedBuilder,
    this.spring,
    this.borderRadius = 12.0,
    this.onExpanded,
    this.onCollapsed,
  });

  @override
  State<PortalExpansion> createState() => _PortalExpansionState();
}

class _PortalExpansionState extends State<PortalExpansion>
    with SingleTickerProviderStateMixin {
  final GlobalKey _sourceKey = GlobalKey();
  late AnimationController _controller;

  OverlayEntry? _overlayEntry;
  Rect? _sourceRect;
  bool _isExpanded = false;

  // Animated values
  late Animation<double> _top;
  late Animation<double> _left;
  late Animation<double> _width;
  late Animation<double> _height;
  late Animation<double> _radius;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
  }

  void _expand() {
    final RenderBox? box =
        _sourceKey.currentContext?.findRenderObject() as RenderBox?;
    if (box == null) return;

    final position = box.localToGlobal(Offset.zero);
    final size = box.size;
    _sourceRect = Rect.fromLTWH(
      position.dx,
      position.dy,
      size.width,
      size.height,
    );

    final reduced = SFReducedMotion.of(context);
    final screen = MediaQuery.of(context).size;

    final spring = scaledSpring(widget.spring ?? SoulConstants.expansion);
    final durationMs = reduced
        ? 0
        : (4.0 * spring.mass / spring.damping * 1000).clamp(200.0, 3000.0).round();

    _controller.duration = Duration(milliseconds: durationMs);

    final curve = reduced
        ? Curves.linear
        : Curves.easeOutCubic;

    final curvedAnim = CurvedAnimation(parent: _controller, curve: curve);

    _top = Tween(begin: _sourceRect!.top, end: 0.0).animate(curvedAnim);
    _left = Tween(begin: _sourceRect!.left, end: 0.0).animate(curvedAnim);
    _width = Tween(begin: _sourceRect!.width, end: screen.width).animate(curvedAnim);
    _height = Tween(begin: _sourceRect!.height, end: screen.height).animate(curvedAnim);
    _radius = Tween(begin: widget.borderRadius, end: 0.0).animate(curvedAnim);

    _overlayEntry = OverlayEntry(
      builder: (context) => AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return Positioned(
            top: _top.value,
            left: _left.value,
            width: _width.value,
            height: _height.value,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(_radius.value),
              child: widget.expandedBuilder(context, _collapse),
            ),
          );
        },
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
    setState(() => _isExpanded = true);

    _controller.forward(from: 0.0).then((_) {
      widget.onExpanded?.call();
    });
  }

  void _collapse() {
    final reduced = SFReducedMotion.of(context);

    if (reduced) {
      _overlayEntry?.remove();
      _overlayEntry = null;
      setState(() => _isExpanded = false);
      widget.onCollapsed?.call();
      return;
    }

    _controller.reverse().then((_) {
      _overlayEntry?.remove();
      _overlayEntry = null;
      setState(() => _isExpanded = false);
      widget.onCollapsed?.call();
    });
  }

  @override
  void dispose() {
    _overlayEntry?.remove();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      key: _sourceKey,
      onTap: _isExpanded ? null : _expand,
      child: widget.child,
    );
  }
}
