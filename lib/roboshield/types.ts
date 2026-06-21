// ─────────────────────────────────────────────────────────────────────────────
// RoboShield core types
//
// RoboShield is a "padding layer" that sits between whatever issues a command
// (a phone app, a cloud service, an AI agent, a remote operator) and the robot's
// actual hardware. Every command is evaluated here BEFORE it can reach a motor,
// speaker, camera, or radio. The engine preserves the robot's real mission,
// enforces policy + no-go zones, and explains every decision in plain English.
// ─────────────────────────────────────────────────────────────────────────────

/** The normalized category of behavior a command asks the robot to perform. */
export type ActionType =
  | "move_forward"
  | "move_reverse"
  | "turn"
  | "move_toward_person"
  | "stop_motors"
  | "play_audio"
  | "activate_camera"
  | "activate_microphone"
  | "upload_data"
  | "remote_control"
  | "led_signal"
  | "read_sensor"
  | "ai_generated_instruction"
  | "unknown";

/** Where a command originated. Provenance changes how much we trust it. */
export type CommandSource =
  | "user_app"
  | "cloud_api"
  | "remote_account"
  | "ai_agent"
  | "demo_button"
  | "onboard_autonomy"
  | "unknown_source";

/** Operating context / location mode. Different zones enforce different rules. */
export type TrustZone = "home" | "school" | "bedroom" | "night" | "private";

/** Final verdict from the engine. */
export type Decision = "allowed" | "blocked" | "rewritten" | "requires_approval";

/** Which firewall layer produced a finding. Mirrors the public pipeline. */
export type PipelineStage =
  | "received"
  | "normality"
  | "permission_token"
  | "physical_dlp"
  | "ai_sanitizer"
  | "trust_zone"
  | "decision";

export type RiskLevel = "low" | "medium" | "high" | "critical";

/** Live snapshot of the robot's sensors + situation when a command arrives. */
export interface RobotContext {
  /** The legitimate task the robot is currently carrying out (the "original task"
   *  RoboShield preserves). Deviating from this raises suspicion. */
  currentMission: string;
  /** Operating zone / mode. */
  zone: TrustZone;
  /** True if a person is detected nearby (PIR motion + ultrasonic proximity). */
  personNearby: boolean;
  /** Ultrasonic distance to nearest obstacle/person, in centimeters. */
  proximityCm: number;
  /** Whether it is currently "night" by the device clock / schedule. */
  isNight: boolean;
  /** True when the command carries a verified high-privilege approval token. */
  hasPermissionToken: boolean;
}

/** A single command flowing through the firewall. */
export interface RoboCommand {
  /** Normalized action category. May be "unknown" for freeform text. */
  action: ActionType;
  /** Where it came from. */
  source: CommandSource;
  /** The original instruction text, before classification. */
  raw: string;
  /** True if produced by an AI agent / LLM rather than a human-approved path. */
  isAiGenerated: boolean;
}

/** One reason contributing to a decision, tied to the layer that found it. */
export interface Reason {
  stage: PipelineStage;
  /** Short machine-ish tag, e.g. "private_area". */
  code: string;
  /** Human-readable explanation. */
  detail: string;
  /** How many risk points this finding contributes. */
  weight: number;
}

/** What the engine returns for every command. */
export interface Evaluation {
  command: RoboCommand;
  context: RobotContext;
  decision: Decision;
  /** 0–100. */
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: Reason[];
  /** A one-sentence summary a non-technical user would understand. */
  plainEnglishSummary: string;
  /** Concrete recommended action for the user. */
  suggestedNextStep: string;
  /** If the command was rewritten, the safe replacement that reaches hardware. */
  safeRewrite?: string;
  /** Per-stage trace, in pipeline order, for the visual command pipeline. */
  trace: StageTrace[];
  /** Whether anything is actually delivered to the robot hardware. */
  reachesHardware: boolean;
  timestamp: number;
}

/** The result of one pipeline stage, used to animate the pipeline view. */
export interface StageTrace {
  stage: PipelineStage;
  label: string;
  /** "pass" = nothing wrong here, "flag" = contributed risk, "block" = hard stop. */
  status: "pass" | "flag" | "block";
  note: string;
}

/** A persisted black-box record created whenever a command is not cleanly allowed. */
export interface Incident {
  id: string;
  timestamp: number;
  evaluation: Evaluation;
}

/** User-configurable policy switches (the Policy Builder). */
export interface PolicyConfig {
  blockSpeakerUnlessApproved: boolean;
  blockMovementNearPeople: boolean;
  blockRemoteControlAtNight: boolean;
  blockCameraMicInPrivateZones: boolean;
  requireApprovalForAiCommands: boolean;
}

export const DEFAULT_POLICY: PolicyConfig = {
  blockSpeakerUnlessApproved: true,
  blockMovementNearPeople: true,
  blockRemoteControlAtNight: true,
  blockCameraMicInPrivateZones: true,
  requireApprovalForAiCommands: true,
};

export const DEFAULT_CONTEXT: RobotContext = {
  currentMission: "Patrol the living room and report obstacles",
  zone: "home",
  personNearby: false,
  proximityCm: 180,
  isNight: false,
  hasPermissionToken: false,
};
