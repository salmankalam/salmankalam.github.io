"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cv } from "../../data/cv";

function TimelineItem({
  text,
  index,
}: {
  text: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-white/20" />
      <div className="absolute left-[3px] top-4 bottom-0 w-px bg-white/5 last:hidden" />
      <p className="text-sm text-white/50">{text}</p>
    </motion.div>
  );
}

export function Education() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.65rem] uppercase tracking-[0.25em] text-white/30"
        >
          Background
        </motion.p>

        <div className="mt-12 grid gap-16 md:grid-cols-2">
          <div>
            <h3 className="mb-8 text-sm font-medium uppercase tracking-[0.15em] text-white/30">
              Education
            </h3>
            {cv.education.map((edu, i) => (
              <TimelineItem key={i} text={edu} index={i} />
            ))}
          </div>
          <div>
            <h3 className="mb-8 text-sm font-medium uppercase tracking-[0.15em] text-white/30">
              Experience
            </h3>
            {cv.experience.map((exp, i) => (
              <TimelineItem key={i} text={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
