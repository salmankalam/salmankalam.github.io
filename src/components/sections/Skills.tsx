"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { repos } from "../../data/repos";

const allLanguages = [
  ...new Set(repos.flatMap((r) => r.tags?.languages || [])),
].sort();

const allDomain = [
  ...new Set(repos.flatMap((r) => r.tags?.domain || [])),
].sort();

const allTools = [
  ...new Set(repos.flatMap((r) => r.tags?.tools || [])),
].sort();

const skillGroups = [
  { label: "Languages", skills: allLanguages },
  { label: "Domain", skills: allDomain },
  { label: "Tools & Frameworks", skills: allTools },
];

function SkillGroup({
  label,
  skills,
  index,
}: {
  label: string;
  skills: string[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (skills.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">
        {label}
      </span>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white/90"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50"
        >
          Skills & Technologies
        </motion.p>

        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <SkillGroup
              key={group.label}
              label={group.label}
              skills={group.skills}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
