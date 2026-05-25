"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiFileTextLine,
  RiCloseLine,
  RiAddLine,
} from "@remixicon/react";
import { SLIDER_ICONS } from "@/public/icons";

// ── Assets ───────────────────────────────────────────────
const JOURNAL_BG = "/sections/journal-bg.png";
const JOURNAL_PREVIEW = "/sections/journal-preview.png";

// ── Types ────────────────────────────────────────────────

interface JournalItem {
  icon: string;
  label: string;
  description?: string;
}

interface FileTreeItem {
  name: string;
  kind: "folder" | "file";
  level: number;
  open?: boolean;
  dimmed?: boolean;
  children?: FileTreeItem[];
  active?: boolean;
}

// ── Data ─────────────────────────────────────────────────

const JOURNAL_ITEMS: JournalItem[] = [
  {
    icon: SLIDER_ICONS.recordIcon,
    label: "Record",
    description: "Raw data, conversations, & outcomes stored the journal.",
  },
  {
    icon: SLIDER_ICONS.noticeIcon,
    label: "Notice",
    description:
      "Patterns and anomalies surface automatically from the record.",
  },
  {
    icon: SLIDER_ICONS.learnIcon,
    label: "Learn",
    description: "Every outcome refines the system's understanding over time.",
  },
  {
    icon: SLIDER_ICONS.focusIcon,
    label: "Improve",
    description: "Insights feed back into decisions, compounding edge.",
  },
];

const FILE_TREE: FileTreeItem[] = [
  {
    name: "arkive/",
    kind: "folder",
    level: 0,
    open: true,
    children: [
      { name: "identity.md", kind: "file", level: 1, dimmed: true },
      { name: "arkive.config", kind: "file", level: 1, dimmed: true },
      {
        name: "journal/",
        kind: "folder",
        level: 1,
        open: true,
        children: [
          {
            name: "trades/",
            kind: "folder",
            level: 2,
            open: true,
            children: [
              {
                name: "conversations/",
                kind: "folder",
                level: 3,
                open: true,
                children: [
                  {
                    name: "2026-04/",
                    kind: "folder",
                    level: 4,
                    open: true,
                    dimmed: true,
                  },
                  {
                    name: "2026-05/",
                    kind: "folder",
                    level: 4,
                    open: true,
                    children: [
                      {
                        name: "2026-05-17.md",
                        kind: "file",
                        level: 5,
                        active: true,
                      },
                      {
                        name: "2026-05-19.md",
                        kind: "file",
                        level: 5,
                        dimmed: true,
                      },
                      {
                        name: "2026-05-20.md",
                        kind: "file",
                        level: 5,
                        dimmed: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "research/",
            kind: "folder",
            level: 2,
            open: false,
            dimmed: true,
          },
          {
            name: "recaps/",
            kind: "folder",
            level: 2,
            open: false,
            dimmed: true,
          },
        ],
      },
      {
        name: "insights/",
        kind: "folder",
        level: 1,
        open: false,
        dimmed: true,
      },
      { name: "skills/", kind: "folder", level: 1, open: false, dimmed: true },
      {
        name: "context/",
        kind: "folder",
        level: 1,
        open: true,
        dimmed: true,
        children: [
          { name: "watchlist.md", kind: "file", level: 2, dimmed: true },
          { name: "rules.md", kind: "file", level: 2, dimmed: true },
          { name: "intentions.md", kind: "file", level: 2, dimmed: true },
        ],
      },
    ],
  },
];

// ── Sub-components ───────────────────────────────────────

function FileTreeNode({ item }: { item: FileTreeItem }) {
  const isOpen = item.open ?? false;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <>
      <div
        className={`flex items-center gap-[9px] select-none ${
          item.dimmed ? "opacity-30" : ""
        }`}
        style={{ paddingLeft: `${item.level * 28}px` }}
      >
        {item.kind === "folder" ? (
          <span className="flex items-center justify-center size-[20px] shrink-0">
            <RiArrowRightSLine
              size={20}
              className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
            />
          </span>
        ) : (
          <RiFileTextLine size={18} className="shrink-0 text-[#777b84]" />
        )}
        <span
          className={`font-normal leading-[20px] text-[15px] tracking-[0.05px] whitespace-nowrap ${
            item.active
              ? "text-[#edeef0]"
              : item.kind === "folder"
                ? "text-[#edeef0]"
                : "text-[#777b84]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {item.name}
        </span>
      </div>
      {isOpen &&
        hasChildren &&
        item.children!.map((child) => (
          <FileTreeNode key={child.name} item={child} />
        ))}
    </>
  );
}

// ── Main Component ───────────────────────────────────────

export default function ArkivesJournal() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goUp = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : JOURNAL_ITEMS.length - 1));
  }, []);

  const goDown = useCallback(() => {
    setActiveIndex((prev) => (prev < JOURNAL_ITEMS.length - 1 ? prev + 1 : 0));
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] py-24">
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2
            className="font-[590] text-[48px] leading-[0.9] tracking-[-0.4px] text-center whitespace-nowrap"
            style={{
              color: "var(--figma-neutral-12)",
              fontFamily: "var(--figma-font-text)",
            }}
          >
            The loop that compounds.
          </h2>
          <p
            className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) text-center max-w-[500px]"
            style={{
              color: "rgba(0,5,9,0.89)",
              fontFamily: "var(--figma-font-text)",
            }}
          >
            An Arkive&apos;s structure enables compounding intelligence.
          </p>
        </div>

        {/* ── Content Block ──────────────────────────── */}
        <div className="relative h-[550px] rounded-[24px] bg-[#f9f9fb] overflow-clip">
          {/* Decorative background images */}
          <div
            className="absolute -rotate-90"
            style={{ left: 540, top: 337, width: 539, height: 510 }}
          >
            <div className="relative w-[510px] h-[539px]">
              <Image
                src={JOURNAL_BG}
                alt=""
                fill
                className="object-cover scale-x-[-1]"
                sizes="510px"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            className="absolute"
            style={{ left: 796, top: -380, width: 499, height: 624 }}
          >
            <Image
              src={JOURNAL_BG}
              alt=""
              fill
              className="object-cover"
              sizes="499px"
              aria-hidden="true"
            />
          </div>

          {/* Left — scroll buttons + card stack */}
          {/* Scroll buttons — independently centered */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
            <button
              type="button"
              aria-label="Previous step"
              onClick={goUp}
              className="flex items-center justify-center size-10 rounded-full bg-[#f0f0f3] hover:bg-[#e8e8ec] transition-colors"
            >
              <RiArrowUpSLine size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next step"
              onClick={goDown}
              className="flex items-center justify-center size-10 rounded-full bg-[#f0f0f3] hover:bg-[#e8e8ec] transition-colors"
            >
              <RiArrowDownSLine size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Cards — independently centered */}
          <div className="absolute left-[88px] top-1/2 -translate-y-1/2">
            <div className="flex flex-col gap-3 w-[381px]">
              {JOURNAL_ITEMS.map((item, index) => {
                const isExpanded = index === activeIndex;

                return (
                  <div
                    key={item.label}
                    onClick={() => setActiveIndex(index)}
                    className={`bg-[#f0f0f3] rounded-[18px] overflow-clip shrink-0 cursor-pointer transition-[height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      isExpanded ? "h-auto" : "h-[60px]"
                    }`}
                  >
                    <div
                      className={`flex flex-col gap-4 px-8 py-6 ${
                        isExpanded ? "" : "justify-center h-[60px]"
                      }`}
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <Image
                          src={item.icon}
                          alt=""
                          width={24}
                          height={24}
                          aria-hidden="true"
                          className="shrink-0"
                        />
                        <p
                          className="font-[510] text-(length:--figma-font-size-6) leading-(--figma-line-height-6) tracking-(--figma-letter-spacing-6) whitespace-nowrap shrink-0"
                          style={{
                            color: "rgba(0,5,9,0.89)",
                            fontFamily: "var(--figma-font-text)",
                          }}
                        >
                          {item.label}
                        </p>
                      </div>

                      <AnimatePresence>
                        {isExpanded && item.description && (
                          <motion.p
                            key="desc"
                            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              y: -4,
                              filter: "blur(2px)",
                              transition: { duration: 0.15 },
                            }}
                            transition={{
                              duration: 0.45,
                              ease: [0.25, 1, 0.5, 1],
                              delay: 0.1,
                            }}
                            className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3)"
                            style={{
                              color: "rgba(0,7,27,0.5)",
                              fontFamily: "var(--figma-font-text)",
                            }}
                          >
                            {item.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Terminal / File-tree UI */}
          <div className="absolute left-[calc(50%+320px)] top-[calc(50%+111.5px)] -translate-x-1/2 -translate-y-1/2 w-[739px] rounded-[16px] overflow-clip">
            {/* Browser chrome / tabs */}
            <div className="bg-[#212225] border border-[rgba(255,255,255,0.07)] flex items-center justify-between px-[13px] py-[10px] rounded-t-[16px]">
              <div className="flex items-center gap-0">
                <RiArrowRightSLine size={20} className="text-[#777b84]" />
                <RiArrowRightSLine size={20} className="text-[#777b84]" />
                <RiArrowRightSLine size={20} className="text-[#777b84]" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[7px]">
                <div className="size-[17px] rounded bg-[#0022ff] flex items-center justify-center">
                  <span className="text-[10px] text-white font-semibold leading-none">
                    A
                  </span>
                </div>
                <span
                  className="font-normal text-[15px] leading-[20px] text-white tracking-[0.05px] whitespace-nowrap"
                  style={{ fontFamily: "var(--figma-font-text)" }}
                >
                  Arkive
                </span>
              </div>
              <div /> {/* spacer for centering */}
            </div>

            {/* Main terminal area */}
            <div className="flex bg-[#18191b] border-x border-b border-[rgba(255,255,255,0.13)] h-[595px]">
              {/* File tree panel */}
              <div className="shrink-0 w-[305px] pt-[20px] pb-4 border-r border-[#313131] overflow-hidden">
                <div className="flex flex-col gap-[6px]">
                  {FILE_TREE.map((item) => (
                    <FileTreeNode key={item.name} item={item} />
                  ))}
                </div>
              </div>

              {/* Content preview panel */}
              <div className="flex-1 relative overflow-hidden border-l border-[#313131]">
                {/* Tab bar */}
                <div className="flex items-center gap-1">
                  <div className="bg-[#0d0d0d] flex items-center gap-[10px] px-[11px] py-[6px]">
                    <div className="flex items-center gap-[5px]">
                      <RiFileTextLine size={16} className="text-white/70" />
                      <span
                        className="font-normal text-[14px] leading-[1.4] text-white tracking-[0.05px] whitespace-nowrap"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        2026-05-17.md
                      </span>
                    </div>
                    <RiCloseLine size={16} className="text-white/50" />
                  </div>
                  <button
                    type="button"
                    aria-label="New tab"
                    className="flex items-center justify-center size-[16px]"
                  >
                    <RiAddLine size={16} className="text-white/30" />
                  </button>
                </div>

                {/* Content area */}
                <div className="relative w-full h-full">
                  <Image
                    src={JOURNAL_PREVIEW}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="434px"
                    aria-hidden="true"
                  />
                  {/* Left shadow overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: "inset 42px 0px 92px 0px rgba(0,0,0,0.06)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
