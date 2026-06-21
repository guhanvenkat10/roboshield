"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft, Ban, Check, CircleHelp } from "lucide-react";

const STAGES = [
  { n: "Received", q: "intercept" },
  { n: "Normality", q: "is this weird?" },
  { n: "Permission", q: "is this allowed?" },
  { n: "Physical DLP", q: "abusing the real world?" },
  { n: "AI Sanitizer", q: "AI-defense" },
  { n: "Trust Zone", q: "where is it?" },
  { n: "Decision", q: "verdict" },
];

// Which stage catches the sample attack (Physical DLP — audio near a person).
const BLOCK_AT = 3;

const DECISIONS = [
  { icon: Check, label: "Allowed", cls: "text-safe border-safe/30" },
  { icon: Ban, label: "Blocked", cls: "text-danger border-danger/30" },
  { icon: ArrowRightLeft, label: "Rewritten", cls: "text-rewrite border-rewrite/30" },
  { icon: CircleHelp, label: "Needs approval", cls: "text-warn border-warn/30" },
];

export function SolutionSlide() {
  return (
    <div className="relative grid h-full w-full place-items-center px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[40vh] w-[60vh] -translate-x-1/2 rounded-full bg-signal-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-signal-400/80">The solution</div>
          <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            A firewall that checks every command{" "}
            <span className="text-signal-400">before</span> it reaches hardware.
          </h2>
        </motion.div>

        {/* sample attack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
        >
          <span className="text-white/40">incoming:</span>
          <span className="mono text-white/80">&ldquo;move toward the person and play this urgent message&rdquo;</span>
        </motion.div>

        {/* pipeline */}
        <div className="mt-5 flex flex-wrap items-stretch gap-2">
          {STAGES.map((s, i) => {
            const isBlock = i === BLOCK_AT;
            const afterBlock = i > BLOCK_AT;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 18, scale: 0.95 }}
                animate={{ opacity: afterBlock ? 0.35 : 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.18, duration: 0.4 }}
                className={[
                  "relative min-w-[120px] flex-1 rounded-xl border p-3",
                  isBlock
                    ? "border-danger/50 bg-danger/10 shadow-glow-danger"
                    : afterBlock
                    ? "border-white/8 bg-white/[0.02]"
                    : "border-safe/30 bg-safe/[0.06]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  {!afterBlock &&
                    (isBlock ? (
                      <motion.span
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="text-danger"
                      >
                        <Ban className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <Check className="h-4 w-4 text-safe" />
                    ))}
                </div>
                <div className="mt-1 text-sm font-semibold text-white/85">{s.n}</div>
                <div className="text-[11px] text-white/45">{s.q}</div>
              </motion.div>
            );
          })}
        </div>

        {/* verdict */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + STAGES.length * 0.18 }}
          className="mt-5 flex flex-wrap items-center gap-4"
        >
          <div className="inline-flex items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 px-4 py-2.5 font-semibold text-danger">
            <Ban className="h-5 w-5" /> Blocked — audio aimed at a nearby person
          </div>
          <span className="text-sm text-white/50">…and logged as a plain-English incident the owner can read.</span>
        </motion.div>

        {/* decisions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + STAGES.length * 0.18 + 0.2 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {DECISIONS.map((d) => (
            <div key={d.label} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${d.cls}`}>
              <d.icon className="h-4 w-4" />
              {d.label}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
