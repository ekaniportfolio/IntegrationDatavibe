/**
 * SPATIAL FLOW EXAMPLE -- Cascade Dashboard
 * =============================================
 * Demonstrates: SSC (Sequential Spatial Cascade) + Lateral Glide
 *
 * A dashboard where cards arrive in timed waves (SSC) and
 * list items weave in from alternating sides (Lateral Glide).
 *
 * Usage:
 *   import { CascadeDashboardDemo } from "./examples/01-cascade-dashboard";
 *   <CascadeDashboardDemo />
 */

import React from "react";
import { motion } from "motion/react";
import { CascadeList, CascadeItem } from "../src/components/CascadeList";
import { KineticItem } from "../src/components/KineticItem";
import { STANDARD_SOUL, SSC_TIMING } from "../src/core/soul-constants";
import { scaleTransition } from "../src/core/scale-transition";
import { useReducedMotion } from "../src/hooks/useReducedMotion";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const STATS = [
  { id: "streams", label: "Total Streams", value: "2.4M", change: "+12.3%" },
  { id: "listeners", label: "Monthly Listeners", value: "847K", change: "+5.7%" },
  { id: "saves", label: "Library Saves", value: "124K", change: "+18.2%" },
  { id: "playlists", label: "Playlist Adds", value: "3.2K", change: "+8.9%" },
];

const RECENT_TRACKS = [
  { id: "t1", title: "Midnight Drive", artist: "EKANI", plays: "342K" },
  { id: "t2", title: "Digital Rain", artist: "EKANI", plays: "287K" },
  { id: "t3", title: "Neon Pulse", artist: "EKANI ft. Luna", plays: "198K" },
  { id: "t4", title: "Ghost Signal", artist: "EKANI", plays: "156K" },
  { id: "t5", title: "Crystal Waves", artist: "EKANI", plays: "134K" },
  { id: "t6", title: "Void Echo", artist: "EKANI", plays: "98K" },
];

// ─── Components ──────────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: (typeof STATS)[0] }) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
      <p className="text-neutral-400 text-sm">{stat.label}</p>
      <p className="text-white text-3xl mt-2">{stat.value}</p>
      <p className="text-emerald-400 text-sm mt-1">{stat.change}</p>
    </div>
  );
}

function TrackRow({ track }: { track: (typeof RECENT_TRACKS)[0] }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
      <div>
        <p className="text-white">{track.title}</p>
        <p className="text-neutral-400 text-sm">{track.artist}</p>
      </div>
      <p className="text-neutral-300">{track.plays}</p>
    </div>
  );
}

// ─── Main Demo ───────────────────────────────────────────────────────────────

export function CascadeDashboardDemo() {
  const { prefersReduced } = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      {/* Accessibility indicator */}
      {prefersReduced && (
        <div className="mb-4 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300 text-sm">
          Reduced motion is active. Animations are disabled for accessibility.
        </div>
      )}

      {/* Page Header -- SSC Structure phase (T=0) */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={scaleTransition({
          duration: 0.4,
          delay: SSC_TIMING.structure,
        })}
        className="mb-8"
      >
        <h1 className="text-white text-4xl">Dashboard</h1>
        <p className="text-neutral-400 mt-2">Your music performance at a glance</p>
      </motion.header>

      {/* Stat Cards -- SSC Body phase (T=0.8s), using CascadeList */}
      <CascadeList
        stagger={0.08}
        initialDelay={SSC_TIMING.body}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {STATS.map((stat) => (
          <CascadeItem key={stat.id}>
            <StatCard stat={stat} />
          </CascadeItem>
        ))}
      </CascadeList>

      {/* Recent Tracks -- Lateral Glide (weaving from sides) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={scaleTransition({
          duration: 0.3,
          delay: SSC_TIMING.body + 0.3,
        })}
      >
        <h2 className="text-white text-2xl mb-4">Recent Tracks</h2>
        <div className="flex flex-col gap-2">
          {RECENT_TRACKS.map((track, i) => (
            <KineticItem key={track.id} index={i} xOffset={30} blurAmount={6}>
              <TrackRow track={track} />
            </KineticItem>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
