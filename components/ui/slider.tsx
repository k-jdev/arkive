"use client";

import { useEffect, useState, type ReactNode } from "react";
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

export interface SliderProps<T> {
  slides: T[];
  renderCard: (slide: T) => ReactNode;
  header?: ReactNode;
  cardWidth?: number;
  cardGap?: number;
  peekCards?: number;
  className?: string;
  style?: React.CSSProperties;
  paddingLeft?: (width: number, isMobile: boolean, cardWidth: number) => number;
  paddingRight?: (
    width: number,
    isMobile: boolean,
    cardWidth: number,
  ) => number;
  mobileCardMinWidth?: number;
  sectionAriaLabel?: string;
  showNav?: boolean;
}

export function Slider<T>({
  slides,
  renderCard,
  header,
  cardWidth: desktopCardWidth = 558,
  cardGap = 20,
  peekCards = 1,
  className = "",
  style,
  paddingLeft,
  paddingRight,
  mobileCardMinWidth = 280,
  sectionAriaLabel = "Slider",
  showNav = true,
}: SliderProps<T>) {
  const reduced = usePrefersReducedMotion();

  const [cardWidth, setCardWidth] = useState(desktopCardWidth);
  const [pl, setPl] = useState(16);
  const [pr, setPr] = useState(16);
  const [isMobile, setIsMobile] = useState(false);
  const [peek, setPeek] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);

      let cw: number;
      if (mobile) {
        cw = Math.min(desktopCardWidth, Math.max(mobileCardMinWidth, w - 32));
      } else {
        cw = desktopCardWidth;
      }
      setCardWidth(cw);

      const newPl =
        paddingLeft?.(w, mobile, cw) ?? (mobile ? (w - cw) / 2 : 16);
      const newPr =
        paddingRight?.(w, mobile, cw) ?? (mobile ? (w - cw) / 2 : 16);
      setPl(newPl);
      setPr(newPr);

      // Dynamic peek: how much of the next card(s) fits in the viewport
      if (mobile) {
        setPeek(0);
      } else {
        const visibleWidth = w - newPl - newPr;
        const maxPeek = desktopCardWidth * peekCards;
        setPeek(Math.max(0, Math.min(maxPeek, visibleWidth - cw - cardGap)));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [
    desktopCardWidth,
    mobileCardMinWidth,
    paddingLeft,
    paddingRight,
    cardGap,
    peekCards,
  ]);

  const slider = useSlider({
    slidesCount: slides.length,
    cardWidth,
    cardGap,
    peek,
  });

  return (
    <section
      className={`w-full overflow-hidden ${className}`}
      style={style}
      role="region"
      aria-label={sectionAriaLabel}
    >
      {header && (
        <motion.div
          initial="hidden"
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px" }}
          variants={reduced ? safeFade : sliderHeader}
        >
          {header}
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduced ? safeContainer : sliderCardsContainer}
        className="select-none cursor-grab active:cursor-grabbing"
        style={{ paddingLeft: `${pl}px`, paddingRight: `${pr}px` }}
        onMouseDown={(e) => slider.onMouseDown(e.clientX)}
        onMouseMove={(e) => slider.onMouseMove(e.clientX)}
        onMouseUp={(e) => slider.onMouseUp(e.clientX)}
        onMouseLeave={slider.onMouseLeave}
        onTouchStart={(e) => slider.onTouchStart(e.touches[0].clientX)}
        onTouchMove={(e) => slider.onTouchMove(e.touches[0].clientX)}
        onTouchEnd={(e) => slider.onTouchEnd(e.changedTouches[0].clientX)}
      >
        <div
          className="flex"
          style={{
            gap: `${cardGap}px`,
            transform: `translateX(-${slider.offset}px)`,
            transition: slider.isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {slides.map((slide, i) => (
            <motion.div
              key={i}
              variants={reduced ? safeFade : sliderCard}
              className="shrink-0"
              style={{ width: `${cardWidth}px` }}
            >
              {renderCard(slide)}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {showNav && (
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="flex items-center justify-end gap-2 mt-8">
            <motion.button
              type="button"
              onClick={slider.prev}
              disabled={slider.offset <= 0}
              aria-label="Previous slide"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-colors hover:bg-[rgba(0,0,51,0.12)] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            >
              <RiArrowLeftSLine size={20} aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              onClick={slider.next}
              disabled={slider.offset + slider.step > slider.maxOffset}
              aria-label="Next slide"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-colors hover:bg-[rgba(0,0,51,0.12)] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            >
              <RiArrowRightSLine size={20} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      )}
    </section>
  );
}
