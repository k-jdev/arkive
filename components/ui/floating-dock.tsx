"use client";

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  activeIndex,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    opacity?: number;
    hiddenOn?: "lg" | "md";
    bg?: string;
    border?: string;
    isFaded?: boolean;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
  activeIndex?: number;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        activeIndex={activeIndex}
      />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    opacity?: number;
    hiddenOn?: "lg" | "md";
    bg?: string;
    border?: string;
    isFaded?: boolean;
  }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  className="flex items-center justify-center bg-gray-50 dark:bg-neutral-900"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "22px",
                    opacity: item.opacity !== undefined ? item.opacity : 1,
                    backgroundColor: item.bg,
                    border: item.border,
                  }}
                >
                  <div
                    style={{
                      width: item.isFaded ? "100%" : "40px",
                      height: item.isFaded ? "100%" : "40px",
                    }}
                  >
                    {item.icon}
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center bg-gray-50 dark:bg-neutral-800"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "22px",
        }}
      >
        <IconLayoutNavbarCollapse className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  activeIndex,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    opacity?: number;
    hiddenOn?: "lg" | "md";
    bg?: string;
    border?: string;
    isFaded?: boolean;
  }[];
  className?: string;
  activeIndex?: number;
}) => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900",
        className,
      )}
    >
      {items.map((item, idx) => (
        <IconContainer
          mouseX={mouseX}
          key={item.title + idx}
          {...item}
          index={idx}
          activeIndex={activeIndex}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  opacity,
  bg,
  border,
  hiddenOn,
  isFaded,
  index,
  activeIndex,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  opacity?: number;
  bg?: string;
  border?: string;
  hiddenOn?: "lg" | "md";
  isFaded?: boolean;
  index: number;
  activeIndex?: number;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    if (val === Infinity && activeIndex !== undefined) {
      const gap = 16; // Tailwind gap-4
      const itemWidth = 80;
      const idxDiff = index - activeIndex;
      return idxDiff * (itemWidth + gap);
    }
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [80, 160, 80]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [80, 160, 80]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [40, 80, 40],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  // Determine visibility class based on hiddenOn
  const visibilityClass =
    hiddenOn === "lg"
      ? "hidden lg:flex"
      : hiddenOn === "md"
        ? "hidden md:flex"
        : "";

  return (
    <a href={href} className={visibilityClass}>
      <motion.div
        ref={ref}
        style={{
          width,
          height,
          opacity: opacity !== undefined ? opacity : 1,
          backgroundColor: bg,
          border: border,
          borderRadius: "22px",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center",
          !bg && "bg-gray-200 dark:bg-neutral-800",
        )}
      >
        <motion.div
          style={{
            width: isFaded ? "100%" : widthIcon,
            height: isFaded ? "100%" : heightIcon,
          }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
