"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiArrowDownSLine,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react";
import {
  EASE,
  headerContainer,
  headerItem,
  headerMobileContainer,
  headerMobileItem,
} from "@/lib/animations";

interface NavItem {
  label: string;
  hasDropdown?: boolean;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Arkives & Practices", hasDropdown: true },
  { label: "Project DeFi", href: "project-defi" },
  { label: "Trade Project" },
  { label: "Research" },
  { label: "Docs" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Close menus whenever the route changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll("[data-header-theme]");
      const headerH = 72;
      let theme: string | null = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerH && rect.bottom > headerH) {
          theme = section.getAttribute("data-header-theme");
          break;
        }
      }

      setDark(theme === "dark");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 [font-family:var(--figma-font-text)]",
        dark ? "bg-black text-white" : "bg-white text-(--figma-neutral-12)",
      ].join(" ")}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-[clamp(16px,4.17vw,80px)] py-2">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerContainer}
          className="flex items-center gap-[clamp(8px,2vw,28px)]"
        >
          <motion.a
            href="/"
            aria-label="Arkive home"
            className="shrink-0"
            variants={headerItem}
          >
            <Image
              src="/icons/logo.svg"
              alt="Arkive"
              width={40}
              height={32}
              priority
              className={dark ? "invert" : ""}
              draggable={false}
            />
          </motion.a>

          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-(--figma-spacing-2)">
              {NAV_ITEMS.map((item) => (
                <motion.li
                  key={item.label}
                  variants={headerItem}
                  className="relative"
                >
                  {item.label === "Arkives & Practices" ? (
                    <div ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={[
                          "flex items-center justify-center h-8 rounded-full transition-colors duration-300 gap-(--figma-spacing-2) px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
                          dark
                            ? "hover:bg-white/10 focus-visible:ring-white/30 text-white"
                            : "hover:bg-black/5 focus-visible:ring-black/20 text-(--figma-neutral-12)",
                          "focus-visible:outline-none focus-visible:ring-2",
                        ].join(" ")}
                      >
                        <span className="whitespace-nowrap">{item.label}</span>
                        <RiArrowDownSLine
                          size={16}
                          aria-hidden="true"
                          className={[
                            "transition-transform duration-200",
                            dropdownOpen ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: EASE }}
                            className={[
                              "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 py-1.5 rounded-2xl shadow-xl border overflow-hidden backdrop-blur-md",
                              dark
                                ? "bg-black/90 border-white/10 text-white"
                                : "bg-white/95 border-black/5 text-(--figma-neutral-12)",
                            ].join(" ")}
                          >
                            <Link
                              href="/arkives"
                              onClick={() => setDropdownOpen(false)}
                              className={[
                                "flex items-center h-9 px-4 text-(length:--figma-font-size-2) font-normal transition-colors",
                                dark
                                  ? "hover:bg-white/10 text-white"
                                  : "hover:bg-black/5 text-(--figma-neutral-12)",
                              ].join(" ")}
                            >
                              Arkives
                            </Link>
                            <Link
                              href="/practices"
                              onClick={() => setDropdownOpen(false)}
                              className={[
                                "flex items-center h-9 px-4 text-(length:--figma-font-size-2) font-normal transition-colors",
                                dark
                                  ? "hover:bg-white/10 text-white"
                                  : "hover:bg-black/5 text-(--figma-neutral-12)",
                              ].join(" ")}
                            >
                              Practices
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      className={[
                        "flex items-center justify-center h-8 rounded-full transition-colors duration-300 gap-(--figma-spacing-2) px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
                        dark
                          ? "text-white hover:bg-white/10 focus-visible:ring-white/30"
                          : "text-(--figma-neutral-12) hover:bg-black/5 focus-visible:ring-black/20",
                        "focus-visible:outline-none focus-visible:ring-2",
                      ].join(" ")}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.hasDropdown && (
                        <RiArrowDownSLine size={16} aria-hidden="true" />
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={[
                        "flex items-center justify-center h-8 rounded-full transition-colors duration-300 gap-(--figma-spacing-2) px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
                        dark
                          ? "hover:bg-white/10 focus-visible:ring-white/30"
                          : "hover:bg-black/5 focus-visible:ring-black/20",
                        "focus-visible:outline-none focus-visible:ring-2",
                      ].join(" ")}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.hasDropdown && (
                        <RiArrowDownSLine size={16} aria-hidden="true" />
                      )}
                    </button>
                  )}
                </motion.li>
              ))}

              <motion.li variants={headerItem}>
                <button
                  type="button"
                  className={[
                    "flex items-center justify-center h-8 rounded-full transition-colors duration-300 gap-(--figma-spacing-2) px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
                    dark
                      ? "hover:bg-white/10 focus-visible:ring-white/30"
                      : "hover:bg-black/5 focus-visible:ring-black/20",
                    "focus-visible:outline-none focus-visible:ring-2",
                  ].join(" ")}
                  aria-label="Search"
                >
                  <span className="whitespace-nowrap">Search</span>
                  <RiSearchLine size={16} aria-hidden="true" />
                </button>
              </motion.li>
            </ul>
          </nav>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerContainer}
          className="flex items-center gap-3"
        >
          <motion.button
            variants={headerItem}
            type="button"
            className={[
              "flex items-center justify-center h-8 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
              dark
                ? "bg-white text-black hover:bg-[#e6e6e6] focus-visible:ring-white/30"
                : "bg-(--figma-neutral-12) text-(--figma-neutral-1) hover:opacity-90 focus-visible:ring-black/30",
            ].join(" ")}
          >
            Get started
          </motion.button>

          <motion.button
            variants={headerItem}
            onClick={() => setOpen(!open)}
            className={[
              "lg:hidden flex items-center justify-center size-8 rounded-full focus-visible:outline-none focus-visible:ring-2",
              dark
                ? "hover:bg-white/10 focus-visible:ring-white/30"
                : "hover:bg-black/5 focus-visible:ring-black/20",
            ].join(" ")}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RiCloseLine size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RiMenuLine size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={[
              "lg:hidden border-t overflow-hidden",
              dark
                ? "border-white/10 bg-black text-white"
                : "border-black/5 bg-white text-(--figma-neutral-12)",
            ].join(" ")}
            aria-label="Mobile navigation"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={headerMobileContainer}
              className="flex flex-col py-3 px-4 gap-1"
            >
              {NAV_ITEMS.map((item) => (
                <motion.li key={item.label} variants={headerMobileItem}>
                  {item.label === "Arkives & Practices" ? (
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileDropdownOpen(!mobileDropdownOpen);
                        }}
                        className={[
                          "flex items-center justify-between w-full h-10 px-3 rounded-lg transition-colors duration-300 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) font-normal",
                          dark
                            ? "text-white hover:bg-white/10"
                            : "hover:bg-black/5 text-(--figma-neutral-12)",
                        ].join(" ")}
                      >
                        <span>{item.label}</span>
                        <RiArrowDownSLine
                          size={16}
                          aria-hidden="true"
                          className={[
                            "transition-transform duration-200",
                            mobileDropdownOpen ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileDropdownOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col pl-4 gap-1 overflow-hidden"
                          >
                            <Link
                              href="/arkives"
                              onClick={() => setOpen(false)}
                              className={[
                                "flex items-center w-full h-9 px-3 rounded-lg transition-colors duration-300 text-(length:--figma-font-size-2) font-normal",
                                dark
                                  ? "text-white/80 hover:bg-white/10"
                                  : "text-(--figma-neutral-12)/80 hover:bg-black/5",
                              ].join(" ")}
                            >
                              Arkives
                            </Link>
                            <Link
                              href="/practices"
                              onClick={() => setOpen(false)}
                              className={[
                                "flex items-center w-full h-9 px-3 rounded-lg transition-colors duration-300 text-(length:--figma-font-size-2) font-normal",
                                dark
                                  ? "text-white/80 hover:bg-white/10"
                                  : "text-(--figma-neutral-12)/80 hover:bg-black/5",
                              ].join(" ")}
                            >
                              Practices
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between w-full h-10 px-3 rounded-lg transition-colors duration-300 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) font-normal",
                        dark
                          ? "text-white hover:bg-white/10"
                          : "text-(--figma-neutral-12) hover:bg-black/5",
                      ].join(" ")}
                    >
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <RiArrowDownSLine size={16} aria-hidden="true" />
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between w-full h-10 px-3 rounded-lg transition-colors duration-300 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) font-normal",
                        dark
                          ? "hover:bg-white/10"
                          : "hover:bg-black/5 text-(--figma-neutral-12)",
                      ].join(" ")}
                    >
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <RiArrowDownSLine size={16} aria-hidden="true" />
                      )}
                    </button>
                  )}
                </motion.li>
              ))}
              <motion.li
                variants={headerMobileItem}
                className={
                  dark
                    ? "pt-1 border-t border-white/10 mt-1"
                    : "pt-1 border-t border-black/5 mt-1"
                }
              >
                <button
                  type="button"
                  className={[
                    "flex items-center justify-between w-full h-10 px-3 rounded-lg transition-colors duration-300 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) font-normal",
                    dark
                      ? "hover:bg-white/10"
                      : "hover:bg-black/5 text-(--figma-neutral-12)",
                  ].join(" ")}
                  aria-label="Search"
                >
                  <span>Search</span>
                  <RiSearchLine size={16} aria-hidden="true" />
                </button>
              </motion.li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
