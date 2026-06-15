"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiArrowRightSLine,
} from "@remixicon/react";

interface FaqItem {
  question: string;
  answer: string;
}

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
      "Every conversation, thesis, and market observation can be stored into your persistent research layer. Your AI builds context over time instead of starting from zero every session.",
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

function AnswerContent({
  answer,
  isMobile,
}: {
  answer: string;
  isMobile?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [answer]);

  return (
    <motion.p
      ref={ref}
      initial={{ height: 0, opacity: 0, marginTop: 0 }}
      animate={{
        height,
        opacity: 1,
        marginTop: 16,
        transition: {
          height: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
          opacity: { duration: 0.25, delay: 0.05 },
          marginTop: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
        },
      }}
      exit={{
        height: 0,
        opacity: 0,
        marginTop: 0,
        transition: {
          height: { duration: 0.3, ease: [0.55, 0, 0.45, 1] },
          opacity: { duration: 0.15 },
          marginTop: { duration: 0.3, ease: [0.55, 0, 0.45, 1] },
        },
      }}
      className={`overflow-hidden font-[510] text-[#60646c] ${
        isMobile
          ? "text-[14px] leading-5 tracking-normal"
          : "text-base leading-6 tracking-normal w-150.25"
      }`}
      style={{
        fontFamily: "var(--figma-font-text)",
        fontVariationSettings: '"wdth" 100',
      }}
    >
      {answer}
    </motion.p>
  );
}

export default function ArkivesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section data-header-theme="light" className="w-full bg-white">
      <div className="max-w-360 mx-auto px-[clamp(16px,4.17vw,80px)] pt-20 md:pt-64 pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row gap-6.25 lg:gap-16">
          <div className="flex flex-col items-center md:items-start gap-4 md:gap-6 lg:w-95 lg:shrink-0">
            <div className="text-center md:text-left">
              <h2
                className="font-[590] text-[35px] md:text-[48px] leading-none tracking-[-0.4px] text-[#1c2024]"
                style={{
                  fontFamily: "var(--figma-font-text)",
                  fontVariationSettings: '"wdth" 100',
                }}
              >
                Any questions?
              </h2>
              <h2
                className="font-[590] text-[35px] md:text-[48px] leading-none tracking-[-0.4px] text-[#b9bbc6]"
                style={{
                  fontFamily: "var(--figma-font-text)",
                  fontVariationSettings: '"wdth" 100',
                }}
              >
                We got you.
              </h2>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 h-10 px-1 rounded-full text-[#0022ff] text-base leading-6 tracking-normal font-normal whitespace-nowrap shrink-0"
              style={{
                fontFamily: "var(--figma-font-text)",
                fontVariationSettings: '"wdth" 100',
              }}
            >
              Documentation
              <RiArrowRightSLine size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              const hasAnswer = !!item.answer;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + index * 0.05,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="w-full bg-[#f9f9fb] rounded-[18px] px-6 md:px-8 py-4 text-left group "
                  >
                    <div className="flex items-center gap-4 md:gap-16.5">
                      <div className="flex flex-col items-start min-w-0 w-full md:w-169.5">
                        <span
                          className="font-[510] text-[20px] md:text-[24px] leading-7 md:leading-7.5 tracking-[-0.12px] md:tracking-[-0.1px] text-[#1c2024] whitespace-nowrap"
                          style={{
                            fontFamily: "var(--figma-font-text)",
                            fontVariationSettings: '"wdth" 100',
                          }}
                        >
                          {item.question}
                        </span>

                        <div className="hidden md:block w-full">
                          <AnimatePresence mode="wait">
                            {isOpen && hasAnswer && (
                              <AnswerContent
                                key={`desktop-${index}`}
                                answer={item.answer}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="flex items-start justify-center size-8 md:size-10 shrink-0 self-start">
                        <div
                          className={`flex items-center justify-center size-8 md:size-10 shrink-0 transition-all duration-300 ${
                            isOpen
                              ? "bg-[#f0f0f3] rounded-full"
                              : "rounded-[9px]"
                          }`}
                        >
                          {isOpen ? (
                            <RiArrowUpSLine size={18} aria-hidden="true" />
                          ) : (
                            <RiArrowDownSLine size={18} aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="block md:hidden">
                      <AnimatePresence mode="wait">
                        {isOpen && hasAnswer && (
                          <AnswerContent
                            key={`mobile-${index}`}
                            answer={item.answer}
                            isMobile
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
