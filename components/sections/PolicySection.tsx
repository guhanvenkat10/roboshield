"use client";

import { motion } from "framer-motion";
import { useRoboShield } from "@/lib/store";
import { ALL_ZONES, type PolicyConfig } from "@/lib/roboshield";
import { Card, SectionTitle } from "../primitives";
import { cn } from "@/lib/utils";

const POLICY_META: { key: keyof PolicyConfig; label: string; desc: string }[] = [
  {
    key: "blockSpeakerUnlessApproved",
    label: "Block speaker unless approved",
    desc: "The robot cannot play audio unless the command carries a trusted permission token.",
  },
  {
    key: "blockMovementNearPeople",
    label: "Block movement near people",
    desc: "The robot cannot move when proximity sensors detect a person close by.",
  },
  {
    key: "blockRemoteControlAtNight",
    label: "Block remote control at night",
    desc: "Remote commands are blocked during high-risk night hours unless approved.",
  },
  {
    key: "blockCameraMicInPrivateZones",
    label: "Block camera/mic in private zones",
    desc: "Recording and listening are blocked in Bedroom, Night, and Private modes.",
  },
  {
    key: "requireApprovalForAiCommands",
    label: "Require approval for AI-generated commands",
    desc: "An AI agent cannot drive physical hardware directly without review.",
  },
];

export function PolicySection() {
  const policy = useRoboShield((s) => s.policy);
  const setPolicy = useRoboShield((s) => s.setPolicy);
  const currentZone = useRoboShield((s) => s.context.zone);
  const setContext = useRoboShield((s) => s.setContext);

  return (
    <div className="space-y-6">
      {/* Policy Builder */}
      <div>
        <SectionTitle
          eyebrow="Policy Builder"
          title="Define what ‘safe’ means for your device"
          desc="Policy Builder lets a family, school, or company set the rules before the robot can act. Toggle a rule to see it take effect immediately in the Live Console and Demo Lab."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {POLICY_META.map((p) => {
            const on = policy[p.key];
            return (
              <button
                key={p.key}
                onClick={() => setPolicy({ [p.key]: !on } as Partial<PolicyConfig>)}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-lg border p-4 text-left transition",
                  on ? "border-signal-500/30 bg-signal-500/[0.05]" : "border-white/8 bg-white/[0.02]"
                )}
              >
                <div>
                  <div className="font-medium text-white">{p.label}</div>
                  <div className="mt-1 text-xs text-white/50">{p.desc}</div>
                </div>
                <span
                  className={cn(
                    "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition",
                    on ? "bg-signal-500" : "bg-white/15"
                  )}
                >
                  <motion.span
                    layout
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
                    style={{ left: on ? 22 : 2 }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust Zones */}
      <div>
        <SectionTitle
          eyebrow="Trust Zones"
          title="Different rules for different places"
          desc="A Trust Zone is a safety mode based on where the device is. A command that is safe in Home Mode may be blocked in Bedroom, Night, or Private Mode. Click a zone to make it active."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ALL_ZONES.map((z) => {
            const active = currentZone === z.id;
            return (
              <button
                key={z.id}
                onClick={() => setContext({ zone: z.id })}
                className={cn(
                  "rounded-lg border p-4 text-left transition",
                  active ? "border-signal-500/50 bg-signal-500/[0.06]" : "border-white/8 bg-white/[0.02] hover:border-white/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{z.label}</div>
                  {active && <span className="rounded-full bg-signal-500/20 px-2 py-0.5 text-[10px] font-semibold text-signal-400">Active</span>}
                </div>
                <p className="mt-1.5 text-xs text-white/55">{z.description}</p>
                {z.hardBlocked.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {z.hardBlocked.map((a) => (
                      <span key={a} className="rounded-md bg-danger/10 px-1.5 py-0.5 text-[10px] text-danger">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
