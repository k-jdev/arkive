"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  arkivesHeader,
  arkivesCardsContainer,
  arkivesCard,
} from "@/lib/animations";

export default function ArkivesProblems() {
  return (
    <section data-header-theme="light" className="w-full bg-[#f9f9fb]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] pt-31 pb-24"
      >
        <div className="flex flex-col xl:flex-row gap-10 xl:gap-20 min-w-0">
          <motion.div variants={arkivesHeader} className="shrink-0">
            <h2 className="font-[590] text-[clamp(35px,4vw,48px)] leading-[0.9] tracking-[-0.4px] text-[#1c2024] [font-family:var(--figma-font-text)]">
              <span className="block">AI is intelligent</span>
              <span className="block">{`— its memory isn't.`}</span>
            </h2>
          </motion.div>

          <motion.div
            variants={arkivesCardsContainer}
            className="flex flex-col md:flex-row xl:flex-row gap-5 flex-1 justify-end min-w-0"
          >
            <motion.div
              variants={arkivesCard}
              className="relative bg-[#212225] rounded-3xl p-8 w-full md:w-[400px] h-[360px] flex flex-col justify-between overflow-hidden"
            >
              <p className="relative z-10 font-[510] text-[24px] leading-[30px] tracking-[-0.1px] [font-family:var(--figma-font-text)]">
                <span className="text-[#edeef0]">AI model memory</span>
                <span className="text-[#696e77]">
                  {" "}
                  is unstructured, decaying, and model-locked.
                </span>
              </p>

              <div className="absolute left-0 right-0 bottom-0 top-[40%]">
                <Image
                  src="/sections/problems/card1.png"
                  alt=""
                  fill
                  className="object-contain object-bottom md:object-right-bottom translate-x-[0%] md:translate-x-[-20%] translate-y-[14%] scale-[1.15]"
                  sizes="(max-width: 768px) 100vw, 400px"
                  aria-hidden="true"
                  draggable={false}
                  unoptimized
                />
              </div>
            </motion.div>

            <motion.div
              variants={arkivesCard}
              className="relative bg-white rounded-3xl p-8 w-full md:w-[400px] h-[360px] flex flex-col justify-between overflow-hidden"
            >
              <p className="relative z-10 font-[510] text-[24px] leading-[30px] tracking-[-0.1px] [font-family:var(--figma-font-text)]">
                <span className="text-[#1c2024]">
                  Arkives bring a memory structure that{" "}
                </span>
                <span className="text-[#02f]">compounds to any model.</span>
              </p>

              <div className="absolute inset-x-0 bottom-0 h-[60%] top-37">
                <Image
                  src="/sections/problems/card2.png"
                  alt=""
                  fill
                  className="object-contain object-right-bottom"
                  sizes="(max-width: 768px) 100vw, 400px"
                  aria-hidden="true"
                  draggable={false}
                  unoptimized
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
