/**
 * SPATIAL FLOW EXAMPLE -- Speed Control + Reduced Motion
 * =========================================================
 * Demonstrates: Speed Control, useReducedMotion, safeTransition
 *
 * An interactive panel showing all speed presets and the
 * reduced motion WCAG compliance layer in action.
 *
 * Usage:
 *   import { SpeedControlDemo } from "./examples/04-speed-control";
 *   <SpeedControlDemo />
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useSpatialSpeed } from "../src/hooks/useSpatialSpeed";
import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { STANDARD_SOUL, REFLEX_SOUL, DREAM_SOUL } from "../src/core/soul-constants";
import { scaleTransition } from "../src/core/scale-transition";
import type { SpeedPreset } from "../src/core/types";

// ─── Animated Test Elements ──────────────────────────────────────────────────

function BouncingBox({
  soul,
  label,
  color,
}: {
  soul: { stiffness: number; damping: number; mass: number };
  label: string;
  color: string;
}) {
  const [isActive, setIsActive] = useState(false);
  const { prefersReduced, safeSpring } = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-neutral-400 text-sm">{label}</p>
      <motion.button
        className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center text-white cursor-pointer`}
        animate={{
          scale: isActive ? 1.3 : 1,
          borderRadius: isActive ? "50%" : "16px",
        }}
        transition={safeSpring(soul)}
        onClick={() => setIsActive(!isActive)}
        aria-label={`Toggle ${label} animation`}
      >
        {prefersReduced ? "Instant" : "Click"}
      </motion.button>
      <p className="text-neutral-500 text-xs">
        {prefersReduced
          ? "No animation"
          : `s:${soul.stiffness} d:${soul.damping} m:${soul.mass}`}
      </p>
    </div>
  );
}

function SlideElement() {
  const [isOpen, setIsOpen] = useState(false);
  const { prefersReduced, safeTransition } = useReducedMotion();

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
      >
        {isOpen ? "Close" : "Open"} Panel
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 120 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={safeTransition({
          height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.25 },
        })}
        className="overflow-hidden"
      >
        <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
          <p className="text-neutral-300 text-sm">
            This panel uses <code className="text-blue-400">safeTransition()</code>.
            When reduced motion is active, it appears instantly.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Demo ───────────────────────────────────────────────────────────────

export function SpeedControlDemo() {
  const { preset, setPreset, speedLabel, speedScale, presets } = useSpatialSpeed();
  const { prefersReduced } = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <h1 className="text-white text-3xl mb-2">Speed Control</h1>
      <p className="text-neutral-400 mb-8">
        Test how global speed and reduced motion affect all animations.
      </p>

      {/* Status Bar */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-neutral-900 rounded-xl px-4 py-3 border border-neutral-800">
          <p className="text-neutral-400 text-xs">Speed</p>
          <p className="text-white">{speedLabel}</p>
        </div>
        <div className="bg-neutral-900 rounded-xl px-4 py-3 border border-neutral-800">
          <p className="text-neutral-400 text-xs">Scale Factor</p>
          <p className="text-white">{speedScale.toFixed(2)}x</p>
        </div>
        <div
          className={`rounded-xl px-4 py-3 border ${
            prefersReduced
              ? "bg-amber-900/20 border-amber-800/30"
              : "bg-emerald-900/20 border-emerald-800/30"
          }`}
        >
          <p className={`text-xs ${prefersReduced ? "text-amber-400" : "text-emerald-400"}`}>
            Reduced Motion
          </p>
          <p className="text-white">{prefersReduced ? "ON (WCAG)" : "OFF"}</p>
        </div>
      </div>

      {/* Speed Preset Selector */}
      <div className="mb-8">
        <h2 className="text-white text-lg mb-4">Speed Presets</h2>
        <div className="flex gap-2 flex-wrap">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => setPreset(p.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                preset === p.value
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spring Test Boxes */}
      <div className="mb-8">
        <h2 className="text-white text-lg mb-4">Soul Physics Test</h2>
        <p className="text-neutral-400 text-sm mb-4">
          Click each box to see the spring personality. With reduced motion ON,
          all transitions are instant.
        </p>
        <div className="flex gap-8 flex-wrap">
          <BouncingBox soul={STANDARD_SOUL} label="Standard" color="bg-blue-600" />
          <BouncingBox soul={REFLEX_SOUL} label="Reflex" color="bg-emerald-600" />
          <BouncingBox soul={DREAM_SOUL} label="Dream" color="bg-purple-600" />
        </div>
      </div>

      {/* Tween Test */}
      <div className="mb-8">
        <h2 className="text-white text-lg mb-4">Tween Transition Test</h2>
        <SlideElement />
      </div>

      {/* WCAG Info */}
      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 max-w-2xl">
        <h2 className="text-white text-lg mb-3">WCAG Compliance</h2>
        <div className="flex flex-col gap-2 text-sm text-neutral-400">
          <p>
            <span className="text-emerald-400">SC 2.3.1 (A)</span> -- Three
            flashes or below threshold. No Spatial Flow animation produces
            flashing content.
          </p>
          <p>
            <span className="text-emerald-400">SC 2.3.3 (AAA)</span> --
            Animation from interactions can be disabled. The{" "}
            <code className="text-blue-400">useReducedMotion()</code> hook
            respects <code className="text-blue-400">prefers-reduced-motion</code>{" "}
            and disables all spatial movement.
          </p>
          <p>
            <span className="text-emerald-400">Opacity fades</span> are
            preserved even in reduced motion (they don't trigger vestibular
            issues per WCAG guidance).
          </p>
        </div>
      </div>
    </div>
  );
}
