import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "RoboShield — A Behavior Firewall for Robots",
  description:
    "RoboShield is antivirus for the real world. It checks every command before it reaches a robot's motors, speaker, camera, or radio — blocking unsafe movement, audio, recording, remote control, and AI-generated actions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-shell min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
