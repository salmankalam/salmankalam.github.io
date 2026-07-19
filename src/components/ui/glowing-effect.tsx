"use client";

import { cn } from "../../lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface GlowingEffectProps extends ComponentPropsWithoutRef<"div"> {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
}

export function GlowingEffect({
  spread = 40,
  glow = false,
  disabled = false,
  proximity = 60,
  inactiveZone = 0.01,
  className,
  ...props
}: GlowingEffectProps) {
  if (disabled) return null;

  return (
    <div
      className={cn("pointer-events-none absolute -inset-[1px] select-none", className)}
      style={{
        opacity: glow ? 1 : 0.6,
        transition: "opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      {...props}
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient
            id="glow-grad"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="var(--glow-color, #c96287)" stopOpacity="0.8" />
            <stop offset={`${spread}%`} stopColor="var(--glow-color, #c96287)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--glow-color, #c96287)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          rx="inherit"
          ry="inherit"
          fill="none"
          stroke="url(#glow-grad)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
