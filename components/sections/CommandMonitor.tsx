"use client";

import { useState } from "react";
import { Info, Send, Sparkles } from "lucide-react";
import { useRoboShield } from "@/lib/store";
import type { ActionType, CommandSource, Evaluation } from "@/lib/roboshield";
import { EvaluationResult } from "../EvaluationResult";
import { Card } from "../primitives";
import { cn } from "@/lib/utils";

const ACTIONS: { value: ActionType; label: string }[] = [
  { value: "unknown", label: "Auto-detect from text" },
  { value: "move_forward", label: "move_forward" },
  { value: "move_toward_person", label: "move_toward_person" },
  { value: "play_audio", label: "play_audio" },
  { value: "activate_camera", label: "activate_camera" },
  { value: "activate_microphone", label: "activate_microphone" },
  { value: "upload_data", label: "upload_data" },
  { value: "remote_control", label: "remote_control" },
  { value: "stop_motors", label: "stop_motors" },
];

const SOURCES: { value: CommandSource; label: string }[] = [
  { value: "user_app", label: "User App" },
  { value: "cloud_api", label: "Cloud API" },
  { value: "remote_account", label: "Remote Account" },
  { value: "ai_agent", label: "AI Agent" },
  { value: "unknown_source", label: "Unknown Source" },
];

const FIELD_HELP = [
  ["Action", "The normalized behavior the robot is asked to perform — e.g. play_audio, move_forward, activate_camera, stop_motors."],
  ["Source", "Where the command came from: User App, Cloud API, Remote Account, AI Agent, or Unknown. Provenance changes trust."],
  ["Raw Command", "The original text instruction before RoboShield classifies and evaluates it."],
  ["Permission Token", "Trusted approval for high-risk actions — parent/admin approval, a signed API token, or a verified account."],
] as const;

const QUICK = ["go to the bathroom", "follow the person and play a message", "turn on the camera", "patrol forward", "stop motors"];

export function CommandMonitor() {
  const runCommand = useRoboShield((s) => s.runCommand);
  const lastEvaluation = useRoboShield((s) => s.lastEvaluation);
  const [raw, setRaw] = useState("");
  const [action, setAction] = useState<ActionType>("unknown");
  const [source, setSource] = useState<CommandSource>("user_app");
  const [ai, setAi] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [result, setResult] = useState<Evaluation | null>(null);

  function send(text?: string) {
    const command = (text ?? raw).trim();
    if (!command) return;
    const evald = runCommand({ action, source, raw: command, isAiGenerated: ai });
    setResult(evald);
  }

  const shown = result ?? lastEvaluation;

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Command Monitor</h3>
          <p className="text-xs text-white/45">
            Every command here runs through the full RoboShield pipeline before it can reach the robot.
          </p>
        </div>
        <button
          onClick={() => setShowHelp((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/60 hover:bg-white/5"
        >
          <Info className="h-3.5 w-3.5" /> Fields
        </button>
      </div>

      {showHelp && (
        <div className="mb-4 grid gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-3 sm:grid-cols-2">
          {FIELD_HELP.map(([k, v]) => (
            <div key={k} className="text-xs">
              <span className="font-semibold text-signal-400">{k}: </span>
              <span className="text-white/55">{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a command, e.g. ‘move toward the person and play a message’"
          className="flex-1 rounded-xl border border-white/10 bg-ink-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-signal-500/50 focus:outline-none"
        />
        <button
          onClick={() => send()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-signal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-signal-400"
        >
          <Send className="h-4 w-4" /> Evaluate
        </button>
      </div>

      {/* Controls */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Select label="Action" value={action} onChange={(v) => setAction(v as ActionType)} options={ACTIONS} />
        <Select label="Source" value={source} onChange={(v) => setSource(v as CommandSource)} options={SOURCES} />
        <button
          onClick={() => setAi((v) => !v)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
            ai ? "border-rewrite/40 bg-rewrite/10 text-rewrite" : "border-white/10 bg-ink-900/60 text-white/55 hover:bg-white/5"
          )}
        >
          <Sparkles className="h-4 w-4" /> AI-generated: {ai ? "On" : "Off"}
        </button>
      </div>

      {/* Quick commands */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => {
              setRaw(q);
              send(q);
            }}
            className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/50 transition hover:border-white/25 hover:text-white/80"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Result */}
      <div className="mt-5">
        {shown ? (
          <EvaluationResult evaluation={shown} />
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/40">
            Send a command to see how RoboShield evaluates it.
          </div>
        )}
      </div>
    </Card>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2 text-sm">
      <span className="text-xs text-white/40">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-white/80 focus:outline-none [&>option]:bg-ink-850"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
