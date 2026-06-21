"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { Decision, RiskLevel } from "@/lib/roboshield";
import { cn } from "@/lib/utils";

// ── Brand mark ────────────────────────────────────────────────────────────────
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-signal-500/15 text-signal-400 shadow-glow">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight text-white">RoboShield</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Behavior Firewall</div>
      </div>
    </div>
  );
}

// ── Decision badge ──────────────────────────────────────────────────────────────
const DECISION_STYLE: Record<Decision, { label: string; cls: string }> = {
  allowed: { label: "Allowed", cls: "bg-safe/15 text-safe border-safe/30" },
  blocked: { label: "Blocked", cls: "bg-danger/15 text-danger border-danger/30" },
  rewritten: { label: "Rewritten", cls: "bg-rewrite/15 text-rewrite border-rewrite/30" },
  requires_approval: { label: "Needs Approval", cls: "bg-warn/15 text-warn border-warn/30" },
};

export function DecisionBadge({ decision, className }: { decision: Decision; className?: string }) {
  const s = DECISION_STYLE[decision];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", s.cls, className)}>
      {s.label}
    </span>
  );
}

// ── Risk level chip ─────────────────────────────────────────────────────────────
const RISK_STYLE: Record<RiskLevel, string> = {
  low: "text-safe",
  medium: "text-warn",
  high: "text-danger",
  critical: "text-danger",
};

export function RiskLevelText({ level }: { level: RiskLevel }) {
  return <span className={cn("font-semibold capitalize", RISK_STYLE[level])}>{level}</span>;
}

// ── Animated number ─────────────────────────────────────────────────────────────
export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.4, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="tabular-nums"
    >
      {value}
      {suffix}
    </motion.span>
  );
}

// ── Section heading ─────────────────────────────────────────────────────────────
export function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-signal-400/80">{eyebrow}</div>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      {desc && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/55">{desc}</p>}
    </div>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────────
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("card p-5 shadow-card", className)}>{children}</div>;
}
