/**
 * SPATIAL FLOW FRAMEWORK -- Protocol Factory
 * =============================================
 * `createProtocol()` — The Agnostic Protocol Builder.
 *
 * This factory lets any developer create a NEW Spatial Flow protocol
 * without knowing the internals of the pipeline. You define:
 *   - A Soul (spring or tween physics)
 *   - States (initial, animate, exit)
 *   - Optional behaviors (stagger, viewport trigger, blur, direction)
 *
 * The factory returns a complete protocol with:
 *   - `.Item`      — A ready-to-use motion component
 *   - `.List`      — A container with stagger orchestration
 *   - `.variants`  — Raw Motion variants for advanced use
 *   - `.useTransition()` — The underlying hook for full control
 *
 * PHILOSOPHY:
 * "A protocol is a spatial sentence. createProtocol() gives you the grammar."
 *
 * @example
 * // Define a new protocol in 8 lines
 * const SpiralProtocol = createProtocol({
 *   name: "spiral",
 *   soul: STANDARD_SOUL,
 *   states: {
 *     initial: { opacity: 0, rotate: -90, scale: 0.8 },
 *     animate: { opacity: 1, rotate: 0, scale: 1 },
 *     exit:    { opacity: 0, rotate: 90, scale: 0.8 },
 *   },
 *   stagger: 0.06,
 * });
 *
 * // Use it
 * <SpiralProtocol.List>
 *   {items.map((item, i) => (
 *     <SpiralProtocol.Item key={item.id} index={i}>
 *       <Card>{item.name}</Card>
 *     </SpiralProtocol.Item>
 *   ))}
 * </SpiralProtocol.List>
 *
 * @author Michel EKANI
 */

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SpringConfig, EaseCurve } from "./types";
import { getReducedMotion, REDUCED_TRANSITION } from "./reduced-motion";
import { scaleTransition, scaledSpring } from "./scale-transition";
import { getSpeedScale } from "./spatial-speed";
import { useSpatialTransition } from "../hooks/useSpatialTransition";

// ─── Protocol Definition Types ───────────────────────────────────────────────

export interface ProtocolStates {
  /** State when the element first mounts (before animating in) */
  initial: Record<string, any>;
  /** State when the element is fully visible */
  animate: Record<string, any>;
  /** State when the element exits (optional) */
  exit?: Record<string, any>;
}

export interface ProtocolConfig {
  /** Human-readable protocol name (used for data attributes & debugging) */
  name: string;

  /**
   * The Soul that governs this protocol's physics.
   * Can be:
   * - A SpringConfig (e.g., STANDARD_SOUL, REFLEX_SOUL)
   * - A SoulType string ("standard" | "reflex" | "dream" | "expansion")
   * - A custom tween config { duration: number, ease: EaseCurve }
   */
  soul: SpringConfig | Record<string, any>;

  /** The three animation states */
  states: ProtocolStates;

  /** Stagger delay between list items in seconds (default: 0) */
  stagger?: number;

  /** Delay before first item animates in seconds (default: 0) */
  initialDelay?: number;

  /**
   * Trigger mode:
   * - "mount" — animate on first mount (default)
   * - "viewport" — animate when scrolled into view
   */
  trigger?: "mount" | "viewport";

  /** Viewport options when trigger is "viewport" */
  viewport?: {
    /** Only trigger once (default: true) */
    once?: boolean;
    /** IntersectionObserver rootMargin (default: "-10%") */
    margin?: string;
  };

  /**
   * Per-property transition overrides.
   * Example: { opacity: { duration: 0.2, ease: "easeOut" } }
   * These are merged on top of the Soul transition.
   */
  perProperty?: Record<string, Record<string, any>>;

  /**
   * Direction-aware mode: if true, the `index` prop determines
   * whether the item enters from left (even) or right (odd),
   * like the Lateral Glide protocol.
   */
  directional?: boolean;

  /** Horizontal offset for directional mode (default: 20px) */
  xOffset?: number;

  /** Allow opacity fades in reduced motion (default: true) */
  allowOpacityInReduced?: boolean;
}

// ─── Protocol Output Types ───────────────────────────────────────────────────

export interface ProtocolItemProps {
  /** Zero-based index (used for stagger timing and directional offset) */
  index?: number;
  /** Content to render */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Override the animation states for this specific item */
  overrideStates?: Partial<ProtocolStates>;
}

export interface ProtocolListProps {
  /** Items to render */
  children: React.ReactNode;
  /** Additional CSS class for the container */
  className?: string;
  /** HTML tag for the container (default: "div") */
  as?: "div" | "ul" | "ol" | "section" | "nav" | "main" | "article";
  /** Override stagger for this specific list */
  stagger?: number;
  /** Override initial delay for this specific list */
  initialDelay?: number;
}

export interface Protocol {
  /** The protocol name */
  name: string;
  /** Ready-to-use item component */
  Item: React.FC<ProtocolItemProps>;
  /** Container component with stagger orchestration */
  List: React.FC<ProtocolListProps>;
  /** Raw Motion variants for advanced/custom use */
  variants: {
    hidden: (index?: number) => Record<string, any>;
    visible: (index?: number) => Record<string, any>;
    exit: (index?: number) => Record<string, any>;
  };
  /**
   * Use the protocol's transition in your own component.
   * Returns the same interface as useSpatialTransition.
   */
  useTransition: () => ReturnType<typeof useSpatialTransition>;
  /** The original config (for inspection/debugging) */
  config: ProtocolConfig;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSpring(soul: any): soul is SpringConfig {
  return soul?.type === "spring" && typeof soul.stiffness === "number";
}

function buildTransition(
  soul: SpringConfig | Record<string, any>,
  index: number,
  stagger: number,
  perProperty?: Record<string, Record<string, any>>
): Record<string, any> {
  const speedScale = getSpeedScale();

  let base: Record<string, any>;
  if (isSpring(soul)) {
    base = scaledSpring(soul.stiffness, soul.damping, soul.mass);
  } else {
    base = scaleTransition({ ...soul });
  }

  // Add stagger delay
  if (stagger > 0 && index > 0) {
    base.delay = (base.delay || 0) + index * stagger * speedScale;
  }

  // Merge per-property overrides
  if (perProperty) {
    for (const [prop, propTransition] of Object.entries(perProperty)) {
      base[prop] = scaleTransition(propTransition);
    }
  }

  return base;
}

function stripSpatialForReduced(
  state: Record<string, any>,
  allowOpacity: boolean
): Record<string, any> {
  const SPATIAL = new Set([
    "x", "y", "z", "rotate", "rotateX", "rotateY", "rotateZ",
    "scale", "scaleX", "scaleY", "skewX", "skewY",
    "filter", "clipPath",
  ]);
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(state)) {
    if (SPATIAL.has(k)) continue;
    result[k] = v;
  }
  return result;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProtocol(config: ProtocolConfig): Protocol {
  const {
    name,
    soul,
    states,
    stagger = 0,
    initialDelay = 0,
    trigger = "mount",
    viewport = { once: true, margin: "-10%" },
    perProperty,
    directional = false,
    xOffset = 20,
    allowOpacityInReduced = true,
  } = config;

  // ── Variants Factory ────────────────────────────────────────────────────

  const variants = {
    hidden: (index = 0): Record<string, any> => {
      const reduced = getReducedMotion();
      let state = { ...states.initial };

      // Apply directional offset
      if (directional) {
        const isEven = index % 2 === 0;
        state.x = (state.x || 0) + (isEven ? -xOffset : xOffset);
      }

      return reduced
        ? stripSpatialForReduced(state, allowOpacityInReduced)
        : state;
    },

    visible: (index = 0): Record<string, any> => {
      const reduced = getReducedMotion();
      const state = { ...states.animate };

      return reduced
        ? stripSpatialForReduced(state, allowOpacityInReduced)
        : state;
    },

    exit: (index = 0): Record<string, any> => {
      const reduced = getReducedMotion();
      const state = { ...(states.exit || states.initial) };

      if (directional) {
        const isEven = index % 2 === 0;
        state.x = (state.x || 0) + (isEven ? -xOffset : xOffset);
      }

      return reduced
        ? stripSpatialForReduced(state, allowOpacityInReduced)
        : state;
    },
  };

  // ── Item Component ──────────────────────────────────────────────────────

  const Item: React.FC<ProtocolItemProps> = ({
    index = 0,
    children,
    className = "",
    overrideStates,
  }) => {
    const reduced = getReducedMotion();
    const resolvedStates = overrideStates
      ? { ...states, ...overrideStates }
      : states;

    // Build initial state
    let initialState = { ...resolvedStates.initial };
    if (directional) {
      const isEven = index % 2 === 0;
      initialState.x = (initialState.x || 0) + (isEven ? -xOffset : xOffset);
    }

    // Build animate state
    const animateState = { ...resolvedStates.animate };

    // Build transition
    const transition = reduced
      ? allowOpacityInReduced
        ? { ...REDUCED_TRANSITION, opacity: { duration: 0.15, ease: "easeOut" } }
        : { ...REDUCED_TRANSITION }
      : buildTransition(soul, index, stagger, perProperty);

    // Add initial delay
    if (!reduced && initialDelay > 0) {
      const speedScale = getSpeedScale();
      transition.delay = (transition.delay || 0) + initialDelay * speedScale;
    }

    // Sanitize for reduced motion
    const safeInitial = reduced
      ? stripSpatialForReduced(initialState, allowOpacityInReduced)
      : initialState;
    const safeAnimate = reduced
      ? stripSpatialForReduced(animateState, allowOpacityInReduced)
      : animateState;

    const motionProps: Record<string, any> = {
      className,
      initial: safeInitial,
      animate: undefined,
      transition,
      [`data-sf-${name}`]: "",
      [`data-sf-index`]: index,
    };

    // Viewport trigger vs mount trigger
    if (trigger === "viewport") {
      motionProps.whileInView = safeAnimate;
      motionProps.viewport = {
        once: viewport.once ?? true,
        margin: viewport.margin ?? "-10%",
      };
    } else {
      motionProps.animate = safeAnimate;
    }

    return React.createElement(motion.div, motionProps, children);
  };

  Item.displayName = `SpatialFlow.${name}.Item`;

  // ── List Component ──────────────────────────────────────────────────────

  const List: React.FC<ProtocolListProps> = ({
    children,
    className = "",
    as = "div",
    stagger: listStagger,
    initialDelay: listInitialDelay,
  }) => {
    const reduced = getReducedMotion();
    const speedScale = getSpeedScale();
    const resolvedStagger = listStagger ?? stagger;
    const resolvedDelay = listInitialDelay ?? initialDelay;

    const containerVariants = useMemo(
      () => ({
        hidden: { opacity: reduced ? 1 : 0 },
        visible: {
          opacity: 1,
          transition: reduced
            ? { duration: 0 }
            : {
                staggerChildren: resolvedStagger * speedScale,
                delayChildren: resolvedDelay * speedScale,
              },
        },
      }),
      [reduced, speedScale, resolvedStagger, resolvedDelay]
    );

    const itemVariants = useMemo(
      () => ({
        hidden: (i: number = 0) => {
          let state = { ...states.initial };
          if (directional) {
            state.x = (state.x || 0) + (i % 2 === 0 ? -xOffset : xOffset);
          }
          return reduced
            ? stripSpatialForReduced(state, allowOpacityInReduced)
            : state;
        },
        visible: () => {
          const state = { ...states.animate };
          let transition: Record<string, any>;
          if (isSpring(soul)) {
            transition = scaledSpring(soul.stiffness, soul.damping, soul.mass);
          } else {
            transition = scaleTransition({ ...soul });
          }
          if (perProperty) {
            for (const [prop, pt] of Object.entries(perProperty)) {
              transition[prop] = scaleTransition(pt);
            }
          }
          return reduced
            ? { ...stripSpatialForReduced(state, allowOpacityInReduced), transition: { duration: 0 } }
            : { ...state, transition };
        },
      }),
      [reduced, speedScale]
    );

    const Component = motion[as] as any;

    // Wrap children to inject variants
    const wrappedChildren = React.Children.map(children, (child, i) => {
      if (!React.isValidElement(child)) return child;

      return React.createElement(
        motion.div,
        {
          custom: i,
          variants: {
            hidden: itemVariants.hidden(i),
            visible: itemVariants.visible(),
          },
          [`data-sf-${name}`]: "",
          [`data-sf-index`]: i,
          className: (child.props as any)?.className || "",
        },
        child
      );
    });

    return React.createElement(
      Component,
      {
        variants: containerVariants,
        initial: "hidden",
        animate: trigger === "viewport" ? undefined : "visible",
        whileInView: trigger === "viewport" ? "visible" : undefined,
        viewport: trigger === "viewport"
          ? { once: viewport.once ?? true, margin: viewport.margin ?? "-10%" }
          : undefined,
        className,
        [`data-sf-${name}-list`]: "",
      },
      wrappedChildren
    );
  };

  List.displayName = `SpatialFlow.${name}.List`;

  // ── useTransition Hook ──────────────────────────────────────────────────

  const useProtocolTransition = () =>
    useSpatialTransition(soul, {
      perProperty,
      stagger,
      delayChildren: initialDelay,
      allowOpacityInReduced,
    });

  // ── Return Protocol ─────────────────────────────────────────────────────

  return {
    name,
    Item,
    List,
    variants,
    useTransition: useProtocolTransition,
    config,
  };
}
