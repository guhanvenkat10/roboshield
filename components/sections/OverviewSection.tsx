"use client";

import { Lock, OctagonX, RotateCcw } from "lucide-react";
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
  const totalBlocked = useRoboShield((s) => s.totalBlocked);
  const lockdown = useRoboShield((s) => s.lockdown);
  const resetDemo = useRoboShield((s) => s.resetDemo);
  const emergencyStop = useRoboShield((s) => s.emergencyStop);

  const currentRisk = riskHistory[riskHistory.length - 1]?.v ?? 0;
  const riskColor = currentRisk >= 70 ? "text-danger" : currentRisk >= 40 ? "text-warn" : "text-safe";

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {/* Left rail: device at a glance */}
      <div className="space-y-5 lg:col-span-4">
        <Card>
          <div className="kicker mb-3 text-[11px]">device</div>
          <div className="mx-auto w-2/3">
            <RobotVisual status={status} personNearby={context.personNearby} />
          </div>
          <div className="mt-2 text-center">
            <div className="font-term text-lg uppercase tracking-wide text-white">Demo Rover</div>
            <div className="mt-0.5 text-xs text-white/40">{context.currentMission}</div>
          </div>

          {/* risk readout */}
          <div className="mt-4 flex items-end justify-between border-t border-white/8 pt-4">
            <div>
              <div className="kicker text-[10px]">risk</div>
              <div className={`font-term text-4xl leading-none ${riskColor}`}>
                <AnimatedNumber value={currentRisk} suffix="%" />
              </div>
            </div>
            <div className="h-12 w-32">
              <RiskChart data={riskHistory} height={48} />
            </div>
          </div>
          <div className="mt-1 text-right text-[11px] text-white/35">{totalBlocked} blocked this session</div>

          {/* controls */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={lockdown}
              disabled={status === "lockdown"}
              className="flex items-center justify-center gap-1.5 rounded-md border border-warn/40 bg-warn/10 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-warn transition hover:bg-warn/15 disabled:opacity-40"
            >
              <Lock className="h-3.5 w-3.5" /> Lock
            </button>
            <button
              onClick={emergencyStop}
              className="flex items-center justify-center gap-1.5 rounded-md border border-danger/40 bg-danger/10 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-danger transition hover:bg-danger/15"
            >
              <OctagonX className="h-3.5 w-3.5" /> Stop
            </button>
            <button
              onClick={resetDemo}
              className="flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:bg-white/5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </Card>

        <HardwareBridge />
      </div>

      {/* Right: sensors + the command monitor as the focal point */}
      <div className="space-y-5 lg:col-span-8">
        <Card>
          <ContextControls />
          <p className="mt-3 text-[11px] leading-relaxed text-white/35">
            Simulated sensor inputs. Flip one, then send a command below to watch the verdict change. Prefer
            guided runs?{" "}
            <button onClick={() => onJump("demo")} className="text-danger hover:underline">
              Open the Demo Lab
            </button>
            .
          </p>
        </Card>

        <CommandMonitor />
      </div>
    </div>
  );
}
