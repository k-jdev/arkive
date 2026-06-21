"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNewsletterModal } from "@/components/providers/newsletter-modal-provider";
import {
  RiArrowDownSLine,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
  RiDiscordLine,
  RiTwitterXLine,
  RiGithubLine,
  RiTelegramLine,
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
  { label: "Arkives", href: "/arkives" },
  { label: "Practices", href: "/practices" },
  { label: "Project DeFi", href: "/project-defi" },
  { label: "Docs" },
];

const SOCIAL_LINKS = [
  { label: "Discord", href: "#", Icon: RiDiscordLine },
  { label: "Twitter", href: "#", Icon: RiTwitterXLine },
  { label: "GitHub", href: "#", Icon: RiGithubLine },
  { label: "Telegram", href: "#", Icon: RiTelegramLine },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();
  const { openModal } = useNewsletterModal();

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
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={[
                        "flex items-center justify-center h-8 rounded-full transition-colors duration-300 px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
                        dark
                          ? "text-white hover:bg-white/10 focus-visible:ring-white/30"
                          : "text-(--figma-neutral-12) hover:bg-black/5 focus-visible:ring-black/20",
                        "focus-visible:outline-none focus-visible:ring-2",
                      ].join(" ")}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={[
                        "flex items-center justify-center h-8 rounded-full transition-colors duration-300 px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
                        dark
                          ? "hover:bg-white/10 focus-visible:ring-white/30"
                          : "hover:bg-black/5 focus-visible:ring-black/20",
                        "focus-visible:outline-none focus-visible:ring-2",
                      ].join(" ")}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                  )}
                </motion.li>
              ))}
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
            onClick={openModal}
            className={[
              "hidden lg:flex items-center justify-center h-8 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 px-(--figma-spacing-3) text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) font-normal",
              dark
                ? "bg-white text-black hover:bg-[#e6e6e6] focus-visible:ring-white/30"
                : "bg-(--figma-neutral-12) text-(--figma-neutral-1) hover:opacity-90 focus-visible:ring-black/30",
            ].join(" ")}
          >
            Coming soon
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-50 bg-black lg:hidden"
            aria-label="Mobile navigation"
          >
            {/* Top bar: logo + close */}
            <div className="flex items-center justify-between h-12 px-(--figma-spacing-4) py-(--figma-spacing-3)">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                aria-label="Arkive home"
                className="shrink-0"
              >
                <Image
                  src="/icons/logo.svg"
                  alt="Arkive"
                  width={40}
                  height={32}
                  priority
                  className="invert"
                  draggable={false}
                />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center size-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                aria-label="Close menu"
              >
                <RiCloseLine size={24} className="text-white" />
              </button>
            </div>

            {/* Menu items */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={headerMobileContainer}
              className="flex flex-col px-(--figma-spacing-4) mt-[37px]"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div key={item.label} variants={headerMobileItem}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between py-(--figma-spacing-4) w-full",
                        i < NAV_ITEMS.length - 1
                          ? "border-b border-[#2e3135]"
                          : "",
                      ].join(" ")}
                    >
                      <span className="text-white text-(length:--figma-font-size-7) leading-(--figma-line-height-7) tracking-(--figma-letter-spacing-7) font-normal [font-family:var(--figma-font-text)]">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between py-(--figma-spacing-4) w-full text-left",
                        i < NAV_ITEMS.length - 1
                          ? "border-b border-[#2e3135]"
                          : "",
                      ].join(" ")}
                    >
                      <span className="text-white text-(length:--figma-font-size-7) leading-(--figma-line-height-7) tracking-(--figma-letter-spacing-7) font-normal [font-family:var(--figma-font-text)]">
                        {item.label}
                      </span>
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Social icons */}
            <div className="absolute bottom-8 left-(--figma-spacing-4) right-(--figma-spacing-4) flex items-center justify-between">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center size-6 text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
