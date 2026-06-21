"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * The signature motif: a command travels toward the robot and RoboShield
 * intercepts it at a gate. Runs on a loop on its own, and each gate reacts to
 * hover so the presenter can pause and point. No screenshots, fully native.
 */

const GATES = [
  { n: "Received", q: "intercept the command" },
  { n: "Normality", q: "is this normal behavior?" },
  { n: "Permission", q: "is it approved?" },
  { n: "Physical DLP", q: "who is nearby right now?" },
  { n: "AI Sanitizer", q: "is an AI driving this?" },
  { n: "Trust Zone", q: "where is the device?" },
  { n: "Decision", q: "allow, block, rewrite" },
];
const BLOCK = 3; // Physical DLP catches the audio-near-person attack.
const BLOCK_LEFT = ((BLOCK + 0.5) / GATES.length) * 100;

export function GateFlow() {
  const [cycle, setCycle] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), 4600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full select-none">
      {/* endpoints */}
      <div className="mb-3 flex items-center justify-between">
        <span className="deck-kicker">command</span>
        <span className="deck-kicker">robot hardware</span>
      </div>

      {/* track */}
      <div className="relative h-[180px] w-full">
        {/* baseline */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--ink-faint)]" />

        {/* traveling command token */}
        <motion.div
          key={`tok-${cycle}`}
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          initial={{ left: "2%", opacity: 1 }}
          animate={{ left: ["2%", `${BLOCK_LEFT}%`, `${BLOCK_LEFT}%`], opacity: [1, 1, 1, 0] }}
          transition={{ duration: 2.6, times: [0, 0.82, 0.9, 0.98], ease: "easeOut" }}
        >
          <span
            className="whitespace-nowrap rounded-full border px-3 py-1 text-[11px]"
            style={{ borderColor: "var(--ink-faint)", background: "var(--paper-2)", fontFamily: "var(--font-mono)" }}
          >
            move toward person + play audio
          </span>
        </motion.div>

        {/* block burst */}
        <motion.div
          key={`burst-${cycle}`}
          className="absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${BLOCK_LEFT}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 1] }}
          transition={{ delay: 2.2, duration: 0.5, ease: "easeOut" }}
        >
          <span
            className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ background: "var(--ember)", color: "#140805", fontFamily: "var(--font-mono)" }}
          >
            blocked
          </span>
        </motion.div>

        {/* gates */}
        <div className="absolute inset-0 flex items-stretch justify-between">
          {GATES.map((g, i) => {
            const isBlock = i === BLOCK;
            const after = i > BLOCK;
            const active = hover === i;
            return (
              <div
                key={g.n}
                className="group relative flex flex-1 cursor-default flex-col items-center justify-center"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {/* gate bar */}
                <motion.div
                  key={`gate-${i}-${cycle}`}
                  className="w-px"
                  style={{
                    height: isBlock ? "120px" : "84px",
                    transformOrigin: "center",
                    background: isBlock ? "var(--ember)" : "var(--ink)",
                  }}
                  initial={{ scaleY: isBlock ? 0 : 0.4, opacity: after ? 0.22 : 0.4 }}
                  animate={
                    isBlock
                      ? { scaleY: 1, opacity: 1 }
                      : after
                      ? { opacity: 0.22 }
                      : { scaleY: [0.4, 1, 0.6], opacity: [0.4, 1, 0.55] }
                  }
                  transition={
                    isBlock
                      ? { delay: 2.05, duration: 0.2 }
                      : after
                      ? {}
                      : { delay: 0.3 + i * 0.5, duration: 0.5 }
                  }
                />

                {/* index + label */}
                <div className="absolute -bottom-2 translate-y-full text-center">
                  <div className="deck-index">{String(i + 1).padStart(2, "0")}</div>
                  <div
                    className="mt-1 text-[12px] font-medium leading-tight"
                    style={{ color: isBlock ? "var(--ember)" : after ? "var(--ink-faint)" : "var(--ink)" }}
                  >
                    {g.n}
                  </div>
                  <div
                    className="mt-0.5 text-[10px] leading-tight transition-opacity"
                    style={{ color: "var(--ink-dim)", opacity: active ? 1 : 0 }}
                  >
                    {g.q}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-[12px]" style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
        hover a gate to read what it checks
      </div>
    </div>
  );
}
