"use client";

import Image from "next/image";
import { motion } from "motion/react";
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
    trading: "trades, conversations",
    research: "sources, notes",
    health: "sleep, training",
  },
  {
    label: "Insights",
    trading: "surfaced patterns",
    research: "surfaced patterns",
    health: "surfaced patterns",
  },
  {
    label: "Skills",
    trading: "exit discipline",
    research: "citation rules",
    health: "recovery rules",
  },
  {
    label: "Context",
    trading: "rules, positions",
    research: "open questions",
    health: "goals, limits",
  },
] as const;

/* ─── Shared style tokens (from Figma) ───────────────────────────── */
const ROW_BORDER = "rgba(0, 0, 0, 0.09)";
const CELL_COLOR = "rgba(0, 5, 29, 0.45)";
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
          {/* Header row — 3 folder icons */}
          <motion.div
            variants={
              reduced
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                : rowVariants
            }
            className="flex items-stretch border-b border-[rgba(0,0,0,0.09)]"
          >
            <div className="w-[64px] shrink-0" />

            {DOMAINS.map((d) => (
              <div
                key={d.key}
                className="flex-1 flex flex-col items-center gap-2 py-4"
              >
                <Image
                  src={d.img}
                  alt={d.label}
                  width={48}
                  height={48}
                  className="object-contain"
                  draggable={false}
                />
                <span className="font-[510] text-[12px] leading-[15px] text-center [font-family:var(--figma-font-text)] text-[#1C2024]">
                  {d.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Data rows */}
          {ROWS.map((row) => (
            <motion.div
              key={row.label}
              variants={
                reduced
                  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                  : rowVariants
              }
              className="flex items-center border-b border-[rgba(0,0,0,0.09)]"
              style={{ height: 88 }}
            >
              <div className="w-[64px] shrink-0 flex items-center justify-center">
                <span className="font-[510] text-[14px] leading-[20px] [font-family:var(--figma-font-text)] text-[#1C2024]">
                  {row.label}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center px-2">
                <span className="text-center font-[400] text-[12px] leading-[16px] [font-family:var(--figma-font-text)] text-[rgba(0,5,29,0.45)]">
                  {row.trading}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center px-2">
                <span className="text-center font-[400] text-[12px] leading-[16px] [font-family:var(--figma-font-text)] text-[rgba(0,5,29,0.45)]">
                  {row.research}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center px-2">
                <span className="text-center font-[400] text-[12px] leading-[16px] [font-family:var(--figma-font-text)] text-[rgba(0,5,29,0.45)]">
                  {row.health}
                </span>
              </div>
            </motion.div>
          ))}
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
                  className="flex-1 flex flex-col items-center justify-center gap-3 py-6 pr-8"
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
                    className="font-[510] text-[clamp(20px,1.94vw,28px)] leading-[1.286] [font-family:var(--figma-font-text)] text-[#1C2024]"
                    style={{
                      letterSpacing: "-0.43%",
                      fontVariationSettings: '"wdth" 100',
                    }}
                  >
                    {row.label}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center pr-8">
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: CELL_COLOR }}
                  >
                    {row.trading}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center pr-8">
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: CELL_COLOR }}
                  >
                    {row.research}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center pr-8">
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: CELL_COLOR }}
                  >
                    {row.health}
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
