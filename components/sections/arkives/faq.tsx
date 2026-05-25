"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { RiArrowDownSLine } from "@remixicon/react";

// ── Types ────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

// ── Data ─────────────────────────────────────────────────

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Does the AI learn from previous trades?",
    answer: "",
  },
  {
    question: "Can I organize research by topic?",
    answer: "",
  },
  {
    question: "What happens when context gets too large?",
    answer:
      "Every conversation, thesis, and market observation can be stored into your persistent research layer. Your AI builds context over time instead of starting from zero every session.",
  },
  {
    question: "What happens when context gets too large?",
    answer: "",
  },
  {
    question: "Is my research private?",
    answer: "",
  },
  {
    question: "Can I revisit old market theses?",
    answer: "",
  },
];

// ── Main Component ───────────────────────────────────────

export default function ArkivesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] pt-31 pb-24">
        {/* ── Header ─────────────────────────────────── */}
        <h2
          className="font-[590] text-[48px] leading-[0.9] tracking-[-0.4px] [font-family:var(--figma-font-text)]"
          style={{ color: "var(--figma-neutral-12)" }}
        >
          FAQ
        </h2>

        {/* ── FAQ Items ──────────────────────────────── */}
        <div className="mt-[83px] border-t border-[rgba(0,0,0,0.09)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const hasAnswer = !!item.answer;

            return (
              <div key={index} className="border-b border-[rgba(0,0,0,0.09)]">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className={`w-full flex gap-[56px] py-6 text-left ${
                    isOpen && hasAnswer ? "items-start" : "items-center"
                  }`}
                >
                  {/* ── Text block (question + answer) ─── */}
                  <div className="flex-1 flex items-center gap-[80px] min-w-px">
                    {/* Question */}
                    <span
                      className={`font-[510] text-(length:--figma-font-size-5) leading-(--figma-line-height-5) tracking-(--figma-letter-spacing-5) [font-family:var(--figma-font-text)] [font-feature-settings:'wdth'_100] ${
                        isOpen && hasAnswer ? "" : "whitespace-nowrap"
                      }`}
                      style={{ color: "var(--figma-neutral-12)" }}
                    >
                      {item.question}
                    </span>

                    {/* Answer / empty spacer */}
                    <div className="w-[601px] shrink-0">
                      {isOpen && hasAnswer ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 1, 0.5, 1],
                          }}
                          className="font-normal text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) [font-family:var(--figma-font-text)] [font-feature-settings:'wdth'_100]"
                          style={{ color: "var(--figma-neutral-12)" }}
                        >
                          {item.answer}
                        </motion.p>
                      ) : (
                        <div className="h-10" />
                      )}
                    </div>
                  </div>

                  {/* ── Arrow icon ────────────────────── */}
                  <div
                    className="flex items-center justify-center size-8 rounded-[6px] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <RiArrowDownSLine size={16} aria-hidden="true" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
