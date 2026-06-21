"use client";

import { motion } from "framer-motion";
import { Building2, Plane, Home, PackageSearch, School, ShieldCheck } from "lucide-react";

const MARKETS = [
  { icon: Home, label: "Smart homes", note: "vacuums, pet & home robots" },
  { icon: ShieldCheck, label: "Eldercare & kids", note: "companion robots near people" },
  { icon: School, label: "Schools", note: "shared, supervised devices" },
  { icon: PackageSearch, label: "Warehouses", note: "autonomous floor robots" },
  { icon: Plane, label: "Drones", note: "aerial cameras & delivery" },
  { icon: Building2, label: "Robotics OEMs", note: "ship it as a safety layer" },
];

export function MarketSlide() {
  return (
    <div className="relative grid h-full w-full place-items-center px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-500/10 blur-[130px]" />

      <div className="relative z-10 w-full max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Every robot that can <span className="text-signal-400">move, speak, or see</span> needs this.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MARKETS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="card flex items-center gap-3 p-4 text-left"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-signal-500/10 text-signal-400">
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white">{m.label}</div>
                <div className="text-xs text-white/45">{m.note}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-signal-500/20 bg-signal-500/[0.06] p-6"
        >
          <p className="text-xl font-medium leading-relaxed text-white/90">
            RoboShield stops hacked or AI-controlled devices from becoming moving cameras, speakers, and
            harassment tools — <span className="text-signal-400">antivirus for the physical world.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-white/35"
        >
          RoboShield · thank you
        </motion.div>
      </div>
    </div>
  );
}
