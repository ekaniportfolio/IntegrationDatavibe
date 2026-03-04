/**
 * SPATIAL FLOW FRAMEWORK -- Type Definitions
 * ============================================
 * Core TypeScript types for the Spatial Flow physics engine.
 */

// ─── Spring Configuration ─────────────────────────────────────────────────────

export interface SpringConfig {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

// ─── Tween Configuration ──────────────────────────────────────────────────────

export type EaseCurve = [number, number, number, number];

export interface TweenConfig {
  duration: number;
  ease: EaseCurve | string;
  delay?: number;
}

// ─── Soul Physics ─────────────────────────────────────────────────────────────

export type SoulType = "standard" | "reflex" | "dream" | "chrysalis" | "expansion";

export interface SoulPhysicsMap {
  /** General movement, navigation, morphing */
  standard: SpringConfig;
  /** High energy: snap, click, toggle, mitosis */
  reflex: SpringConfig;
  /** Backgrounds: viscous, dreamy, heavy drift */
  dream: SpringConfig;
  /** Content transmutation (tween-based, not spring) */
  chrysalis: ChrysalisSoulConfig;
  /** Fullscreen portal expansion (PEF/GLS) */
  expansion: SpringConfig;
}

// ─── Chrysalis Shift ──────────────────────────────────────────────────────────

export interface ChrysalisSoulConfig {
  height: {
    duration: number;
    ease: EaseCurve;
  };
  dissolution: {
    duration: number;
    stagger: number;
    ease: EaseCurve;
  };
  emergence: {
    delay: number;
    duration: number;
    stagger: number;
    ease: EaseCurve;
  };
  weaving: {
    /** Percentage of exit completion before height starts (0-1) */
    dissolutionThreshold: number;
    /** Percentage of height completion before entry starts (0-1) */
    emergenceThreshold: number;
  };
}

export interface DirectionalMomentum {
  /** Timings for Large -> Small (Compression) */
  compression: {
    delayReduction: number;
    durationReduction: number;
    staggerReduction: number;
  };
  /** Timings for Small -> Large (Unfolding) */
  unfolding: {
    delayReduction: number;
    durationReduction: number;
    staggerReduction: number;
  };
}

// ─── Speed Control ────────────────────────────────────────────────────────────

export type SpeedPreset = "zen" | "normal" | "rapide" | "ultra";

export interface SpeedFactors {
  zen: number;
  normal: number;
  rapide: number;
  ultra: number;
}

export type SpeedListener = (preset: SpeedPreset) => void;

// ─── Follow Flow (Direction-Aware Navigation) ────────────────────────────────

export type FlowDirection = -1 | 0 | 1;

export interface FollowFlowVariants {
  enter: (direction: FlowDirection) => Record<string, any>;
  center: Record<string, any>;
  exit: (direction: FlowDirection) => Record<string, any>;
}

// ─── Lateral Glide ────────────────────────────────────────────────────────────

export interface KineticItemProps {
  /** Zero-based index of the item in the list */
  index: number;
  /** Content to render */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Horizontal offset distance in pixels (default: 20) */
  xOffset?: number;
  /** Blur amount in pixels during flight (default: 4) */
  blurAmount?: number;
  /** Stagger delay per item in seconds (default: 0.05) */
  staggerDelay?: number;
}

// ─── Sequential Spatial Cascade ───────────────────────────────────────────────

export interface CascadeListProps {
  /** Items to render */
  children: React.ReactNode;
  /** Stagger delay between children in seconds (default: 0.05) */
  stagger?: number;
  /** Delay before the first child appears in seconds (default: 0.2) */
  initialDelay?: number;
  /** Additional CSS class for the container */
  className?: string;
  /** HTML tag for the container (default: "div") */
  as?: "div" | "ul" | "ol" | "section" | "nav";
}

export interface CascadeItemProps {
  /** Content to render */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Vertical entry offset in pixels (default: 20) */
  yOffset?: number;
}

// ─── Chrysalis Container ──────────────────────────────────────────────────────

export interface ChrysalisContainerProps {
  /** Current active view key */
  activeView: string;
  /** Map of view keys to their content render functions */
  views: Record<string, () => React.ReactNode>;
  /** Height for each view in pixels */
  viewHeights: Record<string, number>;
  /** Additional CSS class for the outer container */
  className?: string;
  /** Direction of the transition: "compression" | "unfolding" | "auto" */
  direction?: "compression" | "unfolding" | "auto";
  /** Callback fired when transition completes */
  onTransitionComplete?: () => void;
}

// ─── Ghost DOM Measurement ────────────────────────────────────────────────────

export interface GhostDomResult {
  /** Measured height of the ghost content */
  height: number;
  /** Ref to attach to the ghost container */
  ghostRef: React.RefObject<HTMLDivElement>;
  /** Whether measurement is complete */
  measured: boolean;
}

// ─── Transition Scaling ───────────────────────────────────────────────────────

export interface ScalableTransition {
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  delayChildren?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  ease?: EaseCurve | string;
  type?: "spring" | "tween" | "inertia";
  times?: number[];
  /** Per-property transition overrides */
  [key: string]: any;
}

// ─── Protocol Factory ─────────────────────────────────────────────────────────

export interface ProtocolStates {
  /** State when the element first mounts (before animating in) */
  initial: Record<string, any>;
  /** State when the element is fully visible */
  animate: Record<string, any>;
  /** State when the element exits (optional) */
  exit?: Record<string, any>;
}

export interface ProtocolConfig {
  /** Human-readable protocol name */
  name: string;
  /** Soul physics (SpringConfig or tween config) */
  soul: SpringConfig | Record<string, any>;
  /** The three animation states */
  states: ProtocolStates;
  /** Stagger delay between list items in seconds */
  stagger?: number;
  /** Delay before first item animates */
  initialDelay?: number;
  /** Trigger mode: "mount" or "viewport" */
  trigger?: "mount" | "viewport";
  /** Viewport options */
  viewport?: { once?: boolean; margin?: string };
  /** Per-property transition overrides */
  perProperty?: Record<string, Record<string, any>>;
  /** Direction-aware mode (Lateral Glide style) */
  directional?: boolean;
  /** Horizontal offset for directional mode */
  xOffset?: number;
  /** Allow opacity fades in reduced motion */
  allowOpacityInReduced?: boolean;
}

export interface ProtocolItemProps {
  index?: number;
  children: React.ReactNode;
  className?: string;
  overrideStates?: Partial<ProtocolStates>;
}

export interface ProtocolListProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section" | "nav" | "main" | "article";
  stagger?: number;
  initialDelay?: number;
}