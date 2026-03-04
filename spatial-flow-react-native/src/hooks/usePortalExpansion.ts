/**
 * SPATIAL FLOW -- React Native -- usePortalExpansion Hook
 * ========================================================
 * Portal Expansion Flow [PEF] Protocol.
 *
 * "Inline content expands to fullscreen from its exact position."
 *
 * React Native implementation uses `measure()` for rect capture
 * and Reanimated for physics-based expansion animation.
 *
 * @example
 * function ExpandableCard({ children }) {
 *   const portal = usePortalExpansion();
 *
 *   return (
 *     <>
 *       <Pressable ref={portal.sourceRef} onPress={portal.expand}>
 *         {children}
 *       </Pressable>
 *
 *       {portal.isOpen && (
 *         <Animated.View style={[styles.portal, portal.animatedStyle]}>
 *           <Pressable onPress={portal.collapse}>
 *             <Text>Close</Text>
 *           </Pressable>
 *           <ExpandedContent />
 *         </Animated.View>
 *       )}
 *     </>
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
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { EXPANSION_SOUL } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledSpring } from "../core/scale-transition";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SourceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UsePortalExpansionOptions {
  spring?: { stiffness: number; damping: number; mass: number };
  borderRadius?: number;
  onExpanded?: () => void;
  onCollapsed?: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePortalExpansion(
  options: UsePortalExpansionOptions = {}
) {
  const {
    spring = EXPANSION_SOUL,
    borderRadius = 12,
    onExpanded,
    onCollapsed,
  } = options;

  const sourceRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { width: screenW, height: screenH } = Dimensions.get("window");

  // Animated values
  const top = useSharedValue(0);
  const left = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const radius = useSharedValue(borderRadius);

  // Capture rect and expand
  const expand = useCallback(() => {
    if (!sourceRef.current) return;

    sourceRef.current.measureInWindow((x, y, w, h) => {
      const reduced = getReducedMotion();

      // Set initial position
      top.value = y;
      left.value = x;
      width.value = w;
      height.value = h;
      radius.value = borderRadius;

      setIsOpen(true);
      setIsExpanded(true);

      if (reduced) {
        top.value = 0;
        left.value = 0;
        width.value = screenW;
        height.value = screenH;
        radius.value = 0;
        onExpanded?.();
        return;
      }

      const springConfig = scaledSpring(spring);

      top.value = withSpring(0, springConfig);
      left.value = withSpring(0, springConfig);
      width.value = withSpring(screenW, springConfig);
      height.value = withSpring(screenH, springConfig, (finished) => {
        if (finished && onExpanded) {
          runOnJS(onExpanded)();
        }
      });
      radius.value = withSpring(0, springConfig);
    });
  }, [spring, borderRadius, screenW, screenH, onExpanded]);

  // Collapse back to source
  const collapse = useCallback(() => {
    if (!sourceRef.current) return;

    sourceRef.current.measureInWindow((x, y, w, h) => {
      const reduced = getReducedMotion();

      if (reduced) {
        setIsExpanded(false);
        setIsOpen(false);
        onCollapsed?.();
        return;
      }

      const springConfig = scaledSpring(spring);

      setIsExpanded(false);
      top.value = withSpring(y, springConfig);
      left.value = withSpring(x, springConfig);
      width.value = withSpring(w, springConfig);
      height.value = withSpring(h, springConfig, (finished) => {
        if (finished) {
          runOnJS(setIsOpen)(false);
          if (onCollapsed) runOnJS(onCollapsed)();
        }
      });
      radius.value = withSpring(borderRadius, springConfig);
    });
  }, [spring, borderRadius, onCollapsed]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    top: top.value,
    left: left.value,
    width: width.value,
    height: height.value,
    borderRadius: radius.value,
    overflow: "hidden" as const,
    zIndex: 9999,
  }));

  return {
    sourceRef,
    isOpen,
    isExpanded,
    expand,
    collapse,
    animatedStyle,
  };
}
