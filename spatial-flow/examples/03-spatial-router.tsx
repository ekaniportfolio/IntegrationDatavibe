/**
 * SPATIAL FLOW EXAMPLE -- Spatial Router
 * =========================================
 * Demonstrates: Follow Flow + SSC + Samsara Shift
 *
 * A tab-based navigation where content follows the direction
 * of attention displacement (Follow Flow protocol). Combined
 * with SSC cascade for each view's content arrival.
 *
 * Usage:
 *   import { SpatialRouterDemo } from "./examples/03-spatial-router";
 *   <SpatialRouterDemo />
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFollowFlow } from "../src/hooks/useFollowFlow";
import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { CascadeList, CascadeItem } from "../src/components/CascadeList";
import { STANDARD_SOUL, SAMSARA_INDICATOR } from "../src/core/soul-constants";
import { scaleTransition } from "../src/core/scale-transition";

// ─── Tab Configuration ───────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "streaming", label: "Streaming" },
  { id: "social", label: "Social" },
  { id: "radio", label: "Radio" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Tab Content Views ───────────────────────────────────────────────────────

function OverviewView() {
  return (
    <CascadeList stagger={0.06} initialDelay={0.1} className="flex flex-col gap-4">
      <CascadeItem>
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
          <h3 className="text-white text-lg">Welcome back</h3>
          <p className="text-neutral-400 mt-2">
            Your music reached 2.4M listeners this month.
          </p>
        </div>
      </CascadeItem>
      <CascadeItem>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-800/30">
            <p className="text-emerald-400 text-sm">Revenue</p>
            <p className="text-white text-2xl mt-1">$12.4K</p>
          </div>
          <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-800/30">
            <p className="text-blue-400 text-sm">Followers</p>
            <p className="text-white text-2xl mt-1">847K</p>
          </div>
        </div>
      </CascadeItem>
      <CascadeItem>
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
          <h3 className="text-white text-lg">Recent Activity</h3>
          <div className="flex flex-col gap-3 mt-4">
            {["New playlist placement on Chill Vibes", "Featured on Discover Weekly", "Radio play on NRJ France"].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-neutral-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </CascadeItem>
    </CascadeList>
  );
}

function StreamingView() {
  return (
    <CascadeList stagger={0.06} initialDelay={0.1} className="flex flex-col gap-4">
      <CascadeItem>
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
          <h3 className="text-white text-lg">Streaming Performance</h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: "Spotify", value: "1.2M" },
              { label: "Apple Music", value: "680K" },
              { label: "Deezer", value: "520K" },
            ].map((p) => (
              <div key={p.label} className="text-center">
                <p className="text-neutral-400 text-sm">{p.label}</p>
                <p className="text-white text-xl mt-1">{p.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CascadeItem>
      <CascadeItem>
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
          <h3 className="text-white text-lg">Top Tracks</h3>
          <div className="flex flex-col gap-2 mt-4">
            {["Midnight Drive -- 342K plays", "Digital Rain -- 287K plays", "Neon Pulse -- 198K plays"].map((track, i) => (
              <p key={i} className="text-neutral-300 text-sm py-2 border-b border-neutral-800 last:border-0">
                {i + 1}. {track}
              </p>
            ))}
          </div>
        </div>
      </CascadeItem>
    </CascadeList>
  );
}

function SocialView() {
  return (
    <CascadeList stagger={0.06} initialDelay={0.1} className="flex flex-col gap-4">
      <CascadeItem>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pink-900/20 rounded-xl p-4 border border-pink-800/30">
            <p className="text-pink-400 text-sm">Instagram</p>
            <p className="text-white text-xl mt-1">245K</p>
            <p className="text-pink-400/70 text-xs mt-1">+2.3% this week</p>
          </div>
          <div className="bg-sky-900/20 rounded-xl p-4 border border-sky-800/30">
            <p className="text-sky-400 text-sm">Twitter/X</p>
            <p className="text-white text-xl mt-1">89K</p>
            <p className="text-sky-400/70 text-xs mt-1">+1.7% this week</p>
          </div>
        </div>
      </CascadeItem>
      <CascadeItem>
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
          <h3 className="text-white text-lg">Engagement Rate</h3>
          <p className="text-emerald-400 text-3xl mt-2">4.7%</p>
          <p className="text-neutral-400 text-sm mt-1">Industry average: 3.2%</p>
        </div>
      </CascadeItem>
    </CascadeList>
  );
}

function RadioView() {
  return (
    <CascadeList stagger={0.06} initialDelay={0.1} className="flex flex-col gap-4">
      <CascadeItem>
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
          <h3 className="text-white text-lg">Radio Airplay</h3>
          <p className="text-white text-3xl mt-2">1,247</p>
          <p className="text-neutral-400 text-sm mt-1">spins this month</p>
        </div>
      </CascadeItem>
      <CascadeItem>
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
          <h3 className="text-white text-lg">Top Stations</h3>
          <div className="flex flex-col gap-2 mt-4">
            {[
              { name: "NRJ France", spins: 342 },
              { name: "Radio FG", spins: 287 },
              { name: "Fun Radio", spins: 198 },
            ].map((station) => (
              <div key={station.name} className="flex justify-between py-2 border-b border-neutral-800 last:border-0">
                <p className="text-neutral-300 text-sm">{station.name}</p>
                <p className="text-neutral-400 text-sm">{station.spins} spins</p>
              </div>
            ))}
          </div>
        </div>
      </CascadeItem>
    </CascadeList>
  );
}

const VIEW_MAP: Record<TabId, () => React.ReactNode> = {
  overview: () => <OverviewView />,
  streaming: () => <StreamingView />,
  social: () => <SocialView />,
  radio: () => <RadioView />,
};

// ─── Main Demo ───────────────────────────────────────────────────────────────

export function SpatialRouterDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { direction, navigateTo, variants } = useFollowFlow({
    xDistance: 300,
    withOpacity: true,
    withBlur: true,
    blurAmount: 6,
  });
  const { prefersReduced } = useReducedMotion();

  const handleTabChange = (newTab: TabId) => {
    const fromIndex = TABS.findIndex((t) => t.id === activeTab);
    const toIndex = TABS.findIndex((t) => t.id === newTab);
    navigateTo(fromIndex, toIndex);
    setActiveTab(newTab);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      {/* Accessibility indicator */}
      {prefersReduced && (
        <div className="mb-4 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300 text-sm">
          Reduced motion active. Tab transitions are instant.
        </div>
      )}

      <h1 className="text-white text-3xl mb-8">Spatial Router</h1>

      {/* Tab Navigation -- Samsara Shift indicator */}
      <div className="relative flex gap-1 bg-neutral-900 rounded-xl p-1 mb-8 max-w-lg">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm transition-colors ${
              activeTab === tab.id ? "text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {tab.label}
            {/* Samsara Indicator -- layoutId makes it travel */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-neutral-800 rounded-lg -z-10"
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: SAMSARA_INDICATOR.stiffness,
                        damping: SAMSARA_INDICATOR.damping,
                        mass: SAMSARA_INDICATOR.mass,
                      }
                }
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area -- Follow Flow */}
      <div className="relative overflow-hidden min-h-[400px]" data-sf-follow-flow="">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={prefersReduced ? undefined : variants}
            initial={prefersReduced ? { opacity: 1 } : "enter"}
            animate={prefersReduced ? { opacity: 1 } : "center"}
            exit={prefersReduced ? { opacity: 0 } : "exit"}
            transition={
              prefersReduced
                ? { duration: 0.01 }
                : scaleTransition({
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    filter: { duration: 0.25 },
                  })
            }
          >
            {VIEW_MAP[activeTab]()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
