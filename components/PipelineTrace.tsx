"use client";

import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import type { StageTrace } from "@/lib/roboshield";
import { cn } from "@/lib/utils";

const STATUS = {
  pass: { cls: "border-safe/40 bg-safe/10 text-safe", icon: Check },
  flag: { cls: "border-warn/40 bg-warn/10 text-warn", icon: Minus },
  block: { cls: "border-danger/40 bg-danger/10 text-danger", icon: X },
} as const;

export function PipelineTrace({ trace }: { trace: StageTrace[] }) {
  return (
    <div className="scroll-thin flex items-stretch gap-1.5 overflow-x-auto pb-1">
      {trace.map((s, i) => {
        const cfg = STATUS[s.status];
        return (
          <motion.div
            key={s.stage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={cn("group relative min-w-[92px] flex-1 rounded-lg border px-2.5 py-2", cfg.cls)}
            title={s.note}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{i + 1}</span>
              <cfg.icon className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 text-[11px] font-medium leading-tight text-white/80">{s.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
