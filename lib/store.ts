"use client";

import { create } from "zustand";
import {
  DEFAULT_CONTEXT,
  DEFAULT_POLICY,
  evaluateCommand,
  type Evaluation,
  type Incident,
  type PolicyConfig,
  type RoboCommand,
  type RobotContext,
} from "./roboshield";
import { serialBridge, outcomeToRobotCommand, type RobotTelemetry } from "./serial";

export type ShieldStatus = "protected" | "threat" | "lockdown";

interface RiskPoint {
  t: number;
  v: number;
}

interface RoboShieldState {
  context: RobotContext;
  policy: PolicyConfig;
  incidents: Incident[];
  /** The most recent evaluation, shown in the live command monitor. */
  lastEvaluation: Evaluation | null;
  status: ShieldStatus;
  /** Rolling risk history for the live chart. */
  riskHistory: RiskPoint[];
  /** Total commands seen / blocked, for headline stats. */
  totalEvaluated: number;
  totalBlocked: number;
  /** When false, the firewall is bypassed and commands hit the robot raw
   *  (the "unprotected device" half of the on-stage A/B demo). */
  shieldEnabled: boolean;

  /** Live hardware state. */
  robotConnected: boolean;
  telemetry: RobotTelemetry | null;
  /** When true (and a robot is connected), the real ultrasonic reading drives
   *  context.personNearby / proximityCm instead of the manual toggles. */
  useLiveSensors: boolean;

  setContext: (patch: Partial<RobotContext>) => void;
  setPolicy: (patch: Partial<PolicyConfig>) => void;
  setShield: (enabled: boolean) => void;
  setUseLiveSensors: (v: boolean) => void;
  runCommand: (command: RoboCommand, contextOverride?: Partial<RobotContext>) => Evaluation;
  lockdown: () => void;
  emergencyStop: () => void;
  resetDemo: () => void;
  clearIncidents: () => void;

  /** Internal: fed by the serial bridge subscription in DashboardShell. */
  _onRobotStatus: (connected: boolean) => void;
  _onTelemetry: (t: RobotTelemetry) => void;
}

let incidentCounter = 0;

function seedHistory(): RiskPoint[] {
  // Deterministic so server and client render identically (no hydration drift)
  // and the idle chart looks the same every run.
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    t: now - (24 - i) * 1000,
    v: 8 + Math.round(Math.sin(i / 2) * 3 + Math.cos(i / 3) * 2),
  }));
}

export const useRoboShield = create<RoboShieldState>((set, get) => ({
  context: { ...DEFAULT_CONTEXT },
  policy: { ...DEFAULT_POLICY },
  incidents: [],
  lastEvaluation: null,
  status: "protected",
  riskHistory: seedHistory(),
  totalEvaluated: 0,
  totalBlocked: 0,
  shieldEnabled: true,
  robotConnected: false,
  telemetry: null,
  useLiveSensors: true,

  setContext: (patch) => set((s) => ({ context: { ...s.context, ...patch } })),
  setPolicy: (patch) => set((s) => ({ policy: { ...s.policy, ...patch } })),
  setShield: (enabled) => set({ shieldEnabled: enabled }),
  setUseLiveSensors: (v) => set({ useLiveSensors: v }),

  runCommand: (command, contextOverride) => {
    const base = get().context;
    const ctx = contextOverride ? { ...base, ...contextOverride } : base;
    const evaluation = evaluateCommand(command, ctx, get().policy);

    // Forward the outcome to the physical rover (no-op if none is connected).
    const robotCmd = outcomeToRobotCommand(evaluation.command.action, evaluation.decision, get().shieldEnabled);
    if (robotCmd) serialBridge.send(robotCmd);

    set((s) => {
      const isIncident = evaluation.decision !== "allowed";
      const incidents = isIncident
        ? [
            { id: `INC-${String(++incidentCounter).padStart(4, "0")}`, timestamp: evaluation.timestamp, evaluation },
            ...s.incidents,
          ].slice(0, 50)
        : s.incidents;

      const status: ShieldStatus =
        s.status === "lockdown"
          ? "lockdown"
          : evaluation.decision === "blocked"
          ? "threat"
          : s.status;

      const riskHistory = [...s.riskHistory, { t: evaluation.timestamp, v: evaluation.riskScore }].slice(-48);

      return {
        lastEvaluation: evaluation,
        incidents,
        status,
        riskHistory,
        totalEvaluated: s.totalEvaluated + 1,
        totalBlocked: s.totalBlocked + (evaluation.decision === "blocked" ? 1 : 0),
      };
    });

    return evaluation;
  },

  lockdown: () => {
    serialBridge.send("LOCKDOWN");
    set((s) => ({
      status: "lockdown",
      context: { ...s.context, zone: "private" },
      riskHistory: [...s.riskHistory, { t: Date.now(), v: 34 }].slice(-48),
    }));
  },

  emergencyStop: () => {
    serialBridge.send("STOP");
    set({ status: "threat" });
  },

  resetDemo: () => {
    serialBridge.send("PATROL");
    set({
      context: { ...DEFAULT_CONTEXT },
      policy: { ...DEFAULT_POLICY },
      incidents: [],
      lastEvaluation: null,
      status: "protected",
      riskHistory: seedHistory(),
      totalEvaluated: 0,
      totalBlocked: 0,
      shieldEnabled: true,
    });
  },

  clearIncidents: () => set({ incidents: [] }),

  _onRobotStatus: (connected) =>
    set((s) => ({ robotConnected: connected, telemetry: connected ? s.telemetry : null })),

  _onTelemetry: (t) => {
    const s = get();
    // The dashboard "sees" the rover here: its current mode, the ultrasonic
    // distance, and whether the onboard sensors think a person is in range.
    const patch: Partial<RoboShieldState> = { telemetry: t };

    // When live sensors are on, the REAL ultrasonic reading drives the firewall
    // context — so a speaker command is blocked because the hardware actually
    // sees someone, not because we flipped a toggle. Only write on meaningful
    // change to avoid churn from the 3 Hz telemetry stream.
    if (s.useLiveSensors && s.robotConnected) {
      const proximityCm = Math.min(t.dist, 400);
      const personNearby = t.person;
      if (personNearby !== s.context.personNearby || Math.abs(proximityCm - s.context.proximityCm) > 5) {
        patch.context = { ...s.context, personNearby, proximityCm };
      }
    }
    set(patch);
  },
}));
