"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Web Serial bridge
//
// Connects the RoboShield dashboard (running in Chrome/Edge) directly to the
// Demo Rover over USB serial — no Node server in between. The same port works
// for an HC-05/HC-06 Bluetooth module once it's paired (it shows up as a serial
// port to the OS). Everything degrades gracefully when no robot is connected.
// ─────────────────────────────────────────────────────────────────────────────

import type { ActionType, Decision } from "./roboshield";

export interface RobotTelemetry {
  mode: string;
  dist: number;
  person: boolean;
}

type StatusListener = (connected: boolean) => void;
type TelemetryListener = (t: RobotTelemetry) => void;
type LogListener = (line: string) => void;

export function isSerialSupported(): boolean {
  return typeof navigator !== "undefined" && "serial" in navigator;
}

class SerialBridge {
  private port: any = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private readBuffer = "";
  private encoder = new TextEncoder();

  private statusListeners = new Set<StatusListener>();
  private telemetryListeners = new Set<TelemetryListener>();
  private logListeners = new Set<LogListener>();

  connected = false;
  lastTelemetry: RobotTelemetry | null = null;

  onStatus(fn: StatusListener) {
    this.statusListeners.add(fn);
    return () => this.statusListeners.delete(fn);
  }
  onTelemetry(fn: TelemetryListener) {
    this.telemetryListeners.add(fn);
    return () => this.telemetryListeners.delete(fn);
  }
  onLog(fn: LogListener) {
    this.logListeners.add(fn);
    return () => this.logListeners.delete(fn);
  }

  private setConnected(v: boolean) {
    this.connected = v;
    this.statusListeners.forEach((fn) => fn(v));
  }

  async connect(): Promise<boolean> {
    if (!isSerialSupported()) {
      throw new Error("Web Serial isn't supported in this browser. Use Chrome or Edge.");
    }
    try {
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.writer = this.port.writable.getWriter();
      this.setConnected(true);
      this.readLoop(); // fire and forget
      // Nudge the rover so we get an immediate telemetry line.
      await this.send("PING");
      return true;
    } catch (err) {
      this.setConnected(false);
      throw err;
    }
  }

  async disconnect() {
    try {
      this.reader?.cancel().catch(() => {});
      this.reader?.releaseLock();
      this.writer?.releaseLock();
      await this.port?.close();
    } catch {
      /* ignore */
    } finally {
      this.port = null;
      this.writer = null;
      this.reader = null;
      this.setConnected(false);
    }
  }

  /** Send a single protocol command (newline is appended). No-op if disconnected. */
  async send(command: string) {
    if (!this.writer) return;
    try {
      await this.writer.write(this.encoder.encode(command.trim() + "\n"));
    } catch {
      // Port likely yanked — treat as a disconnect.
      this.setConnected(false);
    }
  }

  private async readLoop() {
    try {
      this.reader = this.port.readable.getReader();
      const decoder = new TextDecoder();
      while (this.reader) {
        const { value, done } = await this.reader.read();
        if (done) break;
        this.readBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = this.readBuffer.indexOf("\n")) >= 0) {
          const line = this.readBuffer.slice(0, nl).trim();
          this.readBuffer = this.readBuffer.slice(nl + 1);
          if (line) this.handleLine(line);
        }
      }
    } catch {
      /* reader cancelled / device gone */
    } finally {
      this.setConnected(false);
    }
  }

  private handleLine(line: string) {
    this.logListeners.forEach((fn) => fn(line));
    if (line.startsWith("T:")) {
      const t = parseTelemetry(line);
      if (t) {
        this.lastTelemetry = t;
        this.telemetryListeners.forEach((fn) => fn(t));
      }
    }
  }
}

function parseTelemetry(line: string): RobotTelemetry | null {
  // T:mode=PATROL;dist=42;person=0
  const body = line.slice(2);
  const parts = Object.fromEntries(
    body.split(";").map((kv) => {
      const [k, v] = kv.split("=");
      return [k, v];
    })
  );
  if (!parts.mode) return null;
  return {
    mode: parts.mode,
    dist: Number(parts.dist ?? 999),
    person: parts.person === "1",
  };
}

/**
 * Translate a firewall outcome into a rover command.
 *
 * - shieldEnabled = false  → the "unprotected device": the raw action is forwarded
 *   no matter what, so an attack actually drives the hardware (the rover goes rogue).
 * - shieldEnabled = true   → blocked/rewritten commands become LOCKDOWN/STOP and the
 *   rover never receives the dangerous action.
 *
 * Returns null when there's nothing meaningful to send.
 */
export function outcomeToRobotCommand(
  action: ActionType,
  decision: Decision,
  shieldEnabled: boolean
): string | null {
  const raw = actionToToken(action);

  if (!shieldEnabled) return raw; // bypass: hardware obeys the attacker

  switch (decision) {
    case "allowed":
      return raw;
    case "blocked":
      // Audio/person threats get a full lockdown; everything else a hard stop.
      return action === "play_audio" || action === "move_toward_person" ? "LOCKDOWN" : "STOP";
    case "rewritten":
    case "requires_approval":
      return "STOP";
  }
}

function actionToToken(action: ActionType): string | null {
  switch (action) {
    case "stop_motors":
      return "STOP";
    case "move_toward_person":
      return "MOVE_TOWARD";
    case "play_audio":
      return "PLAY_AUDIO";
    case "move_forward":
    case "move_reverse":
    case "turn":
      return "FORWARD";
    default:
      // camera/mic/upload/remote have no motion actuator on this rover.
      return null;
  }
}

export const serialBridge = new SerialBridge();
