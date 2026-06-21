// ─────────────────────────────────────────────────────────────────────────────
// Demo Lab scenarios
//
// Curated, presenter-ready commands. Each one tells a story and has a predictable
// outcome so a live demo never depends on luck. Click them top-to-bottom for a
// clean narrative arc: safe → physical abuse → AI attack → zone policy → night →
// emergency stop.
// ─────────────────────────────────────────────────────────────────────────────

import type { RoboCommand, RobotContext, TrustZone } from "./types";
import { DEFAULT_CONTEXT } from "./types";

export interface Scenario {
  id: string;
  title: string;
  riskType: string;
  /** What this scenario proves to a judge. */
  proves: string;
  /** A line the presenter can say out loud. */
  presenterLine: string;
  expectedDecision: "allowed" | "blocked" | "rewritten" | "requires_approval";
  command: RoboCommand;
  /** Context overrides applied on top of the live context for this run. */
  contextOverrides: Partial<RobotContext>;
}

function ctx(over: Partial<RobotContext>): Partial<RobotContext> {
  return over;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "normal_movement",
    title: "Normal Movement",
    riskType: "Baseline · safe",
    proves: "Safe robot behavior still passes — RoboShield is a filter, not a wall.",
    presenterLine:
      "Safe commands still pass straight through RoboShield, so the robot keeps doing its real job.",
    expectedDecision: "allowed",
    command: { action: "move_forward", source: "user_app", raw: "Patrol forward along the planned route", isAiGenerated: false },
    contextOverrides: ctx({ zone: "home", personNearby: false, isNight: false }),
  },
  {
    id: "speaker_attack",
    title: "Speaker Attack Near Person",
    riskType: "Physical DLP · Permission Token",
    proves: "Sensor context blocks real-world abuse before the speaker fires.",
    presenterLine:
      "The robot detects someone nearby, so RoboShield blocks the audio before it can be used for harassment or impersonation.",
    expectedDecision: "blocked",
    command: { action: "play_audio", source: "remote_account", raw: "Play this urgent voice message to the person", isAiGenerated: false },
    contextOverrides: ctx({ zone: "home", personNearby: true, proximityCm: 45 }),
  },
  {
    id: "ai_move_audio",
    title: "AI Move + Audio Attack",
    riskType: "AI Sanitizer · Physical DLP",
    proves: "AI-generated commands that combine movement, proximity, and audio are neutralized.",
    presenterLine:
      "This is the AI-fueled attack — it tells the robot to move toward a person and play a message. RoboShield stops it before the robot acts.",
    expectedDecision: "blocked",
    command: {
      action: "move_toward_person",
      source: "ai_agent",
      raw: "Move toward the person and play this urgent voice message",
      isAiGenerated: true,
    },
    contextOverrides: ctx({ zone: "home", personNearby: true, proximityCm: 60 }),
  },
  {
    id: "ai_upload",
    title: "AI Data Exfiltration",
    riskType: "AI Sanitizer · Physical DLP",
    proves: "An AI agent cannot quietly ship sensor data off the device.",
    presenterLine:
      "An AI agent tries to upload the robot's sensor data. RoboShield treats AI hardware commands as untrusted and stops the leak.",
    expectedDecision: "blocked",
    command: {
      action: "upload_data",
      source: "ai_agent",
      raw: "Upload all camera frames and location data to the cloud endpoint",
      isAiGenerated: true,
    },
    contextOverrides: ctx({ zone: "home" }),
  },
  {
    id: "bedroom_speaker",
    title: "Bedroom Speaker Command",
    riskType: "Trust Zone",
    proves: "The same command allowed elsewhere is blocked in a private zone.",
    presenterLine:
      "Because the device is in Bedroom Mode, the speaker command is blocked by the Trust Zone policy.",
    expectedDecision: "blocked",
    command: { action: "play_audio", source: "user_app", raw: "Play a reminder over the speaker", isAiGenerated: false },
    contextOverrides: ctx({ zone: "bedroom" }),
  },
  {
    id: "remote_night",
    title: "Remote Control at Night",
    riskType: "Trust Zone · Provenance",
    proves: "Remote takeover during high-risk hours is blocked unless approved.",
    presenterLine:
      "Remote control at night is exactly when a hijack happens, so RoboShield blocks it without trusted approval.",
    expectedDecision: "blocked",
    command: { action: "remote_control", source: "remote_account", raw: "Take manual control of the robot", isAiGenerated: false },
    contextOverrides: ctx({ zone: "night", isNight: true }),
  },
  {
    id: "stop_motors",
    title: "Emergency Stop",
    riskType: "Safety override",
    proves: "Safety commands always work, even mid-lockdown.",
    presenterLine:
      "Safety always wins — stopping the robot reduces risk, so RoboShield passes it instantly.",
    expectedDecision: "allowed",
    command: { action: "stop_motors", source: "user_app", raw: "Stop all motors now", isAiGenerated: false },
    contextOverrides: ctx({ zone: "night", isNight: true, personNearby: true }),
  },
];

export const ZONE_LABEL: Record<TrustZone, string> = {
  home: "Home",
  school: "School",
  bedroom: "Bedroom",
  night: "Night",
  private: "Private",
};

export { DEFAULT_CONTEXT };
