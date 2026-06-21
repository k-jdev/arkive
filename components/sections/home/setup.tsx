"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { claudeIcon, gptIcon, grokIcon, geminiIcon } from "@/public/icons";
import { setupHeader, setupCard, EASE, safeFade } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";
import { useNewsletterModal } from "@/components/providers/newsletter-modal-provider";

const AI_ICONS = [
  { src: claudeIcon, alt: "Claude" },
  { src: gptIcon, alt: "ChatGPT" },
  { src: grokIcon, alt: "Grok" },
  { src: geminiIcon, alt: "Gemini" },
];

export default function Setup() {
  const reduced = usePrefersReducedMotion();
  const { openModal } = useNewsletterModal();

  return (
    <section
      data-header-theme="light"
      className="w-full bg-white py-12 md:py-48 px-4 md:px-20"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <motion.h2
          initial="hidden"
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px" }}
          variants={reduced ? safeFade : setupHeader}
          className="font-[590] tracking-[-0.4px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]"
          style={{ fontSize: "clamp(35px, 3.3vw, 48px)", lineHeight: 0.9 }}
        >
          {`Set up your Arkive in < 1 minute.`}
        </motion.h2>

        <div className="flex flex-col gap-5">
          <motion.div
            initial="hidden"
            whileInView={reduced ? undefined : "visible"}
            viewport={{ once: true, margin: "-80px" }}
            variants={reduced ? safeFade : setupCard}
            className="relative w-full rounded-3xl overflow-hidden bg-[#f9f9fb] md:h-[clamp(360px,23vw,441px)]"
          >
            <div className="relative md:absolute md:left-[clamp(40px,7.5vw,144px)] md:top-1/2 md:-translate-y-1/2 flex flex-col gap-6 md:gap-8 px-6 md:px-0 pt-8 md:pt-0 pb-6 md:pb-0 md:w-[clamp(290px,18.75vw,360px)]">
              <p
                className="[font-family:var(--figma-font-text)] text-[clamp(24px,5vw,28px)]"
                style={{
                  lineHeight: "1.3",
                  letterSpacing: "-0.12px",
                }}
              >
                <span className="font-medium text-[rgba(0,5,9,0.89)]">
                  {"Connect the Arkive MCP "} <br />
                </span>
                <span className="font-medium text-[rgba(0,5,29,0.45)]">
                  to your model of choice in seconds.
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  type="button"
                  onClick={openModal}
                  className="flex items-center justify-center h-10 rounded-full shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 px-(--figma-spacing-4) text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-12) text-(--figma-neutral-1) font-regular [font-family:var(--figma-font-text)]"
                >
                  Coming soon
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
                      transition={{
                        delay: i * 0.12,
                        duration: 0.45,
                        ease: EASE,
                      }}
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
            </div>

            <div className="relative md:absolute right-0 top-0 md:h-full w-full md:w-[55%]">
              {/* Mobile: single combined image */}
              <div className="block md:hidden px-6 pt-6">
                <Image
                  src="/sections/setup/mobileMac.png"
                  alt="MacBook with terminal"
                  width={390}
                  height={360}
                  loading="lazy"
                  sizes="100vw"
                  className="w-full h-auto"
                  draggable={false}
                />
              </div>

              {/* Desktop: macbook */}
              <div className="hidden md:block relative md:absolute px-6 md:px-0 md:top-1/2 md:-translate-y-1/2 md:right-[clamp(12px,1.7vw,32px)] w-full md:w-[90%] max-w-140 mx-auto md:mx-0">
                <Image
                  src="/sections/setup/macbook.webp"
                  alt="MacBook"
                  width={560}
                  height={340}
                  loading="lazy"
                  sizes="(min-width: 768px) 50vw, 90vw"
                  className="w-full h-auto"
                  draggable={false}
                />
              </div>

              {/* Desktop: terminal */}
              <div className="hidden md:block relative md:absolute bottom-0 right-0 w-full md:w-[58%] z-10 shadow-xl md:rounded-tl-xl overflow-hidden">
                <Image
                  src="/sections/setup/setup.webp"
                  alt="Terminal"
                  width={500}
                  height={160}
                  loading="lazy"
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="w-full h-auto"
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView={reduced ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={reduced ? safeFade : setupCard}
            className="w-full rounded-[18px] bg-[#f9f9fb] p-6 md:px-10 md:py-6"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-6">
              <div className="w-16 h-12 ">
                <Image
                  src="/sections/setup/install.webp"
                  alt="Arkive install"
                  width={64}
                  height={48}
                  loading="lazy"
                  sizes="64px"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              <p
                className="flex-1 font-[510] text-[rgba(0,5,9,0.89)] [font-family:var(--figma-font-text)]"
                style={{
                  fontSize: "var(--figma-font-size-3)",
                  lineHeight: "var(--figma-line-height-3)",
                  letterSpacing: "var(--figma-letter-spacing-3)",
                }}
              >
                Read our docs on how to transfer context from your model to the{" "}
                <span className="hidden md:inline">
                  <br />
                </span>
                new standard for context-capture.
              </p>

              <motion.a
                href="#"
                className="inline-flex items-center gap-1 h-10 px-4 rounded-full bg-transparent font-[400] text-(--figma-accent-9) [font-family:var(--figma-font-text)] hover:opacity-90 transition-opacity shrink-0"
                style={{
                  fontSize: "var(--figma-font-size-3)",
                  lineHeight: "var(--figma-line-height-3)",
                  letterSpacing: "var(--figma-letter-spacing-3)",
                }}
                aria-label="Documentation"
              >
                Documentation
                <div className="relative shrink-0 w-[18px] h-[18px] overflow-hidden">
                  <RiArrowRightSLine size={18} aria-hidden="true" />
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
