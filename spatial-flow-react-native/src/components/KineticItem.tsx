/**
 * SPATIAL FLOW -- React Native -- KineticItem
 * ==============================================
 * Lateral Glide [LG] Protocol Component.
 *
 * Even items (0, 2, 4...) slide from LEFT.
 * Odd items (1, 3, 5...) slide from RIGHT.
 *
 * @example
 * {items.map((item, i) => (
 *   <KineticItem key={item.id} index={i}>
 *     <Card>{item.name}</Card>
 *   </KineticItem>
 * ))}
 *
 * @author Michel EKANI
 */

import React, { useEffect } from "react";
import { type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { GLIDE_PHYSICS } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledSpring, scaledDelayMs } from "../core/scale-transition";

interface KineticItemProps {
  index: number;
  children: React.ReactNode;
  style?: ViewStyle;
  xOffset?: number;
  staggerDelayMs?: number;
}

export function KineticItem({
  index,
  children,
  style,
  xOffset = 20,
  staggerDelayMs = 50,
}: KineticItemProps) {
  const isEven = index % 2 === 0;
  const xOrigin = isEven ? -xOffset : xOffset;
  const reduced = getReducedMotion();

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(reduced ? 0 : xOrigin);

  useEffect(() => {
    const delay = scaledDelayMs(index * staggerDelayMs);

    if (reduced) {
      opacity.value = withTiming(1, { duration: 150 });
      return;
    }

    const spring = scaledSpring(GLIDE_PHYSICS);
    opacity.value = withDelay(delay, withSpring(1, spring));
    translateX.value = withDelay(delay, withSpring(0, spring));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
