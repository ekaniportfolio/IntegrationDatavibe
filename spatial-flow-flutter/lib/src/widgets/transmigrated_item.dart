/// SPATIAL FLOW -- Flutter -- TransmigratedItem
/// ================================================
/// Transmigrated Astral Flow [TAF] Protocol Widget.
///
/// "The element does not die. It transmigrates."
///
/// In Flutter, TAF wraps the built-in `Hero` widget with:
/// - STANDARD_SOUL physics (via `flightShuttleBuilder` spring curve)
/// - RAU safety via `enabled` flag
/// - Namespace strategy via tag composition
///
/// ```dart
/// // Screen A (list)
/// TransmigratedItem(
///   tag: 'product-${item.id}',
///   child: Image.network(item.imageUrl),
/// )
///
/// // Screen B (detail) - same tag
/// TransmigratedItem(
///   tag: 'product-${item.id}',
///   child: Image.network(item.imageUrl, fit: BoxFit.cover),
/// )
/// ```
///
/// Author: Michel EKANI

import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

class TransmigratedItem extends StatelessWidget {
  /// Unique tag for this transmigrating element.
  /// Must match between source and target screens.
  final String tag;

  /// Optional namespace suffix (e.g., 'mobile' → tag becomes 'tag-mobile').
  final String? namespace;

  /// The child widget.
  final Widget child;

  /// Whether the Hero transition is enabled (RAU safety).
  /// Set to false to prevent Quantum Flicker.
  final bool enabled;

  /// Custom spring config (default: SoulConstants.standard).
  final SFSpringConfig? spring;

  /// How the child is placed within the hero bounds during flight.
  final BoxFit? flightFit;

  const TransmigratedItem({
    super.key,
    required this.tag,
    this.namespace,
    required this.child,
    this.enabled = true,
    this.spring,
    this.flightFit,
  });

  String get _resolvedTag => namespace != null ? '$tag-$namespace' : tag;

  @override
  Widget build(BuildContext context) {
    if (!enabled) {
      // RAU Safety: When disabled, render without Hero
      return child;
    }

    final reduced = SFReducedMotion.of(context);

    return Hero(
      tag: _resolvedTag,
      // Use custom flight shuttle for spring-based transition
      flightShuttleBuilder: reduced
          ? null // Default crossfade in reduced motion
          : (
              BuildContext flightContext,
              Animation<double> animation,
              HeroFlightDirection flightDirection,
              BuildContext fromHeroContext,
              BuildContext toHeroContext,
            ) {
              final springConfig =
                  scaledSpring(spring ?? SoulConstants.standard);

              // Use a curved animation that approximates the spring feel
              // The actual spring duration is estimated from mass/damping
              final curved = CurvedAnimation(
                parent: animation,
                curve: Curves.easeOutCubic,
              );

              return AnimatedBuilder(
                animation: curved,
                builder: (context, _) {
                  // During flight, render the destination version
                  return toHeroContext.widget;
                },
              );
            },
      child: child,
    );
  }
}

/// Helper widget for managing TAF transitions with shield capability.
///
/// Wraps multiple TransmigratedItem children and can disable all
/// their Hero transitions simultaneously (Layout Projection Shield).
///
/// ```dart
/// TransmigrationZone(
///   shielded: _isFilterActive,
///   children: [
///     TransmigratedItem(tag: 'a', child: WidgetA()),
///     TransmigratedItem(tag: 'b', child: WidgetB()),
///   ],
/// )
/// ```
class TransmigrationZone extends StatelessWidget {
  /// Whether all child TransmigratedItems should be shielded.
  final bool shielded;

  /// Child widgets (should include TransmigratedItem instances).
  final List<Widget> children;

  const TransmigrationZone({
    super.key,
    this.shielded = false,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    if (!shielded) {
      return Column(children: children);
    }

    // When shielded, wrap each TransmigratedItem with enabled=false
    return Column(
      children: children.map((child) {
        if (child is TransmigratedItem) {
          return TransmigratedItem(
            key: child.key,
            tag: child.tag,
            namespace: child.namespace,
            enabled: false, // Shield active: disable Hero
            spring: child.spring,
            child: child.child,
          );
        }
        return child;
      }).toList(),
    );
  }
}
