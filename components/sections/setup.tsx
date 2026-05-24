"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { claudeIcon, gptIcon, grokIcon, geminiIcon } from "@/public/icons";

const AI_ICONS = [
  { src: claudeIcon, alt: "Claude" },
  { src: gptIcon, alt: "ChatGPT" },
  { src: grokIcon, alt: "Grok" },
  { src: geminiIcon, alt: "Gemini" },
];

export default function Setup() {
  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <h2
          className="font-[590] tracking-[-0.4px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]"
          style={{ fontSize: "clamp(32px, 3.3vw, 48px)", lineHeight: 0.9 }}
        >
          {`Set up your Arkive in < 1 minute.`}
        </h2>

        <div className="flex flex-col gap-5">
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#f9f9fb] md:h-110.25">
            {/* Content — absolute on desktop, flex col on mobile */}
            <div className="relative md:absolute md:left-36 md:top-1/2 md:-translate-y-1/2 flex flex-col gap-6 md:gap-8 px-6 md:px-0 pt-8 md:pt-0 pb-6 md:pb-0 md:w-77.25">
              <p
                className="[font-family:var(--figma-font-text)] text-[clamp(20px,5vw,28px)]"
                style={{
                  lineHeight: "1.3",
                  letterSpacing: "-0.12px",
                }}
              >
                <span className="font-[510] text-[rgba(0,5,9,0.89)]">
                  {"Connect the Arkive MCP "}
                </span>
                <span className="font-[510] text-[rgba(0,5,29,0.45)]">
                  to your model of choice in seconds.
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center h-10 rounded-full shrink-0 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 px-(--figma-spacing-4) text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-12) text-(--figma-neutral-1) font-[510] [font-family:var(--figma-font-text)]"
                >
                  Get started
                </button>

                <div className="flex items-center">
                  {AI_ICONS.map((icon, i) => (
                    <motion.div
                      key={icon.alt}
                      className="relative shrink-0 size-8.5 rounded-full overflow-hidden bg-white border border-[rgba(187,187,187,0.26)]"
                      initial={{ opacity: 0, x: -12, scale: 0.7 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        delay: i * 0.12,
                        duration: 0.45,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                      animate={{
                        marginRight: i < 3 ? "-10.665px" : "0",
                        zIndex: 4 - i,
                      }}
                      whileHover={{
                        marginRight: "6px",
                        zIndex: 10,
                        transition: { duration: 0.25, ease: "easeOut" },
                      }}
                    >
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={34}
                        height={34}
                        className="w-full h-full object-contain p-1"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side — MacBook + Terminal */}
            <div className="relative md:absolute right-0 top-0 md:h-full w-full md:w-[55%]">
              {/* MacBook — centered vertically */}
              <div className="relative md:absolute px-6 md:px-0 md:top-1/2 md:-translate-y-1/2 md:right-8 w-full md:w-[90%] max-w-140 mx-auto md:mx-0">
                <Image
                  src="/sections/setup/macbook.png"
                  alt="MacBook"
                  width={560}
                  height={340}
                  className="w-full h-auto"
                  priority
                />
              </div>

              {/* Terminal — anchored to card bottom */}
              <div className="relative md:absolute bottom-0 right-0 w-full md:w-[58%] z-10 shadow-xl md:rounded-tl-xl overflow-hidden">
                <Image
                  src="/sections/setup/terminal.png"
                  alt="Terminal"
                  width={500}
                  height={160}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Card 2 — Documentation */}
          <div className="w-full rounded-3xl bg-[#f9f9fb] px-5 md:px-6 py-5 flex flex-wrap items-center gap-3 md:gap-4">
            {/* Icon */}
            <div className="shrink-0 size-10 rounded-xl overflow-hidden">
              <Image
                src="/sections/setup/install.png"
                alt="Arkive install"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <p
              className="flex-1 font-normal text-(--figma-neutral-12) [font-family:var(--figma-font-text)]"
              style={{
                fontSize: "var(--figma-font-size-3)",
                lineHeight: "var(--figma-line-height-3)",
                letterSpacing: "var(--figma-letter-spacing-3)",
              }}
            >
              Read our docs on how to transfer context from your model to the
              new standard for context-capture.
            </p>

            {/* Documentation link */}
            <a
              href="#"
              className="flex items-center gap-0.5 shrink-0 font-[510] text-(--figma-accent-9) [font-family:var(--figma-font-text)] hover:opacity-75 transition-opacity"
              style={{
                fontSize: "var(--figma-font-size-3)",
                lineHeight: "var(--figma-line-height-3)",
              }}
              aria-label="Documentation"
            >
              Documentation
              <RiArrowRightSLine size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
