"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export default function ProjectDefiHero() {
  return (
    <section
      data-header-theme="dark"
      className="relative w-full min-h-svh flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <HeroCanvas />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4 w-[92vw] md:w-[min(52vw,1080px)] pt-[10vh]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-(--figma-neutral-10) font-normal text-sm md:text-base tracking-wide [font-family:var(--figma-font-text)]"
        >
          Project DeFi
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="w-full text-center font-[590] text-[36px] md:text-[clamp(36px,5.5vw,72px)] leading-[0.95] tracking-[-0.4px] text-white [font-family:var(--figma-font-text)]"
        >
          Frontier intelligence
          <br />
          in your trading.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            className="flex items-center justify-center h-10 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 px-6 gap-2 text-sm leading-5 tracking-normal bg-white text-black font-normal [font-family:var(--figma-font-text)]"
          >
            Get started
          </button>

          <button
            type="button"
            className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 px-6 gap-1 text-sm leading-5 tracking-normal border border-white/20 text-white font-normal [font-family:var(--figma-font-text)]"
          >
            View docs
          </button>
        </motion.div>
      </div>
    </section>
  );
}
