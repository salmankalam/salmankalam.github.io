"use client";

import { motion } from "motion/react";
import { cv } from "../../data/cv";
import { useInView } from "motion/react";
import { useRef } from "react";

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
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-white/30">
                About
              </span>
            </RevealText>

            <RevealText delay={0.15}>
              <h2 className="mt-6 text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-white">
                Crafting code into
                <br />
                <span className="text-white/60">meaningful interfaces</span>
              </h2>
            </RevealText>

            <RevealText delay={0.3}>
              <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/50">
                {cv.summary.length > 0 ? (
                  cv.summary.map((para) => <p key={para}>{para}</p>)
                ) : (
                  <>
                    <p>
                      Full-stack developer and Computer Science student at the
                      University of West London, passionate about building
                      performant, human-centered digital experiences.
                    </p>
                    <p>
                      I work across the stack — from crafting fluid UI
                      components in React to designing scalable backend
                      architectures. I believe great software is built at the
                      intersection of engineering rigor and design thinking.
                    </p>
                  </>
                )}
              </div>
            </RevealText>

            <RevealText delay={0.45}>
              <div className="mt-8 flex flex-wrap gap-3">
                {cv.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-white/40 transition-colors hover:border-white/30 hover:text-white/70"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </RevealText>
          </div>

          <div className="relative">
            <RevealText delay={0.35}>
              <div className="sticky top-32 space-y-8">
                <div>
                  <span className="text-[0.55rem] uppercase tracking-[0.25em] text-white/20">
                    Education
                  </span>
                  <div className="mt-3 space-y-3">
                    {cv.education.map((edu, i) => (
                      <p key={i} className="text-sm text-white/50">
                        {edu}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                <div>
                  <span className="text-[0.55rem] uppercase tracking-[0.25em] text-white/20">
                    Languages
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cv.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-sm text-white/40"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
