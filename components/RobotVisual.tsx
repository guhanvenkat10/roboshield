"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ShieldStatus } from "@/lib/store";

const STATUS_COLOR: Record<ShieldStatus, string> = {
  protected: "#bdb6a1",
  threat: "#ff4a1c",
  lockdown: "#e0a341",
};

/**
 * Stylized robot wrapped in a protective shield ring. The ring color and pulse
 * track the live firewall status. `personNearby` lights up a proximity blip so
 * the Physical-DLP story reads visually.
 */
export function RobotVisual({
  status,
  personNearby,
}: {
  status: ShieldStatus;
  personNearby: boolean;
}) {
  const color = STATUS_COLOR[status];

  return (
    <div className="relative grid aspect-square w-full place-items-center">
      {/* pulse rings */}
      <div
        className="absolute h-40 w-40 rounded-full"
        style={{ boxShadow: `0 0 0 1px ${color}33` }}
      />
      <motion.div
        className="absolute h-40 w-40 rounded-full"
        style={{ border: `1px solid ${color}` }}
        animate={{ scale: [0.9, 1.35], opacity: [0.5, 0] }}
        transition={{ duration: status === "threat" ? 1.1 : 2.4, repeat: Infinity, ease: "easeOut" }}
      />

      {/* shield arc */}
      <svg viewBox="0 0 200 200" className="absolute h-full w-full">
        <motion.circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke={color}
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          animate={{ rotate: 360 }}
          transition={{ duration: status === "threat" ? 8 : 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        />
        {/* proximity blip */}
        {personNearby && (
          <g>
            <motion.circle
              cx="160"
              cy="70"
              r="6"
              fill="#fb5e5e"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <text x="150" y="52" fill="#fb5e5e" fontSize="9" textAnchor="middle" className="mono">
              person
            </text>
          </g>
        )}
      </svg>

      {/* robot body */}
      <motion.div
        animate={status === "threat" ? { x: [0, -2, 2, -1, 0] } : { y: [0, -3, 0] }}
        transition={{ duration: status === "threat" ? 0.3 : 3, repeat: Infinity }}
        className="relative z-10 flex flex-col items-center"
      >
        <div
          className={cn("relative grid h-24 w-24 place-items-center rounded-lg border")}
          style={{ borderColor: `${color}55`, background: `${color}12`, boxShadow: `0 0 40px -10px ${color}` }}
        >
          {/* eyes */}
          <div className="flex gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: color }} />
            <span className="h-3 w-3 rounded-full" style={{ background: color }} />
          </div>
          {/* mouth / status line */}
          <div className="mt-2 h-1 w-10 rounded-full" style={{ background: `${color}88` }} />
          {/* antenna */}
          <div className="absolute -top-3 h-3 w-0.5" style={{ background: `${color}88` }} />
          <div className="absolute -top-4 h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        </div>
        {/* wheels */}
        <div className="mt-1.5 flex w-20 justify-between">
          <div className="h-2.5 w-5 rounded-full bg-white/15" />
          <div className="h-2.5 w-5 rounded-full bg-white/15" />
        </div>
      </motion.div>
    </div>
  );
}
