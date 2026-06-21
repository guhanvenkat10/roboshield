"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { serialBridge } from "@/lib/serial";
import { motion } from "framer-motion";
import { Activity, FlaskConical, GitBranch, ScrollText, ShieldOff, SlidersHorizontal } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { OverviewSection } from "./sections/OverviewSection";
import { PipelineSection } from "./sections/PipelineSection";
import { DemoLabSection } from "./sections/DemoLabSection";
import { PolicySection } from "./sections/PolicySection";
import { IncidentsSection } from "./sections/IncidentsSection";
import { useRoboShield } from "@/lib/store";
import { PixelField } from "./cyber/PixelField";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Live Console", icon: Activity },
  { id: "pipeline", label: "Command Pipeline", icon: GitBranch },
  { id: "demo", label: "Demo Lab", icon: FlaskConical },
  { id: "policy", label: "Policies & Zones", icon: SlidersHorizontal },
  { id: "incidents", label: "Incidents", icon: ScrollText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DashboardShell() {
  const params = useSearchParams();
  const initial = (params.get("tab") as TabId) || "overview";
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === initial) ? initial : "overview");
  const incidents = useRoboShield((s) => s.incidents);
  const shieldEnabled = useRoboShield((s) => s.shieldEnabled);

  // Single place that feeds the hardware serial stream into the store, so live
  // telemetry reaches every component (sensors, risk logic, monitor) at once.
  useEffect(() => {
    const { _onRobotStatus, _onTelemetry } = useRoboShield.getState();
    const offStatus = serialBridge.onStatus(_onRobotStatus);
    const offTel = serialBridge.onTelemetry(_onTelemetry);
    return () => {
      offStatus();
      offTel();
    };
  }, []);

  return (
    <div className="scanlines bg-shell relative min-h-screen">
      <PixelField density={0.5} />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-block h-3 w-3 bg-danger" />
            <span className="pixel text-[12px] text-white">ROBOSHIELD</span>
          </Link>
          <StatusPill />
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-3">
          <div className="scroll-thin flex gap-0.5 overflow-x-auto pb-px">
            {TABS.map((t) => {
              const active = tab === t.id;
              const count = t.id === "incidents" ? incidents.length : 0;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 font-term text-base uppercase tracking-wider transition",
                    active ? "text-danger" : "text-white/45 hover:text-white/80"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                  {count > 0 && (
                    <span className="bg-danger px-1.5 text-[10px] font-semibold text-black">{count}</span>
                  )}
                  {active && (
                    <motion.div layoutId="tab-underline" className="absolute inset-x-2 -bottom-px h-0.5 bg-danger" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Firewall-bypassed banner, the "unprotected device" half of the A/B demo */}
      {!shieldEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="relative z-20 border-b border-danger/30 bg-danger/15"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-2 text-sm font-semibold text-danger">
            <ShieldOff className="h-4 w-4" />
            Firewall bypassed, commands are reaching the device unfiltered. This is what an unprotected robot does.
          </div>
        </motion.div>
      )}

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 py-7">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {tab === "overview" && <OverviewSection onJump={setTab} />}
          {tab === "pipeline" && <PipelineSection />}
          {tab === "demo" && <DemoLabSection onJump={setTab} />}
          {tab === "policy" && <PolicySection />}
          {tab === "incidents" && <IncidentsSection />}
        </motion.div>
      </main>
    </div>
  );
}
