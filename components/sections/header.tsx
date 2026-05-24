"use client";

import Image from "next/image";
import { useState } from "react";
import {
  RiArrowDownSLine,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react";

interface NavItem {
  label: string;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", hasDropdown: true },
  { label: "Arkives & Practices", hasDropdown: true },
  { label: "Trade Project" },
  { label: "Research" },
  { label: "Docs" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80  [font-family:var(--figma-font-text)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-20 py-2">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4 md:gap-(--figma-spacing-7)">
          <a href="/" aria-label="Arkive home" className="shrink-0">
            <Image
              src="/icons/logo.svg"
              alt="Arkive"
              width={40}
              height={32}
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-(--figma-spacing-2)">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className="flex items-center justify-center h-8 rounded-full transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 gap-(--figma-spacing-2) px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) font-normal"
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.hasDropdown && (
                      <RiArrowDownSLine
                        size={16}
                        aria-hidden="true"
                        className="text-(--figma-neutral-12)"
                      />
                    )}
                  </button>
                </li>
              ))}

              <li>
                <button
                  type="button"
                  className="flex items-center justify-center h-8 rounded-full transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 gap-(--figma-spacing-2) px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) font-normal"
                  aria-label="Search"
                >
                  <span className="whitespace-nowrap">Search</span>
                  <RiSearchLine
                    size={16}
                    aria-hidden="true"
                    className="text-(--figma-neutral-12)"
                  />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center justify-center h-8 rounded-full transition-colors hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) bg-(--figma-neutral-12) text-(--figma-neutral-1) font-[510]"
          >
            Get started
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center size-8 rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col py-3 px-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between w-full h-10 px-3 rounded-lg hover:bg-black/5 transition-colors text-(length:--figma-font-size-2) leading-(--figma-line-height-2) text-(--figma-neutral-12) font-normal"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <RiArrowDownSLine
                      size={16}
                      aria-hidden="true"
                      className="text-(--figma-neutral-12)"
                    />
                  )}
                </button>
              </li>
            ))}
            <li className="pt-1 border-t border-black/5 mt-1">
              <button
                type="button"
                className="flex items-center justify-between w-full h-10 px-3 rounded-lg hover:bg-black/5 transition-colors text-(length:--figma-font-size-2) leading-(--figma-line-height-2) text-(--figma-neutral-12) font-normal"
                aria-label="Search"
              >
                <span>Search</span>
                <RiSearchLine
                  size={16}
                  aria-hidden="true"
                  className="text-(--figma-neutral-12)"
                />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
