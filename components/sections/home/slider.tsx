"use client";

import Image from "next/image";
import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";
import { Slider } from "@/components/ui/slider";

interface SlideItem {
  imageSrc?: string;
  boldText: string;
  dimText: string;
}

const SLIDES: SlideItem[] = [
  {
    imageSrc: "/sections/slider/card.png",
    boldText: "Arkive\u2019s first core practice.",
    dimText:
      " Add our practice designed specifically for decentralized markets to your arkive.",
  },
  {
    imageSrc: "/sections/slider/card2.png",
    boldText: "Compound every trade.",
    dimText:
      "Trade with any frontier AI across on-chain markets, with full Arkive context behind every decision.",
  },
  {
    imageSrc: "/sections/slider/card3.webp",
    boldText: "All of DeFi, a prompt away.",
    dimText:
      "Execute spot and perpetual trades across EVM and Solana securely with your AI.",
  },
  {
    imageSrc: "/sections/slider/card4.png",
    boldText: "Your trades, your signature.",
    dimText:
      " Approve every transaction yourself - nothing executes without your say so.",
  },
];

export default function HomeSlider() {
  return (
    <Slider<SlideItem>
      slides={SLIDES}
      className="bg-white py-36"
      sectionAriaLabel="Projects showcase"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
      paddingLeft={(w, isMobile) =>
        isMobile ? 16 : Math.max(80, (w - 1280) / 2 + 80)
      }
      paddingRight={(w, isMobile) =>
        isMobile ? 16 : Math.max(80, (w - 1280) / 2 + 80)
      }
      header={
        <div className="max-w-7xl mx-auto px-4 md:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="flex flex-col">
              <h2
                className="font-[590] tracking-[-0.4px] [font-family:var(--figma-font-text)] bg-linear-to-r from-[#1C2024] to-[#0080FF] bg-clip-text text-transparent whitespace-nowrap"
                style={{ fontSize: "clamp(48px, 4vw, 72px)" }}
              >
                Project DeFi.
              </h2>
              <p className="font-medium text-(--figma-neutral-alpha-10) text-[18px] md:text-[24px] leading-(--figma-line-height-3) [font-family:var(--figma-font-text)]">
                Arkive applied to trading.
              </p>
            </div>

            <Link href="/project-defi">
              <button
                type="button"
                className="mt-5 md:mt-0 flex items-center justify-center h-10 rounded-full shrink-0 transition-colors hover:bg-[rgba(0,0,51,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) font-regular [font-family:var(--figma-font-text)] w-fit"
              >
                Learn more
                <RiArrowRightSLine size={18} aria-hidden="true" />
              </button>
            </Link>
          </div>
        </div>
      }
      renderCard={(slide) => (
        <div className="flex flex-col gap-4">
          <div
            className="rounded-3xl overflow-hidden bg-[#f9f9fb] w-full relative"
            style={{ aspectRatio: "558 / 340" }}
          >
            {slide.imageSrc ? (
              <Image
                src={slide.imageSrc}
                alt={slide.boldText}
                fill
                loading="lazy"
                sizes="558px"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            ) : null}
          </div>

          <p className="px-4 font-regular text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) [font-family:var(--figma-font-text)]">
            <span style={{ color: "rgba(0,5,9,0.89)" }}>{slide.boldText} </span>
            <span style={{ color: "rgba(0,5,29,0.45)" }}>{slide.dimText}</span>
          </p>
        </div>
      )}
    />
  );
}
