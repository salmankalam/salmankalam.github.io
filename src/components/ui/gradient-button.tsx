"use client";

import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "variant";
}

export function GradientButton({
  className,
  variant = "default",
  children,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        "gradient-button",
        variant === "variant" && "gradient-button-variant",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
