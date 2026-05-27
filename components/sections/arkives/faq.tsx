"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    answer:
      "Yes. Every trade, outcome, and annotation is stored in your Arkive. The AI references past decisions to surface patterns and improve future recommendations — it gets smarter the more you use it.",
  },
  {
    question: "Can I organize research by topic?",
    answer:
      "Absolutely. You can structure your Arkive with folders, tags, and custom taxonomies — just like a filesystem. Group by sector, thesis, asset class, or any dimension that fits your workflow.",
  },
  {
    question: "What happens when context gets too large?",
    answer:
      "Arkive automatically summarizes and prunes stale context while preserving critical signals. You set the retention rules — the system keeps what matters and archives the rest.",
  },
  {
    question: "What happens when context gets too large?",
    answer: "",
  },
  {
    question: "Is my research private?",
    answer:
      "Yes. Your Arkive runs locally by default. Nothing leaves your machine unless you explicitly configure a sync endpoint. You own your data, always.",
  },
  {
    question: "Can I revisit old market theses?",
    answer:
      "Every thesis is timestamped and preserved. You can browse your archive chronologically, search by keyword, or filter by outcome — so past reasoning is always one click away.",
  },
];

export default function ArkivesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section data-header-theme="light" className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] pt-20 md:pt-64 pb-16 md:pb-24">
        {/* ── Header ─────────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="font-[590] text-[48px] leading-[0.9] tracking-[-0.4px] text-center [font-family:var(--figma-font-text)]"
          style={{ color: "var(--figma-neutral-12)" }}
        >
          FAQ
        </motion.h2>

        {/* ── FAQ Items ──────────────────────────────── */}
        <div className="mt-10 md:mt-[83px] border-t border-[rgba(0,0,0,0.09)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const hasAnswer = !!item.answer;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + index * 0.06,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="border-b border-[rgba(0,0,0,0.09)]"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left group"
                >
                  {/* ── Question + answer ─────────────── */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_601px] gap-2 xl:gap-[80px] items-start">
                      <span
                        className="font-[510] text-(length:--figma-font-size-5) leading-(--figma-line-height-5) tracking-(--figma-letter-spacing-5) [font-family:var(--figma-font-text)]"
                        style={{ color: "var(--figma-neutral-12)" }}
                      >
                        {item.question}
                      </span>

                      {/* Desktop answer */}
                      <div className="hidden xl:block">
                        <AnimatePresence mode="wait">
                          {isOpen && hasAnswer && (
                            <motion.p
                              key="answer"
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{
                                height: "auto",
                                opacity: 1,
                                marginTop: 0,
                              }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{
                                height: {
                                  duration: 0.4,
                                  ease: [0.25, 1, 0.5, 1],
                                },
                                opacity: { duration: 0.25 },
                              }}
                              className="overflow-hidden font-normal text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) [font-family:var(--figma-font-text)]"
                              style={{ color: "var(--figma-neutral-12)" }}
                            >
                              {item.answer}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Mobile answer */}
                    <AnimatePresence>
                      {isOpen && hasAnswer && (
                        <motion.p
                          key="answer-mobile"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.25, 1, 0.5, 1],
                          }}
                          className="xl:hidden overflow-hidden font-normal text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) [font-family:var(--figma-font-text)] mt-3"
                          style={{ color: "var(--figma-neutral-12)" }}
                        >
                          {item.answer}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Arrow ──────────────────────── */}
                  <div
                    className={`flex items-center justify-center size-8 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <RiArrowDownSLine size={16} aria-hidden="true" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
