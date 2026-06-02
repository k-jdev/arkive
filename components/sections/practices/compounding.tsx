"use client";

import Image from "next/image";
import compoundingImg from "@/public/sections/compounding/compounding.png";


export default function PracticesCompounding() {
    return (
        <section className="w-full py-[60px] md:py-[180px]">
            <div className="max-w-[1440px] mx-auto px-[clamp(16px,4.17vw,80px)]">
                <div className="rounded-[24px] overflow-hidden bg-[#F9F9FB] flex flex-col lg:flex-row lg:h-[580px]">

                    {/* ── Left: image (Figma: x:0 y:0 w:769 h:580 = 60% of card) ── */}
                    <div
                        className="relative h-[300px] lg:h-auto shrink-0"
                        style={{ flexBasis: "60%" }}
                    >
                        <Image
                            src={compoundingImg}
                            alt="Person holding phone with Arkive app"
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority
                        />
                    </div>

                    {/* ── Right: text (Figma: x:827 y:244 w:348, vertically centred) ── */}
                    {/* Right panel = 512px wide. Text: pl=58px, pr=106px (from Figma x/w) */}
                    <div className="flex-1 flex items-center px-10 py-12 lg:py-0 lg:pl-[58px] lg:pr-[106px]">
                        <p
                            className="font-[510] [font-family:var(--figma-font-text)] text-[clamp(20px,1.94vw,28px)] leading-[1.286] tracking-[-0.43%]"
                            style={{ color: "rgba(0, 5, 9, 0.89)" }}
                        >
                            {/* Figma ts1: fill #0022FF */}
                            <span style={{ color: "#0022FF" }}>Compounding intelligence, </span>
                            built into whatever matters most for you.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
