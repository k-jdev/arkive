"use client";

import { motion } from "motion/react";
import GraphBackground from "./graph-background";

export default function PracticesHero() {
    return (
        <section
            data-header-theme="dark"
            className="relative w-full min-h-[100svh] bg-black overflow-hidden flex flex-col justify-center items-center"
        >
            <GraphBackground />

            <motion.div
                className="relative z-10 flex flex-col items-center gap-6 pointer-events-none text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <p className="font-[590] text-[20px] leading-[28px] tracking-[-0.4%] text-white [font-family:var(--figma-font-text)]">
                    Practices
                </p>
                <h1 className="font-[590] text-[clamp(40px,5vw,60px)] leading-[0.9] tracking-[-0.67%] text-white [font-family:var(--figma-font-text)] whitespace-pre-line">
                    {"Better outcomes\nin any domain."}
                </h1>
            </motion.div>
        </section>
    );
}
