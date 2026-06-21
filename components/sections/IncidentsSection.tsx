"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileWarning, Trash2 } from "lucide-react";
import { useRoboShield } from "@/lib/store";
import type { Incident } from "@/lib/roboshield";
import { Card, DecisionBadge, RiskLevelText, SectionTitle } from "../primitives";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function IncidentsSection() {
  const incidents = useRoboShield((s) => s.incidents);
  const clearIncidents = useRoboShield((s) => s.clearIncidents);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <SectionTitle
          eyebrow="Black-box recorder"
          title="Incident reports"
          desc="Every blocked or rewritten command becomes a plain-English report explaining exactly what was prevented and why, the proof a user gets after an attack."
        />
        {incidents.length > 0 && (
          <button
            onClick={clearIncidents}
            className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/55 hover:bg-white/5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {incidents.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <FileWarning className="h-8 w-8 text-white/25" />
            <div className="text-sm text-white/50">No incidents yet.</div>
            <div className="text-xs text-white/35">Run a blocked scenario in the Demo Lab to generate a report.</div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <IncidentRow key={inc.id} incident={inc} />
          ))}
        </div>
      )}
    </div>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  const [open, setOpen] = useState(false);
  const e = incident.evaluation;

  const fields: [string, string][] = [
    ["Time", formatTime(incident.timestamp)],
    ["Command", e.command.raw],
    ["Action", e.command.action],
    ["Source", e.command.source.replace("_", " ")],
    ["Sensor state", `${e.context.personNearby ? "person nearby" : "clear"} · ${e.context.proximityCm}cm · ${e.context.isNight ? "night" : "day"}`],
    ["Trust zone", e.context.zone],
    ["Decision", e.decision],
    ["Risk level", e.riskLevel],
  ];

  return (
    <Card className="overflow-hidden p-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 p-4 text-left">
        <span className="mono text-xs text-white/35">{incident.id}</span>
        <DecisionBadge decision={e.decision} />
        <span className="min-w-0 flex-1 truncate text-sm text-white/70">{e.plainEnglishSummary}</span>
        <span className="hidden shrink-0 text-xs text-white/40 sm:block">{formatTime(incident.timestamp)}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-white/40 transition", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {/* fields */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {fields.map(([k, v]) => (
                  <div key={k}>
                    <div className="text-white/35">{k}</div>
                    <div className={cn("font-medium text-white/75", k === "Risk level" && "capitalize")}>{v}</div>
                  </div>
                ))}
                <div className="col-span-2">
                  <div className="text-white/35">Risk score</div>
                  <div className="font-medium text-white/75">
                    {e.riskScore} · <RiskLevelText level={e.riskLevel} />
                  </div>
                </div>
              </div>

              {/* reasons + next step */}
              <div className="space-y-2">
                <div className="text-xs text-white/35">Reasons</div>
                <ul className="space-y-1">
                  {e.reasons.map((r, i) => (
                    <li key={i} className="text-xs text-white/65">
                      <span className="mono text-[10px] uppercase text-white/35">{r.stage.replace("_", " ")}</span>, {r.detail}
                    </li>
                  ))}
                </ul>
                {e.safeRewrite && (
                  <div className="rounded-lg border border-rewrite/25 bg-rewrite/10 px-2.5 py-1.5 text-xs text-rewrite">
                    Safe rewrite: “{e.safeRewrite}”
                  </div>
                )}
                <div className="rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/60">
                  <span className="font-semibold text-white/80">Next step: </span>
                  {e.suggestedNextStep}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
