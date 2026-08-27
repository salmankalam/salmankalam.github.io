"use client";

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] px-6 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/90">
          &copy; {new Date().getFullYear()} Salman Kalam
        </p>
        <div className="flex items-center gap-6">
          <motion.a
            href="https://github.com/salmankalam"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-[0.7rem] uppercase tracking-[0.2em] text-white/90 transition-colors hover:text-white"
          >
            GitHub
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/salmankalam123"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-[0.7rem] uppercase tracking-[0.2em] text-white/90 transition-colors hover:text-white"
          >
            LinkedIn
          </motion.a>
          <motion.a
            href="mailto:salman@example.com"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-[0.7rem] uppercase tracking-[0.2em] text-white/90 transition-colors hover:text-white"
          >
            Email
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
