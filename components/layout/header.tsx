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
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.3263 1.90393H21.6998L14.3297 10.3274L23 21.7899H16.2112L10.894 14.838L4.80995 21.7899H1.43443L9.31743 12.78L1 1.90393H7.96111L12.7674 8.25826L18.3263 1.90393ZM17.1423 19.7707H19.0116L6.94539 3.81706H4.93946L17.1423 19.7707Z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0099 0C5.36875 0 0 5.40833 0 12.0992C0 17.4475 3.43994 21.9748 8.21205 23.5771C8.80869 23.6976 9.02724 23.3168 9.02724 22.9965C9.02724 22.716 9.00757 21.7545 9.00757 20.7527C5.6667 21.474 4.97099 19.3104 4.97099 19.3104C4.43409 17.9082 3.63858 17.5478 3.63858 17.5478C2.54511 16.8066 3.71823 16.8066 3.71823 16.8066C4.93117 16.8868 5.56763 18.0486 5.56763 18.0486C6.64118 19.8913 8.37111 19.3707 9.06706 19.0501C9.16638 18.2688 9.48473 17.728 9.82275 17.4276C7.15817 17.1471 4.35469 16.1055 4.35469 11.458C4.35469 10.1359 4.8316 9.05428 5.58729 8.21304C5.46807 7.91263 5.0504 6.67043 5.70677 5.00787C5.70677 5.00787 6.72083 4.6873 9.00732 6.24981C9.98625 5.98497 10.9958 5.85024 12.0099 5.84911C13.024 5.84911 14.0577 5.98948 15.0123 6.24981C17.299 4.6873 18.3131 5.00787 18.3131 5.00787C18.9695 6.67043 18.5515 7.91263 18.4323 8.21304C19.2079 9.05428 19.6652 10.1359 19.6652 11.458C19.6652 16.1055 16.8617 17.1269 14.1772 17.4276C14.6148 17.8081 14.9924 18.5292 14.9924 19.6711C14.9924 21.2936 14.9727 22.5957 14.9727 22.9962C14.9727 23.3168 15.1915 23.6976 15.7879 23.5774C20.56 21.9745 23.9999 17.4475 23.9999 12.0992C24.0196 5.40833 18.6312 0 12.0099 0Z"
        />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20.317 4.15557C18.7873 3.45369 17.147 2.93658 15.4319 2.6404C15.4007 2.63469 15.3695 2.64897 15.3534 2.67754C15.1424 3.05276 14.9087 3.54226 14.7451 3.927C12.9004 3.65083 11.0652 3.65083 9.25832 3.927C9.09465 3.5337 8.85248 3.05276 8.64057 2.67754C8.62448 2.64992 8.59328 2.63564 8.56205 2.6404C6.84791 2.93563 5.20756 3.45275 3.67693 4.15557C3.66368 4.16129 3.65233 4.17082 3.64479 4.18319C0.533392 8.83155 -0.31895 13.3657 0.0991801 17.8436C0.101072 17.8655 0.11337 17.8864 0.130398 17.8997C2.18321 19.4073 4.17171 20.3225 6.12328 20.9291C6.15451 20.9386 6.18761 20.9272 6.20748 20.9015C6.66913 20.2711 7.08064 19.6063 7.43348 18.9073C7.4543 18.8664 7.43442 18.8178 7.39186 18.8016C6.73913 18.554 6.1176 18.2521 5.51973 17.9093C5.47244 17.8816 5.46865 17.814 5.51216 17.7816C5.63797 17.6873 5.76382 17.5893 5.88396 17.4902C5.90569 17.4721 5.93598 17.4683 5.96153 17.4797C9.88928 19.273 14.1415 19.273 18.023 17.4797C18.0485 17.4674 18.0788 17.4712 18.1015 17.4893C18.2216 17.5883 18.3475 17.6873 18.4742 17.7816C18.5177 17.814 18.5149 17.8816 18.4676 17.9093C17.8697 18.2588 17.2482 18.554 16.5945 18.8006C16.552 18.8168 16.533 18.8664 16.5538 18.9073C16.9143 19.6054 17.3258 20.2701 17.7789 20.9005C17.7978 20.9272 17.8319 20.9386 17.8631 20.9291C19.8241 20.3225 21.8126 19.4073 23.8654 17.8997C23.8834 17.8864 23.8948 17.8664 23.8967 17.8445C24.3971 12.6676 23.0585 8.17064 20.3482 4.18414C20.3416 4.17082 20.3303 4.16129 20.317 4.15557ZM8.02002 15.117C6.8375 15.117 5.86313 14.0313 5.86313 12.6981C5.86313 11.3648 6.8186 10.2791 8.02002 10.2791C9.23087 10.2791 10.1958 11.3743 10.1769 12.6981C10.1769 14.0313 9.22141 15.117 8.02002 15.117ZM15.9947 15.117C14.8123 15.117 13.8379 14.0313 13.8379 12.6981C13.8379 11.3648 14.7933 10.2791 15.9947 10.2791C17.2056 10.2791 18.1705 11.3743 18.1516 12.6981C18.1516 14.0313 17.2056 15.117 15.9947 15.117Z"
          fill="white"
        />
      </svg>
    ),
  },
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

            <div className="absolute bottom-8 left-(--figma-spacing-4) right-(--figma-spacing-4) flex items-center justify-between">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center size-6 text-white hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                >
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
