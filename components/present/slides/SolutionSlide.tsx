"use client";

import { Kicker, Reveal, Rise } from "../kit";
import { GateFlow } from "../GateFlow";

export function SolutionSlide() {
  return (
    <section className="relative flex h-full w-full flex-col justify-center px-[clamp(28px,7vw,120px)]">
      <div className="relative z-10 flex flex-col gap-2">
        <Rise>
          <Kicker ember>How it works</Kicker>
        </Rise>
        <h2 className="deck-h deck-h--sm max-w-4xl">
          <Reveal delay={0.1}>Seven checks.</Reveal>
          <Reveal delay={0.2}>
            Every command, <span className="deck-serif">before</span> it moves.
          </Reveal>
        </h2>
      </div>

      <Rise delay={0.6} className="relative z-10 mt-[8vh]">
        <GateFlow />
      </Rise>
    </section>
  );
}
