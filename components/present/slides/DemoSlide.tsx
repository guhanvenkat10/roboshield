"use client";

import { useState } from "react";
import { Kicker, Reveal, Rise } from "../kit";
import { RogueToggle } from "../RogueToggle";

/**
 * Drop your recorded robot clip at `public/demo.mp4` (optional poster at
 * `public/demo-poster.jpg`). Until then a labeled placeholder shows so the slide
 * still reads as intentional.
 */
export function DemoSlide() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative flex h-full w-full flex-col justify-center px-[clamp(28px,7vw,120px)]">
      <div className="relative z-10">
        <Rise>
          <Kicker ember>The demo</Kicker>
        </Rise>
        <h2 className="deck-h deck-h--sm mt-4">
          <Reveal delay={0.1}>
            Same attack. One <span className="deck-serif">switch.</span>
          </Reveal>
        </h2>
      </div>

      <div className="relative z-10 mt-[5vh] grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        {/* interactive recreation */}
        <Rise delay={0.4}>
          <RogueToggle />
        </Rise>

        {/* recorded robot footage */}
        <Rise delay={0.55}>
          <div className="relative aspect-video w-full overflow-hidden rounded-sm" style={{ border: "1px solid var(--ink-faint)", background: "var(--paper-2)" }}>
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
                  <div className="deck-kicker">recorded robot demo</div>
                  <div className="mt-2 text-[13px]" style={{ color: "var(--ink-dim)" }}>
                    drop your clip at <span style={{ fontFamily: "var(--font-mono)" }}>public/demo.mp4</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 deck-index">live footage of the rover under attack, with and without the firewall</div>
        </Rise>
      </div>
    </section>
  );
}
