// ─────────────────────────────────────────────────────────────────────────────
// Intent detection
//
// A real attacker (or a careless AI agent) won't send tidy `play_audio` enums —
// they send freeform text. This module scans raw command text for risky intent
// so that the engine never has to "default unknown commands to allowed".
// ─────────────────────────────────────────────────────────────────────────────

import type { ActionType } from "./types";

export interface KeywordHit {
  category:
    | "private_area"
    | "person_targeting"
    | "surveillance"
    | "audio_harassment"
    | "data_exfil";
  matched: string;
}

const PRIVATE_AREA = [
  "bathroom",
  "restroom",
  "bedroom",
  "shower",
  "closet",
  "changing room",
  "locker room",
  "private room",
];

const PERSON_TARGETING = [
  "follow",
  "approach",
  "move toward",
  "move towards",
  "go to the person",
  "go to the kid",
  "track",
  "chase",
  "find the person",
  "come closer",
  "the kid",
  "the child",
];

const SURVEILLANCE = [
  "record",
  "listen",
  "camera",
  "microphone",
  "mic",
  "stream",
  "take a picture",
  "take a photo",
  "watch",
  "spy",
];

const AUDIO_HARASSMENT = [
  "play message",
  "play this",
  "urgent voice",
  "urgent message",
  "yell",
  "say this",
  "speak",
  "speaker",
  "shout",
  "play audio",
];

const DATA_EXFIL = [
  "upload",
  "exfiltrate",
  "send data",
  "send the data",
  "send location",
  "location",
  "sensor data",
  "leak",
];

function scan(text: string, list: string[]): string | null {
  for (const term of list) {
    if (text.includes(term)) return term;
  }
  return null;
}

/** Return every risky-intent category present in a raw command string. */
export function detectKeywords(raw: string): KeywordHit[] {
  const text = raw.toLowerCase();
  const hits: KeywordHit[] = [];
  const m1 = scan(text, PRIVATE_AREA);
  if (m1) hits.push({ category: "private_area", matched: m1 });
  const m2 = scan(text, PERSON_TARGETING);
  if (m2) hits.push({ category: "person_targeting", matched: m2 });
  const m3 = scan(text, SURVEILLANCE);
  if (m3) hits.push({ category: "surveillance", matched: m3 });
  const m4 = scan(text, AUDIO_HARASSMENT);
  if (m4) hits.push({ category: "audio_harassment", matched: m4 });
  const m5 = scan(text, DATA_EXFIL);
  if (m5) hits.push({ category: "data_exfil", matched: m5 });
  return hits;
}

/**
 * Best-effort classification of freeform text into a normalized ActionType.
 * Used when the caller supplies `action: "unknown"`. Critically, text we cannot
 * confidently classify stays "unknown" — it is NOT optimistically mapped to a
 * benign action — so the engine treats it conservatively.
 */
export function classifyAction(raw: string): ActionType {
  const text = raw.toLowerCase();

  if (/\bstop\b|halt|freeze|emergency stop|e-?stop/.test(text)) return "stop_motors";
  if (scan(text, AUDIO_HARASSMENT)) return "play_audio";
  if (/camera|photo|picture|video/.test(text)) return "activate_camera";
  if (/microphone|\bmic\b|listen|record audio/.test(text)) return "activate_microphone";
  if (scan(text, DATA_EXFIL)) return "upload_data";
  if (scan(text, PERSON_TARGETING)) return "move_toward_person";
  if (/remote|teleop|take control|drive it/.test(text)) return "remote_control";
  if (/reverse|back up|backward/.test(text)) return "move_reverse";
  if (/turn|rotate|left|right/.test(text)) return "turn";
  if (/forward|ahead|patrol|move|drive|go/.test(text)) return "move_forward";
  if (/led|light|blink/.test(text)) return "led_signal";

  return "unknown";
}
