"use client";

import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

interface DiaTextProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
}

export function DiaTextReveal({
  children,
  as: Tag = "h1",
  className,
  delay = 0,
}: DiaTextProps) {
  const text = typeof children === "string" ? children : "";
  const chars = text.split("");

  return (
    <Tag className={cn("inline-block overflow-hidden", className)}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 60, rotateX: -90, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: delay + i * 0.035,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </Tag>
  );
}
