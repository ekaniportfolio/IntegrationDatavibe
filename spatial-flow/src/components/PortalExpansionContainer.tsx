/**
 * SPATIAL FLOW FRAMEWORK -- PortalExpansionContainer
 * ====================================================
 * Portal Expansion Flow [PEF] Protocol Component
 *
 * "Inline content expands to fullscreen from its exact position."
 *
 * Architecture:
 * 1. Rect Capture: Source element position is captured on click.
 * 2. Portal: Content escapes overflow/transform via createPortal.
 * 3. Animation: Spring from sourceRect to fullscreen viewport.
 * 4. Reverse: Same spring animates back to captured sourceRect.
 *
 * @example
 * <PortalExpansionContainer
 *   trigger={<Card>Click to expand</Card>}
 *   borderRadius={16}
 * >
 *   <FullScreenView />
 * </PortalExpansionContainer>
 *
 * @author Michel EKANI
 */

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { usePortalExpansion } from "../hooks/usePortalExpansion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortalExpansionContainerProps {
  /** The inline trigger element */
  trigger: React.ReactNode;
  /** The fullscreen expanded content */
  children: React.ReactNode;
  /** Border radius of the source element in px (default: 12) */
  borderRadius?: number;
  /** Custom spring physics */
  spring?: { stiffness: number; damping: number; mass: number };
  /** Enable rotation to landscape (default: false) */
  rotateToLandscape?: boolean;
  /** Additional CSS class for the trigger wrapper */
  triggerClassName?: string;
  /** Additional CSS class for the expanded portal */
  portalClassName?: string;
  /** Callback when fully expanded */
  onExpanded?: () => void;
  /** Callback when fully collapsed */
  onCollapsed?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PortalExpansionContainer({
  trigger,
  children,
  borderRadius = 12,
  spring,
  rotateToLandscape = false,
  triggerClassName = "",
  portalClassName = "",
  onExpanded,
  onCollapsed,
}: PortalExpansionContainerProps) {
  const portal = usePortalExpansion({
    spring,
    borderRadius,
    rotateToLandscape,
    onExpanded,
    onCollapsed,
  });

  return (
    <>
      {/* Source (Trigger) */}
      <div
        ref={portal.sourceRef as React.RefObject<HTMLDivElement>}
        onClick={portal.expand}
        className={triggerClassName}
        style={{ cursor: "pointer" }}
        data-sf-pef-trigger=""
      >
        {trigger}
      </div>

      {/* Expanded Portal */}
      <AnimatePresence>
        {portal.isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <motion.div
              key="pef-portal"
              className={portalClassName}
              style={portal.portalStyle}
              initial={portal.collapsedStyle}
              animate={
                portal.isExpanded
                  ? portal.expandedStyle
                  : portal.collapsedStyle
              }
              exit={portal.collapsedStyle}
              transition={portal.transition}
              onAnimationComplete={() => {
                if (!portal.isExpanded) portal.close();
                if (portal.isExpanded) onExpanded?.();
              }}
              data-sf-pef-portal=""
            >
              {/* Close control */}
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {children}
                <button
                  onClick={portal.collapse}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                  aria-label="Close expanded view"
                  data-sf-pef-close=""
                >
                  &times;
                </button>
              </div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
}
