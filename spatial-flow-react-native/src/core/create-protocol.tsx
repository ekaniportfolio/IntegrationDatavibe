/**
 * SPATIAL FLOW -- React Native -- Protocol Factory
 * ===================================================
 * createProtocol() — The Agnostic Protocol Builder for React Native.
 *
 * Same philosophy as @spatial-flow/core (web):
 * Define Soul + States → get a ready-to-use .Item component,
 * fully wired with speed scaling + reduced motion support.
 *
 * Uses react-native-reanimated under the hood.
 *
 * @example
 * const VortexProtocol = createProtocol({
 *   name: "vortex",
 *   soul: STANDARD_SOUL,
 *   states: {
 *     initial: { opacity: 0, rotate: -90, scale: 0.6 },
 *     animate: { opacity: 1, rotate: 0, scale: 1 },
 *   },
 *   staggerMs: 80,
 * });
 *
 * // Usage:
 * <VortexProtocol.Item index={0}><Card /></VortexProtocol.Item>
 * <VortexProtocol.Item index={1}><Card /></VortexProtocol.Item>
 *
 * @author Michel EKANI
 */

import React, { useEffect } from "react";
import { View, type ViewStyle, type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  type SharedValue,
  Easing,
} from "react-native-reanimated";
import type { SpringConfig, ProtocolConfig, ProtocolStates, EaseCurve } from "./types";
import { getReducedMotion } from "./reduced-motion";
import { scaledSpring, scaledDurationMs, scaledDelayMs } from "./scale-transition";
import { SPATIAL_PROPERTIES } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSpringConfig(soul: any): soul is SpringConfig {
  return typeof soul?.stiffness === "number" && typeof soul?.damping === "number";
}

/**
 * Convert a cubic bezier EaseCurve to Reanimated's Easing.bezier.
 */
function easingFromCurve(curve: EaseCurve) {
  return Easing.bezier(curve[0], curve[1], curve[2], curve[3]);
}

// ─── Protocol Types ──────────────────────────────────────────────────────────

interface ProtocolItemProps {
  index?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface Protocol {
  name: string;
  Item: React.FC<ProtocolItemProps>;
  config: ProtocolConfig;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProtocol(config: ProtocolConfig): Protocol {
  const {
    name,
    soul,
    states,
    staggerMs = 0,
    initialDelayMs = 0,
    directional = false,
    xOffset = 20,
    allowOpacityInReduced = true,
  } = config;

  const Item: React.FC<ProtocolItemProps> = ({ index = 0, children, style }) => {
    const reduced = getReducedMotion();

    // Shared values for each animated property
    const opacity = useSharedValue(
      states.initial.opacity ?? 1
    );
    const translateX = useSharedValue(
      reduced ? 0 : (states.initial.translateX ?? 0) + (directional ? (index % 2 === 0 ? -xOffset : xOffset) : 0)
    );
    const translateY = useSharedValue(
      reduced ? 0 : (states.initial.translateY ?? 0)
    );
    const scale = useSharedValue(
      reduced ? (states.animate.scale ?? 1) : (states.initial.scale ?? 1)
    );
    const rotate = useSharedValue(
      reduced ? 0 : (states.initial.rotate ?? 0)
    );

    useEffect(() => {
      const delay = scaledDelayMs(initialDelayMs + index * staggerMs);

      if (reduced) {
        // Instant — only animate opacity if allowed
        if (allowOpacityInReduced && states.animate.opacity !== undefined) {
          opacity.value = withTiming(states.animate.opacity, { duration: 150 });
        } else {
          opacity.value = states.animate.opacity ?? 1;
        }
        translateX.value = states.animate.translateX ?? 0;
        translateY.value = states.animate.translateY ?? 0;
        scale.value = states.animate.scale ?? 1;
        rotate.value = states.animate.rotate ?? 0;
        return;
      }

      // Full animation
      const animateValue = (
        sv: SharedValue<number>,
        target: number,
        delayMs: number
      ) => {
        if (isSpringConfig(soul)) {
          const spring = scaledSpring(soul as SpringConfig);
          sv.value = withDelay(
            delayMs,
            withSpring(target, {
              stiffness: spring.stiffness,
              damping: spring.damping,
              mass: spring.mass,
            })
          );
        } else {
          const tweenSoul = soul as { durationMs: number; easing?: EaseCurve };
          sv.value = withDelay(
            delayMs,
            withTiming(target, {
              duration: scaledDurationMs(tweenSoul.durationMs),
              easing: tweenSoul.easing ? easingFromCurve(tweenSoul.easing) : undefined,
            })
          );
        }
      };

      if (states.animate.opacity !== undefined) animateValue(opacity, states.animate.opacity, delay);
      if (states.animate.translateX !== undefined || directional) animateValue(translateX, states.animate.translateX ?? 0, delay);
      if (states.animate.translateY !== undefined) animateValue(translateY, states.animate.translateY ?? 0, delay);
      if (states.animate.scale !== undefined) animateValue(scale, states.animate.scale, delay);
      if (states.animate.rotate !== undefined) animateValue(rotate, states.animate.rotate, delay);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    }));

    return (
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    );
  };

  Item.displayName = `SpatialFlow.${name}.Item`;

  return {
    name,
    Item,
    config,
  };
}
