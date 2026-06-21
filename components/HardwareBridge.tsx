"use client";

import { useEffect, useState } from "react";
import { Bluetooth, Cpu, OctagonX, Plug, Radar, Satellite, ShieldOff, Usb } from "lucide-react";
import { Card } from "./primitives";
import { useRoboShield } from "@/lib/store";
import { isSerialSupported, serialBridge } from "@/lib/serial";
import { cn } from "@/lib/utils";

/**
 * Optional hardware panel — but now it really connects. "Connect Robot" opens a
 * USB (or paired-Bluetooth) serial port via Web Serial; allowed commands are
 * forwarded to the rover and blocked ones become LOCKDOWN. RoboShield is fully
 * functional with nothing plugged in.
 */
export function HardwareBridge() {
  const shieldEnabled = useRoboShield((s) => s.shieldEnabled);
  const setShield = useRoboShield((s) => s.setShield);
  const emergencyStop = useRoboShield((s) => s.emergencyStop);
  const connected = useRoboShield((s) => s.robotConnected);
  const telemetry = useRoboShield((s) => s.telemetry);
  const useLiveSensors = useRoboShield((s) => s.useLiveSensors);
  const setUseLiveSensors = useRoboShield((s) => s.setUseLiveSensors);

  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isSerialSupported());
  }, []);

  async function toggleConnect() {
    setError(null);
    try {
      if (connected) await serialBridge.disconnect();
      else await serialBridge.connect();
    } catch (e: any) {
      if (e?.name !== "NotFoundError") setError(e?.message ?? "Connection failed");
    }
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Hardware Bridge</h3>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            connected ? "border-safe/40 bg-safe/10 text-safe" : "border-white/10 text-white/40"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-safe" : "bg-white/30")} />
          {connected ? "Robot Connected" : "Simulation"}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-white/50">
        RoboShield runs entirely in simulation. Connect the Demo Rover over USB (or paired Bluetooth) and
        only commands that pass the firewall reach it.
      </p>

      {/* Live telemetry */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <Tile label="Mode" value={telemetry?.mode ?? "—"} />
        <Tile label="Distance" value={telemetry ? `${telemetry.dist}cm` : "—"} />
        <Tile
          label="Person"
          value={telemetry ? (telemetry.person ? "Detected" : "Clear") : "—"}
          tone={telemetry?.person ? "danger" : undefined}
        />
      </div>

      {/* Live-sensor link: real ultrasonic drives the firewall context */}
      <button
        onClick={() => setUseLiveSensors(!useLiveSensors)}
        className={cn(
          "mt-2 flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition",
          useLiveSensors && connected
            ? "border-signal-500/30 bg-signal-500/10 text-signal-400"
            : "border-white/10 text-white/50 hover:bg-white/5"
        )}
        title="When on, the rover's real ultrasonic reading sets 'person nearby' for the firewall — so blocks are driven by hardware, not toggles."
      >
        <span className="flex items-center gap-2">
          <Satellite className="h-3.5 w-3.5" />
          Live sensors drive the firewall
        </span>
        <span className="opacity-70">
          {useLiveSensors ? (connected ? "ON · live" : "ON · waiting for robot") : "OFF · manual"}
        </span>
      </button>

      {/* Shield A/B toggle — the on-stage money switch */}
      <button
        onClick={() => setShield(!shieldEnabled)}
        className={cn(
          "mt-3 flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
          shieldEnabled
            ? "border-safe/30 bg-safe/10 text-safe"
            : "border-danger/40 bg-danger/10 text-danger animate-pulse"
        )}
        title="Turn the firewall off to show an unprotected device obeying an attack, then back on to block it."
      >
        <span className="flex items-center gap-2">
          {shieldEnabled ? <Cpu className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
          Firewall {shieldEnabled ? "ENABLED" : "BYPASSED"}
        </span>
        <span className="text-[10px] font-normal opacity-70">{shieldEnabled ? "tap to bypass" : "tap to protect"}</span>
      </button>

      {/* Connect + emergency stop */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          onClick={toggleConnect}
          disabled={!supported}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.06] disabled:opacity-40"
        >
          {connected ? <Plug className="h-4 w-4" /> : <Usb className="h-4 w-4" />}
          {connected ? "Disconnect" : "Connect Robot"}
        </button>
        <button
          onClick={emergencyStop}
          className="flex items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/15"
        >
          <OctagonX className="h-4 w-4" /> STOP
        </button>
      </div>

      {!supported && (
        <p className="mt-2 text-[11px] text-warn/80">
          Web Serial needs Chrome or Edge. The simulation still works everywhere.
        </p>
      )}
      {error && <p className="mt-2 text-[11px] text-danger/80">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/30">
        <span className="inline-flex items-center gap-1">
          <Cpu className="h-3 w-3" /> Arduino Uno · L298N
        </span>
        <span className="inline-flex items-center gap-1">
          <Radar className="h-3 w-3" /> HC-SR04 · speaker · LEDs
        </span>
        <span className="inline-flex items-center gap-1">
          <Bluetooth className="h-3 w-3" /> HC-05/06 optional
        </span>
      </div>
    </Card>
  );
}

function Tile({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] px-2 py-2">
      <div className={cn("truncate text-sm font-semibold", tone === "danger" ? "text-danger" : "text-white/85")}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
    </div>
  );
}
