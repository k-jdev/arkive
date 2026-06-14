"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  claudeIcon,
  gptIcon,
  grokIcon,
  geminiIcon,
  downloadIcon,
} from "@/public/icons";
import {
  arkivesHeader,
  arkivesCardsContainer,
  arkivesCard,
} from "@/lib/animations";
import { RiAddFill } from "@remixicon/react";

const AI_AVATARS = [
  { icon: claudeIcon, alt: "Claude", z: 4, bg: "#d97757", delay: 0 },
  { icon: gptIcon, alt: "GPT", z: 3, bg: "#fff", delay: 0.1 },
  { icon: grokIcon, alt: "Grok", z: 2, bg: "#191919", delay: 0.2 },
  { icon: geminiIcon, alt: "Gemini", z: 1, bg: "#fff", delay: 0.3 },
];

function AvatarStack() {
  return (
    <div className="flex items-center">
      <div className="flex items-center isolate">
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
            className="overflow-hidden relative shrink-0"
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
              width={a.alt === "Gemini" ? 40.625 : 40}
              height={a.alt === "Gemini" ? 40.625 : 40}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              draggable={false}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative  ml-[-12.547px] size-[40px] rounded-full bg-[#F0F0F3] flex items-center justify-center opacity-50 shrink-0"
        >
          <RiAddFill className="text-[#000714] opacity-50" size={16} />
        </motion.div>
      </div>
    </div>
  );
}

export default function ArkivesModels() {
  return (
    <section data-header-theme="white" className="w-full px-4 md:px-[80px]">
      <div className="max-w-[1440px] rounded-[24px] bg-[#f9f9fb] w-full mx-auto px-5 md:px-6 lg:px-[80px] xl:px-[144px] pt-[44px] pb-0 md:py-[60px] lg:py-[100px] flex flex-col gap-5 md:gap-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesHeader}
          className="flex items-center justify-center md:justify-between w-full"
        >
          <h2
            className="font-[590] text-[#1c2024] text-[35px] md:text-[clamp(32px,4vw,48px)] leading-[1.0] tracking-[-0.4px] text-center md:text-left"
            style={{
              fontFamily: "var(--figma-font-text)",
              fontVariationSettings: '"wdth" 100',
            }}
          >
            Built into the standard.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesCardsContainer}
          className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full"
        >
          <motion.div
            variants={arkivesCard}
            className="w-full h-[280px] bg-white rounded-[18px] flex flex-col items-center justify-center gap-4 px-[55px] py-8 overflow-hidden min-w-0"
          >
            <div className="grid grid-cols-1 grid-rows-1 place-items-start leading-none relative">
              <div className="col-start-1 row-start-1 w-[188px] h-[92px] rounded-full border border-[#30a46c] opacity-10" />
              <div className="col-start-1 row-start-1 w-[170px] h-[78px] rounded-full border border-[#30a46c] opacity-[0.22] ml-[9px] mt-[7px]" />
              <div className="col-start-1 row-start-1 w-[152px] h-[62px] rounded-full border border-[#30a46c] opacity-40 ml-[18px] mt-[15px]" />

              <div className="col-start-1 row-start-1 ml-[27.33px] mt-[22.5px]">
                <button
                  type="button"
                  className="relative flex items-center gap-[14.247px] h-[47.489px] px-[18.995px] rounded-full bg-[#30a46c] text-white text-[19px] font-[510] leading-[28.493px] tracking-normal"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                    filter: [
                      "drop-shadow(0px 54px 7.5px rgba(48,164,108,0))",
                      "drop-shadow(0px 34px 7px rgba(48,164,108,0.03))",
                      "drop-shadow(0px 19px 6px rgba(48,164,108,0.09))",
                      "drop-shadow(0px 9px 4.5px rgba(48,164,108,0.15))",
                      "drop-shadow(0px 2px 2.5px rgba(48,164,108,0.17))",
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
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow:
                        "inset 3px 3px 4px 0px rgba(255,255,255,0.18), inset -3px -1px 4px 0px rgba(0,0,0,0.18)",
                    }}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 text-center w-full">
              <p
                className="font-[590] text-[#1c2024] text-[36px] leading-[0.9] tracking-[-0.4px] w-full"
                style={{
                  fontFamily: "var(--figma-font-text)",
                  fontVariationSettings: '"wdth" 100',
                }}
              >
                Always yours
              </p>
              <p
                className="font-[510] text-base leading-6 tracking-[0px] text-[rgba(0,7,27,0.5)] w-full"
                style={{
                  fontFamily: "var(--figma-font-text)",
                  fontVariationSettings: '"wdth" 100',
                }}
              >
                Portable by design
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={arkivesCard}
            className="w-full h-[280px] bg-white rounded-[18px] flex flex-col justify-between p-8 overflow-hidden min-w-0"
          >
            <div
              className="font-[510] text-[28px] leading-[36px] tracking-[-0.12px]"
              style={{
                fontFamily: "var(--figma-font-text)",
                fontVariationSettings: '"wdth" 100',
              }}
            >
              <p className="leading-[36px] mb-0 text-[rgba(0,5,9,0.89)]">
                Understood
              </p>
              <p className="leading-[36px] mb-0 text-[rgba(0,5,29,0.45)]">
                by any of the
              </p>
              <p className="leading-[36px] text-[rgba(0,5,29,0.45)]">
                leading models
              </p>
            </div>

            <AvatarStack />
          </motion.div>

          <motion.div
            variants={arkivesCard}
            className="w-full h-[280px] bg-white rounded-[18px] flex flex-col justify-between pt-[54px] pb-8 px-8 overflow-hidden relative min-w-0"
          >
            <p
              className="font-[510] text-[24px] leading-[30px] tracking-[-0.1px] text-[rgba(0,5,9,0.89)]"
              style={{
                fontFamily: "var(--figma-font-text)",
                fontVariationSettings: '"wdth" 100',
              }}
            >
              Collaborative{" "}
              <span className="text-[rgba(0,5,9,0.89)]">across users</span> in
              real time
            </p>

            <div className="-ml-8 -mr-8 -mb-8 pr-8 mt-6 md:mt-0">
              <Image
                src="/sections/models/uptodate.webp"
                alt="Collaborative across users"
                width={318}
                height={135}
                className="w-full h-auto scale-[clamp(0.75,calc(0.8+(100vw-800px)/3000),1)] origin-bottom-left"
                draggable={false}
                unoptimized
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesHeader}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full bg-white rounded-[18px] px-6 md:px-10 py-6 mb-4"
        >
          <div className="flex items-center gap-6">
            <div className="shrink-0 w-16 h-12 rounded-xl overflow-hidden">
              <Image
                src="/sections/setup/install.webp"
                alt=""
                width={64}
                height={48}
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
              Read our docs on how to transfer context from your model to the
              new standard for context-capture.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 h-10 rounded-full bg-transparent font-[400] text-(--figma-accent-9) [font-family:var(--figma-font-text)] hover:opacity-90 transition-opacity shrink-0 self-start md:self-auto"
            style={{
              fontSize: "var(--figma-font-size-3)",
              lineHeight: "var(--figma-line-height-3)",
              letterSpacing: "var(--figma-letter-spacing-3)",
            }}
          >
            Documentation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
