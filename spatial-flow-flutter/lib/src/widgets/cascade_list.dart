/// SPATIAL FLOW -- Flutter -- CascadeList Widget
/// ================================================
/// Sequential Spatial Cascade [SSC] Protocol Widget.
///
/// Content arrives in timed waves. Each child animates with
/// staggered spring physics driven by its index.
///
/// ```dart
/// CascadeList(
///   staggerMs: 50,
///   initialDelayMs: 200,
///   children: items.asMap().entries.map((e) =>
///     CascadeItem(index: e.key, child: Card(child: Text(e.value.name)))
///   ).toList(),
/// )
/// ```
///
/// Author: Michel EKANI

import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/create_protocol.dart';
import '../core/types.dart';
import 'spatial_item.dart';

/// Container for cascade items (optional — can use CascadeItem standalone).
class CascadeList extends StatelessWidget {
  final List<Widget> children;
  final int staggerMs;
  final int initialDelayMs;
  final EdgeInsetsGeometry? padding;

  const CascadeList({
    super.key,
    required this.children,
    this.staggerMs = 50,
    this.initialDelayMs = 200,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: children,
      ),
    );
  }
}

/// Individual cascade item with staggered entrance animation.
class CascadeItem extends StatelessWidget {
  final int index;
  final Widget child;
  final double yOffset;
  final int staggerMs;
  final int initialDelayMs;

  const CascadeItem({
    super.key,
    required this.index,
    required this.child,
    this.yOffset = 20.0,
    this.staggerMs = 50,
    this.initialDelayMs = 200,
  });

  @override
  Widget build(BuildContext context) {
    final protocol = SpatialProtocol(
      name: 'cascade',
      soul: SoulConstants.standard,
      states: SFProtocolStates(
        initial: {'opacity': 0.0, 'translateY': yOffset},
        animate: {'opacity': 1.0, 'translateY': 0.0},
      ),
      staggerMs: staggerMs,
      initialDelayMs: initialDelayMs,
    );

    return SpatialItem(
      protocol: protocol,
      index: index,
      child: child,
    );
  }
}
