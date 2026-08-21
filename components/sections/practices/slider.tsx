"use client";

import Image, { type StaticImageData } from "next/image";
import { Slider } from "@/components/ui/slider";

import opportuityImg from "@/public/sections/slider2/opportuity.png";
import railImg from "@/public/sections/slider2/rail.png";
import statisticImg from "@/public/sections/slider2/statistic.png";
import tradingImg from "@/public/sections/slider2/trading.png";

interface SlideItem {
  imageSrc: StaticImageData;
  boldText: string;
  dimText: string;
}

const SLIDES: SlideItem[] = [
  {
    imageSrc: railImg,
    boldText: "Built for the task. ",
    dimText:
      "Each practice shapes the AI to the task at hand, making it fluent in what you’re actually doing.",
  },
  {
    imageSrc: opportuityImg,
    boldText: "Shaped around you.",
    dimText:
      "It adapts the AI to your way of doing things. Your standards, your preferences, your habits.",
  },
  {
    imageSrc: statisticImg,
    boldText: "Designed to improve.",
    dimText:
      " The more you use a practice, the sharper the AI gets. It identifies what drives progress and what holds it back.",
  },
  {
    imageSrc: tradingImg,
    boldText: "Connected across everything.",
    dimText:
      " What one practice learns informs the rest, so your whole context works together.",
  },
];

export default function PracticesSlider() {
  return (
    <Slider<SlideItem>
      slides={SLIDES}
      className="bg-white pt-30 pb-30"
      sectionAriaLabel="Features slider"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
      paddingLeft={(w, isMobile) =>
        isMobile
          ? (w - Math.min(558, Math.max(280, w - 48))) / 2
          : (15.694 * w) / 100
      }
      paddingRight={(w, isMobile) =>
        isMobile ? (w - Math.min(558, Math.max(280, w - 48))) / 2 : 24
      }
      header={
        <div className="px-6 md:pl-[15.694vw]">
          <div className="flex items-end justify-between mb-10">
            <h2
              className="font-[590] tracking-[-0.4px] [font-family:var(--figma-font-text)] text-[#1C2024]"
              style={{ fontSize: "clamp(36px, 4vw, 48px)" }}
            >
              Fluent in whatever you do.
            </h2>
          </div>
        </div>
      }
      renderCard={(slide) => (
        <div className="flex flex-col gap-4">
          <div
            className="rounded-[24px] overflow-hidden bg-[#f9f9fb] flex items-center justify-center relative border border-black/4 w-full"
            style={{ aspectRatio: "598 / 360" }}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.boldText}
              className="object-cover pointer-events-none w-full h-full"
              draggable={false}
            />
          </div>

          <p className="px-1 font-normal text-[16px] leading-6 [font-family:var(--figma-font-text)]">
            <span style={{ color: "rgba(0,5,9,0.89)", fontWeight: 510 }}>
              {slide.boldText}{" "}
            </span>
            <span style={{ color: "rgba(0,5,29,0.45)" }}>{slide.dimText}</span>
          </p>
        </div>
      )}
    />
  );
}
