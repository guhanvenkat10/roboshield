"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { RobotVisual } from "@/components/RobotVisual";

// Deterministic "floating particles" so the hero animates without hydration drift.
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53) % 100,
  top: (i * 37) % 100,
  delay: (i % 6) * 0.4,
  dur: 4 + (i % 5),
  size: 1 + (i % 3),
}));

export function HeroSlide() {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden px-8">
      {/* layered glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-500/15 blur-[120px]" />
        <div className="absolute right-[12%] top-[20%] h-[30vh] w-[30vh] rounded-full bg-rewrite/10 blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />

      {/* particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-signal-400/40"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -16, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-signal-400" />
            Antivirus for the physical world
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-6xl font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl xl:text-8xl"
          >
            Robo
            <span className="bg-gradient-to-r from-signal-400 to-rewrite bg-clip-text text-transparent">
              Shield
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 max-w-xl text-xl leading-relaxed text-white/65 sm:text-2xl"
          >
            A behavior firewall for robots, drones, cameras &amp; smart devices —
            it checks every command <span className="text-white">before</span> it can reach the hardware.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center gap-3 text-sm text-white/35"
          >
            <span className="inline-flex h-7 items-center rounded-md border border-white/10 px-2 mono">→</span>
            press to begin
          </motion.div>
        </div>

        {/* robot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-[min(78vw,420px)]"
        >
          <RobotVisual status="protected" personNearby={false} />
        </motion.div>
      </div>
    </div>
  );
}
