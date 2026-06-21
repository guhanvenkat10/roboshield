"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { useRoboShield, type ShieldStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

const MAP: Record<ShieldStatus, { label: string; icon: typeof ShieldCheck; cls: string; dot: string }> = {
  protected: { label: "Protected", icon: ShieldCheck, cls: "text-safe border-safe/30 bg-safe/10", dot: "bg-safe" },
  threat: { label: "Threat Detected", icon: ShieldAlert, cls: "text-danger border-danger/30 bg-danger/10", dot: "bg-danger" },
  lockdown: { label: "Locked Down", icon: ShieldX, cls: "text-warn border-warn/30 bg-warn/10", dot: "bg-warn" },
};

export function StatusPill() {
  const status = useRoboShield((s) => s.status);
  const s = MAP[status];
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold", s.cls)}>
      <span className="relative flex h-2 w-2">
        <motion.span
          className={cn("absolute inline-flex h-full w-full rounded-full", s.dot)}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", s.dot)} />
      </span>
      <s.icon className="h-4 w-4" />
      {s.label}
    </div>
  );
}
