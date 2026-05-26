"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiFileTextLine,
} from "@remixicon/react";
import { SLIDER_ICONS } from "@/public/icons";

// ── Assets ───────────────────────────────────────────────
const JOURNAL_BG = "/sections/journal-bg.png";
const JOURNAL_PREVIEW = "/sections/journal-preview.png";

const JOURNAL_BACKGROUNDS = [
  "/sections/journal/record.png",
  "/sections/journal/notice.png",
  "/sections/journal/learn.png",
  "/sections/journal/improve.png",
];

// ── Types ────────────────────────────────────────────────

interface JournalItem {
  icon: string;
  label: string;
  description?: { text: string; bold?: boolean }[];
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
    description: [
      { text: "Raw data, conversations, & outcomes stored " },
      { text: "the journal.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.noticeIcon,
    label: "Notice",
    description: [
      {
        text: "Patterns, anomalies, & previous reasoning from the journal, surfaced as ",
      },
      { text: "insights.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.learnIcon,
    label: "Learn",
    description: [
      { text: "Accepted insights become new " },
      { text: "skills,", bold: true },
      { text: " and update current " },
      { text: "context.", bold: true },
    ],
  },
  {
    icon: SLIDER_ICONS.focusIcon,
    label: "Improve",
    description: [{ text: "Sharper reasoning after every cycle." }],
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
    <section data-header-theme="light" className="w-full bg-white md:px-[80px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-0 py-16 md:py-24">
        {/* ── Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center gap-4 mb-8 md:mb-10"
        >
          <h2
            className="font-[590] text-[32px] md:text-[48px] leading-[0.9] tracking-[-0.4px] text-center [font-family:var(--figma-font-text)]"
            style={{ color: "var(--figma-neutral-12)" }}
          >
            The loop that compounds.
          </h2>
          <p
            className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) text-center max-w-[500px] [font-family:var(--figma-font-text)]"
            style={{ color: "rgba(0,5,9,0.89)" }}
          >
            An Arkive&apos;s structure enables compounding intelligence.
          </p>
        </motion.div>

        {/* ── Content Block ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
          className="relative md:h-[550px] rounded-[24px] overflow-clip bg-[#F9F9FB]"
        >
          {/* Animated background images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={JOURNAL_BACKGROUNDS[activeIndex]}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 hidden md:block"
            >
              <Image
                src={JOURNAL_BACKGROUNDS[activeIndex]}
                alt=""
                fill
                className="object-cover"
                sizes="1440px"
                aria-hidden="true"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Scroll buttons — desktop */}
          <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-10">
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

          {/* Mobile background image */}
          <Image
            src={JOURNAL_BACKGROUNDS[activeIndex]}
            alt=""
            fill
            className="object-cover md:hidden"
            sizes="100vw"
            aria-hidden="true"
          />

          {/* Cards */}
          <div className="relative md:absolute md:left-[88px] md:top-1/2 md:-translate-y-1/2 px-4 md:px-0 py-10 md:py-0">
            <div className="flex flex-col gap-3 items-start">
              {JOURNAL_ITEMS.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.label}
                    onClick={() => setActiveIndex(index)}
                    className={`bg-[#f0f0f3] overflow-hidden shrink-0 cursor-pointer ${
                      isActive
                        ? "rounded-[18px] w-full md:w-[380px]"
                        : "rounded-full"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 shrink-0 h-[60px] ${
                        isActive ? "px-8 py-3" : "px-6 py-3"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={24}
                        height={24}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                      <p
                        className="font-[510] text-(length:--figma-font-size-6) leading-(--figma-line-height-6) tracking-(--figma-letter-spacing-6) shrink-0 [font-family:var(--figma-font-text)]"
                        style={{ color: "rgba(0,5,9,0.89)" }}
                      >
                        {item.label}
                      </p>
                    </div>

                    {isActive && item.description && (
                      <p
                        className="font-[510] text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) px-8 pb-6 [font-family:var(--figma-font-text)]"
                        style={{ color: "rgba(0,7,27,0.5)" }}
                      >
                        {item.description.map((seg, i) => (
                          <span
                            key={i}
                            style={
                              seg.bold
                                ? { color: "rgba(0,5,9,0.89)" }
                                : undefined
                            }
                          >
                            {seg.text}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile scroll buttons */}
            <div className="flex md:hidden justify-center gap-4 mt-6">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
