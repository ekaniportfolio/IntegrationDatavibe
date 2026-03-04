/**
 * SPATIAL FLOW FRAMEWORK -- SequentialGrid
 * ==========================================
 * Sequential Grid [SQG] Protocol Component
 *
 * "Chaos is analog. Order is digital."
 *
 * Orthogonal, turn-based grid reordering with Sokoban timing.
 * Items move X OR Y axis only -- never diagonal, never simultaneous.
 *
 * @example
 * <SequentialGrid columns={3} cellWidth={200} cellHeight={200}>
 *   {items.map(item => (
 *     <SequentialGridItem key={item.id} id={item.id}>
 *       <Card>{item.name}</Card>
 *     </SequentialGridItem>
 *   ))}
 * </SequentialGrid>
 *
 * @author Michel EKANI
 */

import React, { createContext, useContext } from "react";
import { motion } from "motion/react";
import { useSequentialGrid } from "../hooks/useSequentialGrid";
import { getReducedMotion } from "../core/reduced-motion";

// ─── Context ──────────────────────────────────────────────────────────────────

interface SQGContextValue {
  swap: (a: string | number, b: string | number) => void;
  handleDrop: (itemId: string | number, point: { x: number; y: number }) => void;
  getPosition: (itemId: string | number) => { row: number; col: number };
  transition: Record<string, any>;
  isTurning: boolean;
}

const SQGContext = createContext<SQGContextValue | null>(null);

// ─── Types ────────────────────────────────────────────────────────────────────

interface SequentialGridProps {
  /** Ordered list of item IDs */
  items: (string | number)[];
  /** Number of columns */
  columns: number;
  /** Cell width in px (default: 200) */
  cellWidth?: number;
  /** Cell height in px (default: 200) */
  cellHeight?: number;
  /** Gap between cells in px (default: 16) */
  gap?: number;
  /** Sokoban delay between moves in seconds (default: 0.12) */
  turnDelay?: number;
  /** Children (SequentialGridItem elements) */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Callback when order changes */
  onReorder?: (newOrder: (string | number)[]) => void;
}

interface SequentialGridItemProps {
  /** Unique ID matching one of the items in the parent grid */
  id: string | number;
  /** Content to render */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

// ─── Components ───────────────────────────────────────────────────────────────

export function SequentialGrid({
  items,
  columns,
  cellWidth = 200,
  cellHeight = 200,
  gap = 16,
  turnDelay,
  children,
  className = "",
  onReorder,
}: SequentialGridProps) {
  const grid = useSequentialGrid({
    items,
    columns,
    cellWidth,
    cellHeight,
    gap,
    turnDelay,
    onReorder,
  });

  return (
    <SQGContext.Provider
      value={{
        swap: grid.swap,
        handleDrop: grid.handleDrop,
        getPosition: grid.getPosition,
        transition: grid.transition,
        isTurning: grid.isTurning,
      }}
    >
      <div
        className={className}
        data-sf-sqg=""
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${cellWidth}px)`,
          gap: `${gap}px`,
        }}
      >
        {children}
      </div>
    </SQGContext.Provider>
  );
}

export function SequentialGridItem({
  id,
  children,
  className = "",
}: SequentialGridItemProps) {
  const ctx = useContext(SQGContext);
  if (!ctx) {
    throw new Error("SequentialGridItem must be used within a SequentialGrid.");
  }

  const reduced = getReducedMotion();

  return (
    <motion.div
      layout
      layoutId={`sqg-${id}`}
      transition={ctx.transition}
      className={className}
      data-sf-sqg-item={id}
      style={{ cursor: ctx.isTurning ? "wait" : "grab" }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      onDragEnd={(_, info) => ctx.handleDrop(id, info.point)}
      drag
      dragSnapToOrigin
    >
      {children}
    </motion.div>
  );
}
