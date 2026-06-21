"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ban, FileWarning, Film, ShieldCheck, ShieldOff } from "lucide-react";

/**
 * Drop your recorded robot clip at `public/demo.mp4` (and optionally a poster at
 * `public/demo-poster.jpg`). If it isn't there yet, a labeled placeholder shows
 * so the slide still looks intentional while you're editing footage.
 */
export function DemoSlide() {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative grid h-full w-full place-items-center px-8">
      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="card overflow-hidden p-2"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink-950">
            {!videoError ? (
              <video
                className="h-full w-full object-cover"
                src="/demo.mp4"
                poster="/demo-poster.jpg"
                controls
                playsInline
                onError={() => setVideoError(true)}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-center">
                <div>
                  <Film className="mx-auto h-10 w-10 text-white/25" />
                  <div className="mt-3 text-sm font-medium text-white/60">Robot demo video</div>
                  <div className="mt-1 text-xs text-white/35">
                    Drop your clip at <span className="mono">public/demo.mp4</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* A/B story */}
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-signal-400/80">The demo</div>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Same attack. <br />
              One switch.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 rounded-2xl border border-danger/30 bg-danger/[0.07] p-4"
          >
            <div className="flex items-center gap-2 font-semibold text-danger">
              <ShieldOff className="h-5 w-5" /> Firewall OFF
            </div>
            <p className="mt-1 text-sm text-white/65">
              The rover charges the person and blares the speaker. The unprotected device just… obeys.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-3 rounded-2xl border border-safe/30 bg-safe/[0.07] p-4"
          >
            <div className="flex items-center gap-2 font-semibold text-safe">
              <ShieldCheck className="h-5 w-5" /> Firewall ON
            </div>
            <p className="mt-1 text-sm text-white/65">
              RoboShield sees audio aimed at a nearby person and blocks it. The rover never moves.
            </p>
          </motion.div>

          {/* mini incident */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-3 flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] p-3"
          >
            <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            <div className="text-xs leading-relaxed text-white/60">
              <span className="mono text-white/40">INC-0001 · </span>
              <span className="inline-flex items-center gap-1 font-semibold text-danger">
                <Ban className="h-3 w-3" /> Blocked
              </span>{" "}
              — speaker command near a person, no trusted approval. Plain-English black-box report generated.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
