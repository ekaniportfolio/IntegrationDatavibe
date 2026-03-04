/**
 * SPATIAL FLOW -- React Native -- CascadeList & CascadeItem
 * ===========================================================
 * Sequential Spatial Cascade [SSC] Protocol Component.
 *
 * Content arrives in timed waves. Each child mounts with a staggered
 * spring animation driven by its index.
 *
 * @example
 * <CascadeList staggerMs={50} initialDelayMs={200}>
 *   <CascadeItem index={0}><Card>Item 1</Card></CascadeItem>
 *   <CascadeItem index={1}><Card>Item 2</Card></CascadeItem>
 *   <CascadeItem index={2}><Card>Item 3</Card></CascadeItem>
 * </CascadeList>
 *
 * @author Michel EKANI
 */

import React, { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { STANDARD_SOUL, SSC_TIMING } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledSpring, scaledDelayMs } from "../core/scale-transition";

// ─── CascadeList ──────────────────────────────────────────────────────────────

interface CascadeListProps {
  children: React.ReactNode;
  staggerMs?: number;
  initialDelayMs?: number;
  style?: ViewStyle;
}

export function CascadeList({
  children,
  style,
}: CascadeListProps) {
  return <View style={style}>{children}</View>;
}

// ─── CascadeItem ──────────────────────────────────────────────────────────────

interface CascadeItemProps {
  index: number;
  children: React.ReactNode;
  style?: ViewStyle;
  yOffset?: number;
  staggerMs?: number;
  initialDelayMs?: number;
}

export function CascadeItem({
  index,
  children,
  style,
  yOffset = 20,
  staggerMs = SSC_TIMING.staggerMs,
  initialDelayMs = 200,
}: CascadeItemProps) {
  const reduced = getReducedMotion();

  const opacity = useSharedValue(reduced ? 1 : 0);
  const translateY = useSharedValue(reduced ? 0 : yOffset);

  useEffect(() => {
    if (reduced) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    const delay = scaledDelayMs(initialDelayMs + index * staggerMs);
    const spring = scaledSpring(STANDARD_SOUL);

    opacity.value = withDelay(delay, withSpring(1, spring));
    translateY.value = withDelay(delay, withSpring(0, spring));
  }, []);

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
