"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import {
  claudeIcon,
  gptIcon,
  grokIcon,
  geminiIcon,
  downloadIcon,
  downloadCard,
} from "@/public/icons";
import {
  arkivesHeader,
  arkivesCardsContainer,
  arkivesCard,
} from "@/lib/animations";
import { RiAddFill } from "@remixicon/react";

const AI_AVATARS = [
  { icon: claudeIcon, alt: "Claude", z: 4, bg: "#d97757", delay: 0 },
  { icon: gptIcon, alt: "GPT", z: 3, bg: "#fff", delay: 0.1 },
  { icon: grokIcon, alt: "Grok", z: 2, bg: "#191919", delay: 0.2 },
  { icon: geminiIcon, alt: "Gemini", z: 1, bg: "#fff", delay: 0.3 },
];

function AvatarStack() {
  return (
    <div className="flex items-center">
      <div className="flex items-center isolate">
        {AI_AVATARS.map((a, i) => (
          <motion.div
            key={a.alt}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.35,
              delay: a.delay,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="overflow-hidden relative shrink-0"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: i < 3 ? -12.547 : 0,
              zIndex: a.z,
            }}
          >
            <Image
              src={a.icon}
              alt={a.alt}
              width={a.alt === "Gemini" ? 40.625 : 40}
              height={a.alt === "Gemini" ? 40.625 : 40}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              draggable={false}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative  ml-[-12.547px] size-[40px] rounded-full bg-[#F0F0F3] flex items-center justify-center opacity-50 shrink-0"
        >
          <RiAddFill className="text-[#000714] opacity-50" size={16} />
        </motion.div>
      </div>
    </div>
  );
}

function FlipCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const mobileBackOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);

  const childrenArray = Array.isArray(children) ? children : [children];
  const enhancedChildren = childrenArray.map((child, i) => {
    if (i === 1 && isMobile) {
      return (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ opacity: mobileBackOpacity }}
        >
          {child}
        </motion.div>
      );
    }
    return child;
  });

  return (
    <motion.div
      variants={arkivesCard}
      ref={ref}
      className="group w-full h-[280px] min-w-0"
    >
      <div className="relative w-full h-full">{enhancedChildren}</div>
    </motion.div>
  );
}

export default function ArkivesModels() {
  return (
    <section
      data-header-theme="white"
      className="w-full px-4 md:px-[80px] pb-16 md:pb-40"
    >
      <div className="max-w-[1440px] rounded-[24px] bg-[#f9f9fb] w-full mx-auto px-5 md:px-6 lg:px-[80px] xl:px-[144px] pt-[44px] pb-0 md:py-[60px] lg:py-[100px] flex flex-col gap-5 md:gap-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesHeader}
          className="flex items-center justify-center md:justify-between w-full"
        >
          <h2
            className="font-[590] text-[#1c2024] text-[35px] md:text-[clamp(32px,4vw,48px)] leading-[1.0] tracking-[-0.4px] text-center md:text-left"
            style={{
              fontFamily: "var(--figma-font-text)",
              fontVariationSettings: '"wdth" 100',
            }}
          >
            Designed as a standard.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesCardsContainer}
          className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full"
        >
          <FlipCard>
            <div className="absolute inset-0 bg-white rounded-[18px] overflow-hidden flex flex-col items-center justify-center gap-4 px-[55px] py-8">
              <div className="grid grid-cols-1 grid-rows-1 place-items-start leading-none relative">
                <div className="col-start-1 row-start-1 w-[188px] h-[92px] rounded-full border border-[#30a46c] opacity-10" />
                <div className="col-start-1 row-start-1 w-[170px] h-[78px] rounded-full border border-[#30a46c] opacity-[0.22] ml-[9px] mt-[7px]" />
                <div className="col-start-1 row-start-1 w-[152px] h-[62px] rounded-full border border-[#30a46c] opacity-40 ml-[18px] mt-[15px]" />

                <div className="col-start-1 row-start-1 ml-[27.33px] mt-[22.5px]">
                  <button
                    type="button"
                    className="relative flex items-center gap-[14.247px] h-[47.489px] px-[18.995px] rounded-full bg-[#30a46c] text-white text-[19px] font-[510] leading-[28.493px] tracking-normal"
                    style={{
                      fontFamily: "var(--figma-font-text)",
                      fontVariationSettings: '"wdth" 100',
                      filter: [
                        "drop-shadow(0px 54px 7.5px rgba(48,164,108,0))",
                        "drop-shadow(0px 34px 7px rgba(48,164,108,0.03))",
                        "drop-shadow(0px 19px 6px rgba(48,164,108,0.09))",
                        "drop-shadow(0px 9px 4.5px rgba(48,164,108,0.15))",
                        "drop-shadow(0px 2px 2.5px rgba(48,164,108,0.17))",
                      ].join(" "),
                    }}
                  >
                    <span className="relative z-10">Export</span>
                    <Image
                      src={downloadIcon}
                      alt=""
                      width={21.37}
                      height={21.37}
                      className="relative z-10 shrink-0"
                      draggable={false}
                    />
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        boxShadow:
                          "inset 3px 3px 4px 0px rgba(255,255,255,0.18), inset -3px -1px 4px 0px rgba(0,0,0,0.18)",
                      }}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-center w-full">
                <p
                  className="font-[590] text-[#1c2024] text-[36px] leading-[0.9] tracking-[-0.4px] w-full"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  Always yours
                </p>
                <p
                  className="font-[510] text-base leading-6 tracking-[0px] text-[rgba(0,7,27,0.5)] w-full"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  Portable by design
                </p>
              </div>
            </div>

            <div className="absolute inset-0 rounded-[18px] overflow-hidden xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-white/100 rounded-[18px] flex flex-col items-center justify-center gap-4 px-[55px] py-8 [filter:blur(17.5px)]">
                <div className="grid grid-cols-1 grid-rows-1 place-items-start leading-none relative">
                  <div className="col-start-1 row-start-1 w-[188px] h-[92px] rounded-full border border-[#30a46c] opacity-10" />
                  <div className="col-start-1 row-start-1 w-[170px] h-[78px] rounded-full border border-[#30a46c] opacity-[0.22] ml-[9px] mt-[7px]" />
                  <div className="col-start-1 row-start-1 w-[152px] h-[62px] rounded-full border border-[#30a46c] opacity-40 ml-[18px] mt-[15px]" />
                  <div className="col-start-1 row-start-1 ml-[27.33px] mt-[22.5px]">
                    <div className="relative flex items-center gap-[14.247px] h-[47.489px] px-[18.995px] rounded-full bg-[#30a46c] text-white text-[19px] font-[510]">
                      <span>Export</span>
                      <Image
                        src={downloadIcon}
                        alt=""
                        width={21.37}
                        height={21.37}
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 text-center w-full">
                  <p
                    className="font-[590] text-[#1c2024] text-[36px] leading-[0.9] tracking-[-0.4px] w-full"
                    style={{
                      fontFamily: "var(--figma-font-text)",
                      fontVariationSettings: '"wdth" 100',
                    }}
                  >
                    Always yours
                  </p>
                  <p
                    className="font-[510] text-base leading-6 text-[rgba(0,7,27,0.5)] w-full"
                    style={{
                      fontFamily: "var(--figma-font-text)",
                      fontVariationSettings: '"wdth" 100',
                    }}
                  >
                    Portable by design
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 p-8 flex flex-col gap-4">
                <div className="bg-white/80 flex items-center p-3 rounded-[9px] shadow-[0px_8px_8px_rgba(0,0,0,0.05)] w-fit">
                  <Image
                    src={downloadCard}
                    alt=""
                    width={24}
                    height={24}
                    draggable={false}
                  />
                </div>
                <p
                  className="font-[510] text-base leading-6 text-[rgba(0,7,27,0.5)]"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  <span className="leading-6">
                    The user owns the format, the data, and the right to take it
                    anywhere. Arkives are{" "}
                  </span>
                  <span className="leading-6 text-[rgba(0,5,9,0.89)]">
                    exportable in full
                  </span>
                  <span className="leading-6"> at any time.</span>
                </p>
              </div>
            </div>
          </FlipCard>

          <FlipCard>
            <div className="absolute inset-0 bg-white rounded-[18px] overflow-hidden flex flex-col justify-between p-8">
              <div
                className="font-[510] text-[28px] leading-[36px] tracking-[-0.12px]"
                style={{
                  fontFamily: "var(--figma-font-text)",
                  fontVariationSettings: '"wdth" 100',
                }}
              >
                <p className="leading-[36px] mb-0 text-[rgba(0,5,9,0.89)]">
                  Portable
                </p>
                <p className="leading-[36px] mb-0 text-[rgba(0,5,29,0.45)]">
                  across any of the
                </p>
                <p className="leading-[36px] text-[rgba(0,5,29,0.45)]">
                  leading models
                </p>
              </div>

              <AvatarStack />
            </div>

            <div className="absolute inset-0 rounded-[18px] overflow-hidden xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-white/100 rounded-[18px] flex flex-col justify-between p-8 [filter:blur(17.5px)]">
                <div
                  className="font-[510] text-[28px] leading-[36px] tracking-[-0.12px]"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  <p className="leading-[36px] mb-0 text-[rgba(0,5,9,0.89)]">
                    Understood
                  </p>
                  <p className="leading-[36px] mb-0 text-[rgba(0,5,29,0.45)]">
                    by any of the
                  </p>
                  <p className="leading-[36px] text-[rgba(0,5,29,0.45)]">
                    leading models
                  </p>
                </div>
                <AvatarStack />
              </div>

              <div className="absolute inset-0 p-8 flex flex-col gap-4">
                <div className="bg-white/80 flex items-center p-3 rounded-[9px] shadow-[0px_8px_8px_rgba(0,0,0,0.05)] w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M2 18H12V20H2V18ZM2 11H22V13H2V11ZM2 4H22V6H2V4ZM18 18V15H20V18H23V20H20V23H18V20H15V18H18Z"
                      fill="#0022FF"
                    />
                  </svg>
                </div>
                <p
                  className="font-[510] text-base leading-6 text-[rgba(0,7,27,0.5)]"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  <span className="leading-6">Arkives are readable </span>
                  <span className="leading-6 text-[rgba(0,5,9,0.89)]">
                    by any MCP-compatible AI.
                  </span>
                  <span className="leading-6">
                    {" "}
                    Claude, ChatGPT, Grok, Gemini, and any other frontier model
                    can be connected.
                  </span>
                </p>
              </div>
            </div>
          </FlipCard>

          <FlipCard>
            <div className="absolute inset-0 bg-white rounded-[18px] overflow-hidden flex flex-col justify-between pt-[54px] pb-8 px-8">
              <p
                className="font-[510] text-[24px] leading-[30px] tracking-[-0.1px] text-[rgba(0,5,9,0.89)]"
                style={{
                  fontFamily: "var(--figma-font-text)",
                  fontVariationSettings: '"wdth" 100',
                }}
              >
                Collaborative{" "}
                <span className="text-[rgba(0,5,9,0.89)]">across users</span> in
                real time
              </p>

              <div className="-ml-8 -mr-8 -mb-8 pr-8 mt-6 md:mt-0">
                <Image
                  src="/sections/models/uptodate.webp"
                  alt="Collaborative across users"
                  width={318}
                  height={135}
                  className="w-full h-auto scale-[clamp(0.75,calc(0.8+(100vw-800px)/3000),1)] origin-bottom-left"
                  draggable={false}
                  unoptimized
                />
              </div>
            </div>

            <div className="absolute inset-0 rounded-[18px] overflow-hidden xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-white/100 rounded-[18px] flex flex-col justify-between pt-[54px] pb-8 px-8 [filter:blur(17.5px)]">
                <p
                  className="font-[510] text-[24px] leading-[30px] tracking-[-0.1px] text-[rgba(0,5,9,0.89)]"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  Collaborative{" "}
                  <span className="text-[rgba(0,5,9,0.89)]">across users</span>{" "}
                  in real time
                </p>
                <div className="-ml-8 -mr-8 -mb-8 pr-8">
                  <Image
                    src="/sections/models/uptodate.webp"
                    alt=""
                    width={318}
                    height={135}
                    className="w-full h-auto"
                    draggable={false}
                    unoptimized
                  />
                </div>
              </div>

              <div className="absolute inset-0 p-8 flex flex-col gap-4">
                <div className="bg-white/80 flex items-center p-3 rounded-[9px] shadow-[0px_8px_8px_rgba(0,0,0,0.05)] w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M13.1202 17.0232L8.92121 14.7332C8.373 15.3193 7.66119 15.7269 6.87828 15.9031C6.09537 16.0793 5.27756 16.0159 4.53113 15.7212C3.7847 15.4266 3.14417 14.9142 2.69277 14.2506C2.24138 13.5871 2 12.8032 2 12.0007C2 11.1982 2.24138 10.4143 2.69277 9.75076C3.14417 9.08725 3.7847 8.57486 4.53113 8.28016C5.27756 7.98547 6.09537 7.92211 6.87828 8.09832C7.66119 8.27452 8.373 8.68214 8.92121 9.2682L13.1212 6.9782C12.8828 6.03428 12.9968 5.03579 13.4418 4.16991C13.8869 3.30402 14.6325 2.63018 15.5389 2.2747C16.4452 1.91923 17.4501 1.90651 18.3652 2.23894C19.2803 2.57137 20.0427 3.22612 20.5095 4.08046C20.9764 4.93481 21.1156 5.93009 20.9011 6.87975C20.6866 7.82941 20.1332 8.66824 19.3444 9.23901C18.5557 9.80979 17.5859 10.0733 16.6168 9.9802C15.6477 9.88708 14.7458 9.44371 14.0802 8.7332L9.88021 11.0232C10.0414 11.6646 10.0414 12.3358 9.88021 12.9772L14.0792 15.2672C14.7448 14.5567 15.6467 14.1133 16.6158 14.0202C17.5849 13.9271 18.5547 14.1906 19.3434 14.7614C20.1322 15.3322 20.6856 16.171 20.9001 17.1207C21.1146 18.0703 20.9754 19.0656 20.5085 19.9199C20.0417 20.7743 19.2793 21.429 18.3642 21.7615C17.4491 22.0939 16.4442 22.0812 15.5379 21.7257C14.6315 21.3702 13.8859 20.6964 13.4408 19.8305C12.9958 18.9646 12.8818 17.9661 13.1202 17.0222V17.0232ZM6.00021 14.0002C6.53064 14.0002 7.03935 13.7895 7.41442 13.4144C7.78949 13.0393 8.00021 12.5306 8.00021 12.0002C8.00021 11.4698 7.78949 10.9611 7.41442 10.586C7.03935 10.2109 6.53064 10.0002 6.00021 10.0002C5.46977 10.0002 4.96107 10.2109 4.58599 10.586C4.21092 10.9611 4.00021 11.4698 4.00021 12.0002C4.00021 12.5306 4.21092 13.0393 4.58599 13.4144C4.96107 13.7895 5.46977 14.0002 6.00021 14.0002ZM17.0002 8.0002C17.5306 8.0002 18.0393 7.78949 18.4144 7.41442C18.7895 7.03934 19.0002 6.53064 19.0002 6.0002C19.0002 5.46977 18.7895 4.96106 18.4144 4.58599C18.0393 4.21092 17.5306 4.0002 17.0002 4.0002C16.4698 4.0002 15.9611 4.21092 15.586 4.58599C15.2109 4.96106 15.0002 5.46977 15.0002 6.0002C15.0002 6.53064 15.2109 7.03934 15.586 7.41442C15.9611 7.78949 16.4698 8.0002 17.0002 8.0002ZM17.0002 20.0002C17.5306 20.0002 18.0393 19.7895 18.4144 19.4144C18.7895 19.0393 19.0002 18.5306 19.0002 18.0002C19.0002 17.4698 18.7895 16.9611 18.4144 16.586C18.0393 16.2109 17.5306 16.0002 17.0002 16.0002C16.4698 16.0002 15.9611 16.2109 15.586 16.586C15.2109 16.9611 15.0002 17.4698 15.0002 18.0002C15.0002 18.5306 15.2109 19.0393 15.586 19.4144C15.9611 19.7895 16.4698 20.0002 17.0002 20.0002Z"
                      fill="#0022FF"
                    />
                  </svg>
                </div>
                <p
                  className="font-[510] text-base leading-6 text-[rgba(0,7,27,0.5)]"
                  style={{
                    fontFamily: "var(--figma-font-text)",
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  <span className="leading-6">An Arkive can be </span>
                  <span className="leading-6 text-[rgba(0,5,9,0.89)]">
                    shared across users in real time,
                  </span>
                  <span className="leading-6">
                    {" "}
                    with controlled permissions. Every change is recorded and
                    attributed to the user who made it.
                  </span>
                </p>
              </div>
            </div>
          </FlipCard>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={arkivesHeader}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full bg-white rounded-[18px] px-6 md:px-10 py-6 mb-4"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="shrink-0 w-16 h-12 rounded-xl overflow-hidden">
              <Image
                src="/sections/setup/install.webp"
                alt=""
                width={64}
                height={48}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <p
              className="flex-1 font-[510] text-[rgba(0,5,9,0.89)] [font-family:var(--figma-font-text)]"
              style={{
                fontSize: "var(--figma-font-size-3)",
                lineHeight: "var(--figma-line-height-3)",
                letterSpacing: "var(--figma-letter-spacing-3)",
              }}
            >
              Learn more about how Arkive creates the new{" "}
              <span className="hidden md:inline">
                <br />
              </span>{" "}
              standard for context capture.
            </p>
          </div>

          <Link href="#">
            <button
              type="button"
              className="inline-flex items-center gap-1 h-12 rounded-full bg-[#1c2024] font-[510] text-[#fcfcfd] [font-family:var(--figma-font-text)] hover:opacity-90 transition-opacity shrink-0 self-start md:self-auto px-6"
              style={{
                fontSize: "var(--figma-font-size-4)",
                lineHeight: "var(--figma-line-height-4)",
                letterSpacing: "var(--figma-letter-spacing-4)",
                fontVariationSettings: '"wdth" 100',
              }}
            >
              Get started
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
