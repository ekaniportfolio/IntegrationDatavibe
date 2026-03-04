/**
 * SPATIAL FLOW EXAMPLE -- Sequential Grid
 * ==========================================
 * Demonstrates: SQG (Sequential Grid Protocol)
 *
 * "Chaos is analog. Order is digital."
 *
 * Click any two cells to swap them with Sokoban timing:
 * Item A moves first, then Item B fills the void.
 * Strictly orthogonal — no diagonals, no rotation.
 *
 * Usage:
 *   import { SequentialGridDemo } from "./examples/09-sequential-grid";
 *   <SequentialGridDemo />
 */

import React, { useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { useSequentialGrid } from "../src/hooks/useSequentialGrid";
import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { CascadeList, CascadeItem } from "../src/components/CascadeList";

// ─── Sample Data ──────────────────────────────────────────────────────────────

const GRID_ITEMS = [
  { id: "revenue", label: "Revenue", value: "$42.5K", color: "from-violet-600 to-indigo-700", icon: "📈" },
  { id: "users", label: "Users", value: "12.8K", color: "from-emerald-600 to-teal-700", icon: "👥" },
  { id: "sessions", label: "Sessions", value: "89.2K", color: "from-amber-500 to-orange-600", icon: "🔄" },
  { id: "bounce", label: "Bounce Rate", value: "23.4%", color: "from-rose-600 to-pink-700", icon: "↩️" },
  { id: "conversion", label: "Conversion", value: "4.7%", color: "from-blue-600 to-cyan-700", icon: "🎯" },
  { id: "avg-time", label: "Avg. Time", value: "3m 24s", color: "from-purple-600 to-fuchsia-700", icon: "⏱️" },
];

// ─── Main Demo ────────────────────────────────────────────────────────────────

export function SequentialGridDemo() {
  const { prefersReduced } = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);

  const grid = useSequentialGrid({
    items: GRID_ITEMS.map((i) => i.id),
    columns: 3,
    cellWidth: 200,
    cellHeight: 160,
    gap: 16,
    onReorder: (newOrder) => {
      console.log("[SQG] New order:", newOrder);
    },
  });

  const handleCellClick = (id: string) => {
    if (grid.isTurning) return;

    if (selected === null) {
      // First selection
      setSelected(id);
    } else if (selected === id) {
      // Deselect
      setSelected(null);
    } else {
      // Swap
      grid.swap(selected, id);
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      {prefersReduced && (
        <div className="mb-4 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300 text-sm">
          Reduced motion active. Grid swaps are instant.
        </div>
      )}

      <h1 className="text-white text-3xl mb-2">Sequential Grid Protocol</h1>
      <p className="text-neutral-400 mb-2">
        Click two cells to swap them. Movement is strictly orthogonal — like chess pieces.
      </p>
      <p className="text-neutral-500 text-sm mb-8">
        {selected
          ? `Selected: ${GRID_ITEMS.find((i) => i.id === selected)?.label}. Click another cell to swap.`
          : "Click a cell to select it."}
      </p>

      {/* Grid */}
      <LayoutGroup>
        <div
          className="grid gap-4 max-w-2xl"
          style={{ gridTemplateColumns: `repeat(${grid.gridSize.cols}, 1fr)` }}
        >
          {grid.orderedItems.map((id) => {
            const item = GRID_ITEMS.find((i) => i.id === id)!;
            const isSelected = selected === id;
            const pos = grid.getPosition(id);

            return (
              <motion.div
                key={id}
                layout
                layoutId={`sqg-${id}`}
                transition={grid.transition}
                onClick={() => handleCellClick(id)}
                className={`
                  cursor-pointer rounded-2xl bg-gradient-to-br ${item.color} p-5
                  border-2 transition-colors
                  ${isSelected ? "border-white" : "border-transparent"}
                  ${grid.isTurning ? "pointer-events-none" : ""}
                `}
                whileHover={!grid.isTurning ? { scale: 1.03 } : undefined}
                whileTap={!grid.isTurning ? { scale: 0.97 } : undefined}
                role="button"
                tabIndex={0}
                aria-label={`${item.label}: ${item.value}${isSelected ? " (selected)" : ""}`}
                aria-pressed={isSelected}
                onKeyDown={(e) => e.key === "Enter" && handleCellClick(id)}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-white/70 text-xs">{item.label}</p>
                <p className="text-white text-2xl mt-1">{item.value}</p>
                <p className="text-white/40 text-xs mt-2">
                  [{pos.row},{pos.col}]
                </p>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Status */}
      <div className="mt-6 flex gap-4">
        <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 text-xs">
          Turning: <span className="text-white">{grid.isTurning ? "Yes" : "No"}</span>
        </div>
        <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 text-xs">
          Grid: <span className="text-white">{grid.gridSize.rows}×{grid.gridSize.cols}</span>
        </div>
      </div>

      {/* Rules */}
      <div className="mt-8 max-w-2xl bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-white text-lg mb-3">SQG Rules</h2>
        <ul className="text-neutral-400 text-sm space-y-2">
          <li>✅ Move X <strong className="text-white">OR</strong> Y. Never diagonal.</li>
          <li>✅ Turn-based: Item A moves, then Item B fills the void (Sokoban timing: 120ms).</li>
          <li>✅ Scale and opacity changes allowed during movement.</li>
          <li>❌ Rotation forbidden.</li>
          <li>🎯 Physics: REFLEX_SOUL (stiffness: 350, damping: 25, mass: 0.7)</li>
        </ul>
      </div>
    </div>
  );
}
