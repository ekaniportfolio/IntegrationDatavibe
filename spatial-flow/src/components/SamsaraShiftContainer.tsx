/**
 * SPATIAL FLOW FRAMEWORK -- SamsaraShiftContainer
 * =================================================
 * Samsara Shift [SS] Protocol Component
 *
 * "The Vessel carries the Soul. The Indicator points the way."
 *
 * Direction-aware tab navigation where content flows in the direction
 * of the user's attention. The indicator follows with lighter, faster physics.
 *
 * @example
 * <SamsaraShiftContainer
 *   tabs={[
 *     { label: "Overview", content: <Overview /> },
 *     { label: "Analytics", content: <Analytics /> },
 *     { label: "Settings", content: <Settings /> },
 *   ]}
 *   tabWidth={120}
 * />
 *
 * @author Michel EKANI
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSamsaraShift } from "../hooks/useSamsaraShift";
import { getReducedMotion } from "../core/reduced-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SamsaraTab {
  /** Tab label text */
  label: string;
  /** Tab content (React element) */
  content: React.ReactNode;
  /** Optional icon */
  icon?: React.ReactNode;
}

interface SamsaraShiftContainerProps {
  /** Array of tab definitions */
  tabs: SamsaraTab[];
  /** Width of each tab button in px (default: 120) */
  tabWidth?: number;
  /** Starting tab index (default: 0) */
  initialIndex?: number;
  /** Horizontal displacement for content slide in px (default: 300) */
  xDistance?: number;
  /** Include opacity transitions (default: true) */
  withOpacity?: boolean;
  /** Include blur during flight (default: false) */
  withBlur?: boolean;
  /** Additional CSS class for the container */
  className?: string;
  /** Additional CSS class for the tab bar */
  tabBarClassName?: string;
  /** Additional CSS class for the content area */
  contentClassName?: string;
  /** Indicator color (CSS value, default: "currentColor") */
  indicatorColor?: string;
  /** Indicator height in px (default: 2) */
  indicatorHeight?: number;
  /** Callback when tab changes */
  onChange?: (index: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SamsaraShiftContainer({
  tabs,
  tabWidth = 120,
  initialIndex = 0,
  xDistance = 300,
  withOpacity = true,
  withBlur = false,
  className = "",
  tabBarClassName = "",
  contentClassName = "",
  indicatorColor = "currentColor",
  indicatorHeight = 2,
  onChange,
}: SamsaraShiftContainerProps) {
  const samsara = useSamsaraShift({
    tabCount: tabs.length,
    tabWidth,
    initialIndex,
    xDistance,
    withOpacity,
    withBlur,
    onChange: (index) => onChange?.(index),
  });

  const reduced = getReducedMotion();

  return (
    <div className={className} data-sf-samsara="">
      {/* Tab Bar */}
      <div
        className={tabBarClassName}
        style={{ position: "relative", display: "flex" }}
        role="tablist"
        data-sf-samsara-tabs=""
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={samsara.activeIndex === i}
            onClick={() => samsara.goTo(i)}
            style={{
              width: tabWidth,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 16px",
              opacity: samsara.activeIndex === i ? 1 : 0.6,
              transition: "opacity 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            data-sf-samsara-tab={i}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        {/* Indicator (Soul) */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: tabWidth,
            height: indicatorHeight,
            backgroundColor: indicatorColor,
            borderRadius: indicatorHeight,
          }}
          animate={{ x: samsara.indicatorX }}
          transition={samsara.indicatorTransition}
          data-sf-samsara-indicator=""
        />
      </div>

      {/* Content (Vessel) */}
      <div
        className={contentClassName}
        style={{ position: "relative", overflow: "hidden" }}
        role="tabpanel"
        data-sf-samsara-vessel=""
      >
        <AnimatePresence initial={false} custom={samsara.direction} mode="wait">
          <motion.div
            key={samsara.activeIndex}
            custom={samsara.direction}
            variants={samsara.contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={samsara.vesselTransition}
          >
            {tabs[samsara.activeIndex]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
