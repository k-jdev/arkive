"use client";

import { motion } from "motion/react";
import type { SVGProps } from "react";
import { footerContainer, footerItem } from "@/lib/animations";
import { LOGO_COLORS } from "@/public/icons";
import Image from "next/image";
import Link from "next/link";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Arkive",
    links: [
      { label: "Home", href: "/" },
      { label: "Arkives", href: "/arkives" },
      { label: "Practices", href: "/practices" },
      { label: "Project DeFi", href: "/project-defi" },
      { label: "Get started", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "https://docs.arkive.xyz/" },
      { label: "Pitch deck", href: "/deck" },
      { label: "FAQs", href: "/#faq" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "Brand kit", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "X / Twitter", href: "https://x.com/arkivexyz" },
      { label: "Telegram", href: "https://t.me/arkivexyz" },
      { label: "Email", href: "mailto:contact@arkive.xyz" },
      { label: "Support", href: "https://t.me/arkivexyz" },
      { label: "Enterprise inquiries", href: "mailto:team@arkive.xyz" },
    ],
  },
];

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <g clipPath="url(#x-clip)">
        <mask
          id="x-mask"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={18}
          height={18}
        >
          <path d="M0 0H18V18H0V0Z" fill="white" />
        </mask>
        <g mask="url(#x-mask)">
          <path
            d="M13.6 2H16.0537L10.6937 7.9297L17 16H12.0629L8.19314 11.1064L3.77029 16H1.31429L7.04686 9.65542L1 2.0011H6.06286L9.55543 6.4732L13.6 2ZM12.7371 14.5788H14.0971L5.32 3.34726H3.86171L12.7371 14.5788Z"
            fill="#1C2024"
          />
        </g>
      </g>
      <defs>
        <clipPath id="x-clip">
          <rect width={18} height={18} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M15.5326 2.74088C15.5326 2.74088 16.9895 2.17276 16.8676 3.55238C16.8275 4.12051 16.4634 6.10913 16.1799 8.25976L15.2086 14.631C15.2086 14.631 15.1276 15.5644 14.399 15.7268C13.6707 15.8888 12.578 15.1586 12.3755 14.9963C12.2135 14.8744 9.34023 13.0481 8.32849 12.1556C8.04498 11.9119 7.72098 11.4251 8.36899 10.857L12.6185 6.79876C13.1041 6.31126 13.5897 5.17501 11.5662 6.55501L5.89999 10.41C5.89999 10.41 5.25236 10.8161 4.03849 10.4509L1.40749 9.63901C1.40749 9.63901 0.436235 9.03038 2.09561 8.42176C6.14299 6.51451 11.1211 4.56676 15.5322 2.74051"
        fill="#1C2024"
      />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M9 1.5C8.01509 1.5 7.03982 1.69399 6.12987 2.0709C5.21993 2.44781 4.39314 3.00026 3.6967 3.6967C2.29018 5.10322 1.5 7.01088 1.5 9C1.5 12.315 3.6525 15.1275 6.63 16.125C7.005 16.185 7.125 15.9525 7.125 15.75V14.4825C5.0475 14.9325 4.605 13.4775 4.605 13.4775C4.26 12.6075 3.7725 12.375 3.7725 12.375C3.09 11.91 3.825 11.925 3.825 11.925C4.575 11.9775 4.9725 12.6975 4.9725 12.6975C5.625 13.8375 6.7275 13.5 7.155 13.32C7.2225 12.8325 7.4175 12.5025 7.6275 12.315C5.9625 12.1275 4.215 11.4825 4.215 8.625C4.215 7.7925 4.5 7.125 4.9875 6.5925C4.9125 6.405 4.65 5.625 5.0625 4.6125C5.0625 4.6125 5.6925 4.41 7.125 5.3775C7.7175 5.2125 8.3625 5.13 9 5.13C9.6375 5.13 10.2825 5.2125 10.875 5.3775C12.3075 4.41 12.9375 4.6125 12.9375 4.6125C13.35 5.625 13.0875 6.405 13.0125 6.5925C13.5 7.125 13.785 7.7925 13.785 8.625C13.785 11.49 12.03 12.12 10.3575 12.3075C10.6275 12.54 10.875 12.9975 10.875 13.695V15.75C10.875 15.9525 10.995 16.1925 11.3775 16.125C14.355 15.12 16.5 12.315 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98491 1.5 9 1.5Z"
        fill="#1C2024"
      />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { label: "X / Twitter", icon: XIcon, href: "https://x.com/arkivexyz" },
  { label: "Telegram", icon: TelegramIcon, href: "https://t.me/arkivexyz" },
  { label: "GitHub", icon: GitHubIcon, href: "https://github.com/" },
];

export default function Footer() {
  const linkTextClass =
    "flex items-center h-8 text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#60646c] [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity whitespace-nowrap";

  const columnHeadingClass =
    "font-[510] text-[20px] leading-7 tracking-[-0.08px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]";

  return (
    <footer className="w-full bg-[#f9f9fb]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={footerContainer}
        className="max-w-360 mx-auto px-[clamp(16px,4.17vw,80px)] py-[clamp(32px,4.17vw,72px)]"
      >
        <div className="hidden md:flex flex-col gap-21.5">
          <div className="flex flex-row justify-between">
            <motion.div
              variants={footerItem}
              className="flex flex-col gap-[24.4px]"
            >
              <Image
                src={LOGO_COLORS.logo}
                alt="Arkive"
                width={54}
                height={43}
                loading="lazy"
                sizes="54px"
                draggable={false}
                className="object-contain w-13.5 h-10.75"
              />

              <div className="flex items-center gap-4">
                {SOCIAL_ICONS.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center size-10 rounded-full bg-(--figma-neutral-alpha-3) hover:opacity-70 transition-opacity"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ))}
              </div>
            </motion.div>

            <nav aria-label="Footer navigation" className="flex gap-10">
              {LINK_GROUPS.map((group) => (
                <motion.div
                  key={group.title}
                  variants={footerItem}
                  className="flex flex-col gap-4 w-47.5"
                >
                  <h3 className={columnHeadingClass}>{group.title}</h3>
                  <ul className="flex flex-col">
                    {group.links.map((link) => {
                      const isInternal =
                        link.href.startsWith("/") && link.href !== "#";
                      const Tag = isInternal ? Link : "a";

                      return (
                        <li key={link.label}>
                          <Tag
                            href={link.href}
                            target={isInternal ? undefined : "_blank"}
                            rel={isInternal ? undefined : "noopener noreferrer"}
                            className={linkTextClass}
                          >
                            {link.label}
                          </Tag>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="flex flex-row justify-between items-center">
            <motion.div variants={footerItem}>
              <p className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#8b8d98] [font-family:var(--figma-font-text)] whitespace-nowrap">
                &copy; Arkive 2026. All rights reserved.
              </p>
            </motion.div>

            <motion.div
              variants={footerItem}
              className="flex gap-10"
              role="presentation"
            >
              <div className="w-47.5 flex items-center gap-8">
                <Link
                  href="/privacy"
                  className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#80838d] [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity whitespace-nowrap"
                >
                  Privacy policy
                </Link>
                <Link
                  href="/terms"
                  className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#80838d] [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity whitespace-nowrap"
                >
                  Terms of service
                </Link>
                <Link
                  href="/litepaper"
                  className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#80838d] [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity whitespace-nowrap"
                >
                  Litepaper
                </Link>
              </div>
              <div className="w-47.5" aria-hidden="true" />
              <div className="w-47.5" aria-hidden="true" />
            </motion.div>
          </div>
        </div>

        <div className="md:hidden flex flex-col">
          <motion.div variants={footerItem} className="mb-6">
            <Image
              src={LOGO_COLORS.logo}
              alt="Arkive"
              width={54}
              height={43}
              loading="lazy"
              sizes="54px"
              draggable={false}
              className="object-contain w-13.5 h-10.75"
            />
          </motion.div>

          <motion.div
            variants={footerItem}
            className="flex items-center gap-4 mb-10"
          >
            {SOCIAL_ICONS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center size-10 rounded-full bg-(--figma-neutral-alpha-3) hover:opacity-70 transition-opacity"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 gap-x-4 mb-12">
            {LINK_GROUPS.slice(0, 2).map((group) => (
              <motion.div
                key={group.title}
                variants={footerItem}
                className="flex flex-col gap-4"
              >
                <h3 className={columnHeadingClass}>{group.title}</h3>
                <ul className="flex flex-col">
                  {group.links.map((link) => {
                    const isInternal =
                      link.href.startsWith("/") && link.href !== "#";
                    const Tag = isInternal ? Link : "a";

                    return (
                      <li key={link.label}>
                        <Tag
                          href={link.href}
                          target={isInternal ? undefined : "_blank"}
                          rel={isInternal ? undefined : "noopener noreferrer"}
                          className={linkTextClass}
                        >
                          {link.label}
                        </Tag>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={footerItem}
            className="flex flex-col gap-4 mb-20"
          >
            <h3 className={columnHeadingClass}>Connect</h3>
            <ul className="flex flex-col">
              {LINK_GROUPS[2].links.map((link) => {
                const isInternal =
                  link.href.startsWith("/") && link.href !== "#";
                const Tag = isInternal ? Link : "a";

                return (
                  <li key={link.label}>
                    <Tag href={link.href} className={linkTextClass}>
                      {link.label}
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            variants={footerItem}
            className="flex items-center gap-8 mb-6"
          >
            <Link
              href="/privacy"
              className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#80838d] [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity whitespace-nowrap"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#80838d] [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity whitespace-nowrap"
            >
              Terms of service
            </Link>
            <Link
              href="/litepaper"
              className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#80838d] [font-family:var(--figma-font-text)] hover:opacity-60 transition-opacity whitespace-nowrap"
            >
              Litepaper
            </Link>
          </motion.div>

          <motion.div variants={footerItem}>
            <p className="text-(length:--figma-font-size-2) leading-(--figma-line-height-2) tracking-(--figma-letter-spacing-2) text-[#8b8d98] [font-family:var(--figma-font-text)] whitespace-nowrap">
              &copy; Arkive 2026. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
