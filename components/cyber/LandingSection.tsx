"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Device = (props: { className?: string }) => JSX.Element;

/**
 * A full-height landing section with a large pixel device that travels across
 * the screen, driven by the section's own scroll progress. Different sections
 * pass different devices and directions, so each one reads as its own hero.
 */
export function LandingSection({
  index,
  kicker,
  title,
  body,
  device: Device,
  direction = "ltr",
  size = "min(58vw, 680px)",
  glitch = false,
  children,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  body: ReactNode;
  device: Device;
  direction?: "ltr" | "rtl";
  size?: string;
  glitch?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const x = useTransform(scrollYProgress, [0, 1], direction === "ltr" ? ["-46vw", "42vw"] : ["42vw", "-46vw"]);
  const y = useTransform(scrollYProgress, [0, 1], ["7vh", "-7vh"]);
  const rotate = useTransform(scrollYProgress, [0, 1], direction === "ltr" ? [-7, 7] : [7, -7]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.2, 0.85, 0.85, 0.2]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden px-[clamp(24px,6vw,110px)] py-24">
      {/* travelling device */}
      <motion.div
        aria-hidden
        style={{ x, y, rotate, opacity, width: size }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[#c6ccd6]"
      >
        <Device />
      </motion.div>

      {/* content */}
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="pixel text-[10px] text-danger">{index}</span>
          <span className="kicker">{kicker}</span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.5 }}
          className={`hterm mt-5 text-[clamp(2.6rem,7vw,6rem)] uppercase text-white ${glitch ? "glitch" : ""}`}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65"
        >
          {body}
        </motion.p>
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
