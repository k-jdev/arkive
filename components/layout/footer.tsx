"use client";

import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { footerContainer, footerItem } from "@/lib/animations";
import { LOGO_COLORS } from "@/public/icons";
import Image from "next/image";

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
  const linkTextClass =
    "flex items-center h-8 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity";

  return (
    <footer className="w-full bg-[#f9f9fb]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={footerContainer}
        className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)] pt-[32px] pb-16 md:py-20"
      >
        {/* ── Mobile layout (per Figma 390px frame) ── */}
        <div className="md:hidden flex flex-col">
          {/* Logo */}
          <motion.div variants={footerItem} className="mb-[18px]">
            <Image
              src={LOGO_COLORS.logo}
              alt=""
              width={70}
              height={56}
              loading="lazy"
              sizes="70px"
              aria-hidden="true"
              draggable={false}
              className="object-contain w-[70px] h-[56px]"
            />
          </motion.div>

          {/* Subscribe */}
          <motion.a
            variants={footerItem}
            href="#"
            className="flex items-center gap-1 w-fit h-8 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#60646c] [font-family:var(--figma-font-text)] hover:opacity-70 transition-opacity underline underline-offset-4 decoration-[rgba(0,0,0,0.2)] mb-[26px]"
          >
            Subscribe to newsletter
            <RiArrowRightSLine size={16} aria-hidden="true" />
          </motion.a>

          {/* Arkive + Product columns (side by side) */}
          <div className="grid grid-cols-2 gap-x-4 mb-[36px]">
            {LINK_GROUPS.slice(0, 2).map((group) => (
              <motion.div
                key={group.title}
                variants={footerItem}
                className="flex flex-col gap-4"
              >
                <h3 className="font-[510] text-[20px] leading-7 tracking-[-0.08px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]">
                  {group.title}
                </h3>
                <ul className="flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkTextClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Resources + Social links + Copyright (side by side) */}
          <div className="flex gap-4 mb-[49px]">
            <div className="w-[calc(50%-8px)] shrink-0">
              <motion.div variants={footerItem} className="flex flex-col gap-4">
                <h3 className="font-[510] text-[20px] leading-7 tracking-[-0.08px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]">
                  Resources
                </h3>
                <ul className="flex flex-col">
                  {LINK_GROUPS[2].links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkTextClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <div className="flex flex-col gap-4">
              <motion.div variants={footerItem} className="flex flex-col gap-4">
                <h3
                  className="font-[510] text-[20px] leading-7 tracking-[-0.08px] opacity-0 pointer-events-none select-none [font-family:var(--figma-font-text)]"
                  aria-hidden="true"
                >
                  Social
                </h3>
                <ul className="flex flex-col">
                  {SOCIAL_LINKS.map((label) => (
                    <li key={label}>
                      <a href="#" className={linkTextClass}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <p className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) [font-family:var(--figma-font-text)] mt-[25px]">
                &copy; Arkive 2026
              </p>
            </div>
          </div>
        </div>

        {/* ── Desktop layout (unchanged) ── */}
        <div className="hidden md:block">
          {/* Row 1 — Logo left, columns right */}
          <div className="flex flex-row justify-between gap-16">
            <motion.div variants={footerItem}>
              <Image
                src={LOGO_COLORS.logo}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                sizes="36px"
                aria-hidden="true"
                draggable={false}
              />
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
                  className="flex flex-col gap-4 w-47.5"
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

          {/* Row 2 — Subscribe left */}
          <div className="mt-20">
            <motion.a
              variants={footerItem}
              href="#"
              className="flex items-center gap-1 w-fit text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#60646c] [font-family:var(--figma-font-text)] hover:opacity-70 transition-opacity underline underline-offset-4 decoration-[rgba(0,0,0,0.2)]"
            >
              Subscribe to newsletter
              <RiArrowRightSLine size={16} aria-hidden="true" />
            </motion.a>
          </div>

          {/* Row 3 — Copyright left, Socials right */}
          <motion.div
            variants={footerItem}
            className="flex flex-row justify-between items-center gap-16 mt-6"
          >
            <p className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) [font-family:var(--figma-font-text)]">
              &copy; Arkive 2026
            </p>

            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-(--figma-neutral-12) [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
