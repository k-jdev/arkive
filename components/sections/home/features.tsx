"use client";

import Image from "next/image";
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
  imageSrc: string;
  imageSrcMobile?: string;
  imageAlt: string;
  imageLeft?: boolean;
}

function FeatureBlock({
  label,
  heading,
  description,
  buttonLabel,
  imageSrc,
  imageSrcMobile,
  imageAlt,
  imageLeft = false,
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

      <motion.button
        type="button"
        aria-label={`${buttonLabel}: ${heading}`}
        className="flex items-center justify-center h-10 rounded-full w-fit transition-colors hover:bg-[rgba(0,0,51,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) font-medium [font-family:var(--figma-font-text)]"
      >
        {buttonLabel}
        <RiArrowRightSLine size={18} aria-hidden="true" />
      </motion.button>
    </motion.div>
  );

  const imageCol = (
    <motion.div
      variants={reduced ? safeFade : featuresImage}
      className="relative w-full md:w-[58%] shrink-0 rounded-2xl overflow-hidden"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={702}
        height={450}
        loading="lazy"
        sizes="(min-width: 768px) 58vw, 100vw"
        className="hidden md:block w-full h-auto"
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
        />
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
      {/* on mobile: text always first, image below; on desktop: respect imageLeft */}
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

export default function Features() {
  return (
    <section
      data-header-theme="light"
      className="w-full bg-white flex flex-col gap-12 md:gap-24 px-4 md:px-20 py-24 md:py-32 items-center"
    >
      <FeatureBlock
        label="Arkives"
        heading="Portable knowledge trees understood by all models."
        description="An Arkive is a portable knowledge tree. It connects to any AI, compounding context and user memory across models."
        buttonLabel="Learn more"
        imageSrc="/sections/arkives/card.png"
        imageSrcMobile="/sections/practices/mobile/arkive-mobile.png"
        imageAlt="Arkive — portable knowledge tree UI"
        imageLeft={false}
      />

      <FeatureBlock
        label="Practices"
        heading="Extend an Arkive into any domain."
        description="Whether it's trading, research, writing, or anything else, a practice connects to an Arkive's core, adapting it to that domain."
        buttonLabel="Explore Practices"
        imageSrc="/sections/practices/card.png"
        imageSrcMobile="/sections/practices/mobile/practices-mobile.png"
        imageAlt="Practices — domain-specific Arkive extension"
        imageLeft={true}
      />
    </section>
  );
}
