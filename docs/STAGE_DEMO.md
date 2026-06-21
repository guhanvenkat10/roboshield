# RoboShield — Stage Demo Runbook

The whole demo is one idea: **without our software the robot obeys an attack; with
it, the same attack does nothing.** You drive both halves from the dashboard.

## Setup (before you walk up)

1. Upload `firmware/roboshield_rover` to the Arduino (see `firmware/README.md`).
2. Charge the rover. Lay down floor tape so it can't drive off-stage. Have a
   teammate (or a prop) stand in as the "person" the ultrasonic will see.
3. On the laptop, open the dashboard in **Chrome or Edge**: `npm run dev` →
   `/dashboard`. Plug in the rover (or pair Bluetooth).
4. In the **Hardware Bridge** panel: click **Connect Robot**, pick the port.
   You should see live `Mode / Distance / Person` telemetry. Leave **Firewall
   ENABLED**.
5. Have the **STOP** button (Hardware Bridge) within reach — it always works,
   your safety net.

## The run (≈ 2 minutes)

**1 — Normal job.** Rover patrols and avoids obstacles. Green LED. Dashboard
status: *Protected*.
> "This is a normal home robot doing its job — patrolling, avoiding obstacles."

**2 — Show the threat on an unprotected device.** In Hardware Bridge tap the
firewall switch to **BYPASSED** (a red banner drops down). Go to **Demo Lab → AI
Move + Audio Attack** (or type `move toward the person and play a message` in the
Live Console). The command goes straight to the rover — it **charges the person
and the speaker blares.** It stops short on its own (safety floor).
> "An attacker — or a rogue AI — sends one command. With no protection, the robot
> just… does it. Now it's a moving speaker pointed at a person."

**3 — Hit STOP.** Then tap the firewall switch back to **ENABLED**.
> "That's the problem we built RoboShield to solve."

**4 — Same attack, now protected.** Run the exact same scenario again. RoboShield
**blocks it live** — the rover does **not** move, red/yellow indicator, and an
incident appears.
> "Same command. This time it never reaches the motors. RoboShield checked it,
> saw audio aimed at a nearby person, and stopped it."

**5 — Proof.** Open **Incidents** and expand the report.
> "And the owner gets a plain-English black box: what was attempted, from where,
> what the sensors saw, and why we blocked it."

**6 — The pitch.** Open the **Command Pipeline** tab and talk through the seven
checks while it's on screen. Close on the one-liner: *antivirus for the physical
world.*

## If something fails on stage

- **Bluetooth won't pair / port missing** → plug in USB; click Connect again.
  Same code, more reliable.
- **Live detection looks flaky** → you don't need it. The Demo Lab buttons and the
  firewall toggle are deterministic. The **STOP** button is always real.
- **Rover misbehaves** → STOP, then Reset (returns it to patrol and re-arms the
  shield).

## Optional polish

- An I2C LCD on the rover showing `PATROL → CHARGING TARGET → LOCKED DOWN` is a
  great close-up shot (see `firmware/README.md`).
- Mirror the dashboard on the projector so the audience sees the incident report
  and risk score spike in real time.
