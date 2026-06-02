"use client";

import Image from "next/image";
import { motion } from "motion/react";
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

const CARD_WIDTH = 558;
const CARD_GAP = 20;

export default function PracticesSlider() {
  const reduced = usePrefersReducedMotion();

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
  } = useSlider({
    slidesCount: SLIDES.length,
    cardWidth: CARD_WIDTH,
    cardGap: CARD_GAP,
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
        className="max-w-[1440px] mx-auto px-6 md:px-[80px]"
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

      {/* Slider track — full bleed */}
      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeContainer : sliderCardsContainer}
        className="select-none cursor-grab active:cursor-grabbing"
        style={{
          paddingLeft: "max(24px, calc((100vw - 1280px) / 2))",
          paddingRight: "max(24px, calc((100vw - 1280px) / 2))",
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
                className="rounded-[24px] overflow-hidden bg-[#f9f9fb] flex items-center justify-center relative border border-black/[0.04]"
                style={{ height: "360px" }}
              >
                <Image
                  src={slide.imageSrc}
                  alt={slide.boldText}
                  fill
                  sizes="558px"
                  className="object-cover pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Caption */}
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
    </section>
  );
}
