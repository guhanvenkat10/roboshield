"use client";

import { motion } from "framer-motion";
import { Kicker, Reveal, Rise } from "../kit";

export function HeroSlide() {
  return (
    <section className="relative flex h-full w-full flex-col justify-center px-[clamp(28px,7vw,120px)]">
      {/* ambient interceptor line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] z-0">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2" style={{ background: "var(--ink-faint)" }} />
        <div className="absolute top-1/2 h-7 w-px -translate-y-1/2" style={{ left: "62%", background: "var(--ember)" }} />
        <motion.div
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
          style={{ background: "var(--ink)" }}
          initial={{ left: "4%", opacity: 0 }}
          animate={{ left: ["4%", "62%", "62%"], opacity: [0, 1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.4, ease: "easeOut", times: [0, 0.8, 1] }}
        />
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <Kicker>A behavior firewall for physical AI</Kicker>
        <Kicker>Pitch / 2026</Kicker>
      </div>

      <div className="relative z-10 mt-[6vh]">
        <h1 className="deck-h">
          <Reveal delay={0.1}>ROBO</Reveal>
          <Reveal delay={0.24}>
            <span className="deck-stroke">SHIELD</span>
          </Reveal>
        </h1>

        <Rise delay={0.7} className="mt-[4vh] max-w-3xl">
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }} className="text-[clamp(1.4rem,3vw,2.6rem)] leading-tight">
            Antivirus for the <span style={{ color: "var(--ember)" }}>physical</span> world.
          </p>
        </Rise>

        <Rise delay={0.9} className="mt-6">
          <p className="deck-lede">
            Every command a robot receives gets checked before a single motor turns. Unsafe movement, audio,
            recording, and AI-driven actions stop at the gate.
          </p>
        </Rise>
      </div>

      <Rise delay={1.2} className="relative z-10 mt-[6vh]">
        <span className="deck-kicker">press the right arrow to begin</span>
      </Rise>
    </section>
  );
}
