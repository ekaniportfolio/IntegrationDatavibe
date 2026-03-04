/**
 * SPATIAL FLOW EXAMPLE -- Portal Expansion Flow
 * ================================================
 * Demonstrates: PEF (Portal Expansion Flow)
 *
 * Click any card to expand it to fullscreen from its exact position.
 * Click the close button or press Escape to collapse back.
 *
 * Usage:
 *   import { PortalExpansionDemo } from "./examples/07-portal-expansion";
 *   <PortalExpansionDemo />
 */

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { usePortalExpansion } from "../src/hooks/usePortalExpansion";
import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { CascadeList, CascadeItem } from "../src/components/CascadeList";

// ─── Sample Data ──────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "alpha",
    title: "Project Alpha",
    description: "Machine learning pipeline for predictive analytics",
    color: "from-violet-600 to-indigo-700",
    stats: { tasks: 24, completed: 18, team: 5 },
    details:
      "This project implements a full ML pipeline with data ingestion, feature engineering, model training, and real-time inference serving.",
  },
  {
    id: "beta",
    title: "Project Beta",
    description: "Real-time collaboration platform",
    color: "from-emerald-600 to-teal-700",
    stats: { tasks: 42, completed: 31, team: 8 },
    details:
      "WebSocket-based collaboration with conflict resolution, presence indicators, and offline-first architecture.",
  },
  {
    id: "gamma",
    title: "Project Gamma",
    description: "Mobile-first design system",
    color: "from-amber-500 to-orange-600",
    stats: { tasks: 16, completed: 12, team: 3 },
    details:
      "Token-based design system with responsive typography, semantic colors, and cross-platform component library.",
  },
  {
    id: "delta",
    title: "Project Delta",
    description: "Infrastructure monitoring dashboard",
    color: "from-rose-600 to-pink-700",
    stats: { tasks: 38, completed: 22, team: 6 },
    details:
      "Real-time infrastructure monitoring with alerting, auto-scaling triggers, and historical trend analysis.",
  },
];

// ─── Expandable Card ──────────────────────────────────────────────────────────

function ExpandableCard({
  project,
}: {
  project: (typeof PROJECTS)[number];
}) {
  const portal = usePortalExpansion({
    borderRadius: 16,
  });
  const { prefersReduced } = useReducedMotion();

  // Close on Escape
  useEffect(() => {
    if (!portal.isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") portal.collapse();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [portal.isOpen, portal.collapse]);

  return (
    <>
      {/* Source Card */}
      <div
        ref={portal.sourceRef as React.RefObject<HTMLDivElement>}
        onClick={portal.expand}
        className={`cursor-pointer rounded-2xl bg-gradient-to-br ${project.color} p-6 
          hover:scale-[1.02] transition-transform border border-white/10`}
        role="button"
        tabIndex={0}
        aria-label={`Expand ${project.title}`}
        onKeyDown={(e) => e.key === "Enter" && portal.expand()}
      >
        <h3 className="text-white text-xl">{project.title}</h3>
        <p className="text-white/70 mt-2 text-sm">{project.description}</p>
        <div className="flex gap-4 mt-4">
          <div className="text-white/80 text-xs">
            <span className="text-white text-lg">{project.stats.completed}</span>
            /{project.stats.tasks} tasks
          </div>
          <div className="text-white/80 text-xs">
            <span className="text-white text-lg">{project.stats.team}</span> members
          </div>
        </div>
      </div>

      {/* Portal (Expanded Fullscreen) */}
      {portal.isOpen &&
        createPortal(
          <motion.div
            style={{
              ...portal.portalStyle,
              background: "#0a0a0a",
            }}
            initial={portal.collapsedStyle}
            animate={
              portal.isExpanded ? portal.expandedStyle : portal.collapsedStyle
            }
            transition={portal.transition}
            onAnimationComplete={() => {
              if (!portal.isExpanded) portal.close();
            }}
          >
            {/* Close Button */}
            <button
              onClick={portal.collapse}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full 
                bg-white/10 hover:bg-white/20 flex items-center justify-center
                text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Expanded Content */}
            <div className={`w-full h-64 bg-gradient-to-br ${project.color} flex items-end p-8`}>
              <div>
                <h1 className="text-white text-4xl">{project.title}</h1>
                <p className="text-white/70 mt-2">{project.description}</p>
              </div>
            </div>

            <div className="p-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 256px)" }}>
              <CascadeList stagger={0.06} initialDelay={0.2} className="flex flex-col gap-6">
                <CascadeItem>
                  <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                    <h2 className="text-white text-lg">Overview</h2>
                    <p className="text-neutral-400 mt-3">{project.details}</p>
                  </div>
                </CascadeItem>

                <CascadeItem>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 text-center">
                      <p className="text-neutral-400 text-sm">Tasks</p>
                      <p className="text-white text-3xl mt-1">{project.stats.tasks}</p>
                    </div>
                    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 text-center">
                      <p className="text-neutral-400 text-sm">Completed</p>
                      <p className="text-emerald-400 text-3xl mt-1">{project.stats.completed}</p>
                    </div>
                    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 text-center">
                      <p className="text-neutral-400 text-sm">Team</p>
                      <p className="text-blue-400 text-3xl mt-1">{project.stats.team}</p>
                    </div>
                  </div>
                </CascadeItem>

                <CascadeItem>
                  <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                    <h2 className="text-white text-lg">Progress</h2>
                    <div className="mt-4 h-3 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${project.color} rounded-full`}
                        style={{
                          width: `${(project.stats.completed / project.stats.tasks) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-neutral-400 text-sm mt-2">
                      {Math.round((project.stats.completed / project.stats.tasks) * 100)}% complete
                    </p>
                  </div>
                </CascadeItem>
              </CascadeList>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}

// ─── Main Demo ────────────────────────────────────────────────────────────────

export function PortalExpansionDemo() {
  const { prefersReduced } = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      {prefersReduced && (
        <div className="mb-4 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300 text-sm">
          Reduced motion active. Portal transitions are instant.
        </div>
      )}

      <h1 className="text-white text-3xl mb-2">Portal Expansion Flow</h1>
      <p className="text-neutral-400 mb-8">
        Click any card to expand it fullscreen from its exact position.
      </p>

      <CascadeList
        stagger={0.08}
        initialDelay={0.3}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
      >
        {PROJECTS.map((project) => (
          <CascadeItem key={project.id}>
            <ExpandableCard project={project} />
          </CascadeItem>
        ))}
      </CascadeList>
    </div>
  );
}
