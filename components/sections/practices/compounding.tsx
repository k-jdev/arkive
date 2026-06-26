"use client";

import Image from "next/image";
import { motion } from "motion/react";
import compoundingImg from "@/public/sections/compounding/compounding.png";
import mobileCompoundingImg from "@/public/sections/compounding/mobileCompounding.png";
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
          className="rounded-[24px] overflow-hidden bg-[#F9F9FB] flex flex-col lg:flex-row lg:min-h-[580px]"
        >
          {/* ── Mobile: text on top, image bleeds below ── */}
          <div className="block lg:hidden px-[38px] pt-[38px] pb-10">
            <p className="font-[510] text-[#60646C] [font-family:var(--figma-font-text)] text-[clamp(20px,1.94vw,28px)] leading-[1.286] tracking-[-0.43%]">
              <span>Practices are collaborative.</span>
              They can be shared across users in real time.
            </p>
          </div>

          <div className="block lg:hidden w-full overflow-hidden">
            <Image
              src={mobileCompoundingImg}
              alt="Person holding phone with Arkive app"
              className="w-full h-auto block"
              priority
              draggable={false}
            />
          </div>

          {/* ── Desktop: image left, text right ── */}
          <div className="hidden lg:flex shrink-0">
            <Image
              src={compoundingImg}
              alt="Person holding phone with Arkive app"
              className="h-[580px] w-auto max-w-none object-scale-down object-left"
              priority
              draggable={false}
            />
          </div>

          <div className="hidden lg:flex items-center px-10 pb-20 lg:py-0 ">
            <p className="font-[510] text-[#60646C] [font-family:var(--figma-font-text)] text-[clamp(20px,1.94vw,28px)] leading-[1.286] tracking-[-0.43%]">
              Practices are collaborative. <br /> They can be shared across{" "}
              <br />
              users in real time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
