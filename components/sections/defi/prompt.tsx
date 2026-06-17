"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  jupiterIcon,
  raydiumIcon,
  uniswapIcon,
  hyperliquidIcon,
  oneInchIcon,
  pancakeswapIcon,
  solanaIcon,
} from "@/public/sections/defiPrompt";

// ── Types & Data ──────────────────────────────────────────────

type ItemType =
  | "faded"
  | "jupiter"
  | "raydium"
  | "uniswap"
  | "hyperliquid"
  | "1inch"
  | "pancakeswap"
  | "solana";

interface DockItemDef {
  id: number;
  type: ItemType;
  opacity?: number;
  hiddenOn?: "lg" | "md";
  href?: string;
}

const ITEMS: DockItemDef[] = [
  { id: 0, type: "faded" },
  { id: 1, type: "faded" },
  { id: 2, type: "faded" },
  { id: 3, type: "faded" },
  { id: 4, type: "faded" },
  { id: 5, type: "faded" },
  { id: 6, type: "faded" },
  { id: 7, type: "faded" },

  { id: 8, type: "faded", hiddenOn: "lg" },
  { id: 9, type: "faded", hiddenOn: "md" },
  { id: 10, type: "faded" },
  { id: 11, type: "jupiter" },
  { id: 12, type: "raydium" },
  { id: 13, type: "uniswap" },
  { id: 14, type: "hyperliquid" },
  { id: 15, type: "1inch" },
  { id: 16, type: "pancakeswap" },
  { id: 17, type: "solana" },
  { id: 18, type: "faded" },
  { id: 19, type: "faded", hiddenOn: "md" },
  { id: 20, type: "faded", hiddenOn: "lg" },

  { id: 21, type: "faded" },
  { id: 22, type: "faded" },
  { id: 23, type: "faded" },
  { id: 24, type: "faded" },
  { id: 25, type: "faded" },
  { id: 26, type: "faded" },
  { id: 27, type: "faded" },
  { id: 28, type: "faded" },
];

// ── Helpers ───────────────────────────────────────────────────

function getVisuals(type: ItemType) {
  switch (type) {
    case "faded":
      return {
        bg: "rgba(245,245,245,1)",
        border: "none",
      };
    case "jupiter":
    case "raydium":
    case "uniswap":
    case "hyperliquid":
    case "1inch":
    case "pancakeswap":
    case "solana":
      return {
        bg: "transparent",
        border: "none",
      };
  }
}

// ── Section ───────────────────────────────────────────────────

const TYPEWRITER_TEXT = "All of DeFi, one prompt away";
const TYPEWRITER_SPEED = 60; // ms per character

export default function DefiPrompt() {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Typing effect
  useEffect(() => {
    if (displayedText.length >= TYPEWRITER_TEXT.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText(TYPEWRITER_TEXT.slice(0, displayedText.length + 1));
    }, TYPEWRITER_SPEED);

    return () => clearTimeout(timeout);
  }, [displayedText]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const dockItems = ITEMS.map((item) => {
    const visuals = getVisuals(item.type);

    const icon =
      item.type === "jupiter" ? (
        <div className="relative w-full h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl transition-shadow duration-300">
          <Image
            src={jupiterIcon}
            alt="Jupiter"
            fill
            className="object-contain scale-[1.875]"
          />
        </div>
      ) : item.type === "raydium" ? (
        <div className="relative w-full h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl transition-shadow duration-300">
          <Image
            src={raydiumIcon}
            alt="Raydium"
            fill
            className="object-contain scale-[1.875]"
          />
        </div>
      ) : item.type === "uniswap" ? (
        <div className="relative w-full h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl transition-shadow duration-300">
          <Image
            src={uniswapIcon}
            alt="Uniswap"
            fill
            className="object-contain scale-[1.875]"
          />
        </div>
      ) : item.type === "hyperliquid" ? (
        <div className="relative w-full h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl transition-shadow duration-300">
          <Image
            src={hyperliquidIcon}
            alt="Hyperliquid"
            fill
            className="object-contain scale-[1.875]"
          />
        </div>
      ) : item.type === "1inch" ? (
        <div className="relative w-full h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl transition-shadow duration-300">
          <Image
            src={oneInchIcon}
            alt="1inch"
            fill
            className="object-contain scale-[1.875]"
          />
        </div>
      ) : item.type === "pancakeswap" ? (
        <div className="relative w-full h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl transition-shadow duration-300">
          <Image
            src={pancakeswapIcon}
            alt="PancakeSwap"
            fill
            className="object-contain scale-[1.875]"
          />
        </div>
      ) : item.type === "solana" ? (
        <div className="relative w-full h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl transition-shadow duration-300">
          <Image
            src={solanaIcon}
            alt="Solana"
            fill
            className="object-contain scale-[1.875]"
          />
        </div>
      ) : null;

    return {
      title: item.type,
      icon,
      href: item.href ?? "#",
      opacity: item.opacity,
      hiddenOn: item.hiddenOn,
      bg: visuals.bg,
      border: visuals.border,
      isFaded: item.type === "faded",
    };
  });

  // Filter items based on responsive breakpoints
  // We'll render all items and let CSS handle the visibility
  const allItems = dockItems;

  return (
    <section
      data-header-theme="light"
      className="w-full bg-white flex flex-col py-24 md:py-80 items-center justify-center defi-dock-root"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      {/* Dock */}
      <div className="w-full mb-16 select-none overflow-visible px-4">
        {/* Desktop */}
        <div
          className="hidden md:flex flex-row items-end justify-center mx-auto"
          style={{
            transform: "scale(clamp(0.18, 1vw, 1))",
            transformOrigin: "center bottom",
          }}
        >
          <FloatingDock
            items={allItems}
            desktopClassName="bg-transparent"
            activeIndex={14}
          />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden justify-center">
          <Image
            src="/sections/defiPrompt/mobilePrompt.png"
            alt="DeFi protocols"
            width={600}
            height={140}
            className="w-full max-w-md h-auto"
            priority
          />
        </div>
      </div>

      {/* Headline */}
      <div className="text-center px-4 max-w-4xl flex flex-col items-center gap-4 md:gap-3">
        <h2 className="text-[48px] md:text-[clamp(32px,4vw,60px)] font-[590] tracking-[-0.4px] [font-family:var(--figma-font-text)] leading-[0.9] md:leading-[1.05]">
          <span className="bg-linear-to-r from-[#1C2024] to-[#0080FF] text-transparent bg-clip-text">
            {displayedText}
          </span>
          <span
            className="font-light"
            style={{
              color: "#0080FF",
              opacity: showCursor ? 1 : 0,
              transition: "opacity 0.1s",
            }}
          >
            |
          </span>
        </h2>
        <p
          className="font-[510] text-[20px] md:text-[24px] leading-7 tracking-[-0.08px] md:text-base md:font-normal md:tracking-[0.01em] [font-family:var(--figma-font-text)] max-w-xl"
          style={{ color: "rgba(0, 7, 27, 0.50)" }}
        >
          Trade spot & perpetuals on EVM and Solana.
        </p>
      </div>
    </section>
  );
}
