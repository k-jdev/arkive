"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  claudeIcon,
  gptIcon,
  grokIcon,
  geminiIcon,
  downloadIcon,
  LOGO_COLORS,
} from "@/public/icons";
import {
  arkivesHeader,
  arkivesCardsContainer,
  arkivesCard,
} from "@/lib/animations";

// ── Avatar stack sub-component ───────────────────────────┐

const AI_AVATARS = [
  { icon: claudeIcon, alt: "Claude", z: 4, bg: "#d97757", delay: 0 },
  { icon: gptIcon, alt: "GPT", z: 3, bg: "#fff", delay: 0.1 },
  { icon: grokIcon, alt: "Grok", z: 2, bg: "#191919", delay: 0.2 },
  { icon: geminiIcon, alt: "Gemini", z: 1, bg: "#fff", delay: 0.3 },
];

function AvatarStack() {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {AI_AVATARS.map((a, i) => (
          <motion.div
            key={a.alt}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.35,
              delay: a.delay,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="overflow-hidden relative"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",

              marginRight: i < 3 ? -12.547 : 0,
              zIndex: a.z,
            }}
          >
            <Image
              src={a.icon}
              alt={a.alt}
              width={a.alt === "Gemini" ? 25.625 : 30}
              height={a.alt === "Gemini" ? 25.625 : 30}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ArkivesModels() {
  return (
    <section className="w-full px-5 md:px-[80px] ">
      <div className="max-w-[1440px] rounded-[24px] bg-black w-full mx-auto px-6 md:px-[144px] py-[60px] md:py-[100px]">
        {/* ── Header row ────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesHeader}
          className="flex items-center justify-between w-full mb-10"
        >
          <h2 className="font-[590] text-white text-[48px] leading-[0.9] tracking-[-0.4px] [font-family:var(--figma-font-text)]">
            Lorem ipsum.
          </h2>

          <button
            type="button"
            className="flex items-center justify-center h-10 px-(--figma-spacing-4) rounded-full bg-[#212225] text-[#edeef0] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) font-[510] whitespace-nowrap shrink-0 [font-family:var(--figma-font-text)]"
          >
            Get started
          </button>
        </motion.div>

        {/* ── Cards row ─────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesCardsContainer}
          className="flex flex-col xl:flex-row gap-5 w-full"
        >
          {/* ── Card 1 — Always yours ─────────────────────── */}
          <motion.div
            variants={arkivesCard}
            className="w-full xl:w-[317px] h-[280px] bg-[#18191b] rounded-[18px] flex flex-col items-center justify-center gap-4 px-[55px] py-8 overflow-hidden xl:shrink-0"
          >
            {/* Decorative circles + Export button */}
            <div className="grid grid-cols-1 grid-rows-1 place-items-start leading-none relative">
              <div className="col-start-1 row-start-1 w-[188px] h-[92px] rounded-full border border-[#30a46c] opacity-10" />
              <div className="col-start-1 row-start-1 w-[170px] h-[78px] rounded-full border border-[#30a46c] opacity-22 ml-[9px] mt-[7px]" />
              <div className="col-start-1 row-start-1 w-[152px] h-[62px] rounded-full border border-[#30a46c] opacity-40 ml-[18px] mt-[15px]" />

              {/* Export floating button */}
              <div className="col-start-1 row-start-1 ml-[27.33px] mt-[22.5px]">
                <button
                  type="button"
                  className="relative flex items-center gap-[14.247px] h-[47.489px] px-[18.995px] rounded-full bg-[#30a46c] text-white text-[19px] font-[510] leading-[28.493px] tracking-[0px] [font-family:var(--figma-font-text)] shadow-[inset_3px_3px_4px_0px_rgba(255,255,255,0.18),inset_-3px_-1px_4px_0px_rgba(0,0,0,0.18)]"
                  style={{
                    filter: [
                      "drop-shadow(0px 53.425px 7.717px rgba(30,118,75,0.01))",
                      "drop-shadow(0px 34.429px 7.123px rgba(30,118,75,0.07))",
                      "drop-shadow(0px 18.995px 5.936px rgba(30,118,75,0.22))",
                      "drop-shadow(0px 8.311px 4.155px rgba(30,118,75,0.38))",
                      "drop-shadow(0px 2.374px 2.374px rgba(30,118,75,0.44))",
                    ].join(" "),
                  }}
                >
                  <span className="relative z-10">Export</span>
                  <Image
                    src={downloadIcon}
                    alt=""
                    width={21.37}
                    height={21.37}
                    className="relative z-10 shrink-0"
                  />
                </button>
              </div>
            </div>

            {/* Text below */}
            <div className="flex flex-col items-center gap-2 text-center w-full">
              <p className="font-[590] text-white text-[36px] text-nowrap leading-[0.9] tracking-[-0.4px] w-full [font-family:var(--figma-font-text)]">
                Always yours
              </p>
              <p className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) text-[rgba(229,237,253,0.48)] w-full [font-family:var(--figma-font-text)]">
                By design
              </p>
            </div>
          </motion.div>

          {/* ── Card 2 — Understood by leading models ─────── */}
          <motion.div
            variants={arkivesCard}
            className="flex-1 min-w-0 h-[280px] bg-[#18191b] rounded-[18px] flex flex-col justify-between p-8 overflow-hidden"
          >
            <div className="font-[510] text-[28px] leading-[36px] tracking-[-0.12px] text-[rgba(223,235,253,0.43)] [font-family:var(--figma-font-text)]">
              <p className="leading-[36px] mb-0 text-[rgba(252,253,255,0.94)]">
                Understood
              </p>
              <p className="leading-[36px] mb-0">by any of the</p>
              <p className="leading-[36px]">leading models</p>
            </div>

            <AvatarStack />
          </motion.div>

          {/* ── Card 3 — The standard ──────────────────────── */}
          <motion.div
            variants={arkivesCard}
            className="flex-1 min-w-0 h-[280px] bg-[#272a2d] rounded-[18px] flex flex-col justify-between p-8 overflow-hidden"
          >
            <div className="font-[510] text-[28px] leading-[36px] tracking-[-0.12px] text-[rgba(223,235,253,0.43)] [font-family:var(--figma-font-text)]">
              <p className="leading-[36px] mb-0 text-[rgba(252,253,255,0.94)]">
                The standard
              </p>
              <p className="leading-[36px]">for compounding context</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: 0.2,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <Image
                src={LOGO_COLORS.logoWhite}
                alt="Arkive"
                width={40}
                height={32}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Bottom CTA bar ──────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesHeader}
          className="flex flex-col md:flex-row items-center justify-between gap-4 w-full mt-10 bg-[#18191b] rounded-[18px] px-6 md:px-10 py-6"
        >
          <p className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) text-[rgba(252,253,255,0.94)] w-full md:w-[511px] [font-family:var(--figma-font-text)]">
            Read our docs on how to transfer context from your model to the new
            standard for context-capture.
          </p>

          <button
            type="button"
            className="flex items-center justify-center h-10 px-(--figma-spacing-4) rounded-full bg-[#edeef0] text-[#111113] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) font-[510] whitespace-nowrap shrink-0 [font-family:var(--figma-font-text)]"
          >
            Get started
          </button>
        </motion.div>
      </div>
    </section>
  );
}
