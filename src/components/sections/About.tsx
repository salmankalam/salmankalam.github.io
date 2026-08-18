"use client";

import { motion } from "motion/react";
import { cv } from "../../data/cv";
import { useInView } from "motion/react";
import { useRef } from "react";

const languages = (cv.languages.find((l) => l.startsWith("Languages:")) ?? "")
  .split(":")
  .slice(1)
  .join(":")
  .split(",")
  .map((l) => l.trim())
  .filter(Boolean);

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative bg-[#0a0a0a] px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <RevealText>
              <span className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50">
                About
              </span>
            </RevealText>

            <RevealText delay={0.15}>
              <h2 className="mt-6 text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-white">
                Crafting code into
                <br />
                <span className="text-white/75">meaningful interfaces</span>
              </h2>
            </RevealText>

            <RevealText delay={0.3}>
              <div className="mt-8 space-y-4 text-base leading-relaxed text-white/75">
                {cv.summary.length > 0 ? (
                  cv.summary.map((para) => <p key={para}>{para}</p>)
                ) : (
                  <p>
                    Full-stack developer and Computer Science student at the
                    University of West London, passionate about building
                    performant, human-centered digital experiences.
                  </p>
                )}
              </div>
            </RevealText>

            <RevealText delay={0.4}>
              <div className="mt-8">
                <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">
                  Languages
                </span>
                <ul className="mt-3 space-y-1.5">
                  {languages.map((lang) => (
                    <li
                      key={lang}
                      className="flex items-center gap-3 text-base text-white/75"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealText>

            <RevealText delay={0.45}>
              <div className="mt-8 flex flex-wrap gap-3">
                {cv.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </RevealText>
          </div>

          <div className="relative flex items-center">
            <RevealText delay={0.35}>
              <div className="w-full">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
                  <img
                    src="WhatsApp-Image.jpeg"
                    alt="Salman Kalam"
                    className="aspect-[16/10] h-auto w-full object-contain"
                  />
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
