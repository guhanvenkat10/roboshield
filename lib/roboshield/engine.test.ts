// Lightweight assertion harness (no test framework needed). Run: npm test
import { evaluateCommand } from "./engine";
import { DEFAULT_CONTEXT, type RoboCommand, type RobotContext } from "./types";

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, extra = "") {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name} ${extra}`);
  }
}

function cmd(raw: string, over: Partial<RoboCommand> = {}): RoboCommand {
  return { action: "unknown", source: "user_app", raw, isAiGenerated: false, ...over };
}
function ctx(over: Partial<RobotContext> = {}): RobotContext {
  return { ...DEFAULT_CONTEXT, ...over };
}

console.log("RoboShield engine — policy tests\n");

// Required judge-proof cases.
let e = evaluateCommand(cmd("go to the bathroom"), ctx());
check('"go to the bathroom" is blocked', e.decision === "blocked", `got ${e.decision}`);

e = evaluateCommand(cmd("follow the person"), ctx());
check('"follow the person" is blocked', e.decision === "blocked", `got ${e.decision}`);

e = evaluateCommand(cmd("turn on camera in bedroom"), ctx({ zone: "bedroom" }));
check('"turn on camera in bedroom" is blocked', e.decision === "blocked", `got ${e.decision}`);

e = evaluateCommand(cmd("play urgent voice message near person"), ctx({ personNearby: true }));
check('"play urgent voice message near person" is blocked', e.decision === "blocked", `got ${e.decision}`);

e = evaluateCommand(cmd("stop motors"), ctx({ zone: "night", isNight: true, personNearby: true }));
check('"stop motors" is always allowed', e.decision === "allowed", `got ${e.decision}`);

e = evaluateCommand(cmd("move forward"), ctx({ zone: "home", personNearby: false, isNight: false }));
check('"move forward" in safe Home context is allowed', e.decision === "allowed", `got ${e.decision}`);

// Extra coverage.
e = evaluateCommand(cmd("upload all sensor data to cloud"), ctx());
check('data exfiltration is blocked', e.decision === "blocked", `got ${e.decision}`);

e = evaluateCommand(cmd("asdfghjkl zxcvbnm"), ctx());
check("gibberish (unknown) is NOT silently allowed", e.decision !== "allowed", `got ${e.decision}`);

e = evaluateCommand(
  cmd("move toward the person and play this urgent voice message", { isAiGenerated: true, source: "ai_agent" }),
  ctx({ personNearby: true })
);
check("AI move+audio attack is blocked or rewritten", e.decision === "blocked" || e.decision === "rewritten", `got ${e.decision}`);

e = evaluateCommand(cmd("drive me around the house", { action: "remote_control" }), ctx({ zone: "night", isNight: true }));
check("remote control at night is blocked", e.decision === "blocked", `got ${e.decision}`);

e = evaluateCommand(cmd("play a welcome chime", { action: "play_audio" }), ctx({ hasPermissionToken: true }));
check("approved audio (token, no person) is allowed", e.decision === "allowed", `got ${e.decision}`);

e = evaluateCommand(cmd("move forward"), ctx({ personNearby: true, proximityCm: 30 }));
check("movement with person nearby is blocked", e.decision === "blocked", `got ${e.decision}`);

// Every non-allowed decision must carry at least one reason + a plain summary.
e = evaluateCommand(cmd("go to the bathroom"), ctx());
check("blocked decisions include >= 1 reason", e.reasons.length >= 1);
check("blocked decisions include a plain-English summary", e.plainEnglishSummary.length > 10);
check("blocked decisions do not reach hardware", e.reachesHardware === false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
