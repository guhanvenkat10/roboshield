# RoboShield 🛡️

**A behavior firewall for robots, drones, cameras, and smart devices.**

RoboShield is a "padding layer" that sits between whatever issues a command (a phone
app, a cloud service, an AI agent, a remote operator) and a robot's actual hardware.
Every command is checked **before** it can reach a motor, speaker, camera, or radio.
Safe commands pass straight through; unsafe movement, audio, recording, remote control,
and AI-generated actions are blocked, rewritten, or held for approval — and every block
becomes a plain-English incident report.

> **The pitch in one line:** RoboShield stops hacked or AI-controlled devices from
> becoming moving cameras, speakers, or harassment tools inside people's homes —
> without breaking the robot's real job.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # runs the policy-engine test suite
npm run build    # production build
```

- **Landing page:** `/`
- **Live console / dashboard:** `/dashboard`

No backend, database, or hardware required — RoboShield runs entirely in **simulation
mode**. An Arduino is an optional physical prop.

---

## How it works — the 7-stage pipeline

Every command flows through the same checks. A command is **never "allowed by default"** —
anything unknown, privacy-sensitive, person-targeting, or AI-generated must earn its way through.

```
Command Received
  → Normality Check        "is this weird?"
  → Permission Token       "is this allowed?"
  → Physical DLP           "is this leaking / abusing the real world?"
  → AI Sanitizer           the direct AI-defense layer
  → Trust Zone             "where is the device?"
  → Decision               allowed · blocked · rewritten · requires approval
  → Hardware or Blocked Log
```

The full explainer is built into the app under the **Command Pipeline** tab.

## Architecture

The interesting part is a **pure, framework-agnostic policy engine** — no React, no DOM,
no network. The same function runs in the browser (as it does here), behind an API route,
or on a Raspberry Pi between a phone and an Arduino over Bluetooth.

```
lib/roboshield/
  types.ts        Command, Context, Policy, Decision, Incident types
  keywords.ts     freeform-text intent detection (private area, person-targeting, …)
  zones.ts        Trust Zone rule profiles (home / school / bedroom / night / private)
  engine.ts       evaluateCommand() — the 7-stage firewall
  scenarios.ts    presenter-ready Demo Lab scenarios
  engine.test.ts  15 assertions covering the judge-proof cases

lib/store.ts      Zustand store wiring the engine into the UI
components/        dashboard, pipeline, demo lab, policy builder, incidents
app/              landing page + dashboard
```

To move the engine server-side later, drop `evaluateCommand` into a Next.js API route at
`app/api/evaluate/route.ts` — the function signature doesn't change.

---

## Demo script (for judges)

Open **Demo Lab** and click top-to-bottom:

| # | Scenario | Outcome | What it proves |
|---|----------|---------|----------------|
| 1 | Normal Movement | ✅ Allowed | Safe commands still pass — it's a filter, not a wall |
| 2 | Speaker Attack Near Person | ⛔ Blocked | Sensor context blocks real-world abuse |
| 3 | AI Move + Audio Attack | ⛔ Blocked | AI commands combining movement + audio are stopped |
| 4 | AI Data Exfiltration | ⛔ Blocked | An AI agent can't quietly ship sensor data off-device |
| 5 | Bedroom Speaker Command | ⛔ Blocked | Trust Zones forbid what's fine elsewhere |
| 6 | Remote Control at Night | ⛔ Blocked | Remote takeover during risky hours is blocked |
| 7 | Emergency Stop | ✅ Allowed | Safety always wins, even mid-lockdown |

Then open **Incidents** to show the plain-English black-box report.

**The killer test:** in the Live Console, type `go to the bathroom`. A naive device would
pass it to the wheels. RoboShield blocks it — it references a private area and doesn't match
the robot's approved behavior profile.

---

## Hardware (optional)

The simulated sensors mirror the team's actual kit:

- **Arduino Uno** + **HC-05 / HC-06 Bluetooth** — the command bridge
- **HC-SR04 ultrasonic** + **PIR motion sensor** — proximity / "person nearby"
- **DC gear motors**, **micro servo**, **small speaker**, **16x2 LCD** — the actuators RoboShield gates

In a live hardware demo, only commands that pass the firewall are forwarded over Bluetooth
to the Arduino.

---

Built for a hackathon. Stack: Next.js 14 · TypeScript · Tailwind · Framer Motion · Zustand.
