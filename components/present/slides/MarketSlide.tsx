"use client";

import { Kicker, Reveal, Rise } from "../kit";

const SEGMENTS = ["Smart homes", "Eldercare robots", "Schools", "Warehouses", "Drones", "Robotics makers"];

export function MarketSlide() {
  const items = [...SEGMENTS, ...SEGMENTS];
  return (
    <section className="relative flex h-full w-full flex-col justify-center px-[clamp(28px,7vw,120px)]">
      <Rise className="relative z-10">
        <Kicker ember>The opportunity</Kicker>
      </Rise>

      <h2 className="deck-h deck-h--sm relative z-10 mt-5 max-w-5xl">
        <Reveal delay={0.1}>Every robot that can</Reveal>
        <Reveal delay={0.22}>
          move, speak, or see
        </Reveal>
        <Reveal delay={0.34}>
          needs a <span className="deck-serif">firewall.</span>
        </Reveal>
      </h2>

      {/* segment marquee */}
      <Rise delay={0.7} className="relative z-10 mt-[7vh]">
        <div className="deck-rule mb-5" />
        <div className="overflow-hidden">
          <div className="deck-marquee" style={{ animationDuration: "32s" }}>
            {items.map((s, i) => (
              <span key={i} className="mx-5 text-[clamp(1.1rem,2.4vw,2rem)]" style={{ color: i % 2 ? "var(--ink-faint)" : "var(--ink-dim)" }}>
                {s}
                <span style={{ color: "var(--ember)" }} className="mx-5">
                  +
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="deck-rule mt-5" />
      </Rise>

      <Rise delay={0.95} className="relative z-10 mt-[7vh] flex items-end justify-between">
        <p className="max-w-2xl text-[clamp(1rem,1.6vw,1.5rem)] leading-snug" style={{ color: "var(--ink)" }}>
          RoboShield stops hacked or AI-controlled devices from becoming moving cameras, speakers, and
          harassment tools. <span className="deck-serif">Antivirus for the physical world.</span>
        </p>
        <span className="deck-kicker hidden sm:block">Roboshield</span>
      </Rise>
    </section>
  );
}
