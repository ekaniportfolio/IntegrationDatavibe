/**
 * SPATIAL FLOW FRAMEWORK -- usePortalExpansion Hook
 * ===================================================
 * Portal Expansion Flow [PEF] Protocol.
 *
 * "Inline content expands to fullscreen from its exact position."
 *
 * Architecture:
 * 1. Rect Capture: getBoundingClientRect() captures source element position.
 * 2. Portal: createPortal(content, document.body) escapes overflow/transform.
 * 3. Animation: Spring from sourceRect to fullscreen viewport.
 * 4. Reverse: Same spring animates back to captured sourceRect.
 *
 * @example
 * function ExpandableCard({ children, expandedContent }) {
 *   const portal = usePortalExpansion();
 *
 *   return (
 *     <>
 *       <div
 *         ref={portal.sourceRef}
 *         onClick={portal.expand}
 *         style={{ cursor: "pointer" }}
 *       >
 *         {children}
 *       </div>
 *
 *       {portal.isOpen && createPortal(
 *         <motion.div
 *           style={portal.portalStyle}
 *           animate={portal.isExpanded ? portal.expandedStyle : portal.collapsedStyle}
 *           transition={portal.transition}
 *           onAnimationComplete={() => {
 *             if (!portal.isExpanded) portal.close();
 *           }}
 *         >
 *           <button onClick={portal.collapse}>Close</button>
 *           {expandedContent}
 *         </motion.div>,
 *         document.body
 *       )}
 *     </>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import { useState, useRef, useCallback, useMemo } from "react";
import { EXPANSION_SOUL } from "../core/soul-constants";
import { scaledSpring } from "../core/scale-transition";
import { getReducedMotion, REDUCED_TRANSITION } from "../core/reduced-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SourceRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface UsePortalExpansionOptions {
  /** Custom spring physics (default: EXPANSION_SOUL) */
  spring?: { stiffness: number; damping: number; mass: number };
  /** Border radius of the source element in px (default: 12) */
  borderRadius?: number;
  /** Enable rotation to landscape (GLS extension, default: false) */
  rotateToLandscape?: boolean;
  /** Callback when fully expanded */
  onExpanded?: () => void;
  /** Callback when fully collapsed */
  onCollapsed?: () => void;
}

interface UsePortalExpansionReturn {
  /** Ref to attach to the source (trigger) element */
  sourceRef: React.RefObject<HTMLElement | null>;
  /** Whether the portal is mounted in the DOM */
  isOpen: boolean;
  /** Whether the portal is animating towards fullscreen */
  isExpanded: boolean;
  /** Trigger expansion */
  expand: () => void;
  /** Trigger collapse (animates back to source) */
  collapse: () => void;
  /** Remove portal from DOM (call after collapse animation completes) */
  close: () => void;
  /** Styles for the collapsed state (source rect) */
  collapsedStyle: Record<string, any>;
  /** Styles for the expanded state (fullscreen) */
  expandedStyle: Record<string, any>;
  /** Initial portal style (position: fixed, pointer-events, etc.) */
  portalStyle: React.CSSProperties;
  /** Ready-to-use transition */
  transition: Record<string, any>;
  /** Captured source rect (for debugging) */
  sourceRect: SourceRect | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePortalExpansion(
  options: UsePortalExpansionOptions = {}
): UsePortalExpansionReturn {
  const {
    spring = EXPANSION_SOUL,
    borderRadius = 12,
    rotateToLandscape = false,
    onExpanded,
    onCollapsed,
  } = options;

  const sourceRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sourceRect, setSourceRect] = useState<SourceRect | null>(null);

  // Capture source rect and expand
  const expand = useCallback(() => {
    if (!sourceRef.current) return;
    const rect = sourceRef.current.getBoundingClientRect();
    const captured: SourceRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
    setSourceRect(captured);
    setIsOpen(true);

    // Micro-delay to ensure portal is mounted before animating
    requestAnimationFrame(() => {
      setIsExpanded(true);
    });
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsExpanded(false);
    setSourceRect(null);
    onCollapsed?.();
  }, [onCollapsed]);

  // Collapsed state = source rect position
  const collapsedStyle = useMemo(() => {
    if (!sourceRect) return {};
    return {
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
      borderRadius,
      ...(rotateToLandscape && { rotate: 0 }),
    };
  }, [sourceRect, borderRadius, rotateToLandscape]);

  // Expanded state = fullscreen
  const expandedStyle = useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
    const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
    return {
      top: 0,
      left: 0,
      width: vw,
      height: vh,
      borderRadius: 0,
      ...(rotateToLandscape && { rotate: 90 }),
    };
  }, [rotateToLandscape]);

  // Portal wrapper style
  const portalStyle: React.CSSProperties = useMemo(
    () => ({
      position: "fixed",
      zIndex: 9999,
      overflow: "hidden",
      willChange: "transform",
    }),
    []
  );

  // Transition
  const transition = useMemo(() => {
    if (getReducedMotion()) {
      return { ...REDUCED_TRANSITION };
    }
    return scaledSpring(spring.stiffness, spring.damping, spring.mass);
  }, [spring]);

  return {
    sourceRef,
    isOpen,
    isExpanded,
    expand,
    collapse,
    close,
    collapsedStyle,
    expandedStyle,
    portalStyle,
    transition,
    sourceRect,
  };
}
