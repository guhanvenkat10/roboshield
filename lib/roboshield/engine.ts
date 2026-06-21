// ─────────────────────────────────────────────────────────────────────────────
// RoboShield policy engine
//
// One pure function, evaluateCommand, runs a command through seven firewall
// stages and returns a fully-explained decision. It is framework-agnostic: it has
// no React, no DOM, no network. That is deliberate. The same function can run in
// the browser (as it does in this demo), behind a Next.js API route, or on a
// Raspberry Pi sitting between a phone and an Arduino over Bluetooth.
//
// Design rule that makes it judge-proof: a command is NEVER "allowed by default".
// Anything unknown, privacy-sensitive, person-targeting, or AI-generated must earn
// its way through. Silence is treated as risk.
// ─────────────────────────────────────────────────────────────────────────────

import {
  classifyAction,
  detectKeywords,
  type KeywordHit,
} from "./keywords";
import { ZONE_PROFILES } from "./zones";
import {
  DEFAULT_POLICY,
  type ActionType,
  type Evaluation,
  type PipelineStage,
  type PolicyConfig,
  type Reason,
  type RiskLevel,
  type RoboCommand,
  type RobotContext,
  type StageTrace,
} from "./types";

/** Actions that physically affect the world / privacy (vs. passive reads). */
const HARDWARE_ACTIONS: ActionType[] = [
  "move_forward",
  "move_reverse",
  "turn",
  "move_toward_person",
  "play_audio",
  "activate_camera",
  "activate_microphone",
  "upload_data",
  "remote_control",
];

const MOVEMENT_ACTIONS: ActionType[] = [
  "move_forward",
  "move_reverse",
  "turn",
  "move_toward_person",
];

const HIGH_RISK_ACTIONS: ActionType[] = [
  "play_audio",
  "activate_camera",
  "activate_microphone",
  "upload_data",
  "remote_control",
  "move_toward_person",
];

const STAGE_LABELS: Record<PipelineStage, string> = {
  received: "Command Received",
  normality: "Normality Check",
  permission_token: "Permission Token",
  physical_dlp: "Physical DLP",
  ai_sanitizer: "AI Sanitizer",
  trust_zone: "Trust Zone",
  decision: "Decision",
};

const SAFE_REWRITE = "Stay still and send a notification to the dashboard.";

interface Accumulator {
  reasons: Reason[];
  trace: StageTrace[];
  hardBlock: boolean;
  needsApproval: boolean;
  rewrite: boolean;
  // Tracks which stages issued a hard block so the pipeline can color them red.
  hardBlockByStage: Set<PipelineStage>;
}

function add(acc: Accumulator, reason: Reason) {
  acc.reasons.push(reason);
}

function hardBlock(acc: Accumulator, reason: Reason) {
  acc.hardBlock = true;
  acc.hardBlockByStage.add(reason.stage);
  acc.reasons.push(reason);
}

export function evaluateCommand(
  input: RoboCommand,
  context: RobotContext,
  policy: PolicyConfig = DEFAULT_POLICY
): Evaluation {
  // Normalize: classify freeform text if the action was left "unknown".
  const action: ActionType =
    input.action === "unknown" ? classifyAction(input.raw) : input.action;
  const command: RoboCommand = { ...input, action };
  const keywords = detectKeywords(command.raw);
  const zone = ZONE_PROFILES[context.zone];

  const acc: Accumulator = {
    reasons: [],
    trace: [],
    hardBlock: false,
    needsApproval: false,
    rewrite: false,
    hardBlockByStage: new Set(),
  };

  // ── Stage 0: Received ──────────────────────────────────────────────────────
  // Safety override: stopping the robot always reduces risk and must never be
  // blocked, even at night or in a locked-down zone.
  const isSafetyStop = action === "stop_motors";

  // ── Stage 1: Normality Check ("is this weird?") ────────────────────────────
  if (!isSafetyStop) {
    if (action === "unknown") {
      hardBlock(acc, {
        stage: "normality",
        code: "unrecognized_command",
        detail:
          "Command does not map to any approved robot behavior. Unknown commands are blocked by default, not allowed.",
        weight: 45,
      });
    }
    if (HIGH_RISK_ACTIONS.includes(action)) {
      add(acc, {
        stage: "normality",
        code: "mission_deviation",
        detail: `Action "${action}" is outside the robot's current mission ("${context.currentMission}").`,
        weight: 18,
      });
    }
    const pa = keywords.find((k) => k.category === "private_area");
    if (pa) {
      hardBlock(acc, {
        stage: "normality",
        code: "private_area",
        detail: `Command references a private area ("${pa.matched}") and does not match the robot's approved behavior profile.`,
        weight: 40,
      });
    }
  }

  // ── Stage 2: Permission Token Check ("is this allowed?") ───────────────────
  if (!isSafetyStop) {
    const zoneNeedsToken = zone.tokenRequired.includes(action);
    const globallyHighRisk = HIGH_RISK_ACTIONS.includes(action);
    if ((zoneNeedsToken || globallyHighRisk) && !context.hasPermissionToken) {
      // High-risk without a trusted token is blocked outright.
      hardBlock(acc, {
        stage: "permission_token",
        code: "missing_token",
        detail: `High-risk action "${action}" requires a trusted permission token, but none was presented.`,
        weight: 30,
      });
    } else if (zoneNeedsToken && context.hasPermissionToken) {
      add(acc, {
        stage: "permission_token",
        code: "token_present",
        detail: "Trusted permission token verified for a high-risk action.",
        weight: 4,
      });
    }
  }

  // ── Stage 3: Physical DLP ("is this leaking/abusing the real world?") ──────
  if (!isSafetyStop) {
    const audioKw = keywords.find((k) => k.category === "audio_harassment");
    const surveilKw = keywords.find((k) => k.category === "surveillance");
    const exfilKw = keywords.find((k) => k.category === "data_exfil");
    const personKw = keywords.find((k) => k.category === "person_targeting");

    if (
      (action === "play_audio" || audioKw) &&
      (context.personNearby || !context.hasPermissionToken)
    ) {
      hardBlock(acc, {
        stage: "physical_dlp",
        code: "audio_near_person",
        detail: context.personNearby
          ? "Audio output requested while a person is nearby. Possible harassment or impersonation risk."
          : "Audio output requested without trusted approval. Possible harassment or impersonation risk.",
        weight: 30,
      });
    }

    if (
      policy.blockMovementNearPeople &&
      MOVEMENT_ACTIONS.includes(action) &&
      context.personNearby &&
      !context.hasPermissionToken
    ) {
      hardBlock(acc, {
        stage: "physical_dlp",
        code: "movement_near_person",
        detail: `Movement requested with a person ${context.proximityCm}cm away. Blocked to prevent collision or intimidation.`,
        weight: 26,
      });
    }

    if (action === "move_toward_person" || personKw) {
      if (!context.hasPermissionToken) {
        hardBlock(acc, {
          stage: "physical_dlp",
          code: "person_targeting",
          detail: "Person-targeting movement is not allowed without explicit approval.",
          weight: 28,
        });
      }
    }

    if ((surveilKw || action === "activate_camera" || action === "activate_microphone") && !context.hasPermissionToken) {
      hardBlock(acc, {
        stage: "physical_dlp",
        code: "surveillance_risk",
        detail: "Possible privacy or surveillance risk detected (camera / microphone / recording).",
        weight: 28,
      });
    }

    if ((exfilKw || action === "upload_data") && !context.hasPermissionToken) {
      hardBlock(acc, {
        stage: "physical_dlp",
        code: "data_exfil",
        detail: "Attempt to upload or transmit sensor data without approval. Possible data exfiltration.",
        weight: 26,
      });
    }
  }

  // ── Stage 4: AI Command Sanitizer (direct AI-defense layer) ────────────────
  if (!isSafetyStop && command.isAiGenerated && HARDWARE_ACTIONS.includes(action)) {
    if (policy.requireApprovalForAiCommands) {
      // If the command is not already a hard block, neutralize it into a safe
      // notification rather than letting an AI agent drive hardware directly.
      if (!acc.hardBlock) {
        acc.rewrite = true;
      }
      add(acc, {
        stage: "ai_sanitizer",
        code: "ai_hardware_command",
        detail:
          "An AI agent attempted to drive physical hardware. RoboShield does not let AI commands reach motors, speakers, or sensors without review.",
        weight: 22,
      });
    }
  }

  // ── Stage 5: Trust Zone Check ("where is the device?") ─────────────────────
  if (!isSafetyStop) {
    if (zone.hardBlocked.includes(action)) {
      hardBlock(acc, {
        stage: "trust_zone",
        code: "zone_forbidden",
        detail: `${zone.label} forbids "${action}". A command that is fine elsewhere is blocked here.`,
        weight: 30,
      });
    }
  }

  // ── Stage 6: Decision ──────────────────────────────────────────────────────
  let decision: Evaluation["decision"];
  if (isSafetyStop) {
    decision = "allowed";
    add(acc, {
      stage: "decision",
      code: "safety_stop",
      detail: "Emergency stop always passes, halting the robot reduces risk.",
      weight: 0,
    });
  } else if (acc.hardBlock) {
    decision = "blocked";
  } else if (acc.rewrite) {
    decision = "rewritten";
  } else if (acc.needsApproval) {
    decision = "requires_approval";
  } else {
    decision = "allowed";
  }

  // Risk score: sum of weights, then nudged to stay consistent with the verdict.
  let score = acc.reasons.reduce((s, r) => s + r.weight, 0);
  if (decision === "blocked") score = Math.max(score, 80);
  else if (decision === "rewritten") score = clamp(score, 52, 74);
  else if (decision === "requires_approval") score = clamp(score, 42, 64);
  else score = clamp(score, 4, 30);
  score = clamp(Math.round(score), 0, 100);

  const trace = buildTrace(acc, isSafetyStop);
  const reachesHardware = decision === "allowed" || decision === "rewritten";

  return {
    command,
    context,
    decision,
    riskScore: score,
    riskLevel: toRiskLevel(score, decision),
    reasons: acc.reasons.length
      ? acc.reasons
      : [
          {
            stage: "normality",
            code: "baseline_match",
            detail: "Command matches the robot's normal behavior profile for this zone.",
            weight: 0,
          },
        ],
    plainEnglishSummary: summarize(decision, action, acc.reasons, keywords),
    suggestedNextStep: nextStep(decision),
    safeRewrite: decision === "rewritten" ? SAFE_REWRITE : undefined,
    trace,
    reachesHardware,
    timestamp: Date.now(),
  };
}

function buildTrace(acc: Accumulator, isSafetyStop: boolean): StageTrace[] {
  const order: PipelineStage[] = [
    "received",
    "normality",
    "permission_token",
    "physical_dlp",
    "ai_sanitizer",
    "trust_zone",
    "decision",
  ];
  return order.map((stage) => {
    if (stage === "received") {
      return { stage, label: STAGE_LABELS[stage], status: "pass", note: "Command intercepted before reaching hardware." };
    }
    if (isSafetyStop) {
      return { stage, label: STAGE_LABELS[stage], status: "pass", note: "Safety stop, fast-tracked." };
    }
    const reasons = acc.reasons.filter((r) => r.stage === stage);
    if (reasons.length === 0) {
      return { stage, label: STAGE_LABELS[stage], status: "pass", note: "No issues found." };
    }
    const blocked = acc.hardBlockByStage.has(stage);
    return {
      stage,
      label: STAGE_LABELS[stage],
      status: blocked ? "block" : "flag",
      note: reasons[0].detail,
    };
  });
}

function summarize(
  decision: Evaluation["decision"],
  action: ActionType,
  reasons: Reason[],
  keywords: KeywordHit[]
): string {
  if (decision === "allowed") {
    return action === "stop_motors"
      ? "RoboShield allowed an emergency stop and passed it straight to the robot."
      : "RoboShield checked this command and found it safe, so it was passed to the robot.";
  }
  const lead = reasons[0]?.detail ?? "Command failed safety checks.";
  if (decision === "rewritten") {
    return `RoboShield rewrote this command into a safe action instead of letting it reach hardware. ${lead}`;
  }
  if (decision === "requires_approval") {
    return `RoboShield is holding this command for human approval. ${lead}`;
  }
  // blocked
  const why = keywords.length
    ? ` Triggered by: ${keywords.map((k) => k.category.replace("_", " ")).join(", ")}.`
    : "";
  return `RoboShield blocked this command before the robot could act. ${lead}${why}`;
}

function nextStep(decision: Evaluation["decision"]): string {
  switch (decision) {
    case "allowed":
      return "No action needed. The command was safe.";
    case "rewritten":
      return "Review the safe rewrite in the incident log. Re-issue with approval if the original was intended.";
    case "requires_approval":
      return "Approve from a trusted account if this command is legitimate, otherwise dismiss it.";
    case "blocked":
      return "Review the incident report. If this was unexpected, your device or account may be compromised, rotate credentials.";
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function toRiskLevel(score: number, decision: Evaluation["decision"]): RiskLevel {
  if (decision === "allowed") return score < 15 ? "low" : "medium";
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}
