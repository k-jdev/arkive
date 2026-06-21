"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open) return;

    // compensate scrollbar width before hiding it to avoid layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-compensation",
      `${scrollbarWidth}px`,
    );
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.documentElement.style.removeProperty("--scrollbar-compensation");
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[10px] md:px-10"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-modal-title"
        className="relative flex w-full max-w-[1281px] flex-col overflow-hidden rounded-[24px] bg-[#F9F9FB] max-h-[90vh] md:h-[clamp(360px,40vw,550px)] md:max-h-none md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile image (top, full-bleed) */}
        <div className="relative block aspect-[716/551] w-full shrink-0 md:hidden">
          <Image
            src="/sections/modal/mobile-card.png"
            alt=""
            fill
            className="object-cover object-center"
            aria-hidden="true"
            priority
          />
        </div>

        {/* Desktop image (left) */}
        <div className="relative hidden w-[54.6%] shrink-0 md:block">
          <Image
            src="/sections/modal/card.png"
            alt=""
            fill
            className="object-cover object-left-top"
            aria-hidden="true"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center gap-6 px-6 pb-8 pt-4 text-center md:px-0 md:py-10 md:pl-[clamp(32px,4.7vw,60px)] md:pr-[clamp(24px,7.7vw,99px)] md:text-left">
          {/* Label + heading */}
          <div className="flex flex-col gap-2">
            <p className="font-[590] text-[16px] leading-[28px] tracking-[-0.005em] text-(--figma-accent-9) md:text-[20px] md:tracking-[-0.004em] [font-family:var(--figma-font-text)]">
              Coming soon
            </p>
            <h2
              id="newsletter-modal-title"
              className="font-[590] text-[35px] leading-[0.9] tracking-[-0.0114em] text-(--figma-neutral-12) md:text-[clamp(28px,3.3vw,48px)] md:tracking-[-0.0083em] [font-family:var(--figma-font-text)]"
            >
              Subscribe to Arkive news &amp; updates.
            </h2>
          </div>

          {/* Email row (stacked on mobile) */}
          <div className="flex w-full flex-col items-start gap-4 self-stretch md:flex-row md:items-stretch md:gap-4">
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              className="h-10 w-full min-w-0 appearance-none self-stretch rounded-[9px] border border-[rgba(0,9,50,0.12)] bg-transparent px-4 font-normal text-[16px] leading-6 text-[rgba(0,5,9,0.89)] outline-none placeholder:text-[rgba(0,5,29,0.45)] focus-visible:ring-2 focus-visible:ring-black/20 md:flex-1 md:bg-white/90 [font-family:var(--figma-font-text)]"
            />
            <button
              type="button"
              className="flex h-10 w-full shrink-0 items-center justify-center self-stretch rounded-[9px] bg-(--figma-neutral-12) px-4 font-[510] text-[16px] leading-6 text-(--figma-neutral-1) transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 md:w-auto [font-family:var(--figma-font-text)]"
            >
              Subscribe
            </button>
          </div>

          {/* Privacy */}
          <p className="mx-auto max-w-[249px] font-[510] text-[12px] leading-4 tracking-[0.0033em] text-(--figma-neutral-alpha-10) md:mx-0 md:max-w-none [font-family:var(--figma-font-text)]">
            By signing up, you agree to{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Terms of Use.
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
