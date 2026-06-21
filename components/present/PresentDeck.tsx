"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Link from "next/link";
import { HeroSlide } from "./slides/HeroSlide";
import { ProblemSlide } from "./slides/ProblemSlide";
import { SolutionSlide } from "./slides/SolutionSlide";
import { DemoSlide } from "./slides/DemoSlide";
import { MarketSlide } from "./slides/MarketSlide";
import { cn } from "@/lib/utils";

const SLIDES = [
  { id: "hero", label: "Hook", Component: HeroSlide },
  { id: "problem", label: "Problem", Component: ProblemSlide },
  { id: "solution", label: "How it works", Component: SolutionSlide },
  { id: "demo", label: "Live demo", Component: DemoSlide },
  { id: "market", label: "Market", Component: MarketSlide },
];

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
};

export function PresentDeck() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);

  const go = useCallback(
    (next: number, direction: number) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, next));
      setState([clamped, direction]);
    },
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        setState(([i]) => [Math.min(SLIDES.length - 1, i + 1), 1]);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        setState(([i]) => [Math.max(0, i - 1), -1]);
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Current = SLIDES[index].Component;

  return (
    <div className="bg-shell relative h-screen w-screen overflow-hidden">
      {/* progress bar */}
      <div className="absolute inset-x-0 top-0 z-50 h-0.5 bg-white/5">
        <motion.div
          className="h-full bg-signal-400"
          animate={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      {/* slide stage */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={SLIDES[index].id}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Current />
        </motion.div>
      </AnimatePresence>

      {/* bottom controls */}
      <div className="absolute inset-x-0 bottom-0 z-50 flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-xs text-white/30 transition hover:text-white/60">
          ← exit to console
        </Link>

        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i, i > index ? 1 : -1)}
              title={s.label}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-7 bg-signal-400" : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="mono text-xs text-white/30">
            {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => setState(([i]) => [Math.max(0, i - 1), -1])}
            disabled={index === 0}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setState(([i]) => [Math.min(SLIDES.length - 1, i + 1), 1])}
            disabled={index === SLIDES.length - 1}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
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
