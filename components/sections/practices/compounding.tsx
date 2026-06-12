"use client";

import Image from "next/image";
import { motion } from "motion/react";
import compoundingImg from "@/public/sections/compounding/compounding.png";
import { setupCard, safeFade } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/motion-config";

export default function PracticesCompounding() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="w-full py-[60px] md:py-[180px]">
      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)]">
        <motion.div
          initial="hidden"
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px" }}
          variants={reduced ? safeFade : setupCard}
          className="rounded-[24px] overflow-hidden bg-[#F9F9FB] flex flex-col lg:flex-row lg:h-[580px]"
        >
          {/* ── Mobile: text on top, image bleeds below ── */}
          <div className="block lg:hidden px-[38px] pt-[38px] pb-0">
            <p
              className="font-[510] [font-family:var(--figma-font-text)] text-[clamp(20px,1.94vw,28px)] leading-[1.286] tracking-[-0.43%]"
              style={{ color: "rgba(0, 5, 9, 0.89)" }}
            >
              <span style={{ color: "#0022FF" }}>
                Compounding intelligence,{" "}
              </span>
              built into whatever matters most for you.
            </p>
          </div>

          <div className="block lg:hidden w-full">
            <Image
              src={compoundingImg}
              alt="Person holding phone with Arkive app"
              className="w-full h-auto block"
              priority
              draggable={false}
            />
          </div>

          {/* ── Desktop: image left, text right ── */}
          <div
            className="hidden lg:block relative shrink-0"
            style={{ flexBasis: "60%", minHeight: 580 }}
          >
            <Image
              src={compoundingImg}
              alt="Person holding phone with Arkive app"
              fill
              className="object-cover object-center"
              sizes="60vw"
              priority
              draggable={false}
            />
          </div>

          <div className="hidden lg:flex flex-1 items-center lg:pl-[58px] lg:pr-[106px]">
            <p
              className="font-[510] [font-family:var(--figma-font-text)] text-[clamp(20px,1.94vw,28px)] leading-[1.286] tracking-[-0.43%]"
              style={{ color: "rgba(0, 5, 9, 0.89)" }}
            >
              <span style={{ color: "#0022FF" }}>
                Compounding intelligence,{" "}
              </span>
              built into whatever matters most for you.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
