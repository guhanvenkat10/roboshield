"use client";

import { Bluetooth, Cpu, Plug } from "lucide-react";
import { Card } from "./primitives";

/**
 * Clearly-optional hardware panel. RoboShield is fully functional in simulation;
 * the Arduino is just a physical prop. The parts listed mirror the team's actual
 * kit (Arduino Uno + HC-05/06 Bluetooth + HC-SR04 + motors + speaker).
 */
export function HardwareBridge() {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Optional Hardware Bridge</h3>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">
          Optional
        </span>
      </div>

      <p className="text-xs leading-relaxed text-white/50">
        RoboShield runs entirely in simulation. The Arduino robot is an optional physical demo device —
        and only commands that pass the firewall are ever sent to it.
      </p>

      <div className="mt-3 space-y-1.5 text-xs">
        <Row label="Hardware Mode" value="Simulation" tone="ok" />
        <Row label="Serial / Bluetooth Bridge" value="Not Connected" tone="muted" />
        <Row label="Live Arduino Data" value="Optional" tone="muted" />
      </div>

      <button
        disabled
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm font-medium text-white/45"
        title="Wire an Arduino over HC-05/HC-06 to enable. Simulation works without it."
      >
        <Bluetooth className="h-4 w-4" />
        Connect Physical Demo Robot
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/30">
        <span className="inline-flex items-center gap-1">
          <Cpu className="h-3 w-3" /> Arduino Uno
        </span>
        <span className="inline-flex items-center gap-1">
          <Plug className="h-3 w-3" /> HC-SR04 · PIR · motors · speaker
        </span>
      </div>
    </Card>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: "ok" | "muted" }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-2.5 py-1.5">
      <span className="text-white/50">{label}</span>
      <span className={tone === "ok" ? "font-medium text-signal-400" : "text-white/40"}>{value}</span>
    </div>
  );
}
