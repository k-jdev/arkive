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
  "/sections/journal/journal.png",
  "/sections/journal/insights.png",
  "/sections/journal/skills.png",
  "/sections/journal/mcp.png",
];

const JOURNAL_BACKGROUNDS_MOBILE = [
  "/sections/journal/journalMobile.png",
  "/sections/journal/insightsMobile.png",
  "/sections/journal/skillsMobile.png",
  "/sections/journal/mcpMobile.png",
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
      { text: "Raw data, conversations, & outcomes stored in " },
      { text: "the journal.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.noticeIcon,
    label: "Notice",
    description: [
      {
        text: "Patterns, anomalies, & previous reasoning, surfaced as ",
      },
      { text: "insights.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.learnIcon,
    label: "Learn",
    description: [
      { text: "Accepted insights become new  " },
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
  const [, setIsAnimating] = useState(false);

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
        <div className="flex flex-col items-center gap-4 mb-8 md:mb-10">
          <h2
            className="font-[590] text-[35px] md:text-[48px] leading-[0.9] tracking-[-0.4px] text-center [font-family:var(--figma-font-text)]"
            style={{ color: "var(--figma-neutral-12)" }}
          >
            The loop that compounds.
          </h2>
          <p
            className="font-[510] text-(length:--figma-font-size-2) md:text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) text-center max-w-125 [font-family:var(--figma-font-text)]"
            style={{ color: "rgba(0,5,9,0.89)" }}
          >
            An Arkive&apos;s structure enables compounding intelligence.
          </p>
        </div>

        <div className="relative md:h-137.5 h-125 rounded-[24px] overflow-clip bg-[#F9F9FB]">
          {/* ── Hidden preload images (Next.js prefetch) ── */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-50 opacity-0 pointer-events-none"
          >
            {JOURNAL_BACKGROUNDS.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                className="object-cover hidden md:block"
                sizes="100vw"
                priority
                draggable={false}
              />
            ))}
            {JOURNAL_BACKGROUNDS_MOBILE.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                className="object-cover block md:hidden"
                sizes="100vw"
                priority
                draggable={false}
              />
            ))}
          </div>
          {/* ── Foreground images (animated) ── */}
          {/* Desktop images */}
          <div className="hidden md:block absolute left-0 -right-10 top-[128px] -bottom-40">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                className="absolute inset-0 scale-[1.1] origin-bottom-right"
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
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile images — contained inside block */}
          <div className="block md:hidden absolute left-[28px] right-0 bottom-0 top-[140px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                className="absolute inset-0"
                variants={{
                  enter: (dir: "down" | "up") => ({
                    translateX: dir === "down" ? 40 : -40,
                    opacity: 0,
                  }),
                  center: { translateX: 0, opacity: 1 },
                  exit: (dir: "down" | "up") => ({
                    translateX: dir === "down" ? -200 : 200,
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
                  src={JOURNAL_BACKGROUNDS_MOBILE[activeIndex]}
                  alt=""
                  fill
                  className="object-contain object-bottom-right"
                  sizes="100vw"
                  aria-hidden="true"
                  priority
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Desktop arrows (left side) ── */}
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

          {/* ── Mobile: card + separate arrows ── */}
          <div className="flex md:hidden flex-col h-full">
            <div className="relative z-10 px-4 pt-6">
              <div className="flex items-start gap-3">
                {(() => {
                  const item = JOURNAL_ITEMS[activeIndex];
                  return (
                    <div className="flex-1 min-w-0 bg-[#f0f0f3] rounded-[18px] overflow-hidden shrink-0">
                      <div className="flex items-center gap-2 md:gap-3 shrink-0 h-15 px-6 py-2 md:py-3">
                        <Image
                          src={item.icon}
                          alt=""
                          width={20}
                          height={20}
                          aria-hidden="true"
                          className="shrink-0 md:w-6 md:h-6"
                          draggable={false}
                        />
                        <p
                          className="font-[510] text-[18px] md:text-(length:--figma-font-size-6) leading-(--figma-line-height-6) tracking-(--figma-letter-spacing-6) shrink-0 [font-family:var(--figma-font-text)]"
                          style={{ color: "rgba(0,5,9,0.89)" }}
                        >
                          {item.label}
                        </p>
                      </div>

                      <motion.div
                        initial={false}
                        animate={{ maxHeight: 120, opacity: 1 }}
                        transition={{
                          maxHeight: {
                            type: "spring",
                            stiffness: 280,
                            damping: 26,
                          },
                          opacity: {
                            duration: duration.normal,
                            ease: easing.smooth,
                            delay: 0.06,
                          },
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        {item.description && (
                          <p
                            className="font-[510] text-(length:--figma-font-size-2) md:text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) px-6 pb-5 [font-family:var(--figma-font-text)] w-full"
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
                    </div>
                  );
                })()}

                <div className="flex flex-col gap-2 shrink-0 justify-center self-center">
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
              </div>
            </div>
          </div>

          {/* ── Desktop: accordion ── */}
          <div className="hidden md:flex md:absolute md:left-22 md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-3 md:items-start">
            {JOURNAL_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.div
                  key={item.label}
                  onClick={() => handleCardClick(index)}
                  className={`bg-[#f0f0f3] overflow-hidden shrink-0 cursor-pointer ${isActive ? "w-full" : "w-40"} rounded-[18px]`}
                  animate={{ borderRadius: 18 }}
                  transition={springs.layout}
                  whileHover={!isActive ? { scale: 1.02 } : {}}
                  whileTap={!isActive ? { scale: 0.98 } : {}}
                >
                  <div
                    className={`flex items-center gap-3 shrink-0 h-15 transition-[padding] duration-200 ${isActive ? "px-8 py-3" : "px-6 py-3"}`}
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden="true"
                      className="shrink-0"
                      draggable={false}
                    />
                    <p
                      className="font-[510] text-(length:--figma-font-size-6) leading-(--figma-line-height-6) tracking-(--figma-letter-spacing-6) shrink-0 [font-family:var(--figma-font-text)]"
                      style={{ color: "rgba(0,5,9,0.89)" }}
                    >
                      {item.label}
                    </p>
                  </div>

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
                        className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) px-8 pb-6 [font-family:var(--figma-font-text)] w-95"
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
        </div>
      </div>
    </section>
  );
}
