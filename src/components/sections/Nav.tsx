"use client";

import { motion, useState } from "motion/react";

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
        <div className="flex items-center gap-8 hidden sm:block">
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
          className="block sm:hidden text-white"
          aria-controls="nav-menu"
          aria-expanded={isMenuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              points="M3 12l2-2m0 0l2-2m-2 2l2 2m7-4l2-2m0 0l2-2m-2 2l2 2m7-4l2 2m0 0l2 2m-7 4l-2-2m0 0l-2-2m7 4l2 2m-7-4l-2-2"
            />
          </svg>
        </button>
        {isMenuOpen && (
          <div
            id="nav-menu"
            className="absolute top-full left-0 right-0 bg-[#0a0a0a] py-8 md:hidden z-40"
          >
            <a
              href="#about"
              className="block mb-4 text-white text-sm uppercase tracking-[0.2em] transition-colors hover:text-white"
            >
              About
            </a>
            <a href="#projects" className="block mb-4 text-white text-sm uppercase tracking-[0.2em] transition-colors hover:text-white">
              Projects
            </a>
            <a href="#certificates" className="block mb-4 text-white text-sm uppercase tracking-[0.2em] transition-colors hover:text-white">
              Certificates
            </a>
            <a href="#resume" className="block mb-4 text-white text-sm uppercase tracking-[0.2em] transition-colors hover:text-white">
              Resume
            </a>
            <a href="#contact" className="block mb-4 text-white text-sm uppercase tracking-[0.2em] transition-colors hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
