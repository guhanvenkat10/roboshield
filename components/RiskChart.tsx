"use client";

import { useMemo } from "react";

interface Point {
  t: number;
  v: number;
}

/** Lightweight dependency-free animated area/line chart for the risk timeline. */
export function RiskChart({ data, height = 120 }: { data: Point[]; height?: number }) {
  const width = 520;
  const pad = 6;

  const { line, area, last } = useMemo(() => {
    if (data.length === 0) return { line: "", area: "", last: 0 };
    const xs = data.map((_, i) => pad + (i / Math.max(1, data.length - 1)) * (width - pad * 2));
    const ys = data.map((d) => {
      const v = Math.max(0, Math.min(100, d.v));
      return pad + (1 - v / 100) * (height - pad * 2);
    });
    const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
    const area = `${line} L${xs[xs.length - 1].toFixed(1)},${height - pad} L${xs[0].toFixed(1)},${height - pad} Z`;
    return { line, area, last: data[data.length - 1].v };
  }, [data, height]);

  const stroke = last >= 70 ? "#ff2233" : last >= 40 ? "#f0a52a" : "#c6ccd6";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((g) => (
        <line
          key={g}
          x1={pad}
          x2={width - pad}
          y1={pad + (1 - g / 100) * (height - pad * 2)}
          y2={pad + (1 - g / 100) * (height - pad * 2)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1}
        />
      ))}
      <path d={area} fill="url(#riskFill)" />
      <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
