"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export default function ArkivesHero() {
  return (
    <section
      data-header-theme="dark"
      className="relative w-full min-h-svh flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <HeroCanvas />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 w-[min(92vw,767px)] pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2">
          <p
            className="font-[590] text-[length:--figma-font-size-5] leading-[--figma-line-height-5] tracking-[--figma-letter-spacing-5] text-white text-center whitespace-nowrap [font-family:var(--figma-font-text)]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Arkives
          </p>
          <h1
            className="font-[590] text-[clamp(36px,6vw,60px)] leading-[0.9] tracking-[-0.4px] text-white text-center w-full [font-family:var(--figma-font-text)]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Sharper reasoning for AI.
          </h1>
        </div>

        <div className="flex gap-2 items-center pointer-events-auto">
          <button
            type="button"
            className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-[#d9dadd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 px-6 bg-[#edeef0] text-[#111113] font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Get started
          </button>
          <button
            type="button"
            className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-[rgba(221,234,248,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 px-6 bg-[rgba(221,234,248,0.08)] text-[#edeef0] font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            View docs
          </button>
        </div>
      </motion.div>
    </section>
  );
}
