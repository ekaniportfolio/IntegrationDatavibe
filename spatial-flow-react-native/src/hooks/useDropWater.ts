/**
 * SPATIAL FLOW -- React Native -- useDropWater Hook
 * ====================================================
 * Drop Water Protocol [DWP] — Complete 5-Act Sequence.
 *
 * "The avatar does not open a modal. It BECOMES the portal."
 *
 * Five-Act Sequence:
 * Act 1 — Trigger:           Avatar gravitational drop
 * Act 2 — Backdrop:          Dark scrim fades in
 * Act 3 — Blur Curtain:      Background blur (via BlurView or similar)
 * Act 4 — Mitosis:           Auth card keyframe expansion (seed → pill → card)
 * Act 5 — Content Emergence: Form elements stagger-enter
 *
 * @example
 * function AvatarAuth() {
 *   const dw = useDropWater();
 *
 *   return (
 *     <View>
 *       <Pressable ref={dw.avatarRef} onPress={dw.trigger}>
 *         <Image source={avatar} style={styles.avatar} />
 *       </Pressable>
 *
 *       {dw.isActive && (
 *         <Modal transparent animationType="none">
 *           <Animated.View style={[styles.backdrop, dw.backdropStyle]} />
 *           <Animated.View style={[styles.card, dw.cardStyle]}>
 *             <AuthForm />
 *           </Animated.View>
 *         </Modal>
 *       )}
 *     </View>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useRef, useCallback } from "react";
import { Dimensions, type View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import {
  DROP_WATER_TIMING,
  REFLEX_SOUL,
  STANDARD_SOUL,
  SF_EASE,
} from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledSpring, scaledDurationMs, scaledDelayMs } from "../core/scale-transition";

// ─── Types ────────────────────────────────────────────────────────────────────

type DWPhase = "idle" | "dropping" | "expanding" | "open" | "reversing";

interface UseDropWaterOptions {
  cardWidth?: number;
  cardHeight?: number;
  onComplete?: () => void;
  onReversed?: () => void;
}

// ─── Easing ───────────────────────────────────────────────────────────────────

const sfEasing = Easing.bezier(SF_EASE[0], SF_EASE[1], SF_EASE[2], SF_EASE[3]);
const gravityEasing = Easing.bezier(0.55, 0, 1, 0.45);
const storeEasing = Easing.bezier(
  DROP_WATER_TIMING.storeEase[0],
  DROP_WATER_TIMING.storeEase[1],
  DROP_WATER_TIMING.storeEase[2],
  DROP_WATER_TIMING.storeEase[3]
);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDropWater(options: UseDropWaterOptions = {}) {
  const {
    cardWidth = 350,
    cardHeight = 480,
    onComplete,
    onReversed,
  } = options;

  const avatarRef = useRef<View>(null);
  const [phase, setPhase] = useState<DWPhase>("idle");
  const { width: screenW, height: screenH } = Dimensions.get("window");

  // Shared values
  const avatarDropY = useSharedValue(0);
  const avatarOpacity = useSharedValue(1);
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.05);
  const cardOpacity = useSharedValue(0);
  const cardBorderRadius = useSharedValue(100);

  // ── Trigger ─────────────────────────────────────────────────────────────

  const trigger = useCallback(() => {
    if (phase !== "idle") return;

    const reduced = getReducedMotion();

    if (reduced) {
      backdropOpacity.value = 1;
      cardScale.value = 1;
      cardOpacity.value = 1;
      cardBorderRadius.value = 16;
      setPhase("open");
      onComplete?.();
      return;
    }

    setPhase("dropping");

    const dropDurationMs = scaledDurationMs(DROP_WATER_TIMING.avatarDropMs);
    const mitosisDurationMs = scaledDurationMs(DROP_WATER_TIMING.mitosisMs);
    const blurDurationMs = scaledDurationMs(DROP_WATER_TIMING.blurCurtainMs);

    // Act 1: Avatar gravitational drop
    avatarDropY.value = withTiming(screenH * 0.4, {
      duration: dropDurationMs,
      easing: gravityEasing,
    });
    avatarOpacity.value = withTiming(0, {
      duration: dropDurationMs * 0.5,
      easing: Easing.out(Easing.ease),
    });

    // Act 2: Backdrop fade
    backdropOpacity.value = withTiming(1, {
      duration: blurDurationMs,
      easing: sfEasing,
    });

    // Act 4: Mitosis (seed → pill → card)
    cardScale.value = withDelay(
      dropDurationMs,
      withSequence(
        // seed → pill
        withTiming(0.3, {
          duration: mitosisDurationMs * 0.4,
          easing: storeEasing,
        }),
        // pill → card
        withTiming(1, {
          duration: mitosisDurationMs * 0.6,
          easing: storeEasing,
        })
      )
    );

    cardOpacity.value = withDelay(
      dropDurationMs,
      withTiming(1, {
        duration: mitosisDurationMs * 0.5,
        easing: Easing.out(Easing.ease),
      })
    );

    cardBorderRadius.value = withDelay(
      dropDurationMs,
      withSequence(
        withTiming(24, { duration: mitosisDurationMs * 0.4, easing: sfEasing }),
        withTiming(16, { duration: mitosisDurationMs * 0.6, easing: sfEasing })
      )
    );

    // Phase transitions
    setTimeout(() => {
      setPhase("expanding");
    }, dropDurationMs);

    setTimeout(() => {
      setPhase("open");
      onComplete?.();
    }, dropDurationMs + mitosisDurationMs);
  }, [phase, screenH, onComplete]);

  // ── Reverse ─────────────────────────────────────────────────────────────

  const reverse = useCallback(() => {
    if (phase === "idle" || phase === "reversing") return;

    const reduced = getReducedMotion();

    if (reduced) {
      backdropOpacity.value = 0;
      cardScale.value = 0.05;
      cardOpacity.value = 0;
      cardBorderRadius.value = 100;
      avatarDropY.value = 0;
      avatarOpacity.value = 1;
      setPhase("idle");
      onReversed?.();
      return;
    }

    setPhase("reversing");

    const reverseDurationMs = scaledDurationMs(
      DROP_WATER_TIMING.mitosisMs + DROP_WATER_TIMING.blurCurtainMs
    );

    // All acts simultaneously in reverse
    cardScale.value = withTiming(0.05, {
      duration: scaledDurationMs(DROP_WATER_TIMING.mitosisMs),
      easing: storeEasing,
    });
    cardOpacity.value = withTiming(0, {
      duration: scaledDurationMs(DROP_WATER_TIMING.mitosisMs * 0.5),
      easing: Easing.in(Easing.ease),
    });
    cardBorderRadius.value = withTiming(100, {
      duration: scaledDurationMs(DROP_WATER_TIMING.mitosisMs),
      easing: sfEasing,
    });

    backdropOpacity.value = withDelay(
      scaledDelayMs(DROP_WATER_TIMING.mitosisMs * 0.3),
      withTiming(0, {
        duration: scaledDurationMs(DROP_WATER_TIMING.blurCurtainMs),
        easing: sfEasing,
      })
    );

    avatarDropY.value = withDelay(
      scaledDelayMs(DROP_WATER_TIMING.mitosisMs * 0.5),
      withTiming(0, {
        duration: scaledDurationMs(DROP_WATER_TIMING.avatarDropMs),
        easing: Easing.out(Easing.ease),
      })
    );
    avatarOpacity.value = withDelay(
      scaledDelayMs(DROP_WATER_TIMING.mitosisMs * 0.5),
      withTiming(1, {
        duration: scaledDurationMs(DROP_WATER_TIMING.avatarDropMs * 0.5),
        easing: Easing.out(Easing.ease),
      })
    );

    setTimeout(() => {
      setPhase("idle");
      onReversed?.();
    }, reverseDurationMs);
  }, [phase, onReversed]);

  // ── Animated Styles ─────────────────────────────────────────────────────

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: avatarDropY.value }],
    opacity: avatarOpacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
    borderRadius: cardBorderRadius.value,
  }));

  return {
    // Refs
    avatarRef,

    // State
    phase,
    isActive: phase !== "idle",
    isOpen: phase === "open",
    isReversing: phase === "reversing",

    // Actions
    trigger,
    reverse,

    // Animated styles
    avatarStyle,
    backdropStyle,
    cardStyle,

    // Card dimensions (for layout)
    cardWidth,
    cardHeight,
  };
}
