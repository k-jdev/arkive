"use client";

import Image from "next/image";
import { useRef, useCallback, useEffect } from "react";

// ── Types & Data ──────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────

const maxAdditionalSize = 2;

function scaleValue(
  value: number,
  from: [number, number],
  to: [number, number],
) {
  const scale = (to[1] - to[0]) / (from[1] - from[0]);
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return Math.floor(capped * scale + to[0]);
}

type Visuals = {
  bg: string;
  rounded: string;
  shadow: string;
  border: string;
};

function getVisuals(type: ItemType): Visuals {
  switch (type) {
    case "faded":
      return {
        bg: "rgba(245,245,245,0.2)",
        rounded: "14px",
        shadow: "none",
        border: "1px solid rgba(204,204,204,0.4)",
      };
    case "jupiter":
      return {
        bg: "#072622",
        rounded: "20.891px",
        shadow:
          "0 96px 27px 0 rgba(0,0,0,0),0 61px 24px 0 rgba(0,0,0,0.01),0 34px 21px 0 rgba(0,0,0,0.05),0 15px 15px 0 rgba(0,0,0,0.09),0 4px 8px 0 rgba(0,0,0,0.10)",
        border: "none",
      };
    case "1inch":
      return {
        bg: "#000",
        rounded: "14px",
        shadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #171717",
      };
    case "uniswap":
      return {
        bg: "#fff",
        rounded: "14px",
        shadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
      };
  }
}

// ── DockItem ──────────────────────────────────────────────────

function DockItem({
  item,
  index,
  onHover,
}: {
  item: DockItemDef;
  index: number;
  onHover: (ev: React.MouseEvent<HTMLLIElement>) => void;
}) {
  let cls = "app";
  if (item.hiddenOn === "lg") cls += " hidden lg:flex";
  else if (item.hiddenOn === "md") cls += " hidden md:flex";

  const v = getVisuals(item.type);

  return (
    <li className={cls} data-idx={index} onMouseMove={onHover}>
      <div
        className="dock-item"
        style={{
          background: v.bg,
          borderRadius: v.rounded,
          boxShadow: v.shadow,
          border: v.border,
          opacity: item.type === "faded" ? (item.opacity ?? 0.2) : 1,
        }}
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
      </div>
    </li>
  );
}

// ── Section ───────────────────────────────────────────────────

export default function DefiPrompt() {
  const dockRef = useRef<HTMLDivElement>(null);
  const iconCache = useRef<{ left: number; width: number }[]>([]);
  const rafId = useRef<number>(0);

  const recalcCache = useCallback(() => {
    if (!dockRef.current) return;
    const apps = dockRef.current.querySelectorAll<HTMLLIElement>(".app");
    iconCache.current = [...apps].map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, width: r.width };
    });
  }, []);

  const handleAppHover = useCallback(
    (ev: React.MouseEvent<HTMLLIElement>) => {
      if (!dockRef.current) return;

      // lazy cache
      if (iconCache.current.length === 0) recalcCache();

      const idx = (ev.currentTarget as HTMLLIElement).dataset.idx;
      if (idx === undefined) return;
      const cached = iconCache.current[Number(idx)];
      if (!cached) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (!dockRef.current) return;

        const cursorDistance = (ev.clientX - cached.left) / cached.width;
        const offsetPixels = scaleValue(
          cursorDistance,
          [0, 1],
          [maxAdditionalSize * -1, maxAdditionalSize],
        );

        dockRef.current.style.setProperty(
          "--dock-offset-left",
          `${offsetPixels * -1}px`,
        );
        dockRef.current.style.setProperty(
          "--dock-offset-right",
          `${offsetPixels}px`,
        );
      });
    },
    [recalcCache],
  );

  const resetOffsets = useCallback(() => {
    if (!dockRef.current) return;
    dockRef.current.style.setProperty("--dock-offset-left", "0px");
    dockRef.current.style.setProperty("--dock-offset-right", "0px");
  }, []);

  // recalc positions on resize
  useEffect(() => {
    const onResize = () => {
      iconCache.current = [];
      resetOffsets();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resetOffsets]);

  return (
    <section
      data-header-theme="light"
      className="w-full bg-white flex flex-col py-24 md:py-36 items-center justify-center defi-dock-root"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      {/* Dock */}
      <div className="w-full mb-16 select-none overflow-visible px-4">
        <div
          className="flex flex-row items-end justify-center mx-auto"
          style={{
            transform: "scale(clamp(0.18, 1vw, 1))",
            transformOrigin: "center bottom",
          }}
        >
          <nav ref={dockRef} className="dock" onMouseLeave={resetOffsets}>
            <ul>
              {ITEMS.map((item, index) => (
                <DockItem
                  key={item.id}
                  item={item}
                  index={index}
                  onHover={handleAppHover}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center px-4 max-w-3xl flex flex-col items-center gap-4 md:gap-3">
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
      </div>

      <style>{`
        @property --dock-offset-left {
          syntax: "<length>";
          initial-value: 0px;
          inherits: true;
        }

        @property --dock-offset-right {
          syntax: "<length>";
          initial-value: 0px;
          inherits: true;
        }

        .defi-dock-root .dock {
          padding: 0 12px;
        }

        .defi-dock-root .dock ul {
          display: flex;
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .defi-dock-root .app {
          width: 76px;
          height: 76px;
          position: relative;
          box-sizing: content-box;
          padding: 0 clamp(4px, 0.5vw, 8px);
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: width, height, margin-top;
          transition:
            --dock-offset-left 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
            --dock-offset-right 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
            width 60ms cubic-bezier(0.25, 1, 0.5, 1),
            height 60ms cubic-bezier(0.25, 1, 0.5, 1),
            margin-top 60ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .defi-dock-root .dock-item {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform;
        }

        .defi-dock-root .app:hover {
          width: 113px;
          height: 113px;
          margin-top: -37px;
        }

        /* Right side */
        .defi-dock-root .app:hover + .app {
          width: calc(91px + var(--dock-offset-right, 0px));
          height: calc(91px + var(--dock-offset-right, 0px));
          margin-top: calc(-15px + var(--dock-offset-right, 0px) * -1);
        }

        .defi-dock-root .app:hover + .app + .app {
          width: calc(83px + var(--dock-offset-right, 0px));
          height: calc(83px + var(--dock-offset-right, 0px));
          margin-top: calc(-7px + var(--dock-offset-right, 0px) * -1);
        }

        /* Left side */
        .defi-dock-root .app:has(+ .app:hover) {
          width: calc(91px + var(--dock-offset-left, 0px));
          height: calc(91px + var(--dock-offset-left, 0px));
          margin-top: calc(-15px + var(--dock-offset-left, 0px) * -1);
        }

        .defi-dock-root .app:has(+ .app + .app:hover) {
          width: calc(83px + var(--dock-offset-left, 0px));
          height: calc(83px + var(--dock-offset-left, 0px));
          margin-top: calc(-7px + var(--dock-offset-left, 0px) * -1);
        }

        @media (max-width: 768px) {
          .defi-dock-root .app {
            width: 62px;
            height: 62px;
          }
          .defi-dock-root .app:hover {
            width: 84px;
            height: 84px;
            margin-top: -22px;
          }
          .defi-dock-root .app:hover + .app {
            width: calc(73px + var(--dock-offset-right, 0px));
            height: calc(73px + var(--dock-offset-right, 0px));
            margin-top: calc(-11px + var(--dock-offset-right, 0px) * -1);
          }
          .defi-dock-root .app:hover + .app + .app {
            width: calc(68px + var(--dock-offset-right, 0px));
            height: calc(68px + var(--dock-offset-right, 0px));
            margin-top: calc(-6px + var(--dock-offset-right, 0px) * -1);
          }
          .defi-dock-root .app:has(+ .app:hover) {
            width: calc(73px + var(--dock-offset-left, 0px));
            height: calc(73px + var(--dock-offset-left, 0px));
            margin-top: calc(-11px + var(--dock-offset-left, 0px) * -1);
          }
          .defi-dock-root .app:has(+ .app + .app:hover) {
            width: calc(68px + var(--dock-offset-left, 0px));
            height: calc(68px + var(--dock-offset-left, 0px));
            margin-top: calc(-6px + var(--dock-offset-left, 0px) * -1);
          }
        }

        @media (max-width: 640px) {
          .defi-dock-root .app {
            width: 50px;
            height: 50px;
          }
          .defi-dock-root .app:hover {
            width: 68px;
            height: 68px;
            margin-top: -18px;
          }
          .defi-dock-root .app:hover + .app {
            width: calc(60px + var(--dock-offset-right, 0px));
            height: calc(60px + var(--dock-offset-right, 0px));
            margin-top: calc(-10px + var(--dock-offset-right, 0px) * -1);
          }
          .defi-dock-root .app:hover + .app + .app {
            width: calc(55px + var(--dock-offset-right, 0px));
            height: calc(55px + var(--dock-offset-right, 0px));
            margin-top: calc(-5px + var(--dock-offset-right, 0px) * -1);
          }
          .defi-dock-root .app:has(+ .app:hover) {
            width: calc(60px + var(--dock-offset-left, 0px));
            height: calc(60px + var(--dock-offset-left, 0px));
            margin-top: calc(-10px + var(--dock-offset-left, 0px) * -1);
          }
          .defi-dock-root .app:has(+ .app + .app:hover) {
            width: calc(55px + var(--dock-offset-left, 0px));
            height: calc(55px + var(--dock-offset-left, 0px));
            margin-top: calc(-5px + var(--dock-offset-left, 0px) * -1);
          }
        }
      `}</style>
    </section>
  );
}
