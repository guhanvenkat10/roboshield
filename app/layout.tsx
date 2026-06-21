import type { Metadata } from "next";
import { JetBrains_Mono, VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";

// Readable mono for body, VT323 terminal for headings/labels, Press Start 2P
// pixel font reserved for big hero moments.
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const term = VT323({ subsets: ["latin"], weight: "400", variable: "--font-term", display: "swap" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel", display: "swap" });

export const metadata: Metadata = {
  title: "RoboShield // behavior firewall for physical machines",
  description:
    "RoboShield sits between the command and the machine. It checks every instruction before a robot, drone, or smart device can act, and blocks the ones that would turn it against you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${term.variable} ${pixel.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
