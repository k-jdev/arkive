"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion-config";

type ItemType = "faded" | "jupiter" | "1inch" | "uniswap";

interface DockItemDef {
  id: number;
  type: ItemType;
  opacity?: number;
  hiddenOn?: "lg" | "md";
}

const ITEMS: DockItemDef[] = [
  { id: 0, type: "faded", opacity: 0.08, hiddenOn: "lg" },
  { id: 1, type: "faded", opacity: 0.15, hiddenOn: "md" },
  { id: 2, type: "faded", opacity: 0.25 },
  { id: 3, type: "jupiter" },
  { id: 4, type: "1inch" },
  { id: 5, type: "uniswap" },
  { id: 6, type: "jupiter" },
  { id: 7, type: "1inch" },
  { id: 8, type: "uniswap" },
  { id: 9, type: "1inch" },
  { id: 10, type: "faded", opacity: 0.25 },
  { id: 11, type: "faded", opacity: 0.15, hiddenOn: "md" },
  { id: 12, type: "faded", opacity: 0.08, hiddenOn: "lg" },
];

const DOCK_SCALES: Record<number, { scale: number; margin: number }> = {
  0: { scale: 1.6, margin: 16 },
  1: { scale: 1.3, margin: 10 },
  2: { scale: 1.1, margin: 4 },
};

function DockItem({
  item,
  index,
  hoveredIndex,
  setHoveredIndex,
  reduced,
}: {
  item: DockItemDef;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  reduced: boolean;
}) {
  const distance =
    hoveredIndex !== null ? Math.abs(hoveredIndex - index) : Infinity;
  const hover =
    hoveredIndex !== null && !reduced
      ? (DOCK_SCALES[distance] ?? { scale: 1, margin: 0 })
      : { scale: 1, margin: 0 };

  let cls =
    "relative flex items-center justify-center shrink-0 transition-colors origin-bottom ";
  if (item.hiddenOn === "lg") cls += "hidden lg:flex ";
  else if (item.hiddenOn === "md") cls += "hidden md:flex ";

  return (
    <motion.div
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        scale: hover.scale,
        marginInline: hover.margin,
        y: hoveredIndex === null ? 0 : distance === 0 ? -4 : 0,
        opacity: item.type === "faded" ? (item.opacity ?? 0.2) : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${cls} ${
        item.type === "jupiter"
          ? "w-[66px] h-[66px] sm:w-[62px] sm:h-[62px] md:w-[72px] md:h-[72px] lg:w-[88.363px] lg:h-[88.363px]"
          : "w-[60px] h-[60px] sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
      } ${
        item.type === "faded"
          ? "rounded-[14px] sm:rounded-2xl border border-neutral-200/40 bg-neutral-100/20"
          : item.type === "jupiter"
            ? "rounded-[22px] sm:rounded-[15px] md:rounded-[17px] lg:rounded-[20.891px] bg-[#072622] shadow-[0_96px_27px_0_rgba(0,0,0,0),0_61px_24px_0_rgba(0,0,0,0.01),0_34px_21px_0_rgba(0,0,0,0.05),0_15px_15px_0_rgba(0,0,0,0.09),0_4px_8px_0_rgba(0,0,0,0.10)]"
            : item.type === "1inch"
              ? "rounded-[14px] sm:rounded-2xl bg-black border border-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden"
              : "rounded-[14px] sm:rounded-2xl bg-white border border-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
      }`}
    >
      {item.type === "faded" ? null : item.type === "jupiter" ? (
        <div className="relative w-full h-full">
          <Image
            src="/sections/defiPrompt/jupiter.png"
            alt="Jupiter"
            fill
            className="object-contain"
            style={{ padding: "11.045px 11.049px 12.426px 12.422px" }}
          />
        </div>
      ) : item.type === "1inch" ? (
        <div className="relative w-[70%] h-[70%]">
          <Image
            src="/sections/defiPrompt/1inch.png"
            alt="1inch"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="relative w-[70%] h-[70%]">
          <Image
            src="/sections/defiPrompt/uniswap.png"
            alt="Uniswap"
            fill
            className="object-contain"
          />
        </div>
      )}
    </motion.div>
  );
}

export default function DefiPrompt() {
  const reduced = usePrefersReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(6);

  return (
    <section
      data-header-theme="light"
      className="w-full bg-white flex flex-col py-24 md:py-36 items-center justify-center border-t border-neutral-100"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      {/* Dock Container */}
      <div className="w-full mb-16 select-none overflow-visible px-4">
        <div
          className="flex flex-row items-end justify-center mx-auto"
          style={{
            gap: "clamp(8px, 1vw, 16px)",
            transform: "scale(clamp(0.18, 1vw, 1))",
            transformOrigin: "center bottom",
            height: "clamp(16px, 2vw, 128px)",
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {ITEMS.map((item, index) => (
            <DockItem
              key={item.id}
              item={item}
              index={index}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center px-4 max-w-3xl flex flex-col items-center gap-4 md:gap-3"
      >
        <h2 className="text-[48px] md:text-[clamp(32px,4vw,56px)] font-[590] tracking-[-0.4px] [font-family:var(--figma-font-text)] leading-[0.9] md:leading-[1.05]">
          <span className="bg-linear-to-r from-[#1C2024] to-[#0080FF] text-transparent bg-clip-text">
            All of DeFi, one prompt away
          </span>
        </h2>

        <p
          className="font-[510] text-[20px] leading-[28px] tracking-[-0.08px] md:text-base md:font-normal md:tracking-[0.01em] [font-family:var(--figma-font-text)] max-w-xl"
          style={{ color: "rgba(0, 7, 27, 0.50)" }}
        >
          Trade spot & perpetuals on EVM and Solana.
        </p>
      </motion.div>
    </section>
  );
}
