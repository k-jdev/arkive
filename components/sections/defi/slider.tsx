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

interface SlideItem {
  id: number;
  imageSrc: string;
  title: string;
  desc: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "Knows where you win.",
    desc: "Surfaces your edge through the noise so you can repeat what works.",
    imageSrc: "/sections/defiSlider/card1.png",
  },
  {
    id: 2,
    title: "Sees what you don't.",
    desc: "Connects the dots across your trade history, showing you patterns you'd never catch.",
    imageSrc: "/sections/defiSlider/card2.png",
  },
  {
    id: 3,
    title: "Holds you to your rules.",
    desc: "Keeps you on plan when the moment tries to pull you off.",
    imageSrc: "/sections/defiSlider/card3.png",
  },
  {
    id: 4,
    title: "Learns from every move.",
    desc: "Automatically extracts insights from your portfolio, adapting to your style.",
    imageSrc: "/sections/defiSlider/card4.png",
  },
];

const DESKTOP_CARD_WIDTH = 380;
const CARD_GAP = 24;

export default function DefiSlider() {
  const reduced = usePrefersReducedMotion();

  const [cardWidth, setCardWidth] = useState(DESKTOP_CARD_WIDTH);
  const [paddingLeft, setPaddingLeft] = useState(80);
  const [paddingRight, setPaddingRight] = useState(80);
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
        const pl = Math.max(80, (w - 1280) / 2 + 80);
        setPaddingLeft(pl);
        setPaddingRight(pl);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
    cardWidth,
    cardGap: CARD_GAP,
    peek: isMobile ? 0 : cardWidth,
  });

  return (
    <section
      data-header-theme="light"
      className="w-full py-24 md:py-36 overflow-hidden"
      role="region"
      aria-label="DeFi features showcase"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 600px",
        background: "linear-gradient(180deg, #F9F9FB 0%, #FFF 100%)",
      }}
    >
      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeFade : sliderHeader}
        className="max-w-7xl mx-auto px-6 md:px-20"
      >
        {/* Header row */}
        <div className="flex flex-col gap-3 mb-12">
          <p className="font-semibold text-(--figma-accent-9) text-sm md:text-base tracking-wide uppercase [font-family:var(--figma-font-text)]">
            Context that compounds
          </p>
          <h2
            className="font-[590] tracking-[-0.03em] text-(--figma-neutral-12) [font-family:var(--figma-font-text)] leading-[1.05]"
            style={{ fontSize: "clamp(36px, 4vw, 64px)" }}
          >
            A second brain
            <br />
            behind every trade.
          </h2>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeContainer : sliderCardsContainer}
        className="select-none cursor-grab active:cursor-grabbing pb-12"
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
              : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {SLIDES.map((slide) => (
            <motion.div
              key={slide.id}
              variants={reduced ? safeFade : sliderCard}
              className="flex flex-col shrink-0 bg-white rounded-[32px] overflow-hidden border border-neutral-100 shadow-[0_6px_48px_0_#F3F3F5] h-[500px] hover:shadow-[0_12px_64px_0_#EAEAEF] transition-shadow duration-300"
              style={{ width: `${cardWidth}px` }}
            >
              {/* Card Header Content */}
              <div className="flex flex-col gap-3 px-8 pt-6 pb-10">
                <h3 className="font-[590] text-2xl text-[#1C2024] [font-family:var(--figma-font-text)] tracking-tight">
                  {slide.title}
                </h3>
                <p className="text-(--figma-neutral-alpha-10) text-[15px] leading-relaxed [font-family:var(--figma-font-text)]">
                  {slide.desc}
                </p>
              </div>

              {/* Card image container */}
              <div className="relative w-full h-[296px]">
                <Image
                  src={slide.imageSrc}
                  alt={slide.title}
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="w-full h-full object-contain object-bottom pointer-events-none"
                  draggable={false}
                  unoptimized
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nav buttons */}
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
