"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { DOMAINS_IMAGES } from "@/public/sections/domains";
import {
  domainsHeader,
  domainsCardsContainer,
  domainsCard,
  safeFade,
  safeContainer,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";

export default function PracticesDomains() {
  const reduced = usePrefersReducedMotion();

  return (
    <section data-header-theme="white" className="w-full">
      <div className="w-full bg-[#f9f9fb]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[80px] py-[60px] md:py-[100px]">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={domainsHeader}
              className="flex flex-col gap-6 w-full lg:w-[480px] shrink-0"
            >
              <p
                className="font-[590] text-(--figma-accent-9) [font-family:var(--figma-font-text)]"
                style={{
                  fontSize: "var(--figma-font-size-5)",
                  lineHeight: "var(--figma-line-height-5)",
                  letterSpacing: "var(--figma-letter-spacing-5)",
                  fontVariationSettings: '"wdth" 100',
                }}
              >
                Practices
              </p>

              <h2
                className="font-[590] text-[clamp(32px,4vw,48px)] leading-[0.9] tracking-[-0.4px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Domains of life and work. One Arkive fits any domain.
              </h2>

              <button
                type="button"
                className="flex items-center justify-center gap-1 h-10 rounded-full w-fit px-(--figma-spacing-4) bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)] transition-colors hover:bg-[rgba(0,0,51,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Learn more
                <RiArrowRightSLine size={18} aria-hidden="true" />
              </button>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView={reduced ? undefined : "visible"}
              viewport={{ once: true, margin: "-60px" }}
              variants={reduced ? safeContainer : domainsCardsContainer}
              className="flex-1 relative w-full lg:h-[660px] min-h-[400px]"
            >
              <motion.div
                variants={reduced ? safeFade : domainsCard}
                className="absolute pointer-events-none overflow-hidden"
                style={{
                  left: 0,
                  top: "22.8%",
                  width: "97.8%",
                  height: "71.5%",
                }}
              >
                <Image
                  src={DOMAINS_IMAGES.graphDomain}
                  alt=""
                  fill
                  className="object-contain object-left-top"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  draggable={false}
                />
              </motion.div>

              <motion.div
                variants={reduced ? safeFade : domainsCard}
                className="absolute aspect-square rounded-[8px] overflow-hidden shadow-lg z-10"
                style={{ left: "30.4%", top: "12.4%", width: "27.5%" }}
              >
                <Image
                  src={DOMAINS_IMAGES.gymDomain}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="28vw"
                  draggable={false}
                />
              </motion.div>

              <motion.div
                variants={reduced ? safeFade : domainsCard}
                className="absolute rounded-[8px] overflow-hidden shadow-lg z-20"
                style={{ left: "52.8%", top: "17.7%", width: "38.3%" }}
              >
                <Image
                  src={DOMAINS_IMAGES.consistencyDomain}
                  alt=""
                  width={277}
                  height={217}
                  className="w-full h-auto"
                  draggable={false}
                />
              </motion.div>

              <motion.div
                variants={reduced ? safeFade : domainsCard}
                className="absolute rounded-[8px] overflow-hidden shadow-lg z-30"
                style={{ left: "21.4%", top: "50.4%", width: "38.9%" }}
              >
                <Image
                  src={DOMAINS_IMAGES.workDomain}
                  alt=""
                  width={282}
                  height={221}
                  className="w-full h-auto"
                  draggable={false}
                />
              </motion.div>

              <motion.div
                variants={reduced ? safeFade : domainsCard}
                className="absolute rounded-[8px] overflow-hidden shadow-lg z-40"
                style={{ left: "49.6%", top: "58.2%", width: "38.3%" }}
              >
                <Image
                  src={DOMAINS_IMAGES.watchDomain}
                  alt=""
                  width={277}
                  height={207}
                  className="w-full h-auto"
                  draggable={false}
                />
              </motion.div>

              <motion.div
                variants={reduced ? safeFade : domainsCard}
                className="absolute rounded-[8px] overflow-hidden shadow-2xl z-50"
                style={{ left: "36.7%", top: "31.9%", width: "43.6%" }}
              >
                <Image
                  src={DOMAINS_IMAGES.indexDomain}
                  alt=""
                  width={316}
                  height={180}
                  className="w-full h-auto"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
