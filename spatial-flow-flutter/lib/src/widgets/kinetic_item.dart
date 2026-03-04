/// SPATIAL FLOW -- Flutter -- KineticItem Widget
/// ================================================
/// Lateral Glide [LG] Protocol Widget.
///
/// Even items slide from LEFT, odd items from RIGHT.
///
/// ```dart
/// ListView.builder(
///   itemCount: items.length,
///   itemBuilder: (context, i) => KineticItem(
///     index: i,
///     child: Card(child: Text(items[i].name)),
///   ),
/// )
/// ```
///
/// Author: Michel EKANI

import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/create_protocol.dart';
import '../core/types.dart';
import 'spatial_item.dart';

class KineticItem extends StatelessWidget {
  final int index;
  final Widget child;
  final double xOffset;
  final int staggerMs;

  const KineticItem({
    super.key,
    required this.index,
    required this.child,
    this.xOffset = 20.0,
    this.staggerMs = 50,
  });

  @override
  Widget build(BuildContext context) {
    final protocol = SpatialProtocol(
      name: 'lateral-glide',
      soul: SoulConstants.glide,
      states: SFProtocolStates(
        initial: {'opacity': 0.0, 'translateX': 0.0},
        animate: {'opacity': 1.0, 'translateX': 0.0},
      ),
      staggerMs: staggerMs,
      directional: true,
      xOffset: xOffset,
    );

    return SpatialItem(
      protocol: protocol,
      index: index,
      child: child,
    );
  }
}
