/**
 * SPATIAL FLOW FRAMEWORK -- KineticItem
 * ========================================
 * Lateral Glide [LG] Protocol Component
 *
 * "Reality is not downloaded; it is woven."
 *
 * Even items (0, 2, 4...) slide from LEFT.
 * Odd items (1, 3, 5...) slide from RIGHT.
 * All items have motion blur during flight.
 *
 * @example
 * <div>
 *   {items.map((item, i) => (
 *     <KineticItem key={item.id} index={i}>
 *       <Card>{item.name}</Card>
 *     </KineticItem>
 *   ))}
 * </div>
 */

import { motion } from "motion/react";
import { GLIDE_PHYSICS } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import { safeSpring } from "../core/reduced-motion";
import type { KineticItemProps } from "../core/types";

export function KineticItem({
  index,
  children,
  className = "",
  xOffset = 20,
  blurAmount = 4,
  staggerDelay = 0.05,
}: KineticItemProps) {
  const isEven = index % 2 === 0;
  const xOrigin = isEven ? -xOffset : xOffset;
  const reduced = getReducedMotion();

  return (
    <motion.div
      className={className}
      data-sf-kinetic=""
      initial={{
        opacity: 0,
        x: reduced ? 0 : xOrigin,
        filter: reduced ? "none" : `blur(${blurAmount}px)`,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-10%" }}
      transition={
        reduced
          ? { duration: 0.01 }
          : {
              ...GLIDE_PHYSICS,
              delay: index * staggerDelay,
            }
      }
    >
      {children}
    </motion.div>
  );
}