/**
 * SPATIAL FLOW EXAMPLE -- Drop Water Protocol
 * ===============================================
 * Demonstrates: DWP (Drop Water Protocol) — Complete 5-Act Sequence
 *
 * Click the avatar to trigger the full Drop Water sequence:
 * 1. Avatar gravitational drop
 * 2. Backdrop fade
 * 3. Blur curtain
 * 4. Card mitosis (seed → pill → card)
 * 5. Content emergence
 *
 * Usage:
 *   import { DropWaterDemo } from "./examples/08-drop-water";
 *   <DropWaterDemo />
 */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDropWater } from "../src/hooks/useDropWater";
import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { STANDARD_SOUL, SF_EASE } from "../src/core/soul-constants";
import { scaleTransition } from "../src/core/scale-transition";

// ─── Mock Auth Form ───────────────────────────────────────────────────────────

function AuthForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col h-full bg-neutral-900 p-8 rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-white text-2xl">Welcome back</h2>
          <p className="text-neutral-400 text-sm mt-1">Sign in to continue</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 
            flex items-center justify-center text-neutral-400 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <label className="text-neutral-400 text-sm block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 
              rounded-xl text-white placeholder:text-neutral-500 
              focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-neutral-400 text-sm block mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 
              rounded-xl text-white placeholder:text-neutral-500 
              focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <button
          className="mt-4 w-full py-3 bg-violet-600 hover:bg-violet-500 
            text-white rounded-xl transition-colors"
        >
          Sign In
        </button>

        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-500 text-sm">or</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        <button
          className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 
            text-white rounded-xl transition-colors border border-neutral-700"
        >
          Continue with Google
        </button>
      </div>

      {/* Footer */}
      <p className="text-neutral-500 text-sm text-center mt-6">
        Don't have an account?{" "}
        <button className="text-violet-400 hover:text-violet-300 transition-colors">
          Sign up
        </button>
      </p>
    </div>
  );
}

// ─── Background App (receives blur) ──────────────────────────────────────────

function BackgroundApp() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
        <h2 className="text-white text-lg">Dashboard</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {["Revenue", "Users", "Sessions"].map((label, i) => (
            <div key={label} className="bg-neutral-800 rounded-xl p-4 text-center">
              <p className="text-neutral-400 text-sm">{label}</p>
              <p className="text-white text-2xl mt-1">
                {["$42.5K", "12.8K", "89.2K"][i]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
        <h2 className="text-white text-lg">Recent Activity</h2>
        <div className="flex flex-col gap-3 mt-4">
          {[
            "New deployment: v2.4.1 pushed to production",
            "Alert resolved: CPU usage normalized",
            "Team update: 3 new members onboarded",
            "Feature flag: Dark mode enabled for 50% of users",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-neutral-800 last:border-0"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-neutral-300 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Demo ────────────────────────────────────────────────────────────────

export function DropWaterDemo() {
  const dw = useDropWater({
    cardWidth: 420,
    cardHeight: 520,
  });
  const { prefersReduced } = useReducedMotion();

  // Close on Escape
  useEffect(() => {
    if (!dw.isActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dw.reverse();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dw.isActive, dw.reverse]);

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* Accessibility */}
      {prefersReduced && (
        <div className="absolute top-4 left-4 right-4 z-50 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300 text-sm">
          Reduced motion active. Drop Water sequence is instant.
        </div>
      )}

      {/* Top Bar with Avatar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-800">
        <h1 className="text-white text-xl">Drop Water Protocol</h1>

        {/* Avatar — the trigger */}
        <motion.div
          ref={dw.avatarRef as React.RefObject<HTMLDivElement>}
          animate={dw.avatarAnimate}
          transition={dw.avatarTransition}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Open authentication"
          onClick={dw.trigger}
          onKeyDown={(e) => e.key === "Enter" && dw.trigger()}
        >
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 
              flex items-center justify-center text-white text-sm hover:scale-110 transition-transform
              ring-2 ring-violet-400/30"
          >
            ME
          </div>
        </motion.div>
      </div>

      {/* Background App Content (receives blur curtain) */}
      <motion.div
        animate={dw.blurAnimate}
        transition={dw.blurTransition}
      >
        <BackgroundApp />
      </motion.div>

      {/* Portal: Backdrop + Card */}
      {dw.isActive &&
        createPortal(
          <>
            {/* Act 2: Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-[9998]"
              initial={{ opacity: 0 }}
              animate={dw.backdropAnimate}
              transition={dw.backdropTransition}
              onClick={dw.reverse}
            />

            {/* Act 4: Card (Mitosis) */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-[9999]"
              style={{
                width: 420,
                height: 520,
                marginLeft: -210,
                marginTop: -260,
              }}
              initial={dw.cardInitial}
              animate={dw.cardAnimate}
              transition={dw.cardTransition}
            >
              {/* Act 5: Content Emergence */}
              <motion.div
                className="w-full h-full"
                animate={
                  dw.isOpen
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : scaleTransition({
                        duration: 0.4,
                        delay: 0.1,
                        ease: SF_EASE,
                      })
                }
              >
                <AuthForm onClose={dw.reverse} />
              </motion.div>
            </motion.div>
          </>,
          document.body
        )}

      {/* Phase Indicator (debug) */}
      <div className="fixed bottom-4 left-4 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 text-xs">
        Phase: <span className="text-white">{dw.phase}</span>
      </div>
    </div>
  );
}
