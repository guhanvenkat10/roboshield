"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ListChecks, Play } from "lucide-react";
import { useRoboShield } from "@/lib/store";
import { SCENARIOS, type Scenario, type Evaluation } from "@/lib/roboshield";
import { Card, DecisionBadge, SectionTitle } from "../primitives";
import { EvaluationResult } from "../EvaluationResult";
import { cn } from "@/lib/utils";

const SUCCESS = [
  "Safe commands are allowed through.",
  "Suspicious commands are blocked before hardware acts.",
  "Sensor context (person nearby) changes the decision.",
  "Trust Zones change what is allowed.",
  "AI-generated commands are sanitized or rewritten.",
  "Every block becomes a plain-English incident report.",
];

export function DemoLabSection({ onJump }: { onJump: (tab: any) => void }) {
  const runCommand = useRoboShield((s) => s.runCommand);
  const [active, setActive] = useState<Scenario | null>(null);
  const [result, setResult] = useState<Evaluation | null>(null);

  function run(s: Scenario) {
    setActive(s);
    setResult(runCommand(s.command, s.contextOverrides));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Demo Lab"
        title="Run the demo without typing a thing"
        desc="Click these in order for a clean narrative: a safe command passes, then escalating attacks get blocked, rewritten, and logged. Each card shows what it proves and a line you can say out loud."
      />

      {/* How to run */}
      <Card className="border-signal-500/20 bg-signal-500/[0.04]">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <ListChecks className="h-4 w-4 text-signal-400" /> How to run the demo
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-white/60">
          Use the Demo Lab to show how RoboShield checks commands before they reach the robot. Safe commands
          pass through. Risky commands are blocked, rewritten, and logged as incidents. Click each scenario
          top-to-bottom, read the presenter line, then open{" "}
          <button onClick={() => onJump("incidents")} className="text-signal-400 hover:underline">
            Incidents
          </button>{" "}
          to show the black-box report.
        </p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Scenario list */}
        <div className="space-y-3">
          {SCENARIOS.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => run(s)}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition",
                active?.id === s.id
                  ? "border-signal-500/50 bg-signal-500/[0.06]"
                  : "border-white/8 bg-white/[0.02] hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="mono text-xs text-white/30">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold text-white">{s.title}</span>
                </div>
                <DecisionBadge decision={s.expectedDecision} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-signal-400/70">{s.riskType}</div>
              <p className="mt-2 text-sm text-white/55">{s.proves}</p>
              <p className="mt-2 flex items-start gap-1.5 text-xs italic text-white/40">
                <Play className="mt-0.5 h-3 w-3 shrink-0" />
                {s.presenterLine}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Result panel */}
        <div className="space-y-4">
          <Card className="min-h-[200px]">
            {result && active ? (
              <>
                <div className="mb-3 text-xs text-white/45">
                  Result for <span className="font-semibold text-white/80">{active.title}</span>, raw command:{" "}
                  <span className="mono text-white/55">“{active.command.raw}”</span>
                </div>
                <EvaluationResult evaluation={result} />
              </>
            ) : (
              <div className="grid h-full min-h-[180px] place-items-center text-center text-sm text-white/40">
                Click a scenario to run it through RoboShield.
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CheckCircle2 className="h-4 w-4 text-safe" /> Demo success criteria
            </div>
            <ul className="mt-2 space-y-1.5">
              {SUCCESS.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-white/60">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safe/70" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
