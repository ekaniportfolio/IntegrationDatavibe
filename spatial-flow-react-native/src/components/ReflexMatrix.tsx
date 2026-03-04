/**
 * SPATIAL FLOW -- React Native -- ReflexMatrix Component
 * ========================================================
 * Reflex Matrix [RM] Protocol — "The Organic Cell"
 *
 * A container that undergoes mitosis (biological division) to reveal options.
 *
 * Key Patterns (adapted from web):
 * - Inverse Trapdoor: ScrollView expansion via animated contentContainerStyle
 * - Soft Lock: scrollTo headroom position (160px from top)
 * - Ghost DOM: onLayout measurement of target height before animating
 *
 * Physics: REFLEX_SOUL (stiffness: 350, damping: 25, mass: 0.7)
 *
 * @example
 * <ReflexMatrix
 *   collapsed={<CompactCard />}
 *   expanded={<DetailView />}
 *   isExpanded={isExpanded}
 *   onToggle={() => setIsExpanded(!isExpanded)}
 * />
 *
 * @author Michel EKANI
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  LayoutAnimation,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { REFLEX_SOUL } from "../core/soul-constants";
import { scaledSpring } from "../core/scale-transition";
import { getReducedMotion } from "../core/reduced-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReflexMatrixProps {
  /** Compact/collapsed content */
  collapsed: React.ReactNode;
  /** Expanded detail content */
  expanded: React.ReactNode;
  /** Whether the cell is expanded */
  isExpanded: boolean;
  /** Toggle callback */
  onToggle: () => void;
  /** Headroom position for Soft Lock (default: 160) */
  headroomOffset?: number;
  /** Reference to parent ScrollView for Soft Lock */
  scrollViewRef?: React.RefObject<ScrollView>;
  /** Container style */
  style?: ViewStyle;
  /** Custom spring config (default: REFLEX_SOUL) */
  spring?: { stiffness: number; damping: number; mass: number };
}

// ─── Soft Lock: scroll to headroom position ───────────────────────────────────

const HEADROOM_PX = 160;

// ─── Component ────────────────────────────────────────────────────────────────

export function ReflexMatrix({
  collapsed,
  expanded,
  isExpanded,
  onToggle,
  headroomOffset = HEADROOM_PX,
  scrollViewRef,
  style,
  spring = REFLEX_SOUL,
}: ReflexMatrixProps) {
  const containerRef = useRef<View>(null);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [measured, setMeasured] = useState(false);

  const animatedHeight = useSharedValue(0);

  // Ghost DOM: Measure expanded content height via hidden layout
  const onExpandedLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && !measured) {
      setExpandedHeight(h);
      setMeasured(true);
    }
  }, [measured]);

  const onCollapsedLayout = useCallback((e: LayoutChangeEvent) => {
    setCollapsedHeight(e.nativeEvent.layout.height);
  }, []);

  // Animate height
  useEffect(() => {
    const reduced = getReducedMotion();
    const targetHeight = isExpanded ? expandedHeight : collapsedHeight;

    if (targetHeight <= 0) return;

    if (reduced) {
      animatedHeight.value = targetHeight;
      return;
    }

    const springConfig = scaledSpring(spring);
    animatedHeight.value = withSpring(targetHeight, springConfig);

    // Soft Lock: scroll to headroom position when expanding
    if (isExpanded && scrollViewRef?.current && containerRef.current) {
      containerRef.current.measureInWindow((_x, y) => {
        const scrollTarget = Math.max(0, y - headroomOffset);
        scrollViewRef.current?.scrollTo({ y: scrollTarget, animated: !reduced });
      });
    }
  }, [isExpanded, expandedHeight, collapsedHeight, spring, headroomOffset]);

  const heightStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value > 0 ? animatedHeight.value : undefined,
    overflow: "hidden" as const,
  }));

  return (
    <View ref={containerRef} style={style}>
      {/* Animated Height Container */}
      <Animated.View style={heightStyle}>
        <Pressable onPress={onToggle}>
          {/* Collapsed Content (always rendered for measurement) */}
          <View onLayout={onCollapsedLayout}>
            {!isExpanded && collapsed}
          </View>

          {/* Expanded Content */}
          {isExpanded && (
            <View onLayout={onExpandedLayout}>
              {expanded}
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Ghost DOM: Hidden measurement of expanded content */}
      {!measured && !isExpanded && (
        <View
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          onLayout={onExpandedLayout}
        >
          {expanded}
        </View>
      )}
    </View>
  );
}

export { HEADROOM_PX as REFLEX_HEADROOM_PX };
