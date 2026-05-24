"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

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
    boldText: "Lorem ipsum dolortasd.",
    dimText:
      "Trade with any frontier AI across on-chain markets, with full Arkive context behind every decision.",
  },
  {
    id: 3,
    boldText: "Lorem ipsum dolortasd.",
    dimText:
      "Trade with any frontier AI across on-chain markets, with full Arkive context behind every decision.",
  },
];

const CARD_WIDTH = 558;
const CARD_GAP = 20;
const STEP = CARD_WIDTH + CARD_GAP;

export default function Slider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  // Stop when last card aligns to left edge of the grid (same position as first card)
  const maxOffset = STEP * (SLIDES.length - 1);

  // Drag state
  const dragStart = useRef<number | null>(null);
  const dragOffset = useRef(0);

  const clamp = (val: number) => Math.max(0, Math.min(val, maxOffset));

  const prev = useCallback(() => {
    setOffset((o) => clamp(o - STEP));
  }, [maxOffset]);

  const next = useCallback(() => {
    setOffset((o) => clamp(o + STEP));
  }, [maxOffset]);

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = e.clientX;
    dragOffset.current = offset;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.clientX;
    setOffset(clamp(dragOffset.current + delta));
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.clientX;
    const snapped = Math.round((dragOffset.current + delta) / STEP) * STEP;
    setOffset(clamp(snapped));
    dragStart.current = null;
  };
  const onMouseLeave = () => {
    if (dragStart.current !== null) {
      const snapped = Math.round(offset / STEP) * STEP;
      setOffset(clamp(snapped));
      dragStart.current = null;
    }
  };

  // Touch drag
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    dragOffset.current = offset;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = touchStart.current - e.touches[0].clientX;
    setOffset(clamp(dragOffset.current + delta));
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = touchStart.current - e.changedTouches[0].clientX;
    const snapped = Math.round((dragOffset.current + delta) / STEP) * STEP;
    setOffset(clamp(snapped));
    touchStart.current = null;
  };

  const activeIndex = Math.round(offset / STEP);

  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-20">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <h2
              className="font-[590] tracking-[-0.4px] [font-family:var(--figma-font-text)] bg-linear-to-r from-[#1C2024] to-[#0080FF] bg-clip-text text-transparent"
              style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1 }}
            >
              Project DeFi.
            </h2>
            <p className="font-[510] text-(--figma-neutral-alpha-10) text-(length:--figma-font-size-3) leading-(--figma-line-height-3) [font-family:var(--figma-font-text)]">
              Arkive applied to trading.
            </p>
          </div>

          <button
            type="button"
            className="flex items-center justify-center h-10 rounded-full shrink-0 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) font-[510] [font-family:var(--figma-font-text)]"
          >
            Learn more
            <RiArrowRightSLine size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Slider track — full bleed */}
      <div
        ref={trackRef}
        className="select-none cursor-grab active:cursor-grabbing"
        style={{
          paddingLeft: "max(80px, calc((100vw - 1280px) / 2 + 80px))",
          paddingRight: "max(80px, calc((100vw - 1280px) / 2 + 80px))",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex"
          style={{
            gap: `${CARD_GAP}px`,
            transform: `translateX(-${offset}px)`,
            transition:
              dragStart.current !== null
                ? "none"
                : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
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
              <p className="px-4 font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]">
                <span style={{ color: "rgba(0,5,9,0.89)" }}>
                  {slide.boldText}{" "}
                </span>
                <span style={{ color: "rgba(0,5,29,0.45)" }}>
                  {slide.dimText}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="max-w-7xl mx-auto px-20">
        <div className="flex items-center justify-end gap-2 mt-8">
          <button
            type="button"
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-opacity hover:opacity-75 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <RiArrowLeftSLine size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={activeIndex === SLIDES.length - 1}
            aria-label="Next slide"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-opacity hover:opacity-75 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <RiArrowRightSLine size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
