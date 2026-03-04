/**
 * SPATIAL FLOW FRAMEWORK -- CascadeList
 * ========================================
 * Sequential Spatial Cascade [SSC] Protocol Component
 *
 * "Nothing appears instantly in nature."
 *
 * Content arrives in timed waves to guide the eye through
 * the information hierarchy. Replaces the "Data Flashbang"
 * of instant rendering.
 *
 * @example
 * <CascadeList stagger={0.05} initialDelay={0.3}>
 *   <CascadeItem><Card>Item 1</Card></CascadeItem>
 *   <CascadeItem><Card>Item 2</Card></CascadeItem>
 *   <CascadeItem><Card>Item 3</Card></CascadeItem>
 * </CascadeList>
 *
 * // Or with an array:
 * <CascadeList>
 *   {items.map(item => (
 *     <CascadeItem key={item.id}><Card>{item.name}</Card></CascadeItem>
 *   ))}
 * </CascadeList>
 */

import { motion } from "motion/react";
import { STANDARD_SOUL, SSC_TIMING } from "../core/soul-constants";
import { getReducedMotion } from "../core/reduced-motion";
import type { CascadeListProps, CascadeItemProps } from "../core/types";

// ─── Container Variants ──────────────────────────────────────────────────────

const createListVariants = (stagger: number, initialDelay: number, reduced: boolean) => ({
  hidden: { opacity: reduced ? 1 : 0 },
  visible: {
    opacity: 1,
    transition: reduced
      ? { duration: 0 }
      : {
          staggerChildren: stagger,
          delayChildren: initialDelay,
        },
  },
});

// ─── Item Variants ───────────────────────────────────────────────────────────

const createItemVariants = (yOffset: number, reduced: boolean) => ({
  hidden: {
    opacity: reduced ? 1 : 0,
    y: reduced ? 0 : yOffset,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: reduced
      ? { duration: 0 }
      : {
          type: "spring",
          stiffness: STANDARD_SOUL.stiffness,
          damping: STANDARD_SOUL.damping,
          mass: STANDARD_SOUL.mass,
        },
  },
});

// ─── Components ──────────────────────────────────────────────────────────────

export function CascadeList({
  children,
  stagger = SSC_TIMING.stagger,
  initialDelay = 0.2,
  className = "",
  as = "div",
}: CascadeListProps) {
  const Component = motion[as] as any;
  const reduced = getReducedMotion();
  const variants = createListVariants(stagger, initialDelay, reduced);

  return (
    <Component
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
      data-sf-cascade=""
    >
      {children}
    </Component>
  );
}

export function CascadeItem({
  children,
  className = "",
  yOffset = 20,
}: CascadeItemProps) {
  const reduced = getReducedMotion();
  const variants = createItemVariants(yOffset, reduced);

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}