"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { useNewsletterModal } from "@/components/providers/newsletter-modal-provider";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export default function ProjectDefiHero() {
  const { openModal } = useNewsletterModal();

  return (
    <section
      data-header-theme="dark"
      className="relative w-full min-h-svh flex flex-col items-center justify-start pt-[calc(54px+15vh)] bg-black overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <HeroCanvas />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-[92vw] md:w-[min(52vw,1080px)]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-white font-normal text-[16px]  md:text-[20px] tracking-wide [font-family:var(--figma-font-text)]"
        >
          Project DeFi
        </motion.p>

        <div className="flex flex-col items-center gap-6 w-full">
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
            className="flex gap-2 items-center pointer-events-auto"
          >
            <button
              type="button"
              onClick={openModal}
              className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-[#d9dadd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 px-6 bg-[#edeef0] text-[#111113] font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Coming soon
            </button>

            <Link href="#">
              <button
                type="button"
                className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-[rgba(221,234,248,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 px-6 bg-[rgba(221,234,248,0.08)] text-[#edeef0] font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                View docs
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
