"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion-config";

// Custom SVG path for the Jupiter Logo (Teal Bowtie)
const JupiterLogo = ({
  className = "w-full h-full text-[#4ef0d2]",
}: {
  className?: string;
}) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <path
      d="M16 50C16 35 28 28 42 42C46 46 48 49 50 50C52 49 54 46 58 42C72 28 84 35 84 50C84 65 72 72 58 58C54 54 52 51 50 50C48 51 46 54 42 58C28 72 16 65 16 50Z"
      fill="currentColor"
    />
  </svg>
);

type ItemType = "faded" | "jupiter" | "1inch" | "uniswap";

interface DockItemDef {
  id: number;
  type: ItemType;
  opacity?: number;
  hiddenOn?: "lg" | "md";
}

const items: DockItemDef[] = [
  { id: 0, type: "faded", opacity: 0.08, hiddenOn: "lg" },
  { id: 1, type: "faded", opacity: 0.15, hiddenOn: "md" },
  { id: 2, type: "faded", opacity: 0.25 },
  { id: 3, type: "jupiter" },
  { id: 4, type: "1inch" },
  { id: 5, type: "uniswap" },
  { id: 6, type: "jupiter" }, // Center
  { id: 7, type: "1inch" },
  { id: 8, type: "uniswap" },
  { id: 9, type: "1inch" },
  { id: 10, type: "faded", opacity: 0.25 },
  { id: 11, type: "faded", opacity: 0.15, hiddenOn: "md" },
  { id: 12, type: "faded", opacity: 0.08, hiddenOn: "lg" },
];

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
  // Determine distance from hovered item
  const distance =
    hoveredIndex !== null ? Math.abs(hoveredIndex - index) : Infinity;

  // Calculate scale and margin based on distance to replicate macOS dock
  let scale = 1;
  let margin = 0;

  if (hoveredIndex !== null && !reduced) {
    if (distance === 0) {
      scale = 1.6;
      margin = 16;
    } else if (distance === 1) {
      scale = 1.3;
      margin = 10;
    } else if (distance === 2) {
      scale = 1.1;
      margin = 4;
    }
  }

  // Base responsive classes
  let baseClasses =
    "relative flex items-center justify-center shrink-0 rounded-[14px] sm:rounded-2xl transition-colors origin-bottom ";

  if (item.hiddenOn === "lg") baseClasses += "hidden lg:flex ";
  else if (item.hiddenOn === "md") baseClasses += "hidden md:flex ";

  let content = null;

  if (item.type === "faded") {
    baseClasses += "border border-neutral-200/40 bg-neutral-100/20";
    content = (
      <div style={{ opacity: item.opacity }} className="w-full h-full" />
    );
  } else if (item.type === "jupiter") {
    baseClasses +=
      "bg-[#03201e] border border-[#093d3a] shadow-[0_4px_12px_rgba(3,32,30,0.15)]";
    content = (
      <div className="w-[60%] h-[60%]">
        <JupiterLogo />
      </div>
    );
  } else if (item.type === "1inch") {
    baseClasses +=
      "bg-black border border-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden";
    content = (
      <div className="relative w-[70%] h-[70%]">
        <Image
          src="/sections/defiPrompt/1inch.png"
          alt="1inch"
          fill
          className="object-contain"
        />
      </div>
    );
  } else if (item.type === "uniswap") {
    baseClasses +=
      "bg-white border border-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]";
    content = (
      <div className="relative w-[70%] h-[70%]">
        <Image
          src="/sections/defiPrompt/uniswap.png"
          alt="Uniswap"
          fill
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <motion.div
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        scale,
        marginInline: margin,
        y: hoveredIndex === null ? 0 : distance === 0 ? -4 : 0,
        opacity: item.type === "faded" ? item.opacity : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${baseClasses} w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20`}
    >
      {content}
    </motion.div>
  );
}

export default function DefiPrompt() {
  const reduced = usePrefersReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Typing effect parameters
  const typingText = "DeFi, one prompt away";
  const [displayedText, setDisplayedText] = useState("");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < typingText.length) {
        setDisplayedText(typingText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [inView, typingText]);

  return (
    <section
      data-header-theme="light"
      className="w-full bg-white flex flex-col py-24 md:py-36 items-center justify-center overflow-hidden border-t border-neutral-100"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      {/* Dock Container */}
      <div
        className="w-full max-w-6xl flex flex-row items-end justify-center gap-2 sm:gap-3 md:gap-4 px-4 mb-16 select-none h-32"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {items.map((item, index) => (
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

      {/* Headline Text Section */}
      <motion.div
        onViewportEnter={() => setInView(true)}
        className="text-center px-4 max-w-3xl flex flex-col items-center gap-3"
      >
        <h2 className="text-[32px] md:text-[clamp(32px,4vw,56px)] font-[590] tracking-[-0.03em] [font-family:var(--figma-font-text)] leading-[1.05]">
          <span className="bg-gradient-to-r from-[#1C2024] to-[#0080FF] text-transparent bg-clip-text">
            All of {displayedText}
          </span>
          {/* Blinking blue cursor bar */}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="inline-block relative top-[4px] md:top-[6px] ml-[2px] w-[3px] md:w-[4px] h-[0.85em] bg-[#0080FF]"
          />
        </h2>

        <p className="text-(--figma-neutral-alpha-10) font-normal text-sm sm:text-base md:text-lg tracking-[0.01em] [font-family:var(--figma-font-text)] max-w-xl mt-1">
          Trade spot & perpetuals on EVM and Solana.
        </p>
      </motion.div>
    </section>
  );
}
