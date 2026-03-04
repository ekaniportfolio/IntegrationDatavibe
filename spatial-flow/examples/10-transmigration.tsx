/**
 * SPATIAL FLOW EXAMPLE -- Transmigrated Astral Flow
 * ===================================================
 * Demonstrates: TAF (Transmigrated Astral Flow) + LPS (Layout Projection Shield)
 *
 * "The element does not die. It transmigrates."
 *
 * Click any card to expand it. The card physically travels from its
 * position to the detail view via layoutId (TAF).
 * The blur backdrop triggers the Layout Projection Shield to prevent
 * animation freeze.
 *
 * Usage:
 *   import { TransmigrationDemo } from "./examples/10-transmigration";
 *   <TransmigrationDemo />
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useTransmigration } from "../src/hooks/useTransmigration";
import { useLayoutProjectionShield } from "../src/hooks/useLayoutProjectionShield";
import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { scaleTransition } from "../src/core/scale-transition";
import { STANDARD_SOUL, SF_EASE } from "../src/core/soul-constants";

// ─── Sample Data ──────────────────────────────────────────────────────────────

const ARTISTS = [
  {
    id: "artist-1",
    name: "Lunar Echo",
    genre: "Electronic / Ambient",
    listeners: "2.4M",
    image: "🌙",
    color: "from-indigo-700 to-violet-900",
    bio: "Pioneering ambient electronic soundscapes since 2019. Known for immersive live performances that blend generative visuals with spatial audio.",
  },
  {
    id: "artist-2",
    name: "Velvet Storm",
    genre: "Neo-Soul / R&B",
    listeners: "1.8M",
    image: "⚡",
    color: "from-rose-700 to-amber-900",
    bio: "A voice that defies categorization. Three-time Grammy nominee blending neo-soul warmth with R&B edge and jazz improvisation.",
  },
  {
    id: "artist-3",
    name: "Cipher",
    genre: "Hip-Hop / Experimental",
    listeners: "3.1M",
    image: "🔮",
    color: "from-emerald-700 to-cyan-900",
    bio: "Redefining hip-hop with mathematical precision and raw emotional honesty. Producer, rapper, and visual artist.",
  },
  {
    id: "artist-4",
    name: "Nova Cascade",
    genre: "Indie Pop / Synth",
    listeners: "890K",
    image: "✨",
    color: "from-fuchsia-700 to-blue-900",
    bio: "Bedroom pop meets orchestral grandeur. Their debut album charted in 14 countries and sparked a new wave of indie production.",
  },
];

// ─── Artist Card (Source) ─────────────────────────────────────────────────────

function ArtistCard({
  artist,
  onSelect,
  lps,
}: {
  artist: (typeof ARTISTS)[number];
  onSelect: () => void;
  lps: ReturnType<typeof useLayoutProjectionShield>;
}) {
  const tx = useTransmigration(artist.id);

  return (
    <motion.div
      layoutId={lps.wrap(artist.id)}
      transition={tx.source.transition}
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl bg-gradient-to-br ${artist.color} p-6 
        hover:scale-[1.02] transition-transform border border-white/10`}
      role="button"
      tabIndex={0}
      aria-label={`View ${artist.name}`}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <div className="text-4xl mb-3">{artist.image}</div>
      <h3 className="text-white text-xl">{artist.name}</h3>
      <p className="text-white/60 text-sm mt-1">{artist.genre}</p>
      <p className="text-white/40 text-xs mt-3">{artist.listeners} monthly listeners</p>
    </motion.div>
  );
}

// ─── Artist Detail (Target) ──────────────────────────────────────────────────

function ArtistDetail({
  artist,
  onClose,
  lps,
}: {
  artist: (typeof ARTISTS)[number];
  onClose: () => void;
  lps: ReturnType<typeof useLayoutProjectionShield>;
}) {
  return (
    <motion.div
      layoutId={lps.wrap(artist.id)}
      transition={{
        layout: {
          type: "spring" as const,
          stiffness: STANDARD_SOUL.stiffness,
          damping: STANDARD_SOUL.damping,
          mass: STANDARD_SOUL.mass,
        },
      }}
      className={`fixed inset-4 md:inset-12 z-[100] rounded-3xl bg-gradient-to-br ${artist.color}
        border border-white/10 overflow-hidden flex flex-col`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full 
          bg-black/30 hover:bg-black/50 flex items-center justify-center
          text-white transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={scaleTransition({
          duration: 0.5,
          delay: 0.2,
          ease: SF_EASE,
        })}
        className="flex-1 flex flex-col justify-center items-center p-8 text-center"
      >
        <div className="text-8xl mb-6">{artist.image}</div>
        <h1 className="text-white text-5xl">{artist.name}</h1>
        <p className="text-white/60 text-lg mt-2">{artist.genre}</p>
        <p className="text-white/40 mt-1">{artist.listeners} monthly listeners</p>

        <p className="text-white/70 mt-8 max-w-lg">{artist.bio}</p>

        <div className="flex gap-4 mt-8">
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
            Follow
          </button>
          <button className="px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-colors">
            Play
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Demo ────────────────────────────────────────────────────────────────

export function TransmigrationDemo() {
  const { prefersReduced } = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lps = useLayoutProjectionShield();

  const selectedArtist = ARTISTS.find((a) => a.id === selectedId);

  // Close on Escape
  useEffect(() => {
    if (!selectedId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId]);

  // LPS: Shield when backdrop blur is active
  useEffect(() => {
    if (selectedId) {
      lps.autoShield(0.3); // backdrop transition duration
    }
  }, [selectedId]);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-neutral-950 p-8">
        {prefersReduced && (
          <div className="mb-4 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300 text-sm">
            Reduced motion active. Transmigrations are instant.
          </div>
        )}

        <h1 className="text-white text-3xl mb-2">Transmigrated Astral Flow</h1>
        <p className="text-neutral-400 mb-8">
          Click any artist card. The element physically transmigrates to the detail view via <code className="text-violet-400">layoutId</code>.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {ARTISTS.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onSelect={() => setSelectedId(artist.id)}
              lps={lps}
            />
          ))}
        </div>

        {/* Backdrop + Detail (TAF target) */}
        <AnimatePresence>
          {selectedArtist && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={scaleTransition({ duration: 0.3, ease: SF_EASE })}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99]"
                onClick={() => setSelectedId(null)}
              />

              {/* Detail (RAU: only one instance of layoutId mounted) */}
              <ArtistDetail
                key={selectedArtist.id}
                artist={selectedArtist}
                onClose={() => setSelectedId(null)}
                lps={lps}
              />
            </>
          )}
        </AnimatePresence>

        {/* Protocol Info */}
        <div className="mt-8 max-w-4xl flex gap-4">
          <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-white text-lg mb-3">TAF Rules</h2>
            <ul className="text-neutral-400 text-sm space-y-2">
              <li>🔮 <strong className="text-white">RAU</strong>: Two elements with same layoutId must NEVER coexist.</li>
              <li>🏷️ <strong className="text-white">Namespace</strong>: Use suffixes for responsive layouts.</li>
              <li>🛡️ <strong className="text-white">LPS</strong>: Remove layoutId during filter/transform transitions.</li>
            </ul>
          </div>
          <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-white text-lg mb-3">LPS Status</h2>
            <div className="text-neutral-400 text-sm">
              Shield: <span className={lps.isActive ? "text-amber-400" : "text-emerald-400"}>
                {lps.isActive ? "🛡️ ACTIVE" : "✅ Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}
