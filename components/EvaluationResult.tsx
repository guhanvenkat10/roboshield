"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRightLeft, Ban, Check, Cpu, CircleHelp } from "lucide-react";
import type { Evaluation } from "@/lib/roboshield";
import { DecisionBadge, RiskLevelText } from "./primitives";
import { PipelineTrace } from "./PipelineTrace";
import { cn } from "@/lib/utils";

const DECISION_ICON = {
  allowed: Check,
  blocked: Ban,
  rewritten: ArrowRightLeft,
  requires_approval: CircleHelp,
} as const;

export function EvaluationResult({ evaluation }: { evaluation: Evaluation }) {
  const Icon = DECISION_ICON[evaluation.decision];
  const danger = evaluation.decision === "blocked";

  return (
    <motion.div
      key={evaluation.timestamp}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Verdict header */}
      <div
        className={cn(
          "rounded-2xl border p-4",
          danger
            ? "border-danger/30 bg-danger/[0.07]"
            : evaluation.decision === "allowed"
            ? "border-safe/30 bg-safe/[0.06]"
            : evaluation.decision === "rewritten"
            ? "border-rewrite/30 bg-rewrite/[0.07]"
            : "border-warn/30 bg-warn/[0.07]"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Icon className={cn("mt-0.5 h-5 w-5", danger ? "text-danger" : "text-white/80")} />
            <div>
              <div className="flex items-center gap-2">
                <DecisionBadge decision={evaluation.decision} />
                <span className="text-xs text-white/50">
                  risk <span className="font-semibold text-white/80">{evaluation.riskScore}</span> ·{" "}
                  <RiskLevelText level={evaluation.riskLevel} />
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{evaluation.plainEnglishSummary}</p>
            </div>
          </div>
        </div>

        {evaluation.safeRewrite && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-rewrite/25 bg-rewrite/10 px-3 py-2 text-sm text-rewrite">
            <ArrowRightLeft className="h-4 w-4" />
            Safe rewrite sent to robot: <span className="font-medium">“{evaluation.safeRewrite}”</span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            Reaches hardware:{" "}
            <span className={evaluation.reachesHardware ? "text-safe" : "text-danger"}>
              {evaluation.reachesHardware ? "Yes" : "No — stopped at the firewall"}
            </span>
          </span>
        </div>
      </div>

      {/* Reasons */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
          Why — {evaluation.reasons.length} finding{evaluation.reasons.length === 1 ? "" : "s"}
        </div>
        <ul className="space-y-1.5">
          {evaluation.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
              <AlertTriangle
                className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", r.weight >= 25 ? "text-danger" : r.weight > 0 ? "text-warn" : "text-white/30")}
              />
              <div>
                <span className="mono text-[11px] uppercase tracking-wide text-white/40">{r.stage.replace("_", " ")}</span>
                <p className="text-white/75">{r.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested next step */}
      <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5 text-sm text-white/70">
        <span className="font-semibold text-white/85">Suggested next step: </span>
        {evaluation.suggestedNextStep}
      </div>

      {/* Live pipeline trace */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">Pipeline trace</div>
        <PipelineTrace trace={evaluation.trace} />
      </div>
    </motion.div>
  );
}
