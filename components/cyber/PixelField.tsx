"use client";

import { useEffect, useRef } from "react";

/**
 * Moving pixelated backdrop for the cyber-attack theme. A grid of cells with a
 * red "data sweep" travelling across, sparse flicker, and the occasional glitch
 * row. Throttled to a low frame rate for a deliberately retro feel and to stay
 * cheap. Honors prefers-reduced-motion (renders a single static frame).
 */
export function PixelField({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;

    const CELL = 16;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      cv!.width = w * dpr;
      cv!.height = h * dpr;
      cv!.style.width = w + "px";
      cv!.style.height = h + "px";
      c!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function frame(t: number) {
      c!.clearRect(0, 0, w, h);

      // faint static matrix
      c!.fillStyle = "rgba(230,231,238,0.025)";
      for (let i = 0; i < cols * rows * 0.04 * density; i++) {
        c!.fillRect(Math.floor(Math.random() * cols) * CELL, Math.floor(Math.random() * rows) * CELL, CELL - 2, CELL - 2);
      }

      // diagonal red data-sweep
      const sweep = ((t * 0.04) % (w + h)) - h;
      for (let r = 0; r < rows; r++) {
        const cx = Math.round((sweep + r * CELL * 0.6) / CELL);
        for (let k = -1; k <= 3; k++) {
          const col = cx + k;
          if (col < 0 || col > cols) continue;
          c!.fillStyle = `rgba(255,34,51,${(k === 0 ? 0.5 : k === 1 ? 0.32 : 0.14) * density})`;
          c!.fillRect(col * CELL, r * CELL, CELL - 2, CELL - 2);
        }
      }

      // sparse flicker
      for (let i = 0; i < 60 * density; i++) {
        c!.fillStyle = Math.random() > 0.6 ? "rgba(255,34,51,0.35)" : "rgba(198,204,214,0.12)";
        c!.fillRect(Math.floor(Math.random() * cols) * CELL, Math.floor(Math.random() * rows) * CELL, CELL - 2, CELL - 2);
      }

      // occasional glitch row
      if (Math.random() > 0.92) {
        c!.fillStyle = "rgba(255,34,51,0.18)";
        c!.fillRect(0, Math.floor(Math.random() * rows) * CELL, w, CELL - 2);
      }
    }

    let raf = 0;
    let last = 0;
    function loop(t: number) {
      if (t - last > 90) {
        frame(t);
        last = t;
      }
      raf = requestAnimationFrame(loop);
    }
    if (reduced) frame(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={ref} className={`pointer-events-none fixed inset-0 ${className}`} style={{ zIndex: 0 }} aria-hidden />;
}
