"use client";

import { useEffect, useState } from "react";
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

import opportuityImg from "@/public/sections/slider2/opportuity.png";
import railImg from "@/public/sections/slider2/rail.png";
import statisticImg from "@/public/sections/slider2/statistic.png";
import trainingImg from "@/public/sections/slider2/training.png";

interface SlideItem {
  id: number;
  imageSrc: any;
  boldText: string;
  dimText: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    imageSrc: railImg,
    boldText: "Finds your edge.",
    dimText: "It learns what actually works for you, and what quietly doesn't",
  },
  {
    id: 2,
    imageSrc: opportuityImg,
    boldText: "Sees the opportunity cost you miss.",
    dimText: "It weighs what each decision really costs you.",
  },
  {
    id: 3,
    imageSrc: statisticImg,
    boldText: "Fixes your blind spots.",
    dimText: "Highlights patterns in your behavior that you might be missing.",
  },
  {
    id: 4,
    imageSrc: trainingImg,
    boldText: "Accelerates your learning.",
    dimText: "Provides tailored insights to help you grow faster and smarter.",
  },
];

const DESKTOP_CARD_WIDTH = 558;
const CARD_GAP = 20;

export default function PracticesSlider() {
  const reduced = usePrefersReducedMotion();

  const [cardWidth, setCardWidth] = useState(DESKTOP_CARD_WIDTH);
  const [paddingLeft, setPaddingLeft] = useState(24);
  const [paddingRight, setPaddingRight] = useState(24);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      if (mobile) {
        const cw = Math.min(DESKTOP_CARD_WIDTH, Math.max(280, w - 48));
        setCardWidth(cw);
        const pl = (w - cw) / 2;
        setPaddingLeft(pl);
        setPaddingRight(pl);
      } else {
        setCardWidth(DESKTOP_CARD_WIDTH);
        const pl = (15.694 * w) / 100;
        setPaddingLeft(pl);
        setPaddingRight(24);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const {
    offset,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
    prev,
    next,
    step,
    maxOffset,
  } = useSlider({
    slidesCount: SLIDES.length,
    cardWidth,
    cardGap: CARD_GAP,
    peek: isMobile ? 0 : cardWidth,
  });

  return (
    <section
      data-header-theme="light"
      className="w-full bg-white pt-[120px] pb-[120px] overflow-hidden"
      role="region"
      aria-label="Features slider"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeFade : sliderHeader}
        className="px-6 md:pl-[15.694vw]"
      >
        <div className="flex items-end justify-between mb-10">
          <h2
            className="font-[590] tracking-[-0.4px] [font-family:var(--figma-font-text)] text-[#1C2024]"
            style={{ fontSize: "clamp(36px, 4vw, 48px)" }}
          >
            Fluent in whatever you do.
          </h2>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeContainer : sliderCardsContainer}
        className="select-none cursor-grab active:cursor-grabbing"
        style={{
          paddingLeft: `${paddingLeft}px`,
          paddingRight: `${paddingRight}px`,
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
              style={{ width: `${cardWidth}px` }}
            >
              <div
                className="rounded-[24px] overflow-hidden bg-[#f9f9fb] flex items-center justify-center relative border border-black/[0.04] w-full"
                style={{ aspectRatio: "598 / 360" }}
              >
                <Image
                  src={slide.imageSrc}
                  alt={slide.boldText}
                  className="object-cover pointer-events-none w-full h-full"
                  draggable={false}
                />
              </div>

              <p className="px-1 font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]">
                <span style={{ color: "rgba(0,5,9,0.89)", fontWeight: 510 }}>
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

      {/* Nav buttons — right-aligned */}
      <div className="max-w-7xl mx-auto px-6 md:px-20">
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
