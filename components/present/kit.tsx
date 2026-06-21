"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Small monospaced label used to tag sections. */
export function Kicker({ children, ember = false }: { children: ReactNode; ember?: boolean }) {
  return <div className={`deck-kicker ${ember ? "deck-kicker--ember" : ""}`}>{children}</div>;
}

/** One line of a headline that masks up from below on mount. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`reveal-mask ${className}`}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.85, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Fade-and-rise for supporting copy / objects. */
export function Rise({
  children,
  delay = 0,
  className = "",
  y = 18,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
