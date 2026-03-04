/**
 * SPATIAL FLOW -- React Native -- useTransmigration Hook
 * ========================================================
 * Transmigrated Astral Flow [TAF] Protocol.
 *
 * "The element does not die. It transmigrates."
 *
 * In React Native, there is no `layoutId` like Motion.
 * Instead, TAF uses `sharedTransitionTag` from Reanimated
 * (react-native-reanimated v3) to achieve element transmigration
 * between screens via Shared Element Transitions.
 *
 * This hook provides:
 * - A unique `sharedTransitionTag` string
 * - STANDARD_SOUL-based spring config for the transition
 * - RAU safety via tag invalidation
 *
 * @example
 * // Screen A (list)
 * function ProductList() {
 *   const items = [...];
 *   return items.map(item => {
 *     const tx = useTransmigration(`product-${item.id}`);
 *     return (
 *       <Animated.View {...tx.tagProps}>
 *         <Image source={item.image} />
 *       </Animated.View>
 *     );
 *   });
 * }
 *
 * // Screen B (detail)
 * function ProductDetail({ id }) {
 *   const tx = useTransmigration(`product-${id}`);
 *   return (
 *     <Animated.View {...tx.tagProps}>
 *       <Image source={product.image} />
 *     </Animated.View>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useCallback, useMemo } from "react";
import { STANDARD_SOUL } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { scaledSpring } from "../core/scale-transition";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseTransmigrationOptions {
  spring?: { stiffness: number; damping: number; mass: number };
  namespace?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTransmigration(
  id: string,
  options: UseTransmigrationOptions = {}
) {
  const {
    spring = STANDARD_SOUL,
    namespace,
  } = options;

  const [isShielded, setIsShielded] = useState(false);

  // Resolve tag with optional namespace
  const tag = namespace ? `${id}-${namespace}` : id;
  const resolvedTag = isShielded ? undefined : tag;

  const shield = useCallback(() => setIsShielded(true), []);
  const unshield = useCallback(() => setIsShielded(false), []);

  // Spring config for shared element transition
  const springConfig = useMemo(() => {
    if (getReducedMotion()) {
      return { stiffness: 10000, damping: 1000, mass: 0.01 };
    }
    return scaledSpring(spring);
  }, [spring]);

  // Props to spread on Animated.View
  // Note: `sharedTransitionTag` is a Reanimated v3 prop
  const tagProps = useMemo(
    () => ({
      sharedTransitionTag: resolvedTag,
      sharedTransitionStyle: {
        springConfig: {
          stiffness: springConfig.stiffness,
          damping: springConfig.damping,
          mass: springConfig.mass,
        },
      },
    }),
    [resolvedTag, springConfig]
  );

  return {
    tag,
    resolvedTag,
    tagProps,
    shield,
    unshield,
    isShielded,
    springConfig,
  };
}
