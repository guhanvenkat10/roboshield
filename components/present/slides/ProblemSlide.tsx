"use client";

import { motion } from "framer-motion";
import { Cpu, Eye, Radio, Volume2 } from "lucide-react";

const THREATS = [
  { icon: Volume2, label: "Hijacked speaker", desc: "plays threats or impersonates a trusted voice" },
  { icon: Eye, label: "Silent camera", desc: "records inside bedrooms and bathrooms" },
  { icon: Radio, label: "Remote takeover", desc: "someone drives your robot at 3 a.m." },
  { icon: Cpu, label: "Rogue AI agent", desc: "an LLM issues its own hardware commands" },
];

export function ProblemSlide() {
  return (
    <div className="relative grid h-full w-full place-items-center px-8">
      <div className="pointer-events-none absolute right-[10%] top-[15%] h-[40vh] w-[40vh] rounded-full bg-danger/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-danger/80">The problem</div>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            When a smart device gets hijacked, it doesn&apos;t crash.
            <span className="text-danger"> It obeys.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-white/55">
            Today a robot passes commands straight to its motors, speaker, and camera. Nothing sits
            in between asking <span className="text-white/80">&ldquo;should it actually do this?&rdquo;</span>
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THREATS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="card p-5"
            >
              <t.icon className="h-6 w-6 text-danger" />
              <div className="mt-3 font-semibold text-white">{t.label}</div>
              <div className="mt-1 text-sm text-white/50">{t.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-lg text-white/70"
        >
          The device isn&apos;t broken — <span className="text-white">it&apos;s being perfectly obedient to the wrong person.</span>
        </motion.div>
      </div>
    </div>
  );
}
