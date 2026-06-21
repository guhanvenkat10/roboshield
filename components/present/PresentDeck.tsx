"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSlide } from "./slides/HeroSlide";
import { ProblemSlide } from "./slides/ProblemSlide";
import { SolutionSlide } from "./slides/SolutionSlide";
import { DemoSlide } from "./slides/DemoSlide";
import { MarketSlide } from "./slides/MarketSlide";

const SLIDES = [
  { id: "hero", label: "Roboshield", Component: HeroSlide },
  { id: "problem", label: "The problem", Component: ProblemSlide },
  { id: "solution", label: "How it works", Component: SolutionSlide },
  { id: "demo", label: "The demo", Component: DemoSlide },
  { id: "market", label: "The opportunity", Component: MarketSlide },
];

export function PresentDeck() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1)), []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const Current = SLIDES[index].Component;

  return (
    <div className="deck">
      <div className="deck-frame" />

      {/* top progress ticks */}
      <div className="absolute left-0 right-0 top-0 z-50 flex gap-1 p-[clamp(16px,3vw,40px)]">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={s.label}
            className="h-[3px] flex-1 overflow-hidden rounded-full"
            style={{ background: "var(--ink-faint)" }}
          >
            <motion.span
              className="block h-full"
              style={{ background: "var(--ember)", transformOrigin: "left" }}
              initial={false}
              animate={{ scaleX: i < index ? 1 : i === index ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        ))}
      </div>

      {/* slide stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={SLIDES[index].id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-10"
        >
          <Current />
        </motion.div>
      </AnimatePresence>

      {/* edge click zones for presenting (center stays interactive) */}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-0 top-0 z-40 h-full w-[10%] cursor-w-resize"
        style={{ background: "transparent" }}
      />
      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-0 top-0 z-40 h-full w-[10%] cursor-e-resize"
        style={{ background: "transparent" }}
      />

      {/* footer */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-end justify-between p-[clamp(16px,3vw,40px)]">
        <div className="deck-kicker">{SLIDES[index].label}</div>
        <div className="deck-index">
          {String(index + 1).padStart(2, "0")} <span style={{ opacity: 0.4 }}>/ {String(SLIDES.length).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}

function toggleFullscreen() {
  if (typeof document === "undefined") return;
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}
