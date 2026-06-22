"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import {
  heroContainer,
  heroFadeUp,
  heroFadeUpSmall,
  heroImageReveal,
  heroDarkEnter,
  safeFade,
  safeContainer,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";
import { useNewsletterModal } from "@/components/providers/newsletter-modal-provider";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const reduced = usePrefersReducedMotion();
  const { openModal } = useNewsletterModal();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (reduced || isMobile) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, isMobile]);

  const FADE_RANGE = 500;
  const progress = reduced || isMobile ? 1 : Math.min(1, scrollY / FADE_RANGE);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const p = easeOutCubic(progress);

  return (
    <div ref={sectionRef} className="relative w-full overflow-x-hidden">
      <section
        data-header-theme="light"
        className="relative w-full min-h-svh flex flex-col items-center justify-start pt-[calc(54px+20vh)] md:pt-[calc(54px+18vh)] bg-white px-4"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={reduced ? safeContainer : heroContainer}
          className="flex flex-col items-center gap-4 md:gap-6 text-center w-[92vw] md:w-[min(65vw,1200px)]"
          style={{
            opacity: reduced || isMobile ? 1 : Math.max(0, 1 - p * 2),
            transform:
              reduced || isMobile ? undefined : `translateY(${-p * 50}px)`,
          }}
        >
          <motion.h1
            variants={reduced ? safeFade : heroFadeUp}
            className="w-full text-center font-[590] text-[48px] md:text-[clamp(48px,5.5vw,72px)] leading-[0.9] tracking-[-0.4px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]"
          >
            The universal language
            <span className="hidden md:inline">
              <br />
            </span>{" "}
            for AI context.
          </motion.h1>

          <motion.div
            variants={reduced ? safeFade : heroFadeUpSmall}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <motion.button
              variants={reduced ? safeFade : heroFadeUpSmall}
              type="button"
              onClick={openModal}
              className="flex items-center justify-center h-10 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 px-(--figma-spacing-4) gap-(--figma-spacing-3) text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-12) text-(--figma-neutral-1) font-normal [font-family:var(--figma-font-text)]"
            >
              Coming soon
            </motion.button>

            <Link href="/project-defi">
              <motion.button
                variants={reduced ? safeFade : heroFadeUpSmall}
                type="button"
                className="flex items-center justify-center h-10 rounded-full transition-colors hover:bg-[rgba(0,0,51,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-[rgba(0,0,51,0.06)] text-(--figma-neutral-12) font-normal [font-family:var(--figma-font-text)]"
              >
                Project DeFi
                <RiArrowRightSLine size={18} aria-hidden="true" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={reduced ? safeFade : heroImageReveal}
        className="absolute pointer-events-none top-[calc(100svh-clamp(200px,30svh,340px))] left-1/2 w-screen md:w-[min(65vw,1200px)] z-10"
        style={{
          x: "-50%",
          y: reduced || isMobile ? 0 : p * 80,
        }}
      >
        <img
          src="/sections/hero/hero-main.png"
          alt="Arkive app view"
          width={860}
          height={553}
          decoding="sync"
          className="hidden md:block w-full h-auto rounded-xl shadow-2xl"
          draggable={false}
        />
        <img
          src="/sections/hero/hero-mobile.png"
          alt="Arkive app view"
          width={390}
          height={844}
          decoding="sync"
          className="block md:hidden w-full h-auto  scale-100  origin-top-left -mt-[10svh] "
          draggable={false}
        />
      </motion.div>

      <section
        data-header-theme="dark"
        className="relative w-full h-[clamp(100svh,80svh+60vw,150svh)] md:h-[clamp(100svh,60svh+35vw,160svh)] bg-white overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-[#0A0A0A] overflow-hidden"
          style={{
            clipPath: reduced
              ? "inset(0 0% 0 0% round 0px)"
              : `inset(0 ${25 * (1 - p)}% 0 ${25 * (1 - p)}% round ${48 * Math.max(0, 1 - Math.pow(p, 8))}px)`,
          }}
        >
          <div className="hidden md:block">
            <HeroCanvas />
          </div>
          <div className="block md:hidden absolute inset-0 bg-[#000000]" />
        </motion.div>

        <motion.div
          className="absolute   inset-0 pointer-events-none flex flex-col items-start md:items-start pt-[calc(41.8vw--30vw)] md:pt-[calc(41.8vw-clamp(200px,30svh,340px)+100px)] px-4 md:px-0 md:pl-[17.5vw]"
          style={{
            opacity: reduced ? 1 : Math.max(0, (p - 0.7) / 0.3),
            transform: reduced
              ? undefined
              : `translateY(${(1 - Math.max(0, (p - 0.7) / 0.3)) * 32}px)`,
          }}
        >
          <motion.p
            initial={isMobile ? "visible" : "hidden"}
            whileInView={reduced || isMobile ? undefined : "visible"}
            viewport={{ once: true, margin: "-100px" }}
            variants={reduced ? safeFade : heroDarkEnter}
            className="w-[92vw] md:w-[min(65vw,1200px)] md:max-w-[min(65vw,1200px)] text-white font-normal [font-family:var(--figma-font-text)] tracking-[-0.4px] text-[35px] md:text-[clamp(18px,5vw,48px)]"
            style={{ lineHeight: 1.15 }}
          >
            The future of AI is one where context is owned, compounding and
            portable across models. Arkive makes this possible.
          </motion.p>

          <motion.div
            initial={isMobile ? "visible" : "hidden"}
            whileInView={reduced || isMobile ? undefined : "visible"}
            viewport={{ once: true, margin: "-100px" }}
            variants={reduced ? safeFade : heroDarkEnter}
            className="w-[92vw] md:w-[min(65vw,1200px)] mt-16 md:mt-[clamp(120px,15vw,280px)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="37"
              viewBox="0 0 56 37"
              fill="none"
              aria-hidden="true"
              className="w-[64px] h-[42px] md:w-[56px] md:h-[37px]"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M36.3438 17.4668H55.0987V36.4668H36.0977V17.6309C25.8588 17.7182 17.586 26.0649 17.586 36.3496C17.586 36.3776 17.5858 36.4057 17.586 36.4336H2.78234e-05C-3.51542e-05 36.4057 2.85766e-05 36.3776 2.78234e-05 36.3496C3.19241e-05 16.2743 16.2339 9.3563e-05 36.2598 2.82152e-05C36.2878 2.82745e-05 36.3158 -3.52987e-05 36.3438 2.82152e-05V17.4668Z"
                fill="white"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
