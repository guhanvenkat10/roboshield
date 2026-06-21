# RoboShield Demo Rover — firmware

The robot runs its own benign job (obstacle-avoiding patrol) and obeys commands
over the serial port. The laptop running the RoboShield dashboard is the gateway —
only commands that pass the firewall get forwarded to the rover.

## Upload

1. Open `roboshield_rover/roboshield_rover.ino` in the Arduino IDE.
2. Select **Tools → Board → Arduino Uno** and the right **Port**.
3. Upload. Open **Serial Monitor** at **9600 baud**, set line ending to *Newline*.
4. Type `PING` → you should get `PONG`. Type `MOVE_TOWARD`, `PLAY_AUDIO`, `LOCKDOWN`,
   `PATROL` to test each behavior by hand before wiring up the dashboard.

## Wiring (generic L298N module + Uno)

| Signal | Pin | Notes |
|---|---|---|
| Left speed (ENA) | **5** (~PWM) | must be a PWM pin |
| Left dir | IN1 **4**, IN2 **7** | |
| Right speed (ENB) | **6** (~PWM) | must be a PWM pin |
| Right dir | IN3 **8**, IN4 **12** | |
| Ultrasonic | TRIG **2**, ECHO **3** | HC-SR04 |
| Green LED | **A0** | protected / patrolling |
| Red LED | **A1** | threat / blocked |
| Yellow LED | **A2** | lockdown |
| Speaker | **11** | through your inline resistor |

Adjust the pin constants at the top of the sketch to match how your chassis is
actually wired — every L298N chassis is a little different. If you're on the
**Adafruit Motor Shield** or **Arduino Motor Shield** instead of a bare L298N,
swap the four `leftMotor`/`rightMotor` lines for that library's calls; nothing
else changes.

## About the LCD (read this)

On a single Uno, the motor driver + ultrasonic + LEDs + speaker already use most
of the pins. A parallel 16x2 LCD needs **6 more** and won't fit cleanly. So:

- **Default:** LCD is **off** and the **R/G/Y LEDs are your stage status light** —
  green = protected, red = blocked/threat, yellow = lockdown. These read great
  from the back of a room.
- **Want the LCD too?** Use an **I2C backpack** (2 wires: SDA→A4, SCL→A5), install
  the `LiquidCrystal_I2C` library, and set `#define USE_LCD_I2C 1`. Set the
  address (often `0x27` or `0x3F`).

## Bluetooth (optional, for an untethered rover)

USB is the reliable default. To go wireless with your **HC-05/HC-06**:

- Module **VCC→5V, GND→GND**, module **TXD→Arduino RX (0)**, module **RXD→Arduino TX (1)**
  through a voltage divider (the module's RX is 3.3V).
- Pair it with the laptop (PIN usually `1234`/`0000`). It shows up as a serial
  port (e.g. `/dev/tty.HC-05` or a COM port) that the dashboard's **Connect Robot**
  button can open — same Web Serial code, no changes.
- ⚠️ Disconnect the module's TX/RX from pins 0/1 while **uploading** new firmware,
  or the upload will fail.

## Serial protocol

One command per line, case-insensitive. The dashboard sends these for you, but
they're handy for manual testing:

| Command | Effect |
|---|---|
| `PATROL` / `NORMAL` / `RESET` | resume autonomous obstacle-avoiding patrol |
| `FORWARD` | drive forward, still avoiding obstacles (safe) |
| `MOVE_TOWARD` | rogue charge forward (stops at the safety floor) |
| `PLAY_AUDIO` | blare the menacing speaker pattern |
| `STOP` | cut motors now |
| `LOCKDOWN` | cut motors + mute + yellow lockdown indicator |
| `PING` | replies `PONG` |

Telemetry is printed ~3×/sec: `T:mode=PATROL;dist=42;person=0`.

## Safety floor

Even in rogue mode the rover **never** drives closer than `SAFETY_FLOOR_CM` (15 cm).
It looks like it charges, then stops short — the human/prop stays safe. Keep that
guard in place for a live audience.
