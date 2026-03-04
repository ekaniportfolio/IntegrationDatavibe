/**
 * SPATIAL FLOW FRAMEWORK -- useDropWater Hook
 * ==============================================
 * Drop Water Protocol [DWP] — Complete 5-Act Sequence.
 *
 * "The avatar does not open a modal. It BECOMES the portal."
 *
 * Five-Act Sequence:
 * Act 1 — Trigger (T=0ms):     Avatar gravitational drop + circle lateral glide
 * Act 2 — Backdrop (T=0-350ms):  Dark scrim fades in
 * Act 3 — Blur Curtain (T=350ms):  Background receives blur filter
 * Act 4 — Mitosis (T=350-750ms):  Auth card keyframe expansion (seed → pill → card)
 * Act 5 — Content Emergence (T=500-1200ms):  Form elements stagger-enter
 *
 * Reverse: All five acts in reverse, simultaneously batched.
 *
 * @example
 * function AvatarAuth() {
 *   const dw = useDropWater();
 *
 *   return (
 *     <>
 *       <div ref={dw.avatarRef} onClick={dw.trigger}>
 *         <img src={avatar} alt="User" className="rounded-full" />
 *       </div>
 *
 *       {dw.isActive && (
 *         <Portal>
 *           <motion.div
 *             className="fixed inset-0 bg-black/60"
 *             animate={dw.backdropAnimate}
 *             transition={dw.backdropTransition}
 *             onClick={dw.reverse}
 *           />
 *           <motion.div
 *             className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
 *             animate={dw.cardAnimate}
 *             initial={dw.cardInitial}
 *             transition={dw.cardTransition}
 *           >
 *             <AuthForm />
 *           </motion.div>
 *         </Portal>
 *       )}
 *     </>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useRef, useCallback, useMemo } from "react";
import {
  DROP_WATER_TIMING,
  REFLEX_SOUL,
  SF_EASE,
  STANDARD_SOUL,
} from "../core/soul-constants";
import { scaleTransition, scaledSpring } from "../core/scale-transition";
import { getFlowDuration } from "../core/spatial-speed";
import { getReducedMotion, REDUCED_TRANSITION } from "../core/reduced-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SourcePosition {
  x: number;
  y: number;
  size: number;
}

interface UseDropWaterOptions {
  /** Card width in px (default: 400) */
  cardWidth?: number;
  /** Card height in px (default: 500) */
  cardHeight?: number;
  /** Callback when sequence completes */
  onComplete?: () => void;
  /** Callback when reverse completes */
  onReversed?: () => void;
}

type DWPhase = "idle" | "dropping" | "expanding" | "open" | "reversing";

// ─── Mitosis Keyframes ────────────────────────────────────────────────────────

const MITOSIS_KEYFRAMES = {
  seed: { scale: 0.05, borderRadius: "50%", opacity: 0 },
  pill: { scale: 0.3, borderRadius: "24px", opacity: 0.6 },
  card: { scale: 1, borderRadius: "16px", opacity: 1 },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDropWater(options: UseDropWaterOptions = {}) {
  const {
    cardWidth = 400,
    cardHeight = 500,
    onComplete,
    onReversed,
  } = options;

  const avatarRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<DWPhase>("idle");
  const [sourcePos, setSourcePos] = useState<SourcePosition | null>(null);
  const reduced = getReducedMotion();

  // ── Trigger: Act 1 ──────────────────────────────────────────────────────

  const trigger = useCallback(() => {
    if (phase !== "idle") return;
    if (!avatarRef.current) return;

    const rect = avatarRef.current.getBoundingClientRect();
    setSourcePos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      size: rect.width,
    });

    if (reduced) {
      setPhase("open");
      onComplete?.();
      return;
    }

    setPhase("dropping");

    // Act 4 start (Mitosis)
    setTimeout(() => {
      setPhase("expanding");
    }, getFlowDuration(DROP_WATER_TIMING.avatarDrop) * 1000);

    // Act 5 complete
    setTimeout(() => {
      setPhase("open");
      onComplete?.();
    }, getFlowDuration(DROP_WATER_TIMING.avatarDrop + DROP_WATER_TIMING.mitosis) * 1000);
  }, [phase, reduced, onComplete]);

  // ── Reverse: All acts simultaneously ────────────────────────────────────

  const reverse = useCallback(() => {
    if (phase === "idle" || phase === "reversing") return;

    if (reduced) {
      setPhase("idle");
      setSourcePos(null);
      onReversed?.();
      return;
    }

    setPhase("reversing");

    setTimeout(() => {
      setPhase("idle");
      setSourcePos(null);
      onReversed?.();
    }, getFlowDuration(DROP_WATER_TIMING.mitosis + DROP_WATER_TIMING.blurCurtain) * 1000);
  }, [phase, reduced, onReversed]);

  // ── Derived States ──────────────────────────────────────────────────────

  const isActive = phase !== "idle";
  const isOpen = phase === "open";
  const isReversing = phase === "reversing";

  // ── Avatar Animation ────────────────────────────────────────────────────

  const avatarAnimate = useMemo(() => {
    if (phase === "idle" || reduced) return {};
    if (phase === "reversing") return { y: 0, opacity: 1 };
    // Gravitational drop
    const vhCenter = typeof window !== "undefined" ? window.innerHeight / 2 : 540;
    const currentY = sourcePos?.y ?? 0;
    return {
      y: vhCenter - currentY,
      opacity: 0,
    };
  }, [phase, sourcePos, reduced]);

  const avatarTransition = useMemo(() => {
    if (reduced) return { ...REDUCED_TRANSITION };
    return scaleTransition({
      y: {
        duration: DROP_WATER_TIMING.avatarDrop,
        ease: [0.55, 0, 1, 0.45], // Accelerating (gravity)
      },
      opacity: { duration: 0.15, ease: "easeOut" },
    });
  }, [reduced]);

  // ── Backdrop Animation ──────────────────────────────────────────────────

  const backdropAnimate = useMemo(() => {
    if (isReversing) return { opacity: 0 };
    if (isActive) return { opacity: 1 };
    return { opacity: 0 };
  }, [isActive, isReversing]);

  const backdropTransition = useMemo(() => {
    if (reduced) return { ...REDUCED_TRANSITION };
    return scaleTransition({
      duration: DROP_WATER_TIMING.blurCurtain,
      ease: SF_EASE,
    });
  }, [reduced]);

  // ── Blur Curtain (for the app background) ───────────────────────────────

  const blurAnimate = useMemo(() => {
    if (isReversing) return { filter: "blur(0px)" };
    if (isActive && (phase === "expanding" || phase === "open"))
      return { filter: "blur(8px)" };
    return { filter: "blur(0px)" };
  }, [phase, isActive, isReversing]);

  const blurTransition = useMemo(() => {
    if (reduced) return { ...REDUCED_TRANSITION };
    return scaleTransition({
      duration: DROP_WATER_TIMING.blurCurtain,
      ease: SF_EASE,
    });
  }, [reduced]);

  // ── Card (Mitosis) Animation ────────────────────────────────────────────

  const cardInitial = useMemo(() => {
    if (!sourcePos) return MITOSIS_KEYFRAMES.seed;
    return {
      ...MITOSIS_KEYFRAMES.seed,
      x: sourcePos.x - cardWidth / 2,
      y: sourcePos.y - cardHeight / 2,
    };
  }, [sourcePos, cardWidth, cardHeight]);

  const cardAnimate = useMemo(() => {
    if (isReversing) return { ...MITOSIS_KEYFRAMES.seed, opacity: 0 };
    if (phase === "expanding" || phase === "open")
      return MITOSIS_KEYFRAMES.card;
    return MITOSIS_KEYFRAMES.pill;
  }, [phase, isReversing]);

  const cardTransition = useMemo(() => {
    if (reduced) return { ...REDUCED_TRANSITION };

    if (isReversing) {
      return scaleTransition({
        duration: DROP_WATER_TIMING.mitosis,
        ease: DROP_WATER_TIMING.storeEase,
      });
    }

    return scaleTransition({
      scale: {
        duration: DROP_WATER_TIMING.mitosis,
        ease: DROP_WATER_TIMING.storeEase,
        times: [0, 0.4, 1], // seed → pill → card
      },
      borderRadius: {
        duration: DROP_WATER_TIMING.mitosis,
        ease: SF_EASE,
      },
      opacity: {
        duration: DROP_WATER_TIMING.mitosis * 0.5,
        ease: "easeOut",
      },
    });
  }, [reduced, isReversing]);

  // ── Content Emergence (for children stagger) ────────────────────────────

  const contentTransition = useMemo(() => {
    if (reduced) return { ...REDUCED_TRANSITION };
    return scaleTransition({
      staggerChildren: 0.08,
      delayChildren: isReversing ? 0 : 0.15,
    });
  }, [reduced, isReversing]);

  const contentItemTransition = useMemo(() => {
    if (reduced) return { ...REDUCED_TRANSITION };
    return scaledSpring(STANDARD_SOUL.stiffness, STANDARD_SOUL.damping, STANDARD_SOUL.mass);
  }, [reduced]);

  return {
    // Refs
    avatarRef,

    // State
    phase,
    isActive,
    isOpen,
    isReversing,
    sourcePos,

    // Actions
    trigger,
    reverse,

    // Avatar
    avatarAnimate,
    avatarTransition,

    // Backdrop
    backdropAnimate,
    backdropTransition,

    // Blur Curtain
    blurAnimate,
    blurTransition,

    // Card (Mitosis)
    cardInitial,
    cardAnimate,
    cardTransition,

    // Content Emergence
    contentTransition,
    contentItemTransition,

    // Mitosis keyframes (for custom implementations)
    mitosisKeyframes: MITOSIS_KEYFRAMES,
  };
}
