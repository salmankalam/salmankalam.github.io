"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { repos } from "../../data/repos";
import { TiltCard } from "../ui/tilt-card";
import { GlowingEffect } from "../ui/glowing-effect";
import { ProjectPreview } from "../ui/project-preview";
import type { Repo } from "../../data/repos";

const validRepos = repos.filter(
  (r) => r.screenshots?.length || r.pages_enabled || r.frontend
);

const pinned = validRepos.filter((r) => r.pinned);
const others = validRepos.filter((r) => !r.pinned);

type Category = "frontend" | "backend" | "data analysis";

function categorize(repo: Repo): Category {
  const domain = repo.tags?.domain || [];
  if (domain.some((d) => d === "backend" || d === "api")) return "backend";
  if (
    domain.some(
      (d) => d === "data analysis" || d === "machine learning" || d === "nlp"
    )
  )
    return "data analysis";
  return "frontend";
}

const categories: { key: Category; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "data analysis", label: "Data Analysis" },
];

function ProjectCard({
  repo,
  onSelect,
}: {
  repo: Repo;
  onSelect: (repo: Repo) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const heroImg = repo.screenshots?.find((s) => s.type === "hero")?.file;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className="h-full"
    >
      <TiltCard className="relative h-full" tiltDegree={4}>
        <button
          onClick={() => onSelect(repo)}
          className="group relative flex aspect-[4/3] h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] text-left"
          style={{ transformStyle: "preserve-3d" }}
        >
          {heroImg ? (
            <div className="absolute inset-0">
              <img
                src={heroImg}
                alt=""
                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/20" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#111] transition-colors group-hover:bg-[#181818]" />
          )}

          <GlowingEffect
            glow
            spread={50}
            className="rounded-2xl"
            style={{ "--glow-color": "rgba(201,98,135,0.2)" } as React.CSSProperties}
          />

          <div className="relative z-10 mt-auto flex flex-col p-5" style={{ transform: "translateZ(30px)" }}>
            {repo.pinned && (
              <span className="mb-1.5 text-[0.55rem] uppercase tracking-[0.2em] text-white/60">
                Pinned
              </span>
            )}
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
              {repo.language || "Project"}
            </span>
            <h3 className="mt-1 text-base font-light text-white/90">
              {repo.name.replace(/-/g, " ")}
            </h3>
            {repo.short_summary && (
              <p className="mt-1 text-sm leading-relaxed text-white/70 line-clamp-2">
                {repo.short_summary}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(repo.tags?.languages || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
}

function ProjectGrid({
  repos,
  onSelect,
}: {
  repos: Repo[];
  onSelect: (repo: Repo) => void;
}) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
      {repos.map((repo) => (
        <ProjectCard key={repo.name} repo={repo} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function Projects() {
  const [selected, setSelected] = useState<Repo | null>(null);

  return (
    <section id="projects" className="bg-[#0a0a0a] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50"
        >
          Projects
        </motion.p>

        {pinned.length > 0 && (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-[-0.02em] text-white"
            >
              Featured
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="mt-8"
            >
              <ProjectGrid repos={pinned} onSelect={setSelected} />
            </motion.div>
          </>
        )}

        {others.length > 0 && (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="mt-16 text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-[-0.02em] text-white"
            >
              All Projects
            </motion.h2>

            {categories.map((cat) => {
              const group = validRepos.filter((r) => categorize(r) === cat.key);
              if (group.length === 0) return null;
              return (
                <div key={cat.key} className="mt-12">
                  <h3 className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50">
                    {cat.label}
                  </h3>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="mt-6"
                  >
                    <ProjectGrid repos={group} onSelect={setSelected} />
                  </motion.div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <ProjectPreview repo={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
