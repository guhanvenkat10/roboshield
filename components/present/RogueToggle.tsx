"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Interactive recreation of the on-stage A/B. Flip the firewall: bypassed, the
 * rover lunges at the person and blares; protected, RoboShield halts it at a
 * gate. Built from primitives so it's live in the deck, not a screenshot.
 */
export function RogueToggle() {
  const [protectedOn, setProtectedOn] = useState(true);

  return (
    <div className="w-full">
      {/* stage */}
      <div
        className="relative h-[230px] w-full overflow-hidden rounded-sm"
        style={{ border: "1px solid var(--ink-faint)", background: "var(--paper-2)" }}
      >
        {/* ground line */}
        <div className="absolute bottom-12 left-0 right-0 h-px" style={{ background: "var(--ink-faint)" }} />

        {/* person on the right */}
        <div className="absolute bottom-12 right-[12%] flex flex-col items-center">
          <div className="h-5 w-5 rounded-full" style={{ background: "var(--ink-dim)" }} />
          <div className="mt-1 h-9 w-7 rounded-t-xl" style={{ background: "var(--ink-dim)" }} />
          <span className="deck-index mt-2">person</span>
        </div>

        {/* rover */}
        <motion.div
          className="absolute bottom-12 left-[10%] flex flex-col items-center"
          animate={{ x: protectedOn ? 0 : "190%" }}
          transition={{ duration: protectedOn ? 0.5 : 1.6, ease: protectedOn ? "easeOut" : "easeIn" }}
        >
          {/* sound blasts when bypassed */}
          {!protectedOn && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute -right-2 top-2 h-8 w-8 rounded-full"
                  style={{ border: "2px solid var(--ember)" }}
                  initial={{ scale: 0.3, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.33 }}
                />
              ))}
            </>
          )}
          <div
            className="relative grid h-12 w-12 place-items-center rounded-lg"
            style={{
              border: `1px solid ${protectedOn ? "var(--ink-faint)" : "var(--ember)"}`,
              background: protectedOn ? "transparent" : "var(--ember-soft)",
            }}
          >
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: protectedOn ? "var(--ink)" : "var(--ember)" }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: protectedOn ? "var(--ink)" : "var(--ember)" }} />
            </div>
          </div>
          <div className="mt-1 flex w-10 justify-between">
            <span className="h-1.5 w-3.5 rounded-full" style={{ background: "var(--ink-faint)" }} />
            <span className="h-1.5 w-3.5 rounded-full" style={{ background: "var(--ink-faint)" }} />
          </div>
        </motion.div>

        {/* the gate appears when protected */}
        <AnimatePresence>
          {protectedOn && (
            <motion.div
              key="gate"
              className="absolute bottom-12 left-[44%] flex h-[120px] flex-col items-center justify-start"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              style={{ transformOrigin: "bottom" }}
            >
              <span
                className="mb-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: "var(--ember)", color: "#140805", fontFamily: "var(--font-mono)" }}
              >
                blocked
              </span>
              <div className="w-px flex-1" style={{ background: "var(--ember)" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* state caption */}
        <div className="absolute left-5 top-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={protectedOn ? "on" : "off"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <div className="deck-kicker" style={{ color: protectedOn ? "var(--ink-dim)" : "var(--ember)" }}>
                {protectedOn ? "firewall on" : "firewall bypassed"}
              </div>
              <div className="mt-1 max-w-xs text-[13px]" style={{ color: "var(--ink-dim)" }}>
                {protectedOn
                  ? "RoboShield sees audio aimed at a person nearby and stops it. The rover never moves."
                  : "The unprotected rover charges the person and blares its speaker. It just obeys."}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* the switch */}
      <button
        onClick={() => setProtectedOn((v) => !v)}
        className="mt-5 flex w-full items-center justify-between rounded-sm px-4 py-3"
        style={{ border: "1px solid var(--ink-faint)" }}
      >
        <span className="deck-kicker">firewall</span>
        <span className="flex items-center gap-3">
          <span className="text-[13px]" style={{ color: protectedOn ? "var(--ink)" : "var(--ink-dim)" }}>
            {protectedOn ? "ON" : "BYPASSED"}
          </span>
          <span
            className="relative h-6 w-12 rounded-full transition-colors"
            style={{ background: protectedOn ? "var(--ink)" : "var(--ember)" }}
          >
            <motion.span
              className="absolute top-1 h-4 w-4 rounded-full"
              style={{ background: "var(--paper)" }}
              animate={{ left: protectedOn ? 26 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </span>
        </span>
      </button>
    </div>
  );
}
