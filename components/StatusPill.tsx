"use client";

import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { useRoboShield, type ShieldStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

const MAP: Record<ShieldStatus, { label: string; icon: typeof ShieldCheck; cls: string }> = {
  protected: { label: "Protected", icon: ShieldCheck, cls: "text-safe border-safe/30" },
  threat: { label: "Threat detected", icon: ShieldAlert, cls: "text-danger border-danger/40" },
  lockdown: { label: "Locked down", icon: ShieldX, cls: "text-warn border-warn/40" },
};

export function StatusPill() {
  const status = useRoboShield((s) => s.status);
  const s = MAP[status];
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium", s.cls)}>
      <s.icon className="h-4 w-4" />
      <span className="font-mono text-xs uppercase tracking-[0.12em]">{s.label}</span>
    </div>
  );
}
