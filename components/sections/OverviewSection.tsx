"use client";

import { Lock, RotateCcw, ShieldX } from "lucide-react";
import { useRoboShield } from "@/lib/store";
import { RobotVisual } from "../RobotVisual";
import { RiskChart } from "../RiskChart";
import { ContextControls } from "../ContextControls";
import { HardwareBridge } from "../HardwareBridge";
import { CommandMonitor } from "./CommandMonitor";
import { AnimatedNumber, Card } from "../primitives";

export function OverviewSection({ onJump }: { onJump: (tab: any) => void }) {
  const status = useRoboShield((s) => s.status);
  const context = useRoboShield((s) => s.context);
  const riskHistory = useRoboShield((s) => s.riskHistory);
  const totalEvaluated = useRoboShield((s) => s.totalEvaluated);
  const totalBlocked = useRoboShield((s) => s.totalBlocked);
  const lockdown = useRoboShield((s) => s.lockdown);
  const resetDemo = useRoboShield((s) => s.resetDemo);

  const currentRisk = riskHistory[riskHistory.length - 1]?.v ?? 0;

  return (
    <div className="space-y-5">
      {/* Top row: robot + risk + stats */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Robot + controls */}
        <Card className="flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Protected Device</div>
          <RobotVisual status={status} personNearby={context.personNearby} />
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-white/80">Demo Rover · {context.zone} zone</div>
            <div className="text-xs text-white/40">Mission: {context.currentMission}</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={lockdown}
              disabled={status === "lockdown"}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2.5 text-sm font-semibold text-warn transition hover:bg-warn/15 disabled:opacity-40"
            >
              <Lock className="h-4 w-4" /> Lockdown
            </button>
            <button
              onClick={resetDemo}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/5"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </Card>

        {/* Risk + stats */}
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Risk Score</div>
              <div className="mt-1 text-4xl font-semibold tracking-tight text-white">
                <AnimatedNumber value={currentRisk} suffix="%" />
              </div>
            </div>
            <div className="flex gap-2">
              <Stat label="Evaluated" value={totalEvaluated} />
              <Stat label="Blocked" value={totalBlocked} tone="danger" />
            </div>
          </div>
          <div className="mt-3 h-[150px] flex-1">
            <RiskChart data={riskHistory} height={150} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-white/35">
            <span>Live command risk over time</span>
            {status === "lockdown" && (
              <span className="inline-flex items-center gap-1 text-warn">
                <ShieldX className="h-3 w-3" /> Isolation mode active — only emergency stop passes
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Second row: sensors + hardware */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <ContextControls />
          <p className="mt-3 text-[11px] leading-relaxed text-white/35">
            These are simulated sensor inputs. Flip them to stage a situation — e.g. turn on “Person nearby”
            then try a speaker command in the monitor below. Want guided scenarios?{" "}
            <button onClick={() => onJump("demo")} className="text-signal-400 hover:underline">
              Open the Demo Lab →
            </button>
          </p>
        </Card>
        <HardwareBridge />
      </div>

      {/* Command monitor */}
      <CommandMonitor />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "danger" }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-center">
      <div className={tone === "danger" ? "text-xl font-semibold text-danger" : "text-xl font-semibold text-white"}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
    </div>
  );
}
