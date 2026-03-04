/**
 * SPATIAL FLOW FRAMEWORK -- ChrysalisContainer
 * ===============================================
 * Chrysalis Shift [CS] Protocol Component
 *
 * "The container does not change pages. It sheds its skin."
 *
 * Three-Phase Weave:
 * Phase 1 (Dissolution): Old content exits element by element
 * Phase 2 (Breathing):   Container height animates (starts at 55% of Phase 1)
 * Phase 3 (Emergence):   New content enters element by element (starts at 65% of Phase 2)
 *
 * The container NEVER unmounts. Only its inner reality transforms.
 *
 * @example
 * function AuthCard() {
 *   const [view, setView] = useState<"signin" | "forgot">("signin");
 *
 *   return (
 *     <ChrysalisContainer
 *       activeView={view}
 *       views={{
 *         signin: () => <SignInForm onForgot={() => setView("forgot")} />,
 *         forgot: () => <ForgotForm onBack={() => setView("signin")} />,
 *       }}
 *       viewHeights={{ signin: 700, forgot: 420 }}
 *     />
 *   );
 * }
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { CHRYSALIS_SOUL, DIRECTIONAL_MOMENTUM, SF_EASE } from "../core/soul-constants";
import { getFlowDuration } from "../core/spatial-speed";
import { getReducedMotion, REDUCED_TRANSITION } from "../core/reduced-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChrysalisProps {
  /** Current active view key */
  activeView: string;
  /** Map of view keys to their React elements */
  views: Record<string, React.ReactNode>;
  /** Height for each view in pixels */
  viewHeights: Record<string, number>;
  /** Number of animatable elements per view (for timing calculation) */
  viewElementCounts?: Record<string, number>;
  /** Additional CSS class for the outer container */
  className?: string;
  /** Callback fired when the full transition completes */
  onTransitionComplete?: () => void;
}

// ─── Timing Calculator ───────────────────────────────────────────────────────

function calculateTimings(
  elementCount: number,
  closeDuration: number,
  closeStagger: number,
  direction: "compression" | "unfolding" | "default"
) {
  const contentCloseTime = closeDuration + (elementCount - 1) * closeStagger;
  const heightStart = contentCloseTime * CHRYSALIS_SOUL.weaving.dissolutionThreshold * 1000;
  const heightDuration = getFlowDuration(CHRYSALIS_SOUL.height.duration);
  const contentSwitch =
    heightStart + heightDuration * CHRYSALIS_SOUL.weaving.emergenceThreshold * 1000;

  // Apply Directional Momentum
  const base = CHRYSALIS_SOUL.emergence;
  let openDelay = base.delay;
  let openDuration = base.duration;
  let openStagger = base.stagger;

  if (direction === "compression") {
    const m = DIRECTIONAL_MOMENTUM.compression;
    openDelay *= 1 - m.delayReduction;
    openDuration *= 1 - m.durationReduction;
    openStagger *= 1 - m.staggerReduction;
  } else if (direction === "unfolding") {
    const m = DIRECTIONAL_MOMENTUM.unfolding;
    openDelay *= 1 - m.delayReduction;
    openDuration *= 1 - m.durationReduction;
    openStagger *= 1 - m.staggerReduction;
  }

  return {
    contentCloseTime,
    heightStart,
    contentSwitch,
    heightDuration,
    openDelay: getFlowDuration(openDelay),
    openDuration: getFlowDuration(openDuration),
    openStagger: getFlowDuration(openStagger),
    closeDuration: getFlowDuration(closeDuration),
    closeStagger: getFlowDuration(closeStagger),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChrysalisContainer({
  activeView,
  views,
  viewHeights,
  viewElementCounts,
  className = "",
  onTransitionComplete,
}: ChrysalisProps) {
  const [currentView, setCurrentView] = useState(activeView);
  const [targetHeight, setTargetHeight] = useState(viewHeights[activeView] ?? 500);
  const [isClosing, setIsClosing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousView = useRef(activeView);

  useEffect(() => {
    if (activeView === previousView.current) return;
    if (isTransitioning) return;

    const reduced = getReducedMotion();

    // Reduced motion: instant swap, no animation phases
    if (reduced) {
      setTargetHeight(viewHeights[activeView] ?? 500);
      setCurrentView(activeView);
      previousView.current = activeView;
      onTransitionComplete?.();
      return;
    }

    setIsTransitioning(true);
    setIsClosing(true);

    const prevHeight = viewHeights[previousView.current] ?? 500;
    const nextHeight = viewHeights[activeView] ?? 500;
    const direction: "compression" | "unfolding" | "default" =
      nextHeight < prevHeight ? "compression" : nextHeight > prevHeight ? "unfolding" : "default";

    const elementCount = viewElementCounts?.[previousView.current] ?? 6;
    const timings = calculateTimings(
      elementCount,
      CHRYSALIS_SOUL.dissolution.duration,
      CHRYSALIS_SOUL.dissolution.stagger,
      direction
    );

    // Phase 2: Height breathing starts at 55%
    setTimeout(() => {
      setTargetHeight(nextHeight);
    }, timings.heightStart);

    // Phase 3: Content swap starts at 65% of height
    setTimeout(() => {
      setIsClosing(false);
      setCurrentView(activeView);
      previousView.current = activeView;
      setIsTransitioning(false);
      onTransitionComplete?.();
    }, timings.contentSwitch);
  }, [activeView]);

  const reduced = getReducedMotion();

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      data-sf-chrysalis=""
      animate={{ maxHeight: targetHeight }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              maxHeight: {
                duration: getFlowDuration(CHRYSALIS_SOUL.height.duration),
                ease: SF_EASE,
              },
            }
      }
    >
      {views[currentView]}
    </motion.div>
  );
}

// ─── Chrysalis Element Wrapper ────────────────────────────────────────────────

/**
 * Wrap each child element inside a Chrysalis view to get automatic
 * enter/exit animations based on element index.
 *
 * @example
 * <ChrysalisElement index={0} isClosing={isClosing}>
 *   <h2>Title</h2>
 * </ChrysalisElement>
 */
export function ChrysalisElement({
  index,
  isClosing,
  children,
  openDelay = CHRYSALIS_SOUL.emergence.delay,
  openDuration = CHRYSALIS_SOUL.emergence.duration,
  openStagger = CHRYSALIS_SOUL.emergence.stagger,
  closeDuration = CHRYSALIS_SOUL.dissolution.duration,
  closeStagger = CHRYSALIS_SOUL.dissolution.stagger,
  className = "",
}: {
  index: number;
  isClosing: boolean;
  children: React.ReactNode;
  openDelay?: number;
  openDuration?: number;
  openStagger?: number;
  closeDuration?: number;
  closeStagger?: number;
  className?: string;
}) {
  const reduced = getReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
      animate={
        reduced
          ? { opacity: isClosing ? 0 : 1, y: 0, transition: { duration: 0 } }
          : isClosing
            ? {
                opacity: 0,
                y: -8,
                transition: {
                  duration: getFlowDuration(closeDuration),
                  delay: index * getFlowDuration(closeStagger),
                  ease: SF_EASE,
                },
              }
            : {
                opacity: 1,
                y: 0,
                transition: {
                  duration: getFlowDuration(openDuration),
                  delay: getFlowDuration(openDelay) + index * getFlowDuration(openStagger),
                  ease: SF_EASE,
                },
              }
      }
    >
      {children}
    </motion.div>
  );
}