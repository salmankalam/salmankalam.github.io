"use client";

import { cn } from "../../lib/utils";
import type { InputHTMLAttributes } from "react";

interface SmoothCaretInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function SmoothCaretInput({
  label,
  className,
  id,
  ...props
}: SmoothCaretInputProps) {
  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[0.7rem] uppercase tracking-[0.15em] text-[var(--ic-muted-foreground)] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full bg-transparent border-b border-[var(--ic-border)] py-3 text-[var(--ic-foreground)]",
          "text-sm placeholder:text-[var(--ic-muted-foreground)]",
          "outline-none transition-[border-color,box-shadow] duration-300",
          "focus:border-[var(--ic-foreground)] focus:shadow-[0_1px_0_var(--ic-foreground)]",
          "caret-[var(--ic-primary)]",
          className
        )}
        {...props}
      />
    </div>
  );
}
