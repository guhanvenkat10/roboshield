import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm "paper" surface scale (replaces the old cool navy/slate).
        ink: {
          950: "#0b0a09",
          900: "#100e0c",
          850: "#161310",
          800: "#1d1813",
          700: "#28211a",
          600: "#352c22",
        },
        // Brand accent — a single warm "ember". Used sparingly.
        signal: {
          400: "#ff6a3c",
          500: "#ff4a1c",
          600: "#e23c12",
        },
        // Semantic decision states, kept warm and restrained (no neon green).
        safe: "#bdb6a1", // allowed = calm warm stone, not a green light
        warn: "#e0a341", // caution / lockdown = amber
        danger: "#ff4a1c", // blocked / threat = ember
        rewrite: "#c98a5c", // rewritten = clay
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,74,28,0.16)",
        "glow-danger": "0 0 0 1px rgba(255,74,28,0.28)",
        "glow-warn": "0 0 0 1px rgba(224,163,65,0.28)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(236,229,215,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(236,229,215,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.25)", opacity: "0" },
          "100%": { transform: "scale(1.25)", opacity: "0" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        scan: "scan 3s linear infinite",
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
