"use client";

import { useState } from "react";
import { motion } from "motion/react";

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
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex sm:hidden flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-controls="nav-menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-5 h-px bg-white transition-transform duration-300 ${
              isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-white transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-white transition-transform duration-300 ${
              isMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
        {isMenuOpen && (
          <div
            id="nav-menu"
            className="absolute top-full left-0 right-0 bg-[#0a0a0a] py-8 sm:hidden z-40"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block mb-4 text-center text-white text-sm uppercase tracking-[0.2em] transition-colors hover:text-white/70"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.nav>
  );
}
