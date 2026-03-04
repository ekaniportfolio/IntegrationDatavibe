/**
 * SPATIAL FLOW EXAMPLE -- Lateral Glide Gallery
 * ================================================
 * Demonstrates: Lateral Glide [LG] Protocol
 *
 * A gallery/grid where items weave in from alternating sides.
 * Even items (0, 2, 4...) arrive from the LEFT.
 * Odd items (1, 3, 5...) arrive from the RIGHT.
 * Each item carries motion blur during flight.
 *
 * Usage:
 *   import { LateralGlideGalleryDemo } from "./examples/05-lateral-glide-gallery";
 *   <LateralGlideGalleryDemo />
 */

import React from "react";
import { KineticItem } from "../src/components/KineticItem";
import { useReducedMotion } from "../src/hooks/useReducedMotion";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const GALLERY_ITEMS = [
  { id: "g1", title: "Midnight Drive", category: "Single", color: "from-blue-600 to-purple-600" },
  { id: "g2", title: "Digital Rain", category: "EP", color: "from-emerald-600 to-teal-600" },
  { id: "g3", title: "Neon Pulse", category: "Album", color: "from-pink-600 to-rose-600" },
  { id: "g4", title: "Ghost Signal", category: "Single", color: "from-amber-600 to-orange-600" },
  { id: "g5", title: "Crystal Waves", category: "Remix", color: "from-cyan-600 to-blue-600" },
  { id: "g6", title: "Void Echo", category: "EP", color: "from-violet-600 to-indigo-600" },
  { id: "g7", title: "Solar Flare", category: "Album", color: "from-red-600 to-orange-600" },
  { id: "g8", title: "Deep Current", category: "Single", color: "from-teal-600 to-emerald-600" },
];

// ─── Card Component ──────────────────────────────────────────────────────────

function GalleryCard({ item }: { item: (typeof GALLERY_ITEMS)[0] }) {
  return (
    <div className="group cursor-pointer">
      <div
        className={`aspect-square rounded-2xl bg-gradient-to-br ${item.color} flex items-end p-4 transition-transform group-hover:scale-[1.02]`}
      >
        <div>
          <p className="text-white/60 text-xs">{item.category}</p>
          <p className="text-white text-lg">{item.title}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Demo ───────────────────────────────────────────────────────────────

export function LateralGlideGalleryDemo() {
  const { prefersReduced } = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <h1 className="text-white text-3xl mb-2">Lateral Glide Gallery</h1>
      <p className="text-neutral-400 mb-2">
        Items weave in from alternating sides. Even from left, odd from right.
      </p>
      {prefersReduced && (
        <p className="text-amber-400 text-sm mb-6">
          Reduced motion is active -- items appear instantly without lateral movement.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {GALLERY_ITEMS.map((item, index) => (
          <KineticItem
            key={item.id}
            index={index}
            xOffset={40}
            blurAmount={8}
            staggerDelay={0.07}
          >
            <GalleryCard item={item} />
          </KineticItem>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-12 bg-neutral-900 rounded-xl p-6 border border-neutral-800 max-w-md">
        <h3 className="text-white text-sm mb-3">Lateral Glide Physics</h3>
        <div className="flex flex-col gap-1 text-xs text-neutral-400">
          <p>Spring: stiffness=140, damping=18, mass=1</p>
          <p>xOffset: 40px | blur: 8px | stagger: 70ms</p>
          <p>Direction: Even indices = LEFT, Odd indices = RIGHT</p>
        </div>
      </div>
    </div>
  );
}
