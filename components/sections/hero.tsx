"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const FADE_RANGE = 500;
  const progress = Math.min(1, scrollY / FADE_RANGE);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const p = easeOutCubic(progress);

  return (
    <div ref={sectionRef} className="relative w-full">
      <section className="relative w-full min-h-svh flex flex-col items-center justify-start pt-[calc(54px+10vh)] md:pt-[calc(54px+18vh)] bg-white px-4">
        <motion.div
          className="flex flex-col items-center gap-4 md:gap-6 text-center"
          style={{
            opacity: Math.max(0, 1 - p * 2),
            y: -p * 50,
          }}
        >
          <h1 className="w-full max-w-3xl text-center font-[590] text-[clamp(32px,8vw,72px)] md:text-[clamp(40px,5.5vw,72px)] leading-[0.95] md:leading-[0.9] tracking-[-0.4px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]">
            Universal language
            <br />
            for AI context.
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center h-10 rounded-full transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 px-(--figma-spacing-4) gap-(--figma-spacing-3) text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-12) text-(--figma-neutral-1) font-[510] [font-family:var(--figma-font-text)]"
            >
              Get started
            </button>

            <button
              type="button"
              className="flex items-center justify-center h-10 rounded-full transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-[rgba(0,0,51,0.06)] text-(--figma-neutral-12) font-[510] [font-family:var(--figma-font-text)]"
            >
              Project DeFi
              <RiArrowRightSLine size={18} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </section>

      <motion.div
        className="absolute pointer-events-none top-[calc(100svh-200px)] md:top-[calc(100svh-340px)] left-1/2 w-[min(860px,92vw)] md:w-[min(860px,78vw)] z-10"
        style={{
          x: "-50%",
          y: p * 80,
        }}
      >
        <Image
          src="/sections/hero/hero-main.png"
          alt="Arkive app view"
          width={860}
          height={553}
          priority
          className="w-full h-auto rounded-xl shadow-2xl"
        />
      </motion.div>

      <section className="relative w-full h-svh bg-white overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[#0A0A0A]"
          style={{
            clipPath: `inset(0 ${25 * (1 - p)}% 0 ${25 * (1 - p)}%)`,
          }}
        >
          <HeroCanvas />
        </motion.div>

        <motion.div
          className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-[8%] md:pb-[12%] pl-[6%] md:pl-[15.5%] pr-[6%] md:pr-[15.5%] gap-8 md:gap-12"
          style={{
            opacity: Math.max(0, (p - 0.7) / 0.3),
            y: (1 - Math.max(0, (p - 0.7) / 0.3)) * 32,
          }}
        >
          <p
            className="max-w-[90%] md:max-w-[69%] text-white font-[510] [font-family:var(--figma-font-text)] tracking-[-0.4px]"
            style={{ fontSize: "clamp(18px, 5vw, 48px)", lineHeight: 1.15 }}
          >
            The future of AI is one where context is owned, compounding, and
            understood across models.{" "}
            <span className="text-white/60">Arkive makes this possible.</span>
          </p>

          <Image
            src="/icons/logo.svg"
            alt="Arkive"
            width={58}
            height={46}
            className="w-10 md:w-14.5 h-auto invert"
          />
        </motion.div>
      </section>
    </div>
  );
}
