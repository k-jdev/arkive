"use client";

import Image from "next/image";
import { Slider } from "@/components/ui/slider";

interface SlideItem {
  imageSrc: string;
  title: string;
  desc: string;
}

const SLIDES: SlideItem[] = [
  {
    title: "Remembers every trade.",
    desc: "Knows your live positions, past trades, and the ones you plan to make.",
    imageSrc: "/sections/defiSlider/card1.png",
  },
  {
    title: "Sees what you don\u2019t.",
    desc: "Connects the dots across your trade history, showing you patterns you'd never catch.",
    imageSrc: "/sections/defiSlider/card2.png",
  },
  {
    title: "Holds you to your rules.",
    desc: "Catches trades that break your rules, keeping you disciplined when emotions are running high. ",
    imageSrc: "/sections/defiSlider/card3.png",
  },
  {
    title: "Reasons across it all.",
    desc: "Considers your complete trading history on every decision you make.",
    imageSrc: "/sections/defiSlider/card4.png",
  },
];

export default function DefiSlider() {
  return (
    <Slider<SlideItem>
      slides={SLIDES}
      cardWidth={380}
      cardGap={24}
      peekCards={2}
      className="py-24 md:py-36"
      sectionAriaLabel="DeFi features showcase"
      paddingLeft={(w, isMobile, cw) =>
        isMobile ? (w - cw) / 2 : Math.max(80, (w - 1280) / 2 + 80)
      }
      paddingRight={(w, isMobile, cw) =>
        isMobile ? (w - cw) / 2 : Math.max(80, (w - 1280) / 2 + 80)
      }
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 600px",
        background: "linear-gradient(180deg, #F9F9FB 0%, #FFF 100%)",
      }}
      header={
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="flex flex-col gap-2 mb-12">
            <p className="font-semibold text-(--figma-accent-9) text-sm md:text-[20px] tracking-wide [font-family:var(--figma-font-text)]">
              Context that compounds
            </p>
            <h2
              className="font-[590] tracking-[-0.03em] text-(--figma-neutral-12) [font-family:var(--figma-font-text)] leading-[1.05]"
              style={{ fontSize: "clamp(35px, 3.34vw, 64px)" }}
            >
              A second brain
              <br />
              behind every trade.
            </h2>
          </div>
        </div>
      }
      renderCard={(slide) => (
        <div className="grid grid-rows-[auto_1fr] gap-10 shrink-0 bg-white rounded-[32px] overflow-hidden border border-neutral-100 shadow-[0_6px_48px_0_#F3F3F5] h-135 hover:shadow-[0_12px_64px_0_#EAEAEF] transition-shadow duration-300">
          <div className="flex flex-col gap-3 px-8 pt-6 pb-10">
            <h3 className="font-[590] text-2xl text-[#1C2024] [font-family:var(--figma-font-text)] tracking-tight">
              {slide.title}
            </h3>
            <p className="text-(--figma-neutral-alpha-10) text-[15px] leading-relaxed [font-family:var(--figma-font-text)]">
              {slide.desc}
            </p>
          </div>

          <div className="relative w-full min-h-0">
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 380px, 100vw"
              className="object-cover pointer-events-none"
              draggable={false}
              unoptimized
            />
          </div>
        </div>
      )}
    />
  );
}
