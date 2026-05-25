import Image from "next/image";
import { RiArrowRightSLine } from "@remixicon/react";

interface FeatureBlockProps {
  label: string;
  heading: string;
  description: string;
  buttonLabel: string;
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
}

function FeatureBlock({
  label,
  heading,
  description,
  buttonLabel,
  imageSrc,
  imageAlt,
  imageLeft = false,
}: FeatureBlockProps) {
  const textCol = (
    <div className="flex flex-col gap-5 justify-center flex-1 min-w-0">
      {/* Label */}
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

      {/* Heading + description */}
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

      {/* Button */}
      <button
        type="button"
        className="flex items-center justify-center h-10 rounded-full w-fit transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 px-(--figma-spacing-4) gap-1 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) tracking-(--figma-letter-spacing-3) bg-(--figma-neutral-alpha-3) text-(--figma-neutral-12) font-medium [font-family:var(--figma-font-text)]"
      >
        {buttonLabel}
        <RiArrowRightSLine size={18} aria-hidden="true" />
      </button>
    </div>
  );

  const imageCol = (
    <div className="relative w-[58%] shrink-0 rounded-2xl overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={702}
        height={450}
        className="w-full h-auto"
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row items-center gap-16 w-full max-w-[1280px] mx-auto">
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
  );
}

export default function Features() {
  return (
    <section className="w-full bg-white flex flex-col gap-16 px-20 py-16 items-center">
      <FeatureBlock
        label="Arkives"
        heading="Portable knowledge trees understood by all models."
        description="An Arkive is a portable knowledge tree. It connects to any AI, compounding context and user memory across models."
        buttonLabel="Learn more"
        imageSrc="/sections/arkives/card.png"
        imageAlt="Arkive — portable knowledge tree UI"
        imageLeft={false}
      />

      <FeatureBlock
        label="Practices"
        heading="Extend an Arkive into any domain."
        description="Whether it's trading, research, writing, or anything else, a practice connects to an Arkive's core, adapting it to that domain."
        buttonLabel="Explore Practices"
        imageSrc="/sections/practices/card.png"
        imageAlt="Practices — domain-specific Arkive extension"
        imageLeft={true}
      />
    </section>
  );
}
