"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PixelField } from "@/components/cyber/PixelField";
import { LandingSection } from "@/components/cyber/LandingSection";
import { PixelDrone, PixelCamera, PixelRoomba, PixelRobotArm } from "@/components/cyber/devices";

export default function Landing() {
  return (
    <main className="scanlines relative bg-shell" style={{ overflowX: "clip" }}>
      <PixelField density={1} />

      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(20px,5vw,80px)] py-4 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 bg-danger" />
          <span className="pixel text-[12px] text-white">ROBOSHIELD</span>
        </Link>
        <Link
          href="/dashboard"
          className="kicker border border-danger/50 px-3 py-2 text-white transition hover:bg-danger/15"
        >
          open console_
        </Link>
      </header>

      <Hero />

      <LandingSection
        index="02"
        kicker="the threat"
        device={PixelCamera}
        direction="ltr"
        glitch
        title={<>It does not crash. It obeys.</>}
        body={
          <>
            A hijacked camera, vacuum, or drone does not break. It follows orders perfectly, just from the wrong
            person. Now it is a moving microphone, a speaker, or a set of wheels aimed at someone.
          </>
        }
      />

      <LandingSection
        index="03"
        kicker="how it works"
        device={PixelDrone}
        direction="rtl"
        title={<>Between the command and the machine.</>}
        body={
          <>
            RoboShield is a firewall that sits on the control link. Every instruction is checked against the
            device&apos;s real sensor state before a single motor turns. Safe commands pass. Dangerous ones never
            arrive.
          </>
        }
      >
        <InterceptLine />
      </LandingSection>

      <LandingSection
        index="04"
        kicker="the proof"
        device={PixelRoomba}
        direction="ltr"
        title={<>Safe passes. Attacks do not.</>}
        body={
          <>
            Move toward a person and play audio? Blocked, with a plain-English reason logged to a black box. Patrol
            the room on schedule? Allowed. The robot keeps its real job and loses the dangerous one.
          </>
        }
      />

      <CTA />

      <footer className="relative z-20 flex items-center justify-between border-t border-white/10 bg-shell px-[clamp(20px,5vw,80px)] py-8">
        <span className="pixel text-[10px] text-white/60">ROBOSHIELD</span>
        <span className="kicker text-white/30">behavior firewall // 2026</span>
      </footer>
    </main>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const droneY = useTransform(scrollYProgress, [0, 1], ["0vh", "-30vh"]);
  const droneScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const droneOpacity = useTransform(scrollYProgress, [0, 0.8], [0.9, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center px-[clamp(24px,6vw,110px)]">
      <motion.div
        aria-hidden
        style={{ y: droneY, scale: droneScale, opacity: droneOpacity }}
        className="pointer-events-none absolute right-[2%] top-1/2 z-10 w-[min(56vw,640px)] -translate-y-1/2 text-[#c6ccd6]"
      >
        <PixelDrone />
      </motion.div>

      <div className="relative z-20 max-w-3xl">
        <div className="kicker">behavior firewall // physical machines</div>
        <h1 className="hpixel mt-6 text-[clamp(2rem,7vw,5.5rem)] leading-[1.1] text-white">
          ROBO<span className="text-danger">SHIELD</span>
        </h1>
        <p className="hterm mt-7 max-w-xl text-[clamp(1.4rem,3vw,2.4rem)] leading-tight text-white/80">
          Antivirus for the things that move, speak, and watch.
        </p>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55">
          Every command a robot, drone, or smart device receives gets checked before it can act. The dangerous ones
          stop at the gate.
        </p>
        <div className="mt-9 flex items-center gap-4">
          <Link href="/dashboard" className="pixel bg-danger px-5 py-3 text-[11px] text-black transition hover:bg-signal-400">
            open console_
          </Link>
          <span className="kicker animate-flicker text-white/40">scroll ▾</span>
        </div>
      </div>
    </section>
  );
}

function InterceptLine() {
  return (
    <div className="inline-flex items-center gap-3 border border-white/12 bg-ink-900/60 px-4 py-3 text-sm">
      <span className="mono text-white/55">command</span>
      <span className="text-white/30">{">>"}</span>
      <span className="kicker">roboshield</span>
      <span className="text-white/30">{">>"}</span>
      <span className="pixel text-[10px] text-danger">BLOCKED</span>
    </div>
  );
}

function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["38vw", "-38vw"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [8, -8]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center px-6 text-center">
      <motion.div
        aria-hidden
        style={{ x, rotate }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(50vw,560px)] -translate-x-1/2 -translate-y-1/2 text-[#c6ccd6] opacity-30"
      >
        <PixelRobotArm />
      </motion.div>

      <div className="relative z-20">
        <div className="kicker">live demo</div>
        <h2 className="hterm mt-5 text-[clamp(2.4rem,7vw,6rem)] uppercase text-white">See it block an attack.</h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/60">
          The console runs entirely in your browser. Fire an attack, watch the firewall stop it, and read the
          incident it leaves behind.
        </p>
        <Link
          href="/dashboard"
          className="pixel mt-9 inline-block bg-danger px-6 py-4 text-[12px] text-black transition hover:bg-signal-400"
        >
          open console_
        </Link>
      </div>
    </section>
  );
}
