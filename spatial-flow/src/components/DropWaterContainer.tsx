/**
 * SPATIAL FLOW FRAMEWORK -- DropWaterContainer
 * ===============================================
 * Drop Water Protocol [DWP] Component
 *
 * "The avatar does not open a modal. It BECOMES the portal."
 *
 * Five-Act Sequence:
 * Act 1 -- Trigger:          Avatar gravitational drop
 * Act 2 -- Backdrop:         Dark scrim fades in
 * Act 3 -- Blur Curtain:     Background receives blur
 * Act 4 -- Mitosis:          Card keyframe expansion (seed -> pill -> card)
 * Act 5 -- Content Emergence: Form elements stagger-enter
 *
 * @example
 * <DropWaterContainer
 *   trigger={<img src={avatar} className="rounded-full w-10 h-10" />}
 *   cardWidth={400}
 *   cardHeight={500}
 * >
 *   <SignInForm />
 * </DropWaterContainer>
 *
 * @author Michel EKANI
 */

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDropWater } from "../hooks/useDropWater";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DropWaterContainerProps {
  /** The trigger element (avatar, button, etc.) */
  trigger: React.ReactNode;
  /** Content to display inside the expanded card */
  children: React.ReactNode;
  /** Card width in px (default: 400) */
  cardWidth?: number;
  /** Card height in px (default: 500) */
  cardHeight?: number;
  /** Additional CSS class for the trigger wrapper */
  triggerClassName?: string;
  /** Additional CSS class for the card */
  cardClassName?: string;
  /** Callback when expansion completes */
  onComplete?: () => void;
  /** Callback when reverse completes */
  onReversed?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DropWaterContainer({
  trigger,
  children,
  cardWidth = 400,
  cardHeight = 500,
  triggerClassName = "",
  cardClassName = "",
  onComplete,
  onReversed,
}: DropWaterContainerProps) {
  const dw = useDropWater({ cardWidth, cardHeight, onComplete, onReversed });

  return (
    <>
      {/* Act 1: Trigger (Avatar) */}
      <motion.div
        ref={dw.avatarRef as React.RefObject<HTMLDivElement>}
        onClick={dw.trigger}
        className={triggerClassName}
        style={{ cursor: "pointer" }}
        animate={dw.avatarAnimate}
        transition={dw.avatarTransition}
        data-sf-dwp-trigger=""
      >
        {trigger}
      </motion.div>

      {/* Acts 2-5: Portal (Backdrop + Card + Content) */}
      <AnimatePresence>
        {dw.isActive &&
          typeof document !== "undefined" &&
          createPortal(
            <>
              {/* Act 2: Backdrop */}
              <motion.div
                key="dwp-backdrop"
                className="fixed inset-0 bg-black/60"
                style={{ zIndex: 9998 }}
                initial={{ opacity: 0 }}
                animate={dw.backdropAnimate}
                exit={{ opacity: 0 }}
                transition={dw.backdropTransition}
                onClick={dw.reverse}
                data-sf-dwp-backdrop=""
              />

              {/* Act 4: Card (Mitosis) */}
              <motion.div
                key="dwp-card"
                className={`fixed ${cardClassName}`}
                style={{
                  zIndex: 9999,
                  width: cardWidth,
                  maxHeight: cardHeight,
                  top: "50%",
                  left: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                  overflow: "auto",
                }}
                initial={dw.cardInitial}
                animate={dw.cardAnimate}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={dw.cardTransition}
                data-sf-dwp-card=""
              >
                {/* Act 5: Content Emergence */}
                <motion.div
                  transition={dw.contentTransition}
                  initial="hidden"
                  animate="visible"
                >
                  {children}
                </motion.div>
              </motion.div>
            </>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
}
