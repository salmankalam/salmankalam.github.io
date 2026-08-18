"use client";

import { motion } from "motion/react";
import { GradientButton } from "../ui/gradient-button";
import { SmoothCaretInput } from "../ui/smooth-caret-input";

export function Contact() {
  return (
    <section id="contact" className="bg-[#0a0a0a] px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50"
        >
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-3 text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-white"
        >
          Let&apos;s work together
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          onSubmit={(e) => e.preventDefault()}
          className="mt-16 space-y-10"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <SmoothCaretInput
              label="Name"
              id="name"
              placeholder="Your name"
              type="text"
            />
            <SmoothCaretInput
              label="Email"
              id="email"
              placeholder="your@email.com"
              type="email"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-[0.75rem] uppercase tracking-[0.15em] text-[var(--ic-muted-foreground)] mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Your message..."
              className="w-full bg-transparent border-b border-[var(--ic-border)] py-3 text-sm text-[var(--ic-foreground)] placeholder:text-[var(--ic-muted-foreground)] outline-none transition-[border-color,box-shadow] duration-300 focus:border-[var(--ic-foreground)] focus:shadow-[0_1px_0_var(--ic-foreground)] resize-none"
            />
          </div>
          <div className="flex justify-end">
            <GradientButton type="submit">Send Message</GradientButton>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
