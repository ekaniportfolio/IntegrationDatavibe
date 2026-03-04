/// SPATIAL FLOW -- Flutter -- SequentialGrid
/// =============================================
/// Sequential Grid [SQG] Protocol Widget.
///
/// "Chaos is analog. Order is digital."
///
/// Rules:
/// - Move X OR Y. Never diagonal. Never simultaneous.
/// - Turn-based (Sokoban timing).
/// - Scale and opacity changes allowed. Rotation forbidden.
///
/// Uses AnimatedPositioned within a Stack for orthogonal grid movement.
///
/// ```dart
/// SequentialGrid<String>(
///   items: ['A', 'B', 'C', 'D', 'E', 'F'],
///   columns: 3,
///   cellWidth: 100,
///   cellHeight: 100,
///   gap: 8,
///   itemBuilder: (item, index, position) => Card(
///     child: Center(child: Text(item)),
///   ),
///   onReorder: (newOrder) => print('New order: $newOrder'),
/// )
/// ```
///
/// Author: Michel EKANI

import 'dart:async';
import 'package:flutter/widgets.dart';
import '../core/soul_constants.dart';
import '../core/types.dart';
import '../core/reduced_motion.dart';
import '../core/scale_transition.dart';

/// Sokoban turn delay in milliseconds.
const int sqgTurnDelayMs = 120;

/// Grid position helper.
class GridPosition {
  final int row;
  final int col;
  const GridPosition(this.row, this.col);

  @override
  String toString() => 'GridPosition($row, $col)';
}

class SequentialGrid<T> extends StatefulWidget {
  /// Ordered list of items.
  final List<T> items;

  /// Number of columns.
  final int columns;

  /// Width of each cell.
  final double cellWidth;

  /// Height of each cell.
  final double cellHeight;

  /// Gap between cells.
  final double gap;

  /// Builder for each grid item.
  final Widget Function(T item, int index, GridPosition position) itemBuilder;

  /// Callback when order changes.
  final void Function(List<T> newOrder)? onReorder;

  /// Sokoban turn delay in ms (default: 120).
  final int turnDelayMs;

  const SequentialGrid({
    super.key,
    required this.items,
    required this.columns,
    this.cellWidth = 100,
    this.cellHeight = 100,
    this.gap = 8,
    required this.itemBuilder,
    this.onReorder,
    this.turnDelayMs = sqgTurnDelayMs,
  });

  @override
  State<SequentialGrid<T>> createState() => _SequentialGridState<T>();
}

class _SequentialGridState<T> extends State<SequentialGrid<T>> {
  late List<T> _orderedItems;
  bool _isTurning = false;
  Timer? _turnTimer;

  @override
  void initState() {
    super.initState();
    _orderedItems = List.from(widget.items);
  }

  @override
  void didUpdateWidget(SequentialGrid<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.items != oldWidget.items) {
      _orderedItems = List.from(widget.items);
    }
  }

  GridPosition _getPosition(int index) {
    return GridPosition(
      index ~/ widget.columns,
      index % widget.columns,
    );
  }

  /// Swap two items with Sokoban timing.
  void swap(T a, T b) {
    if (_isTurning || a == b) return;

    final reduced = SFReducedMotion.isReduced;

    if (reduced) {
      setState(() {
        final idxA = _orderedItems.indexOf(a);
        final idxB = _orderedItems.indexOf(b);
        final temp = _orderedItems[idxA];
        _orderedItems[idxA] = _orderedItems[idxB];
        _orderedItems[idxB] = temp;
      });
      widget.onReorder?.call(List.from(_orderedItems));
      return;
    }

    _isTurning = true;
    _turnTimer?.cancel();
    _turnTimer = Timer(
      Duration(milliseconds: scaledDurationMs(widget.turnDelayMs)),
      () {
        if (mounted) {
          setState(() {
            final idxA = _orderedItems.indexOf(a);
            final idxB = _orderedItems.indexOf(b);
            final temp = _orderedItems[idxA];
            _orderedItems[idxA] = _orderedItems[idxB];
            _orderedItems[idxB] = temp;
            _isTurning = false;
          });
          widget.onReorder?.call(List.from(_orderedItems));
        }
      },
    );
  }

  @override
  void dispose() {
    _turnTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduced = SFReducedMotion.of(context);
    final rows = (_orderedItems.length / widget.columns).ceil();
    final totalWidth = widget.columns * widget.cellWidth +
        (widget.columns - 1) * widget.gap;
    final totalHeight =
        rows * widget.cellHeight + (rows - 1) * widget.gap;

    // Approximate spring duration from REFLEX_SOUL
    final spring = scaledSpring(SoulConstants.reflex);
    final durationMs = reduced
        ? 0
        : (4.0 * spring.mass / spring.damping * 1000).clamp(150.0, 1000.0).round();

    return SizedBox(
      width: totalWidth,
      height: totalHeight,
      child: Stack(
        children: List.generate(_orderedItems.length, (index) {
          final pos = _getPosition(index);
          final left = pos.col * (widget.cellWidth + widget.gap);
          final top = pos.row * (widget.cellHeight + widget.gap);

          return AnimatedPositioned(
            key: ValueKey(_orderedItems[index]),
            duration: Duration(milliseconds: durationMs),
            curve: Curves.easeOutCubic,
            left: left,
            top: top,
            width: widget.cellWidth,
            height: widget.cellHeight,
            child: widget.itemBuilder(
              _orderedItems[index],
              index,
              pos,
            ),
          );
        }),
      ),
    );
  }
}
