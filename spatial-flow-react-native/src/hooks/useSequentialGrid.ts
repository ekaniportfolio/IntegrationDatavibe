/**
 * SPATIAL FLOW -- React Native -- useSequentialGrid Hook
 * ========================================================
 * Sequential Grid [SQG] Protocol.
 *
 * "Chaos is analog. Order is digital."
 *
 * Rules:
 * - Move X OR Y. Never diagonal. Never simultaneous.
 * - Turn-based (Sokoban timing).
 * - Scale and opacity changes allowed. Rotation forbidden.
 *
 * Uses LayoutAnimation for automatic grid transitions.
 *
 * @example
 * function KanbanBoard({ items }) {
 *   const grid = useSequentialGrid({ items: items.map(i => i.id), columns: 3 });
 *
 *   return (
 *     <View style={styles.grid}>
 *       {grid.orderedItems.map(id => (
 *         <Animated.View key={id} style={grid.itemStyle}>
 *           <Card>{items.find(i => i.id === id)?.content}</Card>
 *         </Animated.View>
 *       ))}
 *     </View>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useCallback, useRef } from "react";
import { LayoutAnimation, Platform } from "react-native";
import { REFLEX_SOUL } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledDurationMs } from "../core/scale-transition";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GridPosition {
  row: number;
  col: number;
}

interface UseSequentialGridOptions<T extends string | number> {
  items: T[];
  columns: number;
  turnDelayMs?: number;
  onReorder?: (newOrder: T[]) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SQG_TURN_DELAY_MS = 120;

// ─── Layout Animation Config ─────────────────────────────────────────────────

const SQG_LAYOUT_CONFIG = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: REFLEX_SOUL.damping / REFLEX_SOUL.stiffness * 100,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: REFLEX_SOUL.damping / REFLEX_SOUL.stiffness * 100,
  },
  delete: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: REFLEX_SOUL.damping / REFLEX_SOUL.stiffness * 100,
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSequentialGrid<T extends string | number>(
  options: UseSequentialGridOptions<T>
) {
  const {
    items: initialItems,
    columns,
    turnDelayMs = SQG_TURN_DELAY_MS,
    onReorder,
  } = options;

  const [orderedItems, setOrderedItems] = useState<T[]>(initialItems);
  const [isTurning, setIsTurning] = useState(false);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rows = Math.ceil(orderedItems.length / columns);

  const getPosition = useCallback(
    (itemId: T): GridPosition => {
      const idx = orderedItems.indexOf(itemId);
      return {
        row: Math.floor(idx / columns),
        col: idx % columns,
      };
    },
    [orderedItems, columns]
  );

  const swap = useCallback(
    (a: T, b: T) => {
      if (isTurning || a === b) return;

      const reduced = getReducedMotion();

      if (reduced) {
        setOrderedItems((prev) => {
          const next = [...prev];
          const idxA = next.indexOf(a);
          const idxB = next.indexOf(b);
          [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
          onReorder?.(next);
          return next;
        });
        return;
      }

      setIsTurning(true);

      const scaledDelay = scaledDurationMs(turnDelayMs);

      turnTimer.current = setTimeout(() => {
        // Configure LayoutAnimation for the swap
        LayoutAnimation.configureNext(SQG_LAYOUT_CONFIG);

        setOrderedItems((prev) => {
          const next = [...prev];
          const idxA = next.indexOf(a);
          const idxB = next.indexOf(b);
          [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
          onReorder?.(next);
          return next;
        });

        setIsTurning(false);
      }, scaledDelay);
    },
    [isTurning, turnDelayMs, onReorder]
  );

  const moveTo = useCallback(
    (itemId: T, targetRow: number, targetCol: number) => {
      const targetIdx = targetRow * columns + targetCol;
      if (targetIdx < 0 || targetIdx >= orderedItems.length) return;
      const targetItem = orderedItems[targetIdx];
      if (targetItem !== undefined) swap(itemId, targetItem);
    },
    [orderedItems, columns, swap]
  );

  return {
    orderedItems,
    swap,
    moveTo,
    getPosition,
    isTurning,
    gridSize: { rows, cols: columns },
  };
}

export { SQG_TURN_DELAY_MS };
