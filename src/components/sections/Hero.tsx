"use client";

import { DiaTextReveal } from "../ui/dia-text";
import { AnimatedTextCycle } from "../ui/animated-text-cycle";
import { GradientButton } from "../ui/gradient-button";
import { motion } from "motion/react";

const roles = [
  "Frontend Developer",
  "UI/UX Designer",
  "Problem Solver",
];

export function Hero() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0a0a0a] px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(201,98,135,0.3), transparent 70%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(70,147,150,0.15), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <DiaTextReveal
          className="text-[clamp(3rem,10vw,7rem)] font-light leading-[0.95] tracking-[-0.03em] text-white"
          delay={0.3}
        >
          Building digital
        </DiaTextReveal>

        <div className="mt-2">
          <DiaTextReveal
            className="text-[clamp(3rem,10vw,7rem)] font-light leading-[0.95] tracking-[-0.03em] text-white"
            delay={0.8}
          >
            experiences
          </DiaTextReveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <span className="text-base text-white/70">I&apos;m a</span>
          <AnimatedTextCycle
            texts={roles}
            className="text-base font-medium text-white/90"
            interval={2800}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <a href="#projects">
            <GradientButton>View Work</GradientButton>
          </a>
          <a href="#contact">
            <GradientButton variant="variant">Get in Touch</GradientButton>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
