"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="mix-blend-difference"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-baseline gap-2">
            <span className="text-sm tracking-[0.2em] uppercase text-white/90">
              SK
            </span>
            <span className="text-sm tracking-[0.15em] uppercase text-white/90">
              Salman Kalam
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-8">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative text-[0.7rem] uppercase tracking-[0.15em] text-white/80 transition-colors hover:text-white"
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-px origin-left bg-white/70"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.a>
            ))}
          </div>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex sm:hidden relative w-6 h-5 items-center justify-center"
            aria-controls="nav-menu"
            aria-expanded={isMenuOpen}
          >
            <span
              className={`absolute h-[2px] w-6 bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-[8px]"
              }`}
            />
            <span
              className={`absolute h-[2px] w-6 bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-[8px]"
              }`}
            />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="sm:hidden overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-md"
          >
            <div className="px-6 py-6 flex flex-col items-center gap-5">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="text-[0.75rem] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
