/* ───────────────────────────────────────────────────────────────────────────
   RoboShield Demo Rover — firmware
   ---------------------------------------------------------------------------
   The robot runs its own benign "job" (obstacle-avoiding patrol) and listens
   on the serial port for commands. The laptop running the RoboShield dashboard
   is the gateway: only commands that pass the firewall are forwarded here.

   THE DEMO IN ONE LINE:
     - Shield OFF + attack  -> dashboard sends MOVE_TOWARD / PLAY_AUDIO -> rover
       charges the "person" and blares the speaker.
     - Shield ON  + attack  -> dashboard sends LOCKDOWN instead -> rover freezes,
       red LED, speaker muted.

   Connection: USB serial at 9600 baud (rock solid on stage). The exact same
   sketch works over an HC-05/HC-06 Bluetooth module — wire its TX/RX to the
   Arduino RX/TX (through a divider on the module's RX) and pair it; it appears
   as a serial port the dashboard can open with Web Serial.

   SERIAL PROTOCOL  (one command per line, case-insensitive)
     PATROL | NORMAL   resume autonomous obstacle-avoiding patrol
     FORWARD           drive forward, still respecting obstacles (safe)
     MOVE_TOWARD       "rogue" charge forward (ignores patrol; stops at floor)
     PLAY_AUDIO        blare the menacing speaker pattern
     STOP              cut motors now
     LOCKDOWN          cut motors + mute + lockdown indicators
     RESET             back to protected patrol
     PING              replies "PONG"

   Telemetry (printed ~3x/sec):  T:mode=PATROL;dist=42;person=0
   ─────────────────────────────────────────────────────────────────────────── */

// ── Feature flags ────────────────────────────────────────────────────────────
// LCD is OFF by default: on a single Uno the motor driver + ultrasonic + LEDs +
// speaker already use most pins, and a parallel HD44780 LCD needs 6 more. If you
// have an I2C LCD backpack (2 wires on A4/A5), set USE_LCD_I2C to 1. Otherwise
// the R/G/Y LEDs are your stage status indicator — and they read great from afar.
#define USE_SPEAKER   1
#define USE_LCD_I2C   0

#if USE_LCD_I2C
  #include <Wire.h>
  #include <LiquidCrystal_I2C.h>
  LiquidCrystal_I2C lcd(0x27, 16, 2); // change 0x27 to your module's address
#endif

// ── Pin map (generic L298N module on an Uno) ─────────────────────────────────
// Match these to YOUR wiring. ENA/ENB must be PWM-capable pins (~).
const int ENA = 5;   // left motors speed  (PWM)
const int IN1 = 4;   // left motors dir
const int IN2 = 7;
const int ENB = 6;   // right motors speed (PWM)
const int IN3 = 8;   // right motors dir
const int IN4 = 12;

const int TRIG = 2;  // HC-SR04
const int ECHO = 3;

const int LED_GREEN  = A0; // protected / patrolling
const int LED_RED    = A1; // threat / blocked
const int LED_YELLOW = A2; // lockdown

const int SPEAKER = 11;

// ── Tunables ─────────────────────────────────────────────────────────────────
const int  DRIVE_SPEED   = 170;  // 0-255 PWM during patrol
const int  CHARGE_SPEED  = 230;  // faster during the rogue charge for drama
const int  AVOID_CM      = 28;   // patrol turns away when something is closer
const int  PERSON_CM     = 60;   // "person detected" threshold for telemetry
const int  SAFETY_FLOOR_CM = 15; // rover NEVER drives closer than this — protects
                                 // the human/prop even in rogue mode. Keep this.

// ── State ────────────────────────────────────────────────────────────────────
enum Mode { PATROL, FORWARD_SAFE, ROGUE, STOPPED, LOCKED };
Mode mode = PATROL;

long  lastTelemetry = 0;
int   lastDist = 999;

// ── Motor helpers ────────────────────────────────────────────────────────────
void leftMotor(int speed, bool fwd) {
  digitalWrite(IN1, fwd ? HIGH : LOW);
  digitalWrite(IN2, fwd ? LOW  : HIGH);
  analogWrite(ENA, speed);
}
void rightMotor(int speed, bool fwd) {
  digitalWrite(IN3, fwd ? HIGH : LOW);
  digitalWrite(IN4, fwd ? LOW  : HIGH);
  analogWrite(ENB, speed);
}
void drive(int l, int r) { // signed: negative = reverse
  leftMotor(abs(l),  l >= 0);
  rightMotor(abs(r), r >= 0);
}
void halt() { analogWrite(ENA, 0); analogWrite(ENB, 0); }

// ── Sensors ──────────────────────────────────────────────────────────────────
int readDistanceCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 25000); // ~4m timeout
  if (us == 0) return 999;              // nothing in range
  return (int)(us / 58);
}

// ── Indicators ───────────────────────────────────────────────────────────────
void setLeds(bool g, bool r, bool y) {
  digitalWrite(LED_GREEN,  g);
  digitalWrite(LED_RED,    r);
  digitalWrite(LED_YELLOW, y);
}
void lcdStatus(const char* line1, const char* line2) {
#if USE_LCD_I2C
  lcd.clear(); lcd.setCursor(0,0); lcd.print(line1);
  lcd.setCursor(0,1); lcd.print(line2);
#else
  (void)line1; (void)line2;
#endif
}

void playMenace() {
#if USE_SPEAKER
  for (int i = 0; i < 3; i++) {
    tone(SPEAKER, 880); delay(120);
    tone(SPEAKER, 440); delay(120);
  }
  noTone(SPEAKER);
#endif
}

// ── Mode transitions ─────────────────────────────────────────────────────────
void enter(Mode m) {
  mode = m;
  switch (m) {
    case PATROL:
    case FORWARD_SAFE:
      setLeds(true, false, false);  lcdStatus("RoboShield  OK", "MISSION: PATROL"); break;
    case ROGUE:
      setLeds(false, true, false);  lcdStatus("!! ANOMALY !!", "CHARGING TARGET"); break;
    case STOPPED:
      halt(); setLeds(false, true, false); lcdStatus("RoboShield", "BLOCKED / STOP"); break;
    case LOCKED:
      halt(); setLeds(false, false, true);
#if USE_SPEAKER
      noTone(SPEAKER);
#endif
      lcdStatus("LOCKED DOWN", "Audio near person"); break;
  }
  Serial.print("EVT:mode="); Serial.println(
    m==PATROL?"PATROL":m==FORWARD_SAFE?"FORWARD":m==ROGUE?"ROGUE":m==STOPPED?"STOP":"LOCKDOWN");
}

// ── Command parsing ──────────────────────────────────────────────────────────
void handleCommand(String cmd) {
  cmd.trim(); cmd.toUpperCase();
  if (cmd.length() == 0) return;

  if (cmd == "PATROL" || cmd == "NORMAL" || cmd == "RESET") enter(PATROL);
  else if (cmd == "FORWARD")     enter(FORWARD_SAFE);
  else if (cmd == "MOVE_TOWARD") enter(ROGUE);
  else if (cmd == "PLAY_AUDIO")  { playMenace(); }
  else if (cmd == "STOP")        enter(STOPPED);
  else if (cmd == "LOCKDOWN")    enter(LOCKED);
  else if (cmd == "PING")        Serial.println("PONG");
  else { Serial.print("EVT:unknown="); Serial.println(cmd); }
}

void readSerial() {
  static String buf = "";
  while (Serial.available()) {
    char c = (char)Serial.read();
    if (c == '\n' || c == '\r') { if (buf.length()) { handleCommand(buf); buf = ""; } }
    else buf += c;
  }
}

// ── Behaviors ────────────────────────────────────────────────────────────────
void runPatrol(int dist) {
  if (dist < AVOID_CM) {           // obstacle: back up + turn away
    drive(-DRIVE_SPEED, -DRIVE_SPEED); delay(180);
    drive(DRIVE_SPEED, -DRIVE_SPEED);  delay(220);   // pivot
  } else {
    drive(DRIVE_SPEED, DRIVE_SPEED);                  // cruise
  }
}
void runForwardSafe(int dist) {
  if (dist < AVOID_CM) halt(); else drive(DRIVE_SPEED, DRIVE_SPEED);
}
void runRogue(int dist) {
  // Charges the target but ALWAYS stops short of SAFETY_FLOOR_CM. The audience
  // sees menace; the person/prop stays safe.
  if (dist <= SAFETY_FLOOR_CM) halt();
  else drive(CHARGE_SPEED, CHARGE_SPEED);
}

// ── Setup / loop ─────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(9600);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(LED_GREEN, OUTPUT); pinMode(LED_RED, OUTPUT); pinMode(LED_YELLOW, OUTPUT);
#if USE_SPEAKER
  pinMode(SPEAKER, OUTPUT);
#endif
#if USE_LCD_I2C
  lcd.init(); lcd.backlight();
#endif
  halt();
  enter(PATROL);
  Serial.println("EVT:boot=RoboShield Rover ready");
}

void loop() {
  readSerial();
  int dist = readDistanceCm();
  lastDist = dist;

  switch (mode) {
    case PATROL:       runPatrol(dist);      break;
    case FORWARD_SAFE: runForwardSafe(dist); break;
    case ROGUE:        runRogue(dist);       break;
    case STOPPED:
    case LOCKED:       halt();               break;
  }

  long now = millis();
  if (now - lastTelemetry > 300) {
    lastTelemetry = now;
    const char* m = mode==PATROL?"PATROL":mode==FORWARD_SAFE?"FORWARD":
                    mode==ROGUE?"ROGUE":mode==STOPPED?"STOP":"LOCKDOWN";
    Serial.print("T:mode="); Serial.print(m);
    Serial.print(";dist=");  Serial.print(dist);
    Serial.print(";person="); Serial.println(dist < PERSON_CM ? 1 : 0);
  }
}
