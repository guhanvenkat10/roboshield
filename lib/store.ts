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

  setContext: (patch: Partial<RobotContext>) => void;
  setPolicy: (patch: Partial<PolicyConfig>) => void;
  runCommand: (command: RoboCommand, contextOverride?: Partial<RobotContext>) => Evaluation;
  lockdown: () => void;
  resetDemo: () => void;
  clearIncidents: () => void;
}

let incidentCounter = 0;

function seedHistory(): RiskPoint[] {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    t: now - (24 - i) * 1000,
    v: 6 + Math.round(Math.sin(i / 2) * 3 + Math.random() * 4),
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

  setContext: (patch) => set((s) => ({ context: { ...s.context, ...patch } })),
  setPolicy: (patch) => set((s) => ({ policy: { ...s.policy, ...patch } })),

  runCommand: (command, contextOverride) => {
    const base = get().context;
    const ctx = contextOverride ? { ...base, ...contextOverride } : base;
    const evaluation = evaluateCommand(command, ctx, get().policy);

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

  lockdown: () =>
    set((s) => ({
      status: "lockdown",
      context: { ...s.context, zone: "private" },
      riskHistory: [...s.riskHistory, { t: Date.now(), v: 34 }].slice(-48),
    })),

  resetDemo: () =>
    set({
      context: { ...DEFAULT_CONTEXT },
      policy: { ...DEFAULT_POLICY },
      incidents: [],
      lastEvaluation: null,
      status: "protected",
      riskHistory: seedHistory(),
      totalEvaluated: 0,
      totalBlocked: 0,
    }),

  clearIncidents: () => set({ incidents: [] }),
}));
