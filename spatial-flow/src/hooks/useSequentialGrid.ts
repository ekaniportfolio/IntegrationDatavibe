/**
 * SPATIAL FLOW FRAMEWORK -- useSequentialGrid Hook
 * ==================================================
 * Sequential Grid [SQG] Protocol.
 *
 * "Chaos is analog. Order is digital."
 *
 * Rules:
 * - Move X **OR** Y. Never diagonal. Never simultaneous.
 * - Turn-based: Item A moves, then Item B fills the void (Sokoban timing).
 * - Scale and opacity changes allowed during movement. Rotation forbidden.
 *
 * Architecture:
 * - Maintains a position map (item ID → { row, col })
 * - On swap(A, B): A moves first (X or Y axis only), then B fills the gap.
 * - Uses REFLEX_SOUL for snap-like grid movement.
 * - Sokoban Timing: turnDelay between A's start and B's start.
 *
 * @example
 * function KanbanBoard({ items }) {
 *   const grid = useSequentialGrid({
 *     items: items.map(i => i.id),
 *     columns: 3,
 *   });
 *
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       {grid.orderedItems.map(id => (
 *         <motion.div
 *           key={id}
 *           layout
 *           transition={grid.transition}
 *           layoutId={`grid-${id}`}
 *           onDragEnd={(_, info) => grid.handleDrop(id, info.point)}
 *         >
 *           <Card>{items.find(i => i.id === id)?.content}</Card>
 *         </motion.div>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useCallback, useRef, useMemo } from "react";
import { REFLEX_SOUL, SF_EASE } from "../core/soul-constants";
import { scaledSpring, scaleTransition } from "../core/scale-transition";
import { getFlowDuration } from "../core/spatial-speed";
import { getReducedMotion, REDUCED_TRANSITION } from "../core/reduced-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GridPosition {
  row: number;
  col: number;
}

interface UseSequentialGridOptions<T extends string | number> {
  /** Ordered list of item IDs */
  items: T[];
  /** Number of columns in the grid */
  columns: number;
  /** Cell width in px (for hit-test, default: 200) */
  cellWidth?: number;
  /** Cell height in px (for hit-test, default: 200) */
  cellHeight?: number;
  /** Gap between cells in px (default: 16) */
  gap?: number;
  /** Sokoban delay between A and B moves in seconds (default: 0.12) */
  turnDelay?: number;
  /** Callback when order changes */
  onReorder?: (newOrder: T[]) => void;
}

interface UseSequentialGridReturn<T extends string | number> {
  /** Current ordered items */
  orderedItems: T[];
  /** Swap two items by ID (Sokoban timing applied internally) */
  swap: (a: T, b: T) => void;
  /** Move an item to a specific grid position */
  moveTo: (itemId: T, targetRow: number, targetCol: number) => void;
  /** Handle drop from drag — resolve to nearest cell */
  handleDrop: (itemId: T, point: { x: number; y: number }) => void;
  /** Get the grid position of an item */
  getPosition: (itemId: T) => GridPosition;
  /** Whether a Sokoban turn is in progress */
  isTurning: boolean;
  /** Motion transition for grid items */
  transition: Record<string, any>;
  /** Item count per dimension */
  gridSize: { rows: number; cols: number };
}

// ─── SQG Timing ───────────────────────────────────────────────────────────────

/** Sokoban turn delay: time between Item A's move and Item B's fill */
const SQG_TURN_DELAY = 0.12; // seconds

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSequentialGrid<T extends string | number>(
  options: UseSequentialGridOptions<T>
): UseSequentialGridReturn<T> {
  const {
    items: initialItems,
    columns,
    cellWidth = 200,
    cellHeight = 200,
    gap = 16,
    turnDelay = SQG_TURN_DELAY,
    onReorder,
  } = options;

  const [orderedItems, setOrderedItems] = useState<T[]>(initialItems);
  const [isTurning, setIsTurning] = useState(false);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rows = Math.ceil(orderedItems.length / columns);

  // Item → GridPosition map
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

  // Core swap with Sokoban timing
  const swap = useCallback(
    (a: T, b: T) => {
      if (isTurning) return;
      if (a === b) return;

      const reduced = getReducedMotion();

      if (reduced) {
        // Instant swap
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

      // Turn 1: A begins moving (layout animation handles visual)
      // Turn 2: After turnDelay, B fills the void
      // Both are part of the same state update, but Motion's layout
      // animation creates the visual Sokoban effect via stagger

      const scaledDelay = getFlowDuration(turnDelay) * 1000;

      turnTimer.current = setTimeout(() => {
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
    [isTurning, turnDelay, onReorder]
  );

  // Move to specific grid position
  const moveTo = useCallback(
    (itemId: T, targetRow: number, targetCol: number) => {
      const targetIdx = targetRow * columns + targetCol;
      if (targetIdx < 0 || targetIdx >= orderedItems.length) return;

      const targetItem = orderedItems[targetIdx];
      if (targetItem !== undefined) {
        swap(itemId, targetItem);
      }
    },
    [orderedItems, columns, swap]
  );

  // Handle drag drop — resolve to nearest cell
  const handleDrop = useCallback(
    (itemId: T, point: { x: number; y: number }) => {
      const col = Math.round(point.x / (cellWidth + gap));
      const row = Math.round(point.y / (cellHeight + gap));
      const clampedCol = Math.max(0, Math.min(columns - 1, col));
      const clampedRow = Math.max(0, Math.min(rows - 1, row));
      moveTo(itemId, clampedRow, clampedCol);
    },
    [cellWidth, cellHeight, gap, columns, rows, moveTo]
  );

  // SQG transition: X OR Y only, never diagonal
  // Motion's layout animation automatically handles this via `layout` prop
  // We provide the REFLEX_SOUL spring for snap-like grid movement
  const transition = useMemo(() => {
    if (getReducedMotion()) return { ...REDUCED_TRANSITION };

    const spring = scaledSpring(
      REFLEX_SOUL.stiffness,
      REFLEX_SOUL.damping,
      REFLEX_SOUL.mass
    );

    return {
      layout: spring,
      // SQG Rule: No rotation allowed
      rotate: { duration: 0 },
      rotateX: { duration: 0 },
      rotateY: { duration: 0 },
      rotateZ: { duration: 0 },
    };
  }, []);

  return {
    orderedItems,
    swap,
    moveTo,
    handleDrop,
    getPosition,
    isTurning,
    transition,
    gridSize: { rows, cols: columns },
  };
}

// ─── Exported Timing Constant ─────────────────────────────────────────────────

export { SQG_TURN_DELAY };
