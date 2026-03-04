/**
 * SPATIAL FLOW -- React Native -- useSamsaraShift Hook
 * ======================================================
 * Samsara Shift Protocol — Direction-Aware Tab Navigation.
 *
 * "The Vessel carries the Soul. The Indicator points the way."
 *
 * Returns animated shared values for indicator position and content
 * sliding, driven by SAMSARA_VESSEL and SAMSARA_INDICATOR physics.
 *
 * @example
 * function TabScreen() {
 *   const samsara = useSamsaraShift({ tabCount: 3, tabWidth: 120 });
 *
 *   return (
 *     <View>
 *       <View style={{ flexDirection: 'row' }}>
 *         {tabs.map((tab, i) => (
 *           <Pressable key={i} onPress={() => samsara.goTo(i)}>
 *             <Text>{tab.label}</Text>
 *           </Pressable>
 *         ))}
 *       </View>
 *       <Animated.View style={[styles.indicator, samsara.indicatorStyle]} />
 *       <Animated.View style={samsara.contentStyle}>
 *         {tabs[samsara.activeIndex].content}
 *       </Animated.View>
 *     </View>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type { FlowDirection } from "../core/types";
import { SAMSARA_VESSEL, SAMSARA_INDICATOR } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledSpring } from "../core/scale-transition";

interface UseSamsaraShiftOptions {
  tabCount: number;
  tabWidth?: number;
  initialIndex?: number;
  contentWidth?: number;
  onChange?: (index: number, direction: FlowDirection) => void;
}

export function useSamsaraShift(options: UseSamsaraShiftOptions) {
  const {
    tabCount,
    tabWidth = 120,
    initialIndex = 0,
    contentWidth = 375,
    onChange,
  } = options;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<FlowDirection>(0);

  // Shared values
  const indicatorX = useSharedValue(initialIndex * tabWidth);
  const contentTranslateX = useSharedValue(0);
  const contentOpacity = useSharedValue(1);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= tabCount || index === activeIndex) return;
      const d: FlowDirection = index > activeIndex ? 1 : -1;
      setDirection(d);
      setActiveIndex(index);

      const reduced = getReducedMotion();

      // Indicator animation (lighter spring)
      if (reduced) {
        indicatorX.value = index * tabWidth;
      } else {
        const indSpring = scaledSpring(SAMSARA_INDICATOR);
        indicatorX.value = withSpring(index * tabWidth, {
          stiffness: indSpring.stiffness,
          damping: indSpring.damping,
          mass: indSpring.mass,
        });
      }

      // Content animation (heavier spring)
      if (reduced) {
        contentTranslateX.value = 0;
        contentOpacity.value = 1;
      } else {
        const vesselSpring = scaledSpring(SAMSARA_VESSEL);

        // Slide out → swap → slide in
        contentOpacity.value = withSpring(0, vesselSpring);
        contentTranslateX.value = withSpring(
          d < 0 ? contentWidth * 0.3 : -contentWidth * 0.3,
          vesselSpring,
          () => {
            // Reset position for incoming content
            contentTranslateX.value = d < 0 ? -contentWidth * 0.3 : contentWidth * 0.3;
            contentTranslateX.value = withSpring(0, vesselSpring);
            contentOpacity.value = withSpring(1, vesselSpring);
          }
        );
      }

      onChange?.(index, d);
    },
    [activeIndex, tabCount, tabWidth, contentWidth, onChange]
  );

  const next = useCallback(() => {
    if (activeIndex < tabCount - 1) goTo(activeIndex + 1);
  }, [activeIndex, tabCount, goTo]);

  const prev = useCallback(() => {
    if (activeIndex > 0) goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Animated styles
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: tabWidth,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  return {
    activeIndex,
    direction,
    goTo,
    next,
    prev,
    indicatorStyle,
    contentStyle,
    isReduced: getReducedMotion(),
  };
}
