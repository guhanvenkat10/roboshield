import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surface palette — deep slate with a cool security-ops feel.
        ink: {
          950: "#070a12",
          900: "#0b101c",
          850: "#0f1626",
          800: "#141d30",
          700: "#1c2840",
          600: "#283655",
        },
        // Brand accent — cyan/teal "shield" glow.
        signal: {
          400: "#38e1c4",
          500: "#16c9aa",
          600: "#0fa98e",
        },
        // Decision colors.
        safe: "#36d399",
        warn: "#fbbf24",
        danger: "#fb5e5e",
        rewrite: "#a78bfa",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,225,196,0.18), 0 0 40px -8px rgba(56,225,196,0.35)",
        "glow-danger": "0 0 0 1px rgba(251,94,94,0.22), 0 0 40px -8px rgba(251,94,94,0.45)",
        "glow-warn": "0 0 0 1px rgba(251,191,36,0.22), 0 0 40px -8px rgba(251,191,36,0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
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
