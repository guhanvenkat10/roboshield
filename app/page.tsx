"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Eye, Lock, Radio, ShieldCheck, Volume2 } from "lucide-react";
import { Logo } from "@/components/primitives";

const THREATS = [
  { icon: Volume2, label: "Hijacked speaker", desc: "plays threats or impersonates a voice" },
  { icon: Eye, label: "Silent camera", desc: "records inside private rooms" },
  { icon: Radio, label: "Remote takeover", desc: "drives the robot at 3 a.m." },
  { icon: Cpu, label: "Rogue AI agent", desc: "issues its own hardware commands" },
];

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-white/60">
          <a href="#how" className="hidden hover:text-white sm:block">
            How it works
          </a>
          <a href="#threats" className="hidden hover:text-white sm:block">
            Threats
          </a>
          <Link href="/present" className="hidden hover:text-white sm:block">
            Pitch deck
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-signal-500 px-3.5 py-1.5 font-semibold text-ink-950 transition hover:bg-signal-400"
          >
            Open Console
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-12 sm:pt-20">
        <motion.div initial="hidden" animate="show" variants={fade} custom={0}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-400" />
            Antivirus for the physical world
          </div>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fade}
          custom={1}
          className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
        >
          A behavior firewall for robots,
          <br className="hidden sm:block" /> drones, cameras &amp; smart devices.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fade}
          custom={2}
          className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60"
        >
          RoboShield sits between the apps, clouds, and AI agents that send commands and the robot&apos;s
          actual hardware. Every command is checked first — unsafe movement, audio, recording, remote
          control, and AI-generated actions are blocked before a motor ever turns.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fade}
          custom={3}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-3 font-semibold text-ink-950 shadow-glow transition hover:bg-signal-400"
          >
            Run the live demo
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard?tab=pipeline"
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-3 font-semibold text-white/80 transition hover:bg-white/[0.06]"
          >
            View command pipeline
          </Link>
        </motion.div>

        {/* one-liner card */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fade}
          custom={4}
          className="mt-12 max-w-3xl rounded-2xl border border-signal-500/20 bg-signal-500/[0.06] p-5"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-signal-400" />
            <p className="text-[15px] leading-relaxed text-white/80">
              <span className="font-semibold text-white">The pitch in one line:</span> RoboShield stops
              hacked or AI-controlled devices from becoming moving cameras, speakers, or harassment tools
              inside people&apos;s homes — without breaking the robot&apos;s real job.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Threats */}
      <section id="threats" className="relative z-10 mx-auto max-w-6xl px-6 py-14">
        <div className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
          What a hijacked device can do
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THREATS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card p-5"
            >
              <t.icon className="h-5 w-5 text-danger" />
              <div className="mt-3 font-semibold text-white">{t.label}</div>
              <div className="mt-1 text-sm text-white/50">{t.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How preview */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <div className="card flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Lock className="h-8 w-8 text-signal-400" />
            <div>
              <div className="text-lg font-semibold text-white">Seven checks. Every command. Every time.</div>
              <div className="mt-1 text-sm text-white/55">
                Received → Normality → Permission Token → Physical DLP → AI Sanitizer → Trust Zone → Decision
              </div>
            </div>
          </div>
          <Link
            href="/dashboard?tab=pipeline"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 font-semibold text-white/80 transition hover:bg-white/[0.06]"
          >
            See each step <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-white/30">
          Hackathon MVP · simulation mode · optional Arduino bridge
        </p>
      </section>
    </main>
  );
}
