"use client";

import Image from "next/image";
import tradingFolderImg from "@/public/sections/structure/trading-folder.png";
import researchFolderImg from "@/public/sections/structure/research-folder.png";
import healthFolderImg from "@/public/sections/structure/health-folder.png";

/* ─── Table data ─────────────────────────────────────────────────── */
const DOMAINS = [
  { key: "trading",  label: "Trading",  img: tradingFolderImg  },
  { key: "research", label: "Research", img: researchFolderImg },
  { key: "health",   label: "Health",   img: healthFolderImg   },
] as const;

const ROWS = [
  {
    label: "Journal",
    trading:  "trades, conversations",
    research: "sources, notes",
    health:   "sleep, training",
  },
  {
    label: "Insights",
    trading:  "surfaced patterns",
    research: "surfaced patterns",
    health:   "surfaced patterns",
  },
  {
    label: "Skills",
    trading:  "exit discipline",
    research: "citation rules",
    health:   "recovery rules",
  },
  {
    label: "Context",
    trading:  "rules, positions",
    research: "open questions",
    health:   "goals, limits",
  },
] as const;

/* ─── Shared style tokens (from Figma) ───────────────────────────── */
const ROW_BORDER = "rgba(0, 0, 0, 0.09)";
const CELL_COLOR = "rgba(0, 5, 29, 0.45)";
const LABEL_COL_W = 291; // px — Figma layout_100FRH width

export default function PracticesStructure() {
  return (
    <section className="w-full py-[60px] md:py-[100px]">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] flex flex-col items-center gap-[64px]">

        {/* ── Header (Figma 507-19167) ── */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[600px]">
          <h2
            className="font-[590] text-[clamp(32px,3.33vw,48px)] leading-[0.9] text-[#1C2024] [font-family:var(--figma-font-text)]"
            style={{ letterSpacing: "-0.83%", fontVariationSettings: '"wdth" 100' }}
          >
            A Universal Structure.
          </h2>
          <p
            className="font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
            style={{ color: "rgba(0, 5, 9, 0.89)" }}
          >
            Every practice learns the same way. Four parts, shaped to
            what each domain needs.
          </p>
        </div>

        {/* ── Table (Figma 509-19587, w:1280) ── */}
        {/* Horizontally scrollable on small screens */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px] w-full max-w-[1280px] mx-auto">

            {/* Domain header row — border-bottom */}
            <div
              className="flex items-stretch"
              style={{ borderBottom: `1px solid ${ROW_BORDER}` }}
            >
              {/* Spacer matching label column — Figma: layout_E4EG7Q, w:291, p:24 32 24 0 */}
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
                  />
                  <span
                    className="font-[510] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: "rgba(0, 5, 9, 0.89)" }}
                  >
                    {d.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Data rows — height:88px, border-bottom */}
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-center"
                style={{
                  height: 88,
                  borderBottom: `1px solid ${ROW_BORDER}`,
                }}
              >
                {/* Row label — Figma: Typography/7/Medium, 28px, #1C2024, p:32 32 32 0 */}
                <div
                  className="shrink-0 flex items-center pr-8"
                  style={{ width: LABEL_COL_W }}
                >
                  <span
                    className="font-[510] text-[clamp(20px,1.94vw,28px)] leading-[1.286] [font-family:var(--figma-font-text)] text-[#1C2024]"
                    style={{ letterSpacing: "-0.43%", fontVariationSettings: '"wdth" 100' }}
                  >
                    {row.label}
                  </span>
                </div>

                {/* Trading cell */}
                <div className="flex-1 flex items-center justify-center pr-8">
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: CELL_COLOR }}
                  >
                    {row.trading}
                  </span>
                </div>

                {/* Research cell */}
                <div className="flex-1 flex items-center justify-center pr-8">
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: CELL_COLOR }}
                  >
                    {row.research}
                  </span>
                </div>

                {/* Health cell */}
                <div className="flex-1 flex items-center justify-center pr-8">
                  <span
                    className="text-center font-[400] text-[16px] leading-[24px] [font-family:var(--figma-font-text)]"
                    style={{ color: CELL_COLOR }}
                  >
                    {row.health}
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
