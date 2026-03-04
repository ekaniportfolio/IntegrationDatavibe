/**
 * SPATIAL FLOW -- React Native -- ChrysalisContainer
 * =====================================================
 * Chrysalis Shift [CS] Protocol Component.
 *
 * "The container does not change pages. It sheds its skin."
 *
 * Three-Phase Weave:
 * Phase 1 (Dissolution): Old content exits element by element
 * Phase 2 (Breathing):   Container height animates (starts at 55% of Phase 1)
 * Phase 3 (Emergence):   New content enters element by element (starts at 65% of Phase 2)
 *
 * @example
 * function AuthCard() {
 *   const [view, setView] = useState<"signin" | "forgot">("signin");
 *
 *   return (
 *     <ChrysalisContainer
 *       activeView={view}
 *       views={{
 *         signin: <SignInForm onForgot={() => setView("forgot")} />,
 *         forgot: <ForgotForm onBack={() => setView("signin")} />,
 *       }}
 *       viewHeights={{ signin: 700, forgot: 420 }}
 *     />
 *   );
 * }
 *
 * @author Michel EKANI
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import {
  CHRYSALIS_SOUL,
  DIRECTIONAL_MOMENTUM,
  SF_EASE,
} from "../core/soul-constants";
import { getFlowDurationMs } from "../core/spatial-speed";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledDurationMs, scaledDelayMs } from "../core/scale-transition";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChrysalisProps {
  /** Current active view key */
  activeView: string;
  /** Map of view keys to their React Native elements */
  views: Record<string, React.ReactNode>;
  /** Height for each view in logical pixels */
  viewHeights: Record<string, number>;
  /** Number of animatable elements per view (for timing calculation) */
  viewElementCounts?: Record<string, number>;
  /** Additional style for the outer container */
  style?: ViewStyle;
  /** Callback fired when the full transition completes */
  onTransitionComplete?: () => void;
}

// ─── Easing Helper ────────────────────────────────────────────────────────────

const sfEasing = Easing.bezier(SF_EASE[0], SF_EASE[1], SF_EASE[2], SF_EASE[3]);

// ─── Timing Calculator ───────────────────────────────────────────────────────

function calculateTimingsMs(
  elementCount: number,
  closeDurationMs: number,
  closeStaggerMs: number,
  direction: "compression" | "unfolding" | "default"
) {
  const contentCloseTimeMs = closeDurationMs + (elementCount - 1) * closeStaggerMs;
  const heightStartMs =
    contentCloseTimeMs * CHRYSALIS_SOUL.weaving.dissolutionThreshold;
  const heightDurationMs = getFlowDurationMs(CHRYSALIS_SOUL.height.durationMs);
  const contentSwitchMs =
    heightStartMs +
    heightDurationMs * CHRYSALIS_SOUL.weaving.emergenceThreshold;

  // Apply Directional Momentum
  let openDelayMs = CHRYSALIS_SOUL.emergence.delayMs;
  let openDurationMs = CHRYSALIS_SOUL.emergence.durationMs;
  let openStaggerMs = CHRYSALIS_SOUL.emergence.staggerMs;

  if (direction === "compression") {
    const m = DIRECTIONAL_MOMENTUM.compression;
    openDelayMs *= 1 - m.delayReduction;
    openDurationMs *= 1 - m.durationReduction;
    openStaggerMs *= 1 - m.staggerReduction;
  } else if (direction === "unfolding") {
    const m = DIRECTIONAL_MOMENTUM.unfolding;
    openDelayMs *= 1 - m.delayReduction;
    openDurationMs *= 1 - m.durationReduction;
    openStaggerMs *= 1 - m.staggerReduction;
  }

  return {
    contentCloseTimeMs,
    heightStartMs,
    contentSwitchMs,
    heightDurationMs,
    openDelayMs: getFlowDurationMs(openDelayMs),
    openDurationMs: getFlowDurationMs(openDurationMs),
    openStaggerMs: getFlowDurationMs(openStaggerMs),
    closeDurationMs: getFlowDurationMs(closeDurationMs),
    closeStaggerMs: getFlowDurationMs(closeStaggerMs),
  };
}

// ─── ChrysalisContainer ──────────────────────────────────────────────────────

export function ChrysalisContainer({
  activeView,
  views,
  viewHeights,
  viewElementCounts,
  style,
  onTransitionComplete,
}: ChrysalisProps) {
  const [currentView, setCurrentView] = useState(activeView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousView = useRef(activeView);
  const heightValue = useSharedValue(viewHeights[activeView] ?? 500);

  useEffect(() => {
    if (activeView === previousView.current) return;
    if (isTransitioning) return;

    const reduced = getReducedMotion();

    if (reduced) {
      heightValue.value = viewHeights[activeView] ?? 500;
      setCurrentView(activeView);
      previousView.current = activeView;
      onTransitionComplete?.();
      return;
    }

    setIsTransitioning(true);

    const prevHeight = viewHeights[previousView.current] ?? 500;
    const nextHeight = viewHeights[activeView] ?? 500;
    const direction: "compression" | "unfolding" | "default" =
      nextHeight < prevHeight
        ? "compression"
        : nextHeight > prevHeight
          ? "unfolding"
          : "default";

    const elementCount = viewElementCounts?.[previousView.current] ?? 6;
    const timings = calculateTimingsMs(
      elementCount,
      CHRYSALIS_SOUL.dissolution.durationMs,
      CHRYSALIS_SOUL.dissolution.staggerMs,
      direction
    );

    // Phase 2: Height breathing
    setTimeout(() => {
      heightValue.value = withTiming(nextHeight, {
        duration: timings.heightDurationMs,
        easing: sfEasing,
      });
    }, timings.heightStartMs);

    // Phase 3: Content swap
    setTimeout(() => {
      setCurrentView(activeView);
      previousView.current = activeView;
      setIsTransitioning(false);
      onTransitionComplete?.();
    }, timings.contentSwitchMs);
  }, [activeView]);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: heightValue.value,
    overflow: "hidden" as const,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {views[currentView]}
    </Animated.View>
  );
}

// ─── ChrysalisElement ────────────────────────────────────────────────────────

interface ChrysalisElementProps {
  index: number;
  isClosing: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  openDelayMs?: number;
  openDurationMs?: number;
  openStaggerMs?: number;
  closeDurationMs?: number;
  closeStaggerMs?: number;
}

/**
 * Wrap each child element inside a Chrysalis view to get automatic
 * enter/exit animations based on element index.
 *
 * @example
 * <ChrysalisElement index={0} isClosing={isClosing}>
 *   <Text>Title</Text>
 * </ChrysalisElement>
 */
export function ChrysalisElement({
  index,
  isClosing,
  children,
  style,
  openDelayMs = CHRYSALIS_SOUL.emergence.delayMs,
  openDurationMs = CHRYSALIS_SOUL.emergence.durationMs,
  openStaggerMs = CHRYSALIS_SOUL.emergence.staggerMs,
  closeDurationMs = CHRYSALIS_SOUL.dissolution.durationMs,
  closeStaggerMs = CHRYSALIS_SOUL.dissolution.staggerMs,
}: ChrysalisElementProps) {
  const reduced = getReducedMotion();

  const opacity = useSharedValue(reduced ? 1 : 0);
  const translateY = useSharedValue(reduced ? 0 : 8);

  useEffect(() => {
    if (reduced) {
      opacity.value = isClosing ? 0 : 1;
      translateY.value = 0;
      return;
    }

    if (isClosing) {
      const delay = scaledDelayMs(index * closeStaggerMs);
      opacity.value = withDelay(
        delay,
        withTiming(0, {
          duration: scaledDurationMs(closeDurationMs),
          easing: sfEasing,
        })
      );
      translateY.value = withDelay(
        delay,
        withTiming(-8, {
          duration: scaledDurationMs(closeDurationMs),
          easing: sfEasing,
        })
      );
    } else {
      const delay = scaledDelayMs(openDelayMs + index * openStaggerMs);
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: scaledDurationMs(openDurationMs),
          easing: sfEasing,
        })
      );
      translateY.value = withDelay(
        delay,
        withTiming(0, {
          duration: scaledDurationMs(openDurationMs),
          easing: sfEasing,
        })
      );
    }
  }, [isClosing]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
