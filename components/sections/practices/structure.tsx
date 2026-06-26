"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { usePrefersReducedMotion } from "@/lib/motion-config";
import tradingFolderImg from "@/public/sections/structure/trading-folder.png";
import researchFolderImg from "@/public/sections/structure/research-folder.png";
import healthFolderImg from "@/public/sections/structure/health-folder.png";

/* ─── Table data ─────────────────────────────────────────────────── */
const DOMAINS = [
  { key: "trading", label: "Trading", img: tradingFolderImg },
  { key: "research", label: "Research", img: researchFolderImg },
  { key: "health", label: "Health", img: healthFolderImg },
] as const;

const ROWS = [
  {
    label: "Journal",
    trading: "Theses, trades, outcomes",
    research: "Sources, notes, findings",
    health: "Workouts, sleep, calories",
  },
  {
    label: "Insights",
    trading: "Watchlist adds, risk limit changes",
    research: "New sourcing standards\n& citation rules",
    health: "Adjusted recovery rules & targets",
  },
  {
    label: "Skills",
    trading: "Sizing trades, timing entries",
    research: "Vetting sources, checking claims",
    health: "Planning workouts, scheduling rest",
  },
  {
    label: "Context",
    trading: "Positions, rules, watchlist",
    research: "Open questions, current theses",
    health: "Goals, limits, current program",
  },
] as const;

/* ─── Shared style tokens (from Figma) ───────────────────────────── */
const ROW_BORDER = "rgba(0, 0, 0, 0.09)";
const TRADING_CELL_COLOR = "rgba(0, 6, 46, 0.2)";
const RESEARCH_CELL_COLOR = "rgba(0, 7, 20, 0.62)";
const HEALTH_CELL_COLOR = "rgba(0, 6, 46, 0.2)";
const RESEARCH_BG = "#fcfcfd";
const LABEL_COL_W = 291; // px — Figma layout_100FRH width

// ─── Animation variants ──────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    x: -48,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

export default function PracticesStructure() {
  const reduced = usePrefersReducedMotion();
  const [activeDomain, setActiveDomain] = useState<string>("trading");
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  return (
    <section className="w-full py-[60px] md:py-[100px]">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] flex flex-col items-center gap-[64px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { y: 24, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
            },
          }}
          className="flex flex-col items-center gap-4 text-center max-w-[600px]"
        >
          <h2
            className="font-[590] text-[clamp(32px,3.33vw,48px)] leading-[0.9] text-[#1C2024] [font-family:var(--figma-font-text)]"
            style={{
              letterSpacing: "-0.83%",
              fontVariationSettings: '"wdth" 100',
            }}
          >
            A Universal Structure.
          </h2>
          <p
            className="font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
            style={{ color: "rgba(0, 5, 9, 0.89)" }}
          >
            Every practice learns the same way. Four parts, shaped to{" "}
            <span className="hidden md:inline">
              <br />
            </span>
            what each domain needs.
          </p>
        </motion.div>

        {/* ── Mobile layout (per Figma 358px) ── */}
        <motion.div
          initial="hidden"
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px" }}
          variants={reduced ? { visible: {} } : containerVariants}
          className="block md:hidden w-full"
        >
          {/* Navigation header — arrows + domain icon */}
          <motion.div
            variants={
              reduced
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                : rowVariants
            }
            className="flex items-center justify-between px-8 py-6 border-b border-[rgba(0,0,0,0.09)]"
          >
            <button
              onClick={() => {
                const idx = DOMAINS.findIndex((d) => d.key === activeDomain);
                const prev =
                  DOMAINS[(idx - 1 + DOMAINS.length) % DOMAINS.length];
                setActiveDomain(prev.key);
              }}
              disabled={activeDomain === "trading"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-colors hover:bg-[rgba(0,0,51,0.12)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer disabled:cursor-default"
              aria-label="Previous domain"
            >
              <RiArrowLeftSLine size={20} aria-hidden="true" />
            </button>

            <div className="flex flex-col items-center gap-2">
              <Image
                src={DOMAINS.find((d) => d.key === activeDomain)!.img}
                alt={DOMAINS.find((d) => d.key === activeDomain)!.label}
                width={92}
                height={92}
                className="object-contain size-[92px]"
                draggable={false}
              />
              <span
                className="font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)] text-center"
                style={{ color: "rgba(0, 5, 9, 0.89)" }}
              >
                {DOMAINS.find((d) => d.key === activeDomain)!.label}
              </span>
            </div>

            <button
              onClick={() => {
                const idx = DOMAINS.findIndex((d) => d.key === activeDomain);
                const next = DOMAINS[(idx + 1) % DOMAINS.length];
                setActiveDomain(next.key);
              }}
              disabled={activeDomain === "health"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) transition-colors hover:bg-[rgba(0,0,51,0.12)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer disabled:cursor-default"
              aria-label="Next domain"
            >
              <RiArrowRightSLine size={20} aria-hidden="true" />
            </button>
          </motion.div>

          {/* Data rows — vertical stacked layout */}
          {(() => {
            const domainKey = activeDomain;
            return ROWS.map((row) => (
              <motion.div
                key={row.label}
                variants={
                  reduced
                    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                    : rowVariants
                }
                className="flex flex-col gap-2 px-6 py-6 border-b border-[rgba(0,0,0,0.09)]"
              >
                <span
                  className="font-[510] text-[24px] leading-[30px] [font-family:var(--figma-font-text)] text-[#1C2024]"
                  style={{
                    letterSpacing: "-0.1px",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  {row.label}
                </span>
                <span
                  className="font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                  style={{ color: "rgba(0, 7, 20, 0.62)" }}
                >
                  {row[domainKey as keyof typeof row]
                    .split("\n")
                    .map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                </span>
              </motion.div>
            ));
          })()}
        </motion.div>

        {/* ── Desktop layout ── */}
        <motion.div
          initial="hidden"
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, margin: "-100px" }}
          variants={reduced ? { visible: {} } : containerVariants}
          className="hidden md:block w-full"
        >
          <div className="w-full max-w-[1280px] mx-auto">
            <motion.div
              variants={
                reduced
                  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                  : rowVariants
              }
              className="flex items-stretch"
              style={{ borderBottom: `1px solid ${ROW_BORDER}` }}
            >
              <div style={{ width: LABEL_COL_W, flexShrink: 0 }} />

              {DOMAINS.map((d) => (
                <div
                  key={d.key}
                  onMouseEnter={() => setHoveredDomain(d.key)}
                  onMouseLeave={() => setHoveredDomain(null)}
                  className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 pr-8 cursor-default transition-opacity duration-300 ${d.key === "research" ? "bg-linear-to-b from-white to-[#fcfcfd]" : ""}`}
                  style={{
                    opacity:
                      hoveredDomain && hoveredDomain !== d.key ? 0.35 : 1,
                  }}
                >
                  <Image
                    src={d.img}
                    alt={d.label}
                    width={92}
                    height={92}
                    className="object-contain"
                    draggable={false}
                  />
                  <span
                    className="font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: "rgba(0, 5, 9, 0.89)" }}
                  >
                    {d.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {ROWS.map((row) => (
              <motion.div
                key={row.label}
                variants={
                  reduced
                    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                    : rowVariants
                }
                className="flex items-center"
                style={{
                  height: 88,
                  borderBottom: `1px solid ${ROW_BORDER}`,
                }}
              >
                <div
                  className="shrink-0 flex items-center pr-8"
                  style={{ width: LABEL_COL_W }}
                >
                  <span
                    className="font-[510] text-[clamp(20px,1.94vw,28px)] leading-[36px] [font-family:var(--figma-font-text)] text-[#1C2024]"
                    style={{
                      letterSpacing: "-0.12px",
                      fontVariationSettings: '"wdth" 100',
                    }}
                  >
                    {row.label}
                  </span>
                </div>

                <div
                  className="flex-1 flex items-center justify-center pr-8 transition-opacity duration-300"
                  onMouseEnter={() => setHoveredDomain("trading")}
                  onMouseLeave={() => setHoveredDomain(null)}
                  style={{
                    opacity:
                      hoveredDomain && hoveredDomain !== "trading" ? 0.35 : 1,
                  }}
                >
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] transition-[color] duration-300 [font-family:var(--figma-font-text)]"
                    style={{
                      color:
                        hoveredDomain === "trading"
                          ? RESEARCH_CELL_COLOR
                          : TRADING_CELL_COLOR,
                    }}
                  >
                    {row.trading.split("\n").map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                </div>

                <div
                  className="flex-1 flex items-center justify-center pr-8 transition-opacity duration-300"
                  onMouseEnter={() => setHoveredDomain("research")}
                  onMouseLeave={() => setHoveredDomain(null)}
                  style={{
                    backgroundColor: RESEARCH_BG,
                    opacity:
                      hoveredDomain && hoveredDomain !== "research" ? 0.35 : 1,
                  }}
                >
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: RESEARCH_CELL_COLOR }}
                  >
                    {row.research.split("\n").map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                </div>

                <div
                  className="flex-1 flex items-center justify-center pr-8 transition-opacity duration-300"
                  onMouseEnter={() => setHoveredDomain("health")}
                  onMouseLeave={() => setHoveredDomain(null)}
                  style={{
                    opacity:
                      hoveredDomain && hoveredDomain !== "health" ? 0.35 : 1,
                  }}
                >
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] transition-[color] duration-300 [font-family:var(--figma-font-text)]"
                    style={{
                      color:
                        hoveredDomain === "health"
                          ? RESEARCH_CELL_COLOR
                          : HEALTH_CELL_COLOR,
                    }}
                  >
                    {row.health.split("\n").map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
