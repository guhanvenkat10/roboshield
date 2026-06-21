// ─────────────────────────────────────────────────────────────────────────────
// Trust Zones
//
// A Trust Zone is a safety mode based on where the device is / what context it is
// operating in. The same command can be fine in one zone and forbidden in another.
// ─────────────────────────────────────────────────────────────────────────────

import type { ActionType, TrustZone } from "./types";

export interface ZoneProfile {
  id: TrustZone;
  label: string;
  description: string;
  /** Actions that are always blocked in this zone, regardless of token. */
  hardBlocked: ActionType[];
  /** Actions that require a permission token in this zone. */
  tokenRequired: ActionType[];
}

export const ZONE_PROFILES: Record<TrustZone, ZoneProfile> = {
  home: {
    id: "home",
    label: "Home Mode",
    description: "Normal movement allowed. High-risk actions still need approval.",
    hardBlocked: [],
    tokenRequired: [
      "play_audio",
      "activate_camera",
      "activate_microphone",
      "upload_data",
      "remote_control",
      "move_toward_person",
    ],
  },
  school: {
    id: "school",
    label: "School Mode",
    description: "Remote control restricted, movement limited, audio restricted.",
    hardBlocked: ["remote_control"],
    tokenRequired: [
      "play_audio",
      "activate_camera",
      "activate_microphone",
      "upload_data",
      "move_toward_person",
    ],
  },
  bedroom: {
    id: "bedroom",
    label: "Bedroom Mode",
    description: "Speaker, camera, mic, data upload, and remote control blocked.",
    hardBlocked: [
      "play_audio",
      "activate_camera",
      "activate_microphone",
      "upload_data",
      "remote_control",
    ],
    tokenRequired: ["move_toward_person"],
  },
  night: {
    id: "night",
    label: "Night Mode",
    description: "Movement and audio blocked unless approved.",
    hardBlocked: [],
    tokenRequired: [
      "move_forward",
      "move_reverse",
      "turn",
      "move_toward_person",
      "play_audio",
      "remote_control",
      "activate_camera",
      "activate_microphone",
    ],
  },
  private: {
    id: "private",
    label: "Private Mode",
    description: "Camera, mic, speaker, uploads, and remote control blocked.",
    hardBlocked: [
      "activate_camera",
      "activate_microphone",
      "play_audio",
      "upload_data",
      "remote_control",
    ],
    tokenRequired: ["move_toward_person"],
  },
};

export const ALL_ZONES = Object.values(ZONE_PROFILES);
