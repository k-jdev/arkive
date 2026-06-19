"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import {
  featuresContainer,
  featuresBlock,
  featuresImage,
  safeFade,
  safeContainer,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";

interface FeatureBlockProps {
  label: string;
  heading: string;
  description: string;
  buttonLabel: string;
  href: string;
  imageSrc: string;
  imageSrcMobile?: string;
  imageAlt: string;
  imageLeft?: boolean;
  imageOverlay?: React.ReactNode;
}

function FeatureBlock({
  label,
  heading,
  description,
  buttonLabel,
  href,
  imageSrc,
  imageSrcMobile,
  imageAlt,
  imageLeft = false,
  imageOverlay,
}: FeatureBlockProps) {
  const reduced = usePrefersReducedMotion();

  const textCol = (
    <motion.div
      variants={reduced ? safeFade : featuresBlock}
      className="flex flex-col gap-5 justify-center flex-1 min-w-0"
    >
      <p
        className="font-[590] text-(--figma-accent-9) [font-family:var(--figma-font-text)]"
        style={{
          fontSize: "var(--figma-font-size-5)",
          lineHeight: "var(--figma-line-height-5)",
          letterSpacing: "var(--figma-letter-spacing-5)",
        }}
      >
        {label}
      </p>

      <div className="flex flex-col gap-5">
        <h2
          className="font-[590] tracking-[-0.4px] text-(--figma-neutral-12) [font-family:var(--figma-font-text)]"
          style={{ fontSize: "clamp(32px, 3.3vw, 48px)", lineHeight: 0.9 }}
        >
          {heading}
        </h2>
        <p
          className="font-regular text-(--figma-neutral-alpha-10) [font-family:var(--figma-font-text)]"
          style={{
            fontSize: "var(--figma-font-size-3)",
            lineHeight: "var(--figma-line-height-3)",
            letterSpacing: "var(--figma-letter-spacing-3)",
          }}
        >
          {description}
        </p>
      </div>

      <Link href={href}>
        <motion.button
          type="button"
          aria-label={`${buttonLabel}: ${heading}`}
          className="flex items-center justify-center h-10 rounded-full w-fit transition-colors hover:bg-[rgba(0,0,51,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) font-medium [font-family:var(--figma-font-text)]"
        >
          {buttonLabel}
          <RiArrowRightSLine size={18} aria-hidden="true" />
        </motion.button>
      </Link>
    </motion.div>
  );

  const imageCol = (
    <motion.div
      variants={reduced ? safeFade : featuresImage}
      className={`relative w-full md:w-[58%] shrink-0 rounded-3xl ${imageOverlay ? "" : "overflow-hidden"}`}
    >
      <div className={imageOverlay ? "overflow-hidden rounded-3xl" : ""}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={702}
          height={450}
          loading="lazy"
          sizes="(min-width: 768px) 58vw, 100vw"
          className={`${imageSrcMobile ? "hidden md:block" : "block"} w-full h-auto`}
          draggable={false}
        />
        {imageSrcMobile && (
          <Image
            src={imageSrcMobile}
            alt={imageAlt}
            width={390}
            height={844}
            loading="lazy"
            sizes="100vw"
            className="block md:hidden w-full h-auto"
            draggable={false}
          />
        )}
      </div>
      {imageOverlay && (
        <div className="hidden md:flex absolute inset-0 items-center justify-center z-10 p-4">
          {imageOverlay}
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={reduced ? safeContainer : featuresContainer}
      className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full max-w-7xl mx-auto"
    >
      <div className="contents md:hidden">
        {textCol}
        {imageCol}
      </div>
      <div className="hidden md:contents">
        {imageLeft ? (
          <>
            {imageCol}
            {textCol}
          </>
        ) : (
          <>
            {textCol}
            {imageCol}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function DefiFeatures() {
  return (
    <section
      data-header-theme="light"
      className="w-full bg-white flex flex-col gap-12 md:gap-24 px-4 md:px-20 py-24 md:py-32 items-center"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      <FeatureBlock
        label="Frontier AI"
        heading="Project DeFi is Arkive's first core practice."
        description="Whether it's trading, research, writing, or anything else, a practice connects to an Arkive's core, adapting it to that domain."
        buttonLabel="Get started"
        href="/arkives"
        imageSrc="/sections/defiFeatures/card1.png"
        imageSrcMobile="/sections/defiFeatures/card1Mobile.png"
        imageAlt="Project DeFi is Arkive's first core practice"
        imageLeft={false}
      />

      <FeatureBlock
        label="Secure Signing"
        heading="Stay in control of every AI transaction."
        description="A secure layer for your AI to interact with financial markets. You sign every transaction — nothing goes through without your approval."
        buttonLabel="Go to security"
        href="/project-defi"
        imageSrc="/sections/defiFeatures/card2.png"
        imageSrcMobile="/sections/defiFeatures/card2Mobile.png"
        imageAlt="Stay in control of every AI transaction"
        imageLeft={true}
      />
    </section>
  );
}
