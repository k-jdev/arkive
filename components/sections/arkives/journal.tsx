"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { RiArrowUpSLine, RiArrowDownSLine } from "@remixicon/react";
import { SLIDER_ICONS } from "@/public/icons";

// ─── Motion tokens (inline, no external file needed) ───────────────────────
const springs = {
  snappy: { type: "spring", stiffness: 300, damping: 30 } as const,
  gentle: { type: "spring", stiffness: 120, damping: 14 } as const,
  layout: { type: "spring", stiffness: 260, damping: 28 } as const,
};

const duration = { fast: 0.18, normal: 0.35 };
const easing = { smooth: [0.22, 1, 0.36, 1] as const };

// ─── Data ───────────────────────────────────────────────────────────────────
const JOURNAL_BACKGROUNDS = [
  "/sections/journal/journal.webp",
  "/sections/journal/insights.webp",
  "/sections/journal/skills.webp",
  "/sections/journal/mcp.webp",
];

interface JournalItem {
  icon: string;
  label: string;
  description?: { text: string; bold?: boolean }[];
}

const JOURNAL_ITEMS: JournalItem[] = [
  {
    icon: SLIDER_ICONS.recordIcon,
    label: "Record",
    description: [
      { text: "Raw data, conversations, & outcomes stored " },
      { text: "the journal.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.noticeIcon,
    label: "Notice",
    description: [
      {
        text: "Patterns, anomalies, & previous reasoning from the journal, surfaced as ",
      },
      { text: "insights.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.learnIcon,
    label: "Learn",
    description: [
      { text: "Accepted insights become new " },
      { text: "skills,", bold: true },
      { text: " and update current " },
      { text: "context.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.focusIcon,
    label: "Improve",
    description: [{ text: "Sharper reasoning after every cycle." }],
  },
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function ArkivesJournal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const goUp = useCallback(() => {
    setDirection("up");
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : JOURNAL_ITEMS.length - 1));
  }, []);

  const goDown = useCallback(() => {
    setDirection("down");
    setActiveIndex((prev) => (prev < JOURNAL_ITEMS.length - 1 ? prev + 1 : 0));
  }, []);

  const handleCardClick = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? "down" : "up");
      setActiveIndex(index);
    },
    [activeIndex],
  );

  return (
    <section data-header-theme="light" className="w-full bg-white md:px-20">
      <div className="max-w-360 mx-auto px-4 md:px-0 py-16 md:py-40">
        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-4 mb-8 md:mb-10">
          <h2
            className="font-[590] text-[32px] md:text-[48px] leading-[0.9] tracking-[-0.4px] text-center [font-family:var(--figma-font-text)]"
            style={{ color: "var(--figma-neutral-12)" }}
          >
            The loop that compounds.
          </h2>
          <p
            className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) text-center max-w-125 [font-family:var(--figma-font-text)]"
            style={{ color: "rgba(0,5,9,0.89)" }}
          >
            An Arkive&apos;s structure enables compounding intelligence.
          </p>
        </div>

        {/* ── Content block ── */}
        <div className="relative md:h-137.5 rounded-[24px] overflow-clip bg-[#F9F9FB]">
          {/* Images — right side, single card with switch animation */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                className="absolute inset-0"
                variants={{
                  enter: (dir: "down" | "up") => ({
                    translateX: dir === "down" ? 80 : -80,
                    scale: 0.95,
                    opacity: 0,
                  }),
                  center: { translateX: 0, scale: 1, opacity: 1 },
                  exit: (dir: "down" | "up") => ({
                    translateX: dir === "down" ? -400 : 400,
                    scale: 0.85,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 26,
                }}
              >
                <Image
                  src={JOURNAL_BACKGROUNDS[activeIndex]}
                  alt=""
                  fill
                  className="object-contain object-bottom-right"
                  sizes="100vw"
                  aria-hidden="true"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {isAnimating && (
            <div
              className="absolute inset-y-0 right-0 w-30 pointer-events-none z-10"
              style={{
                background: "linear-gradient(to right, transparent, #F9F9FB)",
              }}
            />
          )}

          {/* ── Scroll buttons — desktop ── */}
          <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-10">
            <motion.button
              type="button"
              aria-label="Previous step"
              onClick={goUp}
              className="flex items-center justify-center size-10 rounded-full bg-[#f0f0f3]"
              whileHover={{ scale: 1.08, backgroundColor: "#e8e8ec" }}
              whileTap={{ scale: 0.93 }}
              transition={springs.snappy}
            >
              <RiArrowUpSLine size={18} aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next step"
              onClick={goDown}
              className="flex items-center justify-center size-10 rounded-full bg-[#f0f0f3]"
              whileHover={{ scale: 1.08, backgroundColor: "#e8e8ec" }}
              whileTap={{ scale: 0.93 }}
              transition={springs.snappy}
            >
              <RiArrowDownSLine size={18} aria-hidden="true" />
            </motion.button>
          </div>

          {/* ── Cards ── */}
          <div className="relative md:absolute md:left-22 md:top-1/2 md:-translate-y-1/2 px-4 md:px-0 py-10 md:py-0">
            <div className="flex flex-col gap-3 items-start">
              {JOURNAL_ITEMS.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <motion.div
                    key={item.label}
                    onClick={() => handleCardClick(index)}
                    className="bg-[#f0f0f3] overflow-hidden shrink-0 cursor-pointer"
                    animate={{
                      borderRadius: isActive ? 18 : 18,
                    }}
                    transition={springs.layout}
                    whileHover={!isActive ? { scale: 1.02 } : {}}
                    whileTap={!isActive ? { scale: 0.98 } : {}}
                  >
                    {/* ── Pill / header row ── */}
                    <div
                      className={`flex items-center gap-3 shrink-0 h-15 transition-[padding] duration-200 ${
                        isActive ? "px-8 py-3" : "px-6 py-3"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={24}
                        height={24}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                      <p
                        className="font-[510] text-(length:--figma-font-size-6) leading-(--figma-line-height-6) tracking-(--figma-letter-spacing-6) shrink-0 [font-family:var(--figma-font-text)]"
                        style={{ color: "rgba(0,5,9,0.89)" }}
                      >
                        {item.label}
                      </p>
                    </div>

                    {/* Description */}
                    <motion.div
                      initial={false}
                      animate={{
                        maxHeight: isActive ? 120 : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{
                        maxHeight: {
                          type: "spring",
                          stiffness: 280,
                          damping: 26,
                        },
                        opacity: {
                          duration: isActive ? duration.normal : duration.fast,
                          ease: easing.smooth,
                          delay: isActive ? 0.06 : 0,
                        },
                      }}
                      style={{ overflow: "hidden" }}
                      aria-hidden={!isActive}
                    >
                      {item.description && (
                        <p
                          className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) px-8 pb-6 [font-family:var(--figma-font-text)] w-full md:w-95"
                          style={{ color: "rgba(0,7,27,0.5)" }}
                        >
                          {item.description.map((seg, i) => (
                            <span
                              key={i}
                              style={
                                seg.bold
                                  ? { color: "rgba(0,5,9,0.89)" }
                                  : undefined
                              }
                            >
                              {seg.text}
                            </span>
                          ))}
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Mobile scroll buttons ── */}
            <div className="flex md:hidden justify-center gap-4 mt-6">
              <motion.button
                type="button"
                aria-label="Previous step"
                onClick={goUp}
                className="flex items-center justify-center size-10 rounded-full bg-[#f0f0f3]"
                whileHover={{ scale: 1.08, backgroundColor: "#e8e8ec" }}
                whileTap={{ scale: 0.93 }}
                transition={springs.snappy}
              >
                <RiArrowUpSLine size={18} aria-hidden="true" />
              </motion.button>
              <motion.button
                type="button"
                aria-label="Next step"
                onClick={goDown}
                className="flex items-center justify-center size-10 rounded-full bg-[#f0f0f3]"
                whileHover={{ scale: 1.08, backgroundColor: "#e8e8ec" }}
                whileTap={{ scale: 0.93 }}
              >
                <RiArrowDownSLine size={18} aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
