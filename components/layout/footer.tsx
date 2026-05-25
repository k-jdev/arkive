"use client";

import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { footerContainer, footerItem } from "@/lib/animations";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Arkive",
    links: [
      { label: "Overview", href: "#" },
      { label: "How Arkive Works", href: "#" },
      { label: "Context Engine", href: "#" },
      { label: "Multi-Model Memory", href: "#" },
      { label: "Knowledge Graph", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
      { label: "Docs", href: "#" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Arkives", href: "#" },
      { label: "Practices", href: "#" },
      { label: "Trade Projects", href: "#" },
      { label: "Research", href: "#" },
      { label: "Workspaces", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "API", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Use Cases", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = ["LinkedIn", "X", "GitHub", "Discord"];

export default function Footer() {
  return (
    <footer className="w-full bg-[#f9f9fb]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={footerContainer}
        className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] py-16 md:py-20"
      >
        {/* Row 1 — Logo left, columns right */}
        <div className="flex flex-col md:flex-row justify-between gap-16">
          {/* Logo */}
          <motion.div variants={footerItem}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="32"
              viewBox="0 0 40 32"
              fill="none"
              aria-label="Arkive"
            >
              <path
                d="M26.0645 3.00098V15.0469H38.9981V28.1504H25.8946V15.1592C18.8335 15.2197 13.128 20.9766 13.1279 28.0693C13.128 28.0885 13.1288 28.1078 13.1289 28.127H1.00002C0.999975 28.1078 1.00002 28.0885 1.00002 28.0693C1.00002 14.2243 12.1959 3.00006 26.0069 3C26.0261 3 26.0453 3.00093 26.0645 3.00098Z"
                fill="#1C2024"
              />
            </svg>
          </motion.div>

          {/* 3 link columns */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-10 gap-y-8"
          >
            {LINK_GROUPS.map((group) => (
              <motion.div
                key={group.title}
                variants={footerItem}
                className="flex flex-col gap-4 w-[190px]"
              >
                <h3 className="font-[510] text-[20px] leading-7 tracking-[-0.08px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]">
                  {group.title}
                </h3>
                <ul className="flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="flex items-center h-8 px-1 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity rounded-full"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Row 2 — Subscribe left, socials right */}
        <div className="flex flex-col md:flex-row justify-between items-start mt-20">
          <motion.a
            variants={footerItem}
            href="#"
            className="flex items-center gap-1 w-fit text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#60646c] [font-family:var(--figma-font-text)] hover:opacity-70 transition-opacity underline underline-offset-4 decoration-[rgba(0,0,0,0.2)]"
          >
            Subscribe to newsletter
            <RiArrowRightSLine size={16} aria-hidden="true" />
          </motion.a>

          <motion.div
            variants={footerItem}
            className="flex items-center gap-4 mt-4 md:mt-0"
          >
            {SOCIAL_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                className="flex items-center justify-center h-8 px-2 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity rounded-md"
              >
                {label}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Row 3 — Copyright left */}
        <motion.p
          variants={footerItem}
          className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) [font-family:var(--figma-font-text)] mt-6"
        >
          &copy; Arkive 2026
        </motion.p>
      </motion.div>
    </footer>
  );
}
