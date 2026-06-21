# RoboShield — End-to-End Setup Guide

For the person building the robot. Follow top to bottom. Budget ~45–60 min the
first time. You do **not** need to understand the web app to do this part.

> **What you're building:** an Arduino rover that patrols and avoids obstacles on
> its own, and obeys commands from the laptop. The laptop (RoboShield) decides
> which commands are safe. The robot only does what gets approved.

---

## 0. Parts you'll grab from the kit

- Arduino **Uno** + USB cable
- The **chassis** with 4 DC motors + the **L298N** motor driver
- **HC-SR04** ultrasonic sensor (the "eyes")
- **Small speaker** (+ its inline resistor)
- **3 LEDs**: green, red, yellow (+ three ~220Ω resistors)
- A handful of **jumper wires** and the breadboard
- Battery pack for the motors (the 18650 holder or 9V)
- *(Optional)* HC-05/HC-06 Bluetooth module for going wireless later

---

## 1. Install the software (laptop)

1. Download the **Arduino IDE**: <https://www.arduino.cc/en/software> → install.
2. Open it once so it finishes setup.
3. *(Only if you use an I2C LCD later)* Sketch → Include Library → Manage
   Libraries → search **"LiquidCrystal I2C"** → Install. **You can skip this** —
   the LEDs are the main status display.

---

## 2. Wire it up

Power off everything first. Use this pin map (it's the default in the sketch — if
your chassis is wired differently, either rewire to match this or change the pin
numbers at the top of the sketch):

| What | Arduino pin | Goes to |
|---|---|---|
| Left motors speed | **5** | L298N **ENA** |
| Left motors dir | **4**, **7** | L298N **IN1**, **IN2** |
| Right motors speed | **6** | L298N **ENB** |
| Right motors dir | **8**, **12** | L298N **IN3**, **IN4** |
| Ultrasonic trigger | **2** | HC-SR04 **TRIG** |
| Ultrasonic echo | **3** | HC-SR04 **ECHO** |
| Green LED (+ resistor) | **A0** | LED → resistor → GND |
| Red LED (+ resistor) | **A1** | LED → resistor → GND |
| Yellow LED (+ resistor) | **A2** | LED → resistor → GND |
| Speaker (+ inline resistor) | **11** | speaker → resistor → GND |

Power notes:
- HC-SR04 **VCC → 5V**, **GND → GND**.
- L298N: motor battery pack into the L298N **12V/VMS + GND** terminals (NOT the
  Arduino 5V — motors need their own power). Tie the L298N **GND** to the Arduino
  **GND** so they share a ground. The L298N can feed 5V back to the Arduino via
  its onboard regulator, but during programming just keep the Arduino on USB.
- Each LED: long leg (+) to the Arduino pin **through** a resistor, short leg to GND.

> **First time? Wire the LEDs + ultrasonic + speaker first and skip the motors.**
> Get everything working on the bench, then add motors last so a code mistake
> can't make the robot bolt off the table.

---

## 3. Upload the firmware

1. Plug the Uno into the laptop with USB.
2. In Arduino IDE: open `firmware/roboshield_rover/roboshield_rover.ino` from this
   repo (File → Open).
3. **Tools → Board → Arduino Uno**.
4. **Tools → Port →** pick the one that appears when you plug in (often
   `COMx` on Windows, `/dev/cu.usbmodem…` on Mac).
5. Click **Upload** (→ arrow). Wait for "Done uploading".

> ⚠️ If you wired up an HC-05/06 to pins 0/1, **unplug its TX/RX before uploading**
> or the upload will fail. Reconnect after.

---

## 4. Test it by hand (no web app yet)

1. **Tools → Serial Monitor**. Set baud to **9600** (bottom right) and line ending
   to **Newline**.
2. You should see telemetry scrolling: `T:mode=PATROL;dist=…;person=…`.
3. Type these into the Serial Monitor's input box and press Enter:
   - `PING` → replies `PONG` ✅ (comms work)
   - `STOP` → motors stop, red LED
   - `PLAY_AUDIO` → speaker blares the alert pattern
   - `MOVE_TOWARD` → rover drives forward (the "rogue charge")
   - `LOCKDOWN` → motors cut, yellow LED
   - `PATROL` → back to normal, green LED
4. Wave your hand in front of the ultrasonic — `dist` should drop and `person`
   should flip to `1` when you're within ~60 cm.

If all of that works, the hardware is done. 🎉

---

## 5. Connect it to the RoboShield dashboard

On the laptop (needs **Chrome or Edge** — Web Serial doesn't work in Safari/Firefox):

1. In the repo: `npm install` (first time only), then `npm run dev`.
2. Open <http://localhost:3000/dashboard>.
3. Close the Arduino IDE's Serial Monitor (only one program can hold the port).
4. In the **Hardware Bridge** panel (right side of the Live Console), click
   **Connect Robot** → pick the Arduino's port → **Connect**.
5. You should see the **Mode / Distance / Person** tiles go live, and a green
   "Robot Connected" badge. Leave **"Live sensors drive the firewall"** ON.

Now the dashboard is in control: safe commands pass to the robot, blocked ones
turn into STOP/LOCKDOWN automatically.

---

## 6. The demo flow

Follow `docs/STAGE_DEMO.md` for the full script. The 20-second version:

1. Rover patrols (green).
2. In Hardware Bridge, flip **Firewall → BYPASSED**. Run **Demo Lab → AI Move +
   Audio Attack** → rover charges + blares (unprotected device).
3. Hit **STOP**, flip **Firewall → ENABLED**, run the same attack → rover does
   nothing, and an incident report appears.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Upload fails / "port busy" | Close Serial Monitor and the dashboard (they hold the port). Unplug Bluetooth from pins 0/1. |
| No telemetry in Serial Monitor | Baud must be **9600**. Check the USB cable is data-capable, not charge-only. |
| Motors don't spin | Motors need their **own battery** on the L298N, and L298N GND tied to Arduino GND. Check ENA/ENB are on pins 5/6. |
| Motors spin backwards | Swap that motor's two wires on the L298N output, or swap the IN1/IN2 (or IN3/IN4) pins in the sketch. |
| "Connect Robot" button greyed out | You're not in Chrome/Edge. Web Serial is Chromium-only. |
| Ultrasonic always reads 999 | TRIG/ECHO swapped, or sensor not on 5V. 999 means "nothing in range". |
| Rover charges and won't stop | It keeps a 15 cm safety floor, but use the **STOP** button and floor tape. In `MOVE_TOWARD` it drives until it sees something within range. |

---

## Going wireless (optional, do this last)

See **"Bluetooth"** in `firmware/README.md`. Short version: wire the HC-05/06,
pair it with the laptop, and in step 5 pick the Bluetooth serial port instead of
USB. Same code, no changes. Test on USB first.
