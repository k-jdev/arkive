"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { claudeIcon, gptIcon, grokIcon, geminiIcon } from "@/public/icons";
import { setupHeader, setupCard, EASE, safeFade } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";

import cardImg from "@/public/sections/creating/card.png";
import projectImg from "@/public/sections/creating/project.png";

const AI_ICONS = [
  { src: claudeIcon, alt: "Claude" },
  { src: gptIcon, alt: "ChatGPT" },
  { src: grokIcon, alt: "Grok" },
  { src: geminiIcon, alt: "Gemini" },
];

export default function PracticesCreating() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="w-full bg-white py-[60px] md:py-[100px]">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView={reduced ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={reduced ? safeFade : setupCard}
            className="w-full lg:w-[60%] shrink-0"
          >
            <div className="w-full rounded-3xl overflow-hidden shadow-sm border border-black/5">
              <Image
                src={cardImg}
                alt="Creating a new practice in Arkive chat interface"
                className="w-full h-auto object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                draggable={false}
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView={reduced ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={reduced ? safeFade : setupHeader}
            className="flex flex-col gap-6 w-full lg:w-auto"
          >
            <div className="flex flex-col gap-4">
              <h2
                className="font-[590] text-[#1C2024] [font-family:var(--figma-font-text)]"
                style={{
                  fontSize: "clamp(36px, 4vw, 48px)",
                  lineHeight: "0.9",
                  letterSpacing: "-0.83%",
                }}
              >
                Creating a new practice.
              </h2>
              <p
                className="font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                style={{ color: "rgba(0, 7, 27, 0.5)" }}
              >
                A single prompt is all you need to add a new practice to Arkive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <motion.button
                type="button"
                className="flex items-center justify-center h-10 rounded-full shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 px-5 text-[16px] font-[510] bg-[#1C2024] text-[#FCFCFD] [font-family:var(--figma-font-text)]"
              >
                Get started
              </motion.button>

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
        </div>

        <motion.div
          initial="hidden"
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px" }}
          variants={reduced ? safeFade : setupCard}
          className="w-full rounded-[18px] bg-[#F9F9FB] px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="shrink-0 size-16 rounded-xl bg-white border border-[#F1F1F1] flex items-center justify-center p-2 shadow-sm relative overflow-hidden">
              <Image
                src={projectImg}
                alt="Project DeFi icon"
                width={48}
                height={48}
                className="object-contain"
                draggable={false}
              />
            </div>

            <p className="flex-1 font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)] max-w-[550px] text-[rgba(0,5,9,0.89)]">
              Project DeFi{" "}
              <span style={{ color: "rgba(0,7,27,0.5)" }}>
                is Arkive’s first core practice, core practices are created by
                the Arkive team and are optimized for their respective domain.
              </span>
            </p>
          </div>

          <motion.a
            href="#"
            className="flex items-center gap-1 shrink-0 font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)] text-[#0022FF] hover:opacity-80 transition-opacity"
            aria-label="Learn more about Project DeFi"
          >
            Learn more about Project DeFi
            <RiArrowRightSLine size={18} aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
