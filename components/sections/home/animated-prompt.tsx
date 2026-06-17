"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion-config";
import { motionTokens } from "@/lib/motion-tokens";

interface Category {
  id: string;
  label: string;
  bg: string;
  text: string;
  prompt: string;
}

const categories: Category[] = [
  {
    id: "investing",
    label: "Investing",
    bg: "#1a3a4a",
    text: "#5ab4d6",
    prompt: "Exit my $RAIL position — it's up past my 40% target.",
  },
  {
    id: "health",
    label: "Health",
    bg: "#1a3a2a",
    text: "#5dc8a0",
    prompt:
      "I slept 5h last night and trained this morning. Adjust today's nutrition plan.",
  },
  {
    id: "legal",
    label: "Legal",
    bg: "#3a2a1a",
    text: "#d4956a",
    prompt: "Flag any deadlines in my NDA with Vertex Corp before I sign.",
  },
  {
    id: "writing",
    label: "Writing",
    bg: "#2a1a3a",
    text: "#a78bdf",
    prompt: "Rewrite the intro of my essay — make it sharper, less hedged.",
  },
  {
    id: "habits",
    label: "Habits",
    bg: "#3a3a1a",
    text: "#c8c86a",
    prompt: "Did I keep my 9pm screen-off rule this week? Show me the pattern.",
  },
  {
    id: "career",
    label: "Career",
    bg: "#2a1a1a",
    text: "#d66a6a",
    prompt:
      "I got a competing offer. Help me pressure-test whether to take it.",
  },
  {
    id: "research",
    label: "Research",
    bg: "#1a2a3a",
    text: "#6ab0d6",
    prompt: "Summarize what I've read on sleep and decision-making so far.",
  },
];

const TYPING_SPEED = 25;
const PAUSE_AFTER_TYPING = 4200;

export default function AnimatedPrompt() {
  const reduced = usePrefersReducedMotion();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showThinking, setShowThinking] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const thinkingTimeoutRef = useRef<number | null>(null);
  const switchTimeoutRef = useRef<number | null>(null);

  const activeCategory = categories[categoryIndex];
  const fullText = activeCategory.prompt;

  useEffect(() => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    if (thinkingTimeoutRef.current !== null)
      clearTimeout(thinkingTimeoutRef.current);
    if (switchTimeoutRef.current !== null)
      clearTimeout(switchTimeoutRef.current);

    setDisplayText("");
    setIsTyping(true);
    setShowThinking(true);
    setShowStop(true);

    if (reduced) {
      setDisplayText(fullText);
      setIsTyping(false);
      thinkingTimeoutRef.current = window.setTimeout(() => {
        setShowThinking(false);
        setShowStop(false);
      }, 600);
      switchTimeoutRef.current = window.setTimeout(() => {
        setCategoryIndex((prev) => (prev + 1) % categories.length);
      }, PAUSE_AFTER_TYPING);
      return;
    }

    let charIndex = 0;
    intervalRef.current = window.setInterval(() => {
      charIndex++;
      setDisplayText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        thinkingTimeoutRef.current = window.setTimeout(() => {
          setShowThinking(false);
          setShowStop(false);
        }, 600);
        switchTimeoutRef.current = window.setTimeout(() => {
          setCategoryIndex((prev) => (prev + 1) % categories.length);
        }, PAUSE_AFTER_TYPING);
      }
    }, TYPING_SPEED);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (thinkingTimeoutRef.current !== null)
        clearTimeout(thinkingTimeoutRef.current);
      if (switchTimeoutRef.current !== null)
        clearTimeout(switchTimeoutRef.current);
    };
  }, [categoryIndex, fullText, reduced]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-[640px] mx-auto">
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduced
            ? undefined
            : {
                delay: 0.2,
                duration: motionTokens.duration.normal,
                ease: motionTokens.easing.smooth,
              }
        }
        className="bg-[#111113] rounded-[14px] px-5 pt-3.5 pb-5 md:pt-3 md:pb-[14px] w-full flex flex-col gap-3 md:gap-[18px] relative z-10"
      >
        <div className="flex flex-wrap gap-2 w-full pb-1">
          {categories.map((cat, i) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={isTyping ? undefined : () => setCategoryIndex(i)}
                initial={reduced ? undefined : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: isActive ? 1 : 0.5, scale: 1 }}
                transition={
                  reduced
                    ? undefined
                    : {
                        delay: i * 0.04,
                        duration: motionTokens.duration.fast,
                        ease: motionTokens.easing.smooth,
                      }
                }
                whileHover={reduced ? undefined : { scale: 1.05, opacity: 1 }}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                className="px-2 py-1 md:px-[13px] md:py-[5px] rounded-[20px] text-xs leading-none font-medium border border-transparent transition-all duration-150 cursor-pointer"
                style={{
                  fontFamily: "var(--figma-font-text)",
                  background: isActive ? cat.bg : "#2a2a2e",
                  color: isActive ? cat.text : "#888",
                  borderColor: isActive ? cat.text + "55" : "transparent",
                }}
              >
                {cat.label}
              </motion.button>
            );
          })}
        </div>
        <p
          className="text-sm md:text-[15px] leading-[1.55] md:leading-[1.55] text-[#e0e0e0] font-normal min-h-[48px] md:min-h-[54px]"
          style={{ fontFamily: "var(--figma-font-text)" }}
        >
          {displayText}
          {isTyping && !reduced && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
              className="inline-block w-[2px] h-4 bg-[#e0e0e0] align-[-2px] ml-px"
              aria-hidden="true"
            />
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="attach"
            className="flex items-center justify-center size-[30px] md:size-[34px] rounded-full text-[#B4B4B4] border border-[#2A2A2A] leading-[0]"
          >
            <PlusIcon />
          </button>

          <button
            type="button"
            aria-label="web"
            className="flex items-center justify-center size-[30px] md:size-[34px] rounded-full text-[#B4B4B4] border border-[#2A2A2A] leading-[0]"
          >
            <WebIcon />
          </button>

          <motion.button
            type="button"
            whileHover={reduced ? undefined : { scale: 1.03 }}
            className="hidden md:flex items-center gap-1.5 px-[14px] h-[34px] rounded-[20px] bg-[#212121] text-[#F2F2F2] text-[13px] border border-[#2A2A2A]"
          >
            <BlocksIcon />
            <span
              className="leading-none"
              style={{ fontFamily: "var(--figma-font-text)" }}
            >
              Connectors
            </span>
          </motion.button>

          <div className="flex ml-auto mr-4 gap-1.5 items-center">
            <p className="text-[13px] font-medium text-[#B4B4B4] leading-none">
              Auto
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <rect
                width="14.08"
                height="14.08"
                fill="white"
                fill-opacity="0.01"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.94334 5.78036C3.12063 5.59125 3.41764 5.58168 3.60674 5.75896L7.04041 8.97803L10.4741 5.75896C10.6632 5.58168 10.9602 5.59125 11.1375 5.78036C11.3147 5.96946 11.3051 6.26647 11.1161 6.44375L7.3614 9.96378C7.18087 10.133 6.89995 10.133 6.71941 9.96378L2.96475 6.44375C2.77564 6.26647 2.76607 5.96946 2.94334 5.78036Z"
                fill="#4A4A4A"
              />
            </svg>
          </div>

          <div className="relative size-[30px] md:size-[36px] shrink-0">
            <AnimatePresence mode="wait">
              {!showStop ? (
                <motion.button
                  key="send"
                  type="button"
                  aria-label="send"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    duration: 0.25,
                    ease: motionTokens.easing.smooth,
                  }}
                  className="absolute inset-0 flex items-center justify-center size-[30px] md:size-[36px] rounded-full bg-[#F2F2F2] text-[#121212] border-none"
                >
                  <SendIcon />
                </motion.button>
              ) : (
                <motion.button
                  key="stop"
                  type="button"
                  aria-label="stop"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    duration: 0.25,
                    ease: motionTokens.easing.smooth,
                  }}
                  className="absolute inset-0 flex items-center justify-center size-[30px] md:size-[36px] rounded-full bg-white border-none"
                >
                  <StopIcon />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          opacity: showThinking ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: motionTokens.easing.smooth }}
        className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+16px)] pointer-events-none z-0"
      >
        <div className="flex items-center gap-[9px] bg-[#121212] border border-[#2A2A2A] rounded-full px-[15px] py-[8px] w-fit">
          <ThinkingDots />
          <span
            className="text-[11px] font-medium text-[#B4B4B4] leading-normal whitespace-nowrap"
            style={{ fontFamily: "var(--figma-font-text)" }}
          >
            Thinking…
          </span>
        </div>
      </motion.div>
    </div>
  );
}

const DOT_OPACITIES = [0.1, 1, 0.4] as const;

function ThinkingDots() {
  return (
    <div className="flex gap-[3.5px] items-center">
      {DOT_OPACITIES.map((base, i) => (
        <motion.div
          key={i}
          className="rounded-[2.2px] size-[4.4px] bg-white"
          animate={{ opacity: [base, base * 2.5, base] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
    >
      <path
        d="M7.03854 12.9067C10.2786 12.9067 12.9052 10.2801 12.9052 7.04001C12.9052 3.79994 10.2786 1.17334 7.03854 1.17334C3.79847 1.17334 1.17188 3.79994 1.17188 7.04001C1.17188 10.2801 3.79847 12.9067 7.03854 12.9067Z"
        stroke="#B4B4B4"
        strokeWidth="1.02667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.03807 1.17334C5.53165 2.75508 4.69141 4.85569 4.69141 7.04001C4.69141 9.22432 5.53165 11.3249 7.03807 12.9067C8.5445 11.3249 9.38474 9.22432 9.38474 7.04001C9.38474 4.85569 8.5445 2.75508 7.03807 1.17334Z"
        stroke="#B4B4B4"
        strokeWidth="1.02667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.17188 7.03998H12.9052"
        stroke="#B4B4B4"
        strokeWidth="1.02667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function BlocksIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M9.90031 9.23997H6.60031V5.93997C6.60031 5.57697 6.30331 5.27997 5.94031 5.27997H1.98031C1.61731 5.27997 1.32031 5.57697 1.32031 5.93997V13.86C1.32031 14.223 1.61731 14.52 1.98031 14.52H9.90031C10.2633 14.52 10.5603 14.223 10.5603 13.86V9.89997C10.5603 9.53697 10.2633 9.23997 9.90031 9.23997ZM5.28031 6.59997V9.23997H2.64031V6.59997H5.28031ZM2.64031 13.2V10.56H5.28031V13.2H2.64031ZM9.24031 13.2H6.60031V10.56H9.24031V13.2ZM11.5239 1.51137C11.4629 1.45019 11.3903 1.40165 11.3105 1.36853C11.2306 1.33541 11.1451 1.31836 11.0586 1.31836C10.9722 1.31836 10.8866 1.33541 10.8067 1.36853C10.7269 1.40165 10.6544 1.45019 10.5933 1.51137L7.78831 4.31637C7.72713 4.37743 7.67859 4.44996 7.64547 4.5298C7.61235 4.60964 7.5953 4.69523 7.5953 4.78167C7.5953 4.86811 7.61235 4.9537 7.64547 5.03354C7.67859 5.11339 7.72713 5.18591 7.78831 5.24697L10.5933 8.05197C10.7253 8.18397 10.8903 8.24337 11.0619 8.24337C11.2335 8.24337 11.3985 8.17737 11.5305 8.05197L14.3355 5.24697C14.3967 5.18591 14.4452 5.11339 14.4784 5.03354C14.5115 4.9537 14.5285 4.86811 14.5285 4.78167C14.5285 4.69523 14.5115 4.60964 14.4784 4.5298C14.4452 4.44996 14.3967 4.37743 14.3355 4.31637L11.5305 1.51137H11.5239ZM11.0553 6.65277L9.18091 4.77837L11.0553 2.90397L12.9297 4.77837L11.0553 6.65277Z"
        fill="#F2F2F2"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="0" y="0" width="12" height="12" rx="2" fill="#111" />
    </svg>
  );
}
