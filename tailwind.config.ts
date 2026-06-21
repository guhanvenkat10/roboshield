import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black "breach" surfaces.
        ink: {
          950: "#08080b",
          900: "#0c0c11",
          850: "#111118",
          800: "#16161f",
          700: "#1f1f2b",
          600: "#2a2a39",
        },
        // Brand / alert accent: intrusion red.
        signal: {
          400: "#ff5560",
          500: "#ff2233",
          600: "#d80f20",
        },
        // Semantic states, kept in the black / red / amber / steel family (no green).
        safe: "#c6ccd6", // allowed = calm steel-white
        warn: "#f0a52a", // caution / lockdown = amber
        danger: "#ff2233", // blocked / threat = red
        rewrite: "#ff7a3c", // rewritten = orange
      },
      fontFamily: {
        sans: ["var(--font-mono)", "ui-monospace", "monospace"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        term: ["var(--font-term)", "ui-monospace", "monospace"],
        pixel: ["var(--font-pixel)", "ui-monospace", "monospace"],
        display: ["var(--font-term)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,34,51,0.2)",
        "glow-danger": "0 0 0 1px rgba(255,34,51,0.3)",
        "glow-warn": "0 0 0 1px rgba(240,165,42,0.3)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "33%": { opacity: "0.78" },
          "66%": { opacity: "0.92" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        flicker: "flicker 3s steps(2) infinite",
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
