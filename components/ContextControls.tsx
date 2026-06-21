"use client";

import { Moon, Radar, KeyRound, User } from "lucide-react";
import { useRoboShield } from "@/lib/store";
import { ALL_ZONES, type TrustZone } from "@/lib/roboshield";
import { cn } from "@/lib/utils";

/**
 * The "simulated sensors". In hardware mode these values would stream from the
 * HC-SR04 ultrasonic sensor, PIR motion sensor, and the device clock. Here they
 * are interactive so a presenter can stage any situation on demand.
 */
export function ContextControls() {
  const context = useRoboShield((s) => s.context);
  const setContext = useRoboShield((s) => s.setContext);
  const liveDriven = useRoboShield((s) => s.useLiveSensors && s.robotConnected);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Live sensor state</div>
        {liveDriven && (
          <span className="inline-flex items-center gap-1 rounded-full border border-signal-500/30 bg-signal-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-signal-400">
            <span className="h-1 w-1 rounded-full bg-signal-400" /> Hardware
          </span>
        )}
      </div>

      {/* Zone selector */}
      <div>
        <div className="mb-1.5 text-xs text-white/50">Trust Zone</div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_ZONES.map((z) => (
            <button
              key={z.id}
              onClick={() => setContext({ zone: z.id as TrustZone })}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                context.zone === z.id
                  ? "border-signal-500/50 bg-signal-500/15 text-signal-400"
                  : "border-white/10 text-white/50 hover:bg-white/5"
              )}
            >
              {z.label.replace(" Mode", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2">
        <Toggle
          icon={User}
          label={liveDriven ? "Person (live)" : "Person nearby"}
          active={context.personNearby}
          onClick={() =>
            !liveDriven && setContext({ personNearby: !context.personNearby, proximityCm: context.personNearby ? 180 : 40 })
          }
        />
        <Toggle icon={Moon} label="Night mode" active={context.isNight} onClick={() => setContext({ isNight: !context.isNight })} />
        <Toggle
          icon={KeyRound}
          label="Permission token"
          active={context.hasPermissionToken}
          onClick={() => setContext({ hasPermissionToken: !context.hasPermissionToken })}
        />
        <div className="flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-2 text-xs text-white/55">
          <Radar className="h-4 w-4 text-white/40" />
          Proximity: <span className="font-semibold text-white/80">{context.proximityCm}cm</span>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof User;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition",
        active ? "border-warn/40 bg-warn/10 text-warn" : "border-white/10 text-white/50 hover:bg-white/5"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      <span className={cn("ml-auto h-1.5 w-1.5 rounded-full", active ? "bg-warn" : "bg-white/20")} />
    </button>
  );
}
