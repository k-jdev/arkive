"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { useNewsletterModal } from "@/components/providers/newsletter-modal-provider";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export default function ArkivesHero() {
  const { openModal } = useNewsletterModal();

  return (
    <section
      data-header-theme="dark"
      className="relative w-full min-h-svh flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
        <HeroCanvas />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 w-[min(92vw,767px)] pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <p
            className="font-[590] text-[20px] leading-[--figma-line-height-5] tracking-[--figma-letter-spacing-5] text-white text-center whitespace-nowrap [font-family:var(--figma-font-text)] pointer-events-none"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Arkives
          </p>
          <h1
            className="font-[590] text-[clamp(42px,6vw,60px)] leading-[0.9] tracking-[-0.4px] text-white text-center w-full [font-family:var(--figma-font-text)] pointer-events-none"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Memory that builds on itself.
          </h1>
        </div>

        <div className="flex gap-2 items-center pointer-events-auto">
          <button
            type="button"
            onClick={openModal}
            className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-[#d9dadd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 px-6 bg-[#edeef0] text-[#111113] font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Coming soon
          </button>
          <Link href="https://docs.arkive.xyz">
            <button
              type="button"
              className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-[rgba(221,234,248,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 px-6 bg-[rgba(221,234,248,0.08)] text-[#edeef0] font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              View docs
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
