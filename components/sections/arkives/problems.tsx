"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ARKIVES_ICONS } from "@/public/icons";
import {
  arkivesHeader,
  arkivesCardsContainer,
  arkivesCard,
} from "@/lib/animations";

interface ProblemCard {
  icon: string;
  title: React.ReactNode;
  number: string;
  description: string;
}

const CARDS: ProblemCard[] = [
  {
    icon: ARKIVES_ICONS.nodeTreeIcon,
    title: (
      <>
        Without structure, the system
        <span className="text-[#dc3e42]"> can&apos;t keep</span>
        <span className="text-[#dc3e42]"> the full record.</span>
      </>
    ),
    number: "1",
    description:
      "Every conversation is reduced to a few facts. Everything else is gone.",
  },
  {
    icon: ARKIVES_ICONS.folderLockIcon,
    title: (
      <>
        <span>Your context is </span>
        <span className="text-[#dc3e42]"> stuck</span>
        <span className="text-[#dc3e42]"> inside whichever model </span>
        you used.
      </>
    ),
    number: "2",
    description:
      "Claude can’t read what ChatGPT remembers. Switch tools and start over.",
  },
  {
    icon: ARKIVES_ICONS.pullRequestIcon,
    title: (
      <>
        Internal memory
        <br />
        grows, <span className="text-[#dc3e42]">intelligence</span>
        <br />
        <span className="text-[#dc3e42]">doesn&apos;t.</span>
      </>
    ),
    number: "3",
    description: "More chats is just more data to store, not a sharper system.",
  },
];

export default function ArkivesProblems() {
  return (
    <section data-header-theme="light" className="w-full bg-[#f9f9fb]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] pt-31 pb-24"
      >
        <motion.h2
          variants={arkivesHeader}
          className="font-[590] text-[48px] leading-[0.9] tracking-[-0.4px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]"
        >
          Today&apos;s AI memory has 3 problems.
        </motion.h2>

        <motion.div
          variants={arkivesCardsContainer}
          className="flex flex-col md:flex-row md:flex-wrap gap-5 mt-10"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.number}
              variants={arkivesCard}
              className="flex-1 min-w-[320px] bg-white rounded-3xl overflow-clip px-8 py-6 flex flex-col justify-between gap-16"
            >
              <div className="flex flex-col gap-4">
                <Image
                  src={card.icon}
                  alt=""
                  width={36}
                  height={36}
                  aria-hidden="true"
                  draggable={false}
                />

                <p
                  className="font-[510] text-(length:--figma-font-size-7) leading-(--figma-line-height-7) tracking-(--figma-letter-spacing-7) [font-family:var(--figma-font-text)]"
                  style={{ color: "rgba(0,5,9,0.89)" }}
                >
                  {card.title}
                </p>
              </div>

              <div className="flex gap-2">
                <span
                  className="font-bold text-(length:--figma-font-size-1) leading-(--figma-line-height-1) tracking-(--figma-letter-spacing-1) [font-family:var(--figma-font-text)] shrink-0"
                  style={{ color: "rgba(0,5,9,0.89)" }}
                >
                  {card.number}
                </span>
                <p
                  className="font-normal text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]"
                  style={{ color: "rgba(0,5,29,0.45)" }}
                >
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
