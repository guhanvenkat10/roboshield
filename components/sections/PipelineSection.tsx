"use client";

import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Ban,
  BrainCircuit,
  Check,
  CircleHelp,
  Fingerprint,
  Inbox,
  KeyRound,
  MapPin,
  ScanEye,
  Scale,
} from "lucide-react";
import { useRoboShield } from "@/lib/store";
import { Card, SectionTitle } from "../primitives";
import { PipelineTrace } from "../PipelineTrace";

const STEPS = [
  {
    n: 1,
    icon: Inbox,
    title: "Command Received",
    judge: "What is being asked?",
    meaning:
      "A command is any request asking the robot to do something, move, speak, record, upload data, or respond to a remote/AI instruction. RoboShield intercepts it before it reaches any hardware.",
    example: "“Move toward the person and play this urgent voice message.”",
  },
  {
    n: 2,
    icon: ScanEye,
    title: "Normality Check",
    judge: "Is this weird?",
    meaning:
      "Does the command match the robot's normal behavior profile? Safe daytime movement is normal. Speaking randomly, moving toward a person, or acting at night is suspicious. Unknown commands are treated as risk, never allowed by default.",
    example: "An unrecognized freeform command → flagged, not waved through.",
  },
  {
    n: 3,
    icon: KeyRound,
    title: "Permission Token Check",
    judge: "Is this allowed?",
    meaning:
      "High-risk actions, speaker, camera, mic, data upload, remote control, movement near people, AI-generated hardware commands, require a trusted approval token before they can run.",
    example: "“Blocked: audio command missing trusted permission token.”",
  },
  {
    n: 4,
    icon: Fingerprint,
    title: "Physical DLP Check",
    judge: "Is this leaking or abusing the real world?",
    meaning:
      "Physical Data-Loss Prevention. RoboShield reads real-world sensor context before allowing an action. If a person is nearby and a speaker command arrives, it is blocked.",
    example: "“Blocked: audio output near person. Possible harassment or impersonation risk.”",
  },
  {
    n: 5,
    icon: BrainCircuit,
    title: "AI Command Sanitizer",
    judge: "The direct AI-defense layer.",
    meaning:
      "AI-generated commands are checked before reaching hardware. If an AI agent asks the robot to follow someone, record, upload, or combine movement with audio, RoboShield blocks or rewrites it.",
    example: "Unsafe → Safe rewrite: “Stay still and send a notification to the dashboard.”",
  },
  {
    n: 6,
    icon: MapPin,
    title: "Trust Zone Check",
    judge: "Where is the device?",
    meaning:
      "Different rules apply depending on location/mode. A command allowed in Home Mode can be blocked in Bedroom, Night, School, or Private Mode.",
    example: "“Blocked: speaker command is not allowed in Bedroom Mode.”",
  },
  {
    n: 7,
    icon: Scale,
    title: "Decision",
    judge: "The verdict.",
    meaning:
      "After all checks, RoboShield decides: Allowed, Blocked, Rewritten, or Requires Approval, with a risk score and plain-English reasons.",
    example: "",
  },
  {
    n: 8,
    icon: Ban,
    title: "Hardware or Blocked Log",
    judge: "What actually happens.",
    meaning:
      "Safe commands are sent to the robot. Risky ones are stopped and recorded as a plain-English black-box incident: time, command, source, sensor state, zone, decision, reason, risk, and next step.",
    example: "",
  },
];

const DECISIONS = [
  { icon: Check, label: "Allowed", desc: "Safe command reaches hardware.", cls: "text-safe border-safe/30 bg-safe/[0.06]" },
  { icon: Ban, label: "Blocked", desc: "Risky command stopped before the robot acts.", cls: "text-danger border-danger/30 bg-danger/[0.06]" },
  { icon: ArrowRightLeft, label: "Rewritten", desc: "Unsafe command converted into a safer action.", cls: "text-rewrite border-rewrite/30 bg-rewrite/[0.06]" },
  { icon: CircleHelp, label: "Requires Approval", desc: "A trusted user must approve before execution.", cls: "text-warn border-warn/30 bg-warn/[0.06]" },
];

export function PipelineSection() {
  const lastEvaluation = useRoboShield((s) => s.lastEvaluation);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="The engine"
        title="How RoboShield evaluates every command"
        desc="Each command passes through seven checks before it can reach a motor, speaker, camera, or radio. A judge should understand each step in under 30 seconds, no narration required."
      />

      {/* Pipeline rail */}
      <Card>
        <div className="scroll-thin flex items-center gap-1 overflow-x-auto pb-2 text-[11px] text-white/50">
          {["Received", "Normality", "Permission", "Physical DLP", "AI Sanitizer", "Trust Zone", "Decision", "Hardware / Log"].map(
            (s, i, arr) => (
              <div key={s} className="flex items-center gap-1">
                <span className="whitespace-nowrap rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-medium text-white/70">
                  {s}
                </span>
                {i < arr.length - 1 && <span className="text-white/25">→</span>}
              </div>
            )
          )}
        </div>
      </Card>

      {/* Step cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 2) * 0.05 }}
            className="card group p-5 transition hover:border-signal-500/30"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-signal-500/10 text-signal-400">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="mono text-xs text-white/35">{String(s.n).padStart(2, "0")}</span>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                </div>
                <div className="mt-0.5 text-xs font-medium text-signal-400/80">“{s.judge}”</div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.meaning}</p>
                {s.example && (
                  <p className="mt-2 rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/50">{s.example}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Four decisions */}
      <div>
        <SectionTitle title="Four possible decisions" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DECISIONS.map((d) => (
            <div key={d.label} className={`rounded-lg border p-4 ${d.cls}`}>
              <d.icon className="h-5 w-5" />
              <div className="mt-2 font-semibold text-white">{d.label}</div>
              <div className="mt-1 text-xs text-white/55">{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live trace */}
      <Card>
        <h3 className="text-sm font-semibold text-white">Your last command through the pipeline</h3>
        <p className="mb-3 text-xs text-white/45">
          Run a command in the Live Console or Demo Lab and its trace appears here.
        </p>
        {lastEvaluation ? (
          <PipelineTrace trace={lastEvaluation.trace} />
        ) : (
          <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-sm text-white/40">
            No command evaluated yet.
          </div>
        )}
      </Card>
    </div>
  );
}
