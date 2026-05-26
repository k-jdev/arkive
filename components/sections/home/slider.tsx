"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useSlider } from "@/lib/use-slider";
import {
  sliderHeader,
  sliderCardsContainer,
  sliderCard,
  safeFade,
  safeContainer,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";

interface SlideItem {
  id: number;
  imageSrc?: string;
  boldText: string;
  dimText: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    imageSrc: "/sections/slider/card.png",
    boldText: "Lorem ipsum dolortasd.",
    dimText:
      "Trade with any frontier AI across on-chain markets, with full Arkive context behind every decision.",
  },
  {
    id: 2,
    imageSrc: "/sections/slider/card2.png",
    boldText: "Lorem ipsum dolortasd.",
    dimText:
      "Trade with any frontier AI across on-chain markets, with full Arkive context behind every decision.",
  },
  {
    id: 3,
    imageSrc: "/sections/slider/card3.png",
    boldText: "Lorem ipsum dolortasd.",
    dimText:
      "Trade with any frontier AI across on-chain markets, with full Arkive context behind every decision.",
  },
];

const CARD_WIDTH = 558;
const CARD_GAP = 20;

export default function Slider() {
  const reduced = usePrefersReducedMotion();

  const {
    offset,
    prev,
    next,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
    step,
    maxOffset,
  } = useSlider({
    slidesCount: SLIDES.length,
    cardWidth: CARD_WIDTH,
    cardGap: CARD_GAP,
  });

  return (
    <section
      data-header-theme="light"
      className="w-full bg-white pt-36 overflow-hidden"
      role="region"
      aria-label="Projects showcase"
    >
      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeFade : sliderHeader}
        className="max-w-7xl mx-auto px-20"
      >
        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <h2
              className="font-[590] tracking-[-0.4px] [font-family:var(--figma-font-text)] bg-linear-to-r from-[#1C2024] to-[#0080FF] bg-clip-text text-transparent"
              style={{ fontSize: "clamp(36px, 4vw, 72px)" }}
            >
              Project DeFi.
            </h2>
            <p className="font-medium text-(--figma-neutral-alpha-10) text-(length:--figma-font-size-3) md:text-[24px] leading-(--figma-line-height-3) [font-family:var(--figma-font-text)]">
              Arkive applied to trading.
            </p>
          </div>

          <motion.button
            type="button"
            className="flex items-center justify-center h-10 rounded-full shrink-0 transition-colors hover:bg-[rgba(0,0,51,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) font-regular [font-family:var(--figma-font-text)]"
          >
            Learn more
            <RiArrowRightSLine size={18} aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>

      {/* Slider track — full bleed */}
      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeContainer : sliderCardsContainer}
        className="select-none cursor-grab active:cursor-grabbing"
        style={{
          paddingLeft: "max(80px, calc((100vw - 1280px) / 2 + 80px))",
          paddingRight: "max(80px, calc((100vw - 1280px) / 2 + 80px))",
        }}
        onMouseDown={(e) => onMouseDown(e.clientX)}
        onMouseMove={(e) => onMouseMove(e.clientX)}
        onMouseUp={(e) => onMouseUp(e.clientX)}
        onMouseLeave={onMouseLeave}
        onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
        onTouchMove={(e) => onTouchMove(e.touches[0].clientX)}
        onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
      >
        <div
          className="flex"
          style={{
            gap: `${CARD_GAP}px`,
            transform: `translateX(-${offset}px)`,
            transition: isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {SLIDES.map((slide) => (
            <motion.div
              key={slide.id}
              variants={reduced ? safeFade : sliderCard}
              className="flex flex-col gap-4 shrink-0"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              {/* Card image */}
              <div
                className="rounded-3xl overflow-hidden bg-[#f9f9fb]"
                style={{ height: "340px" }}
              >
                {slide.imageSrc ? (
                  <Image
                    src={slide.imageSrc}
                    alt={slide.boldText}
                    width={558}
                    height={340}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                ) : null}
              </div>

              {/* Caption */}
              <p className="px-4 font-regular text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]">
                <span style={{ color: "rgba(0,5,9,0.89)" }}>
                  {slide.boldText}{" "}
                </span>
                <span style={{ color: "rgba(0,5,29,0.45)" }}>
                  {slide.dimText}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nav buttons */}
      <div className="max-w-7xl mx-auto px-20">
        <div className="flex items-center justify-end gap-2 mt-8">
          <motion.button
            type="button"
            onClick={prev}
            disabled={offset <= 0}
            aria-label="Previous slide"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-colors hover:bg-[rgba(0,0,51,0.12)] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <RiArrowLeftSLine size={20} aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={next}
            disabled={offset + step > maxOffset}
            aria-label="Next slide"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-colors hover:bg-[rgba(0,0,51,0.12)] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <RiArrowRightSLine size={20} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
