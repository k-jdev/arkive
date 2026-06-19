"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { claudeIcon, gptIcon, grokIcon, geminiIcon } from "@/public/icons";
import { setupHeader, setupCard, EASE, safeFade } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";

import cardImg from "@/public/sections/defiCreate/card.png";
import cardMobileImg from "@/public/sections/defiCreate/cardMobile.png";

const AI_ICONS = [
  { src: claudeIcon, alt: "Claude" },
  { src: gptIcon, alt: "ChatGPT" },
  { src: grokIcon, alt: "Grok" },
  { src: geminiIcon, alt: "Gemini" },
];

export default function DefiCreate() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="w-full bg-white py-[60px] md:py-[100px]">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            whileInView={reduced ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={reduced ? safeFade : setupHeader}
            className="flex flex-col gap-6 w-full lg:w-auto flex-1"
          >
            <div className="flex flex-col gap-2">
              <span className="font-[590] text-[#0022FF] [font-family:var(--figma-font-text)] text-[20px] leading-[28px] tracking-[-0.004em]">
                Project DeFi
              </span>
              <h2
                className="font-[590] text-[#1C2024] [font-family:var(--figma-font-text)] mt-2"
                style={{
                  fontSize: "clamp(36px, 4vw, 48px)",
                  lineHeight: "0.9",
                  letterSpacing: "-0.83%",
                }}
              >
                Create your Arkive
              </h2>
              <p
                className="font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)] mt-2 max-w-[480px]"
                style={{ color: "rgba(0, 7, 27, 0.5)" }}
              >
                Create your account and connect Arkive to any model in a minute.
                Begin trading with frontier AI behind your every move.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link href="/arkives">
                <motion.button
                  type="button"
                  className="flex items-center justify-center h-10 rounded-full shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 pl-5 pr-3 gap-1 text-[16px] font-[510] bg-[#1C2024] text-[#FCFCFD] [font-family:var(--figma-font-text)]"
                >
                  Get started
                  <RiArrowRightSLine
                    size={18}
                    className="text-white"
                    aria-hidden="true"
                  />
                </motion.button>
              </Link>

              <div className="flex items-center">
                {AI_ICONS.map((icon, i) => (
                  <motion.div
                    key={icon.alt}
                    className="relative shrink-0 size-[34px] rounded-full overflow-hidden bg-white border border-[#bbbbbb42]"
                    initial={
                      reduced
                        ? { opacity: 1 }
                        : { opacity: 0, x: -12, scale: 0.7 }
                    }
                    whileInView={
                      reduced ? undefined : { opacity: 1, x: 0, scale: 1 }
                    }
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.12, duration: 0.45, ease: EASE }}
                    animate={{
                      marginRight: i < 3 ? "-10.66px" : "0",
                      zIndex: 4 - i,
                    }}
                  >
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={34}
                      height={34}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial="hidden"
            whileInView={reduced ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={reduced ? safeFade : setupCard}
            className="w-full lg:w-[55%] shrink-0"
          >
            <div className="w-full rounded-3xl overflow-hidden  border border-black/5 bg-[#F9F9FB] ">
              <Image
                src={cardMobileImg}
                alt="Create your Arkive DeFi"
                className="w-full h-auto object-cover rounded-2xl lg:hidden"
                sizes="100vw"
                priority
                draggable={false}
                unoptimized
              />
              <Image
                src={cardImg}
                alt="Create your Arkive DeFi"
                className="hidden w-full h-auto object-cover rounded-2xl lg:block"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                draggable={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
