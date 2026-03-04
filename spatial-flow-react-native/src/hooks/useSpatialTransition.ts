/**
 * SPATIAL FLOW -- React Native -- useSpatialTransition Hook
 * ===========================================================
 * The Unified Pipeline Hook for React Native.
 *
 * Encapsulates speed scaling + reduced motion + Reanimated integration.
 * Returns shared values, animated styles, and a trigger function.
 *
 * @example
 * function MyCard({ children }) {
 *   const sf = useSpatialTransition(STANDARD_SOUL, {
 *     from: { opacity: 0, translateY: 30 },
 *     to:   { opacity: 1, translateY: 0 },
 *   });
 *
 *   useEffect(() => { sf.enter(); }, []);
 *
 *   return (
 *     <Animated.View style={[styles.card, sf.animatedStyle]}>
 *       {children}
 *     </Animated.View>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useCallback, useMemo } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import type { SpringConfig } from "../core/types";
import { useReducedMotion } from "./useReducedMotion";
import { useSpatialSpeed } from "./useSpatialSpeed";
import { scaledSpring, scaledDurationMs, scaledDelayMs } from "../core/scale-transition";

interface TransitionStates {
  from: {
    opacity?: number;
    translateX?: number;
    translateY?: number;
    scale?: number;
    rotate?: number;
  };
  to: {
    opacity?: number;
    translateX?: number;
    translateY?: number;
    scale?: number;
    rotate?: number;
  };
}

interface UseSpatialTransitionOptions extends TransitionStates {
  /** Delay before animation starts in ms (default: 0) */
  delayMs?: number;
  /** Allow opacity fades in reduced motion (default: true) */
  allowOpacityInReduced?: boolean;
}

function isSpringConfig(soul: any): soul is SpringConfig {
  return typeof soul?.stiffness === "number" && typeof soul?.damping === "number";
}

export function useSpatialTransition(
  soul: SpringConfig | { durationMs: number; easing?: any },
  options: UseSpatialTransitionOptions
) {
  const {
    from,
    to,
    delayMs = 0,
    allowOpacityInReduced = true,
  } = options;

  const { prefersReduced } = useReducedMotion();
  const { speedScale } = useSpatialSpeed();

  // Shared values
  const opacity = useSharedValue(from.opacity ?? 1);
  const translateX = useSharedValue(prefersReduced ? (to.translateX ?? 0) : (from.translateX ?? 0));
  const translateY = useSharedValue(prefersReduced ? (to.translateY ?? 0) : (from.translateY ?? 0));
  const scale = useSharedValue(prefersReduced ? (to.scale ?? 1) : (from.scale ?? 1));
  const rotate = useSharedValue(prefersReduced ? (to.rotate ?? 0) : (from.rotate ?? 0));

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  // Animation trigger
  const animateTo = useCallback(
    (target: typeof to, extraDelayMs = 0) => {
      const totalDelay = scaledDelayMs(delayMs + extraDelayMs);

      const animate = (sv: Animated.SharedValue<number>, targetVal: number) => {
        if (isSpringConfig(soul)) {
          const spring = scaledSpring(soul);
          sv.value = withDelay(
            totalDelay,
            withSpring(targetVal, {
              stiffness: spring.stiffness,
              damping: spring.damping,
              mass: spring.mass,
            })
          );
        } else {
          sv.value = withDelay(
            totalDelay,
            withTiming(targetVal, {
              duration: scaledDurationMs(soul.durationMs),
            })
          );
        }
      };

      if (prefersReduced) {
        // Instant, except opacity fade
        if (target.opacity !== undefined) {
          if (allowOpacityInReduced) {
            opacity.value = withTiming(target.opacity, { duration: 150 });
          } else {
            opacity.value = target.opacity;
          }
        }
        if (target.translateX !== undefined) translateX.value = target.translateX;
        if (target.translateY !== undefined) translateY.value = target.translateY;
        if (target.scale !== undefined) scale.value = target.scale;
        if (target.rotate !== undefined) rotate.value = target.rotate;
      } else {
        if (target.opacity !== undefined) animate(opacity, target.opacity);
        if (target.translateX !== undefined) animate(translateX, target.translateX);
        if (target.translateY !== undefined) animate(translateY, target.translateY);
        if (target.scale !== undefined) animate(scale, target.scale);
        if (target.rotate !== undefined) animate(rotate, target.rotate);
      }
    },
    [soul, prefersReduced, speedScale, delayMs, allowOpacityInReduced]
  );

  const enter = useCallback(() => animateTo(to), [animateTo, to]);
  const exit = useCallback(
    () => animateTo(from),
    [animateTo, from]
  );

  return {
    animatedStyle,
    enter,
    exit,
    animateTo,
    isReduced: prefersReduced,
    speedScale,
    sharedValues: { opacity, translateX, translateY, scale, rotate },
  };
}
