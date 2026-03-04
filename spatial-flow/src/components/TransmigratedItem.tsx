/**
 * SPATIAL FLOW FRAMEWORK -- TransmigratedItem
 * ==============================================
 * Transmigrated Astral Flow [TAF] Protocol Component
 *
 * "The element does not die. It transmigrates."
 *
 * Elements physically travel between DOM positions via `layoutId`.
 * This component wraps the useTransmigration hook with a simple
 * source/target API and built-in Layout Projection Shield support.
 *
 * CRITICAL: Only ONE of source or target should be mounted at a time
 * (Single Soul Rule). Violating this causes Quantum Flicker.
 *
 * @example
 * function App() {
 *   const [expanded, setExpanded] = useState(false);
 *
 *   return (
 *     <>
 *       {!expanded && (
 *         <TransmigratedItem id="product-card" role="source">
 *           <Card onClick={() => setExpanded(true)}>
 *             <img src="..." />
 *           </Card>
 *         </TransmigratedItem>
 *       )}
 *
 *       {expanded && (
 *         <TransmigratedItem id="product-card" role="target">
 *           <FullView onClick={() => setExpanded(false)}>
 *             <img src="..." />
 *             <p>Details...</p>
 *           </FullView>
 *         </TransmigratedItem>
 *       )}
 *     </>
 *   );
 * }
 *
 * @author Michel EKANI
 */

import React from "react";
import { motion } from "motion/react";
import { useTransmigration } from "../hooks/useTransmigration";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TransmigratedItemProps {
  /** Unique transmigration ID (shared between source and target) */
  id: string;
  /** Whether this is the source or target position */
  role: "source" | "target";
  /** Content to render */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Custom spring physics */
  spring?: { stiffness: number; damping: number; mass: number };
  /** Responsive namespace suffix */
  namespace?: string;
  /** Per-property transition overrides */
  perProperty?: Record<string, Record<string, any>>;
  /** HTML tag to render (default: "div") */
  as?: "div" | "section" | "article" | "li" | "span";
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TransmigratedItem({
  id,
  role,
  children,
  className = "",
  spring,
  namespace,
  perProperty,
  as = "div",
  style,
  onClick,
}: TransmigratedItemProps) {
  const tx = useTransmigration(id, { spring, namespace, perProperty });

  const props = role === "source" ? tx.source : tx.target;
  const Component = motion[as] as any;

  return (
    <Component
      {...props}
      className={className}
      style={style}
      onClick={onClick}
      data-sf-taf-role={role}
    >
      {children}
    </Component>
  );
}
