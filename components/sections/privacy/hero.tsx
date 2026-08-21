"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/animations";

export default function PrivacyHero() {
  return (
    <section data-header-theme="dark" className="w-full bg-black">
      <div className="max-w-360 mx-auto px-[clamp(16px,4.17vw,80px)]">
        <div className="flex flex-col items-center py-[clamp(80px,10vw,133px)] ">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-[40px] md:text-[60px] leading-tight tracking-[-0.4px] font-medium text-[#edeef0] text-center max-w-[767px]"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mt-2 text-(length:--figma-font-size-3) leading-(--figma-line-height-3) text-[#696e77] text-center"
          >
            Last updated: May 2026
          </motion.p>
        </div>
      </div>
    </section>
  );
}
