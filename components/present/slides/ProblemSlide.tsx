"use client";

import { Kicker, Reveal, Rise } from "../kit";

const THREATS = ["Hijacked speaker", "Silent camera", "Remote takeover at 3am", "Rogue AI agent", "Impersonated voice"];

function Marquee({ reverse = false, duration = 26 }: { reverse?: boolean; duration?: number }) {
  const items = [...THREATS, ...THREATS];
  return (
    <div className="relative w-full overflow-hidden py-1">
      <div
        className="deck-marquee"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {items.map((t, i) => (
          <span
            key={i}
            className="mx-6 text-[clamp(1.6rem,4.5vw,4rem)] font-bold tracking-tight"
            style={{ color: i % 2 ? "var(--ink-faint)" : "var(--ink)" }}
          >
            {t}
            <span style={{ color: "var(--ember)" }} className="mx-6">
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProblemSlide() {
  return (
    <section className="relative flex h-full w-full flex-col justify-center px-[clamp(28px,7vw,120px)]">
      <Rise className="relative z-10">
        <Kicker ember>The problem</Kicker>
      </Rise>

      <h2 className="deck-h deck-h--sm relative z-10 mt-5 max-w-5xl">
        <Reveal delay={0.1}>When a device is hijacked</Reveal>
        <Reveal delay={0.22}>it does not crash.</Reveal>
        <Reveal delay={0.34}>
          It <span className="deck-serif">obeys.</span>
        </Reveal>
      </h2>

      <Rise delay={0.7} className="relative z-10 mt-7 max-w-2xl">
        <p className="deck-lede">
          Today a robot passes commands straight to its motors, speaker, and camera. Nothing sits in between
          asking whether it should actually do this.
        </p>
      </Rise>

      {/* kinetic threat marquee */}
      <Rise delay={0.9} className="relative z-10 mt-[7vh] space-y-1">
        <div className="deck-rule mb-6" />
        <Marquee duration={28} />
        <Marquee reverse duration={34} />
        <div className="deck-rule mt-6" />
      </Rise>
    </section>
  );
}
