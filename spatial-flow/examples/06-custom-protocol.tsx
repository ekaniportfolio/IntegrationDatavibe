/**
 * SPATIAL FLOW FRAMEWORK -- Example 06: Custom Protocol
 * =======================================================
 * Demonstrates createProtocol() and useSpatialTransition().
 *
 * This example shows a developer creating THREE entirely new protocols
 * from scratch — without touching any framework internals.
 *
 * Protocols created:
 * 1. "Vortex"  — items spiral in with rotation + scale
 * 2. "Curtain" — items slide down like a theatrical curtain
 * 3. "Pulse"   — items pulse in from center with a heartbeat feel
 *
 * Also demonstrates useSpatialTransition() for one-off custom animations
 * that don't need a full protocol.
 */

import React, { useState } from "react";
import { motion } from "motion/react";

// ── Import from the framework ─────────────────────────────────────────────────

import {
  createProtocol,
  STANDARD_SOUL,
  REFLEX_SOUL,
  DREAM_SOUL,
  SF_EASE,
  useSpatialTransition,
} from "../src/index";

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOCOL 1: VORTEX
// "Elements spiral into existence like leaves caught in a whirlpool."
// ═══════════════════════════════════════════════════════════════════════════════

const VortexProtocol = createProtocol({
  name: "vortex",
  soul: STANDARD_SOUL,
  states: {
    initial: { opacity: 0, rotate: -90, scale: 0.6 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit:    { opacity: 0, rotate: 90, scale: 0.6 },
  },
  stagger: 0.08,
  initialDelay: 0.2,
  trigger: "viewport",
  perProperty: {
    opacity: { duration: 0.3, ease: "easeOut" },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOCOL 2: CURTAIN
// "Content descends like a theatrical reveal, row by row."
// ═══════════════════════════════════════════════════════════════════════════════

const CurtainProtocol = createProtocol({
  name: "curtain",
  soul: { duration: 0.6, ease: SF_EASE },
  states: {
    initial: { opacity: 0, y: -40, clipPath: "inset(0 0 100% 0)" },
    animate: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
    exit:    { opacity: 0, y: -20, clipPath: "inset(0 0 100% 0)" },
  },
  stagger: 0.1,
  trigger: "viewport",
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOCOL 3: PULSE
// "Elements breathe into existence from the center, like a heartbeat."
// ═══════════════════════════════════════════════════════════════════════════════

const PulseProtocol = createProtocol({
  name: "pulse",
  soul: REFLEX_SOUL,
  states: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
  },
  stagger: 0.04,
  initialDelay: 0.1,
});

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO: useSpatialTransition() for one-off animations
// ═══════════════════════════════════════════════════════════════════════════════

function HeroCard() {
  const sf = useSpatialTransition(DREAM_SOUL, {
    perProperty: {
      opacity: { duration: 0.4, ease: "easeOut" },
      filter: { duration: 0.6 },
    },
  });

  return (
    <motion.div
      initial={sf.initial({ opacity: 0, y: 30, filter: "blur(8px)" })}
      animate={sf.animate({ opacity: 1, y: 0, filter: "blur(0px)" })}
      transition={sf.transition}
      style={{
        padding: "2rem",
        borderRadius: "1rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        maxWidth: 500,
      }}
    >
      <h2 style={{ margin: 0 }}>useSpatialTransition()</h2>
      <p>
        This card uses DREAM_SOUL physics with per-property overrides.
        No protocol needed — just the hook. Speed: {sf.speedScale.toFixed(2)}x
        {sf.isReduced && " (Reduced Motion)"}
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO: Complete Page
// ═══════════════════════════════════════════════════════════════════════════════

const DEMO_ITEMS = [
  { id: "1", title: "Quantum Mesh", desc: "Distributed spatial awareness" },
  { id: "2", title: "Neural Tide", desc: "Self-organizing data streams" },
  { id: "3", title: "Prism Gate", desc: "Multi-dimensional portal access" },
  { id: "4", title: "Echo Lattice", desc: "Resonant information architecture" },
  { id: "5", title: "Drift Core", desc: "Gravitational UI anchoring" },
  { id: "6", title: "Flux Weave", desc: "Dynamic layout metamorphosis" },
];

export default function CustomProtocolDemo() {
  const [activeProtocol, setActiveProtocol] = useState<
    "vortex" | "curtain" | "pulse"
  >("vortex");

  const protocols = {
    vortex: VortexProtocol,
    curtain: CurtainProtocol,
    pulse: PulseProtocol,
  };

  const ActiveProtocol = protocols[activeProtocol];

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>Custom Protocol Demo</h1>
      <p>
        Three protocols created with <code>createProtocol()</code>, plus
        a one-off animation with <code>useSpatialTransition()</code>.
      </p>

      {/* ── Hero Card (useSpatialTransition) ──────────────────────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <h3>useSpatialTransition() — One-off Animation</h3>
        <HeroCard />
      </section>

      {/* ── Protocol Selector ─────────────────────────────────────────── */}
      <section style={{ marginBottom: "2rem" }}>
        <h3>createProtocol() — Reusable Protocol</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["vortex", "curtain", "pulse"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActiveProtocol(p)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: activeProtocol === p ? "2px solid #667eea" : "1px solid #ccc",
                background: activeProtocol === p ? "#667eea" : "transparent",
                color: activeProtocol === p ? "white" : "inherit",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* ── Protocol Items ────────────────────────────────────────────── */}
      <div
        key={activeProtocol}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {DEMO_ITEMS.map((item, i) => (
          <ActiveProtocol.Item key={item.id} index={i}>
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "0.75rem",
                background: "#1a1a2e",
                color: "#e0e0e0",
                border: "1px solid #333",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem", color: "#a78bfa" }}>
                {item.title}
              </h4>
              <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.7 }}>
                {item.desc}
              </p>
            </div>
          </ActiveProtocol.Item>
        ))}
      </div>

      {/* ── Protocol.List demo ────────────────────────────────────────── */}
      <section style={{ marginTop: "3rem" }}>
        <h3>Protocol.List — Auto-Stagger Container</h3>
        <PulseProtocol.List
          as="ul"
          stagger={0.06}
          className=""
        >
          <li style={{ padding: "0.75rem", background: "#1e293b", borderRadius: "0.5rem", color: "#e0e0e0", listStyle: "none" }}>
            Auto-staggered item 1
          </li>
          <li style={{ padding: "0.75rem", background: "#1e293b", borderRadius: "0.5rem", color: "#e0e0e0", listStyle: "none" }}>
            Auto-staggered item 2
          </li>
          <li style={{ padding: "0.75rem", background: "#1e293b", borderRadius: "0.5rem", color: "#e0e0e0", listStyle: "none" }}>
            Auto-staggered item 3
          </li>
        </PulseProtocol.List>
      </section>
    </div>
  );
}
