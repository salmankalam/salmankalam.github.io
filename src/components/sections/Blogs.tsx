"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { repos } from "../../data/repos";
import { TiltCard } from "../ui/tilt-card";
import { GlowingEffect } from "../ui/glowing-effect";
import type { Repo } from "../../data/repos";

const blogRepos = repos.filter((r) => r.isBlog && r.name !== "salmankalam.github.io");

function BlogCard({ repo }: { repo: Repo }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const url = repo.pages_url || repo.repo_url;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className="h-[240px] w-full"
    >
      <TiltCard className="relative h-full" tiltDegree={3}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111] text-left transition-colors hover:border-white/15"
          style={{ transformStyle: "preserve-3d" }}
        >
          <GlowingEffect
            glow
            spread={40}
            className="rounded-2xl"
            style={{ "--glow-color": "rgba(100,180,255,0.15)" } as React.CSSProperties}
          />

          <div className="relative z-10 flex flex-1 flex-col p-5" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-start justify-between">
              <h3 className="text-base font-light text-white/90">
                {repo.name.replace(/-/g, " ")}
              </h3>
              <span className="ml-2 shrink-0 text-white/30 transition-colors group-hover:text-white/60">
                ↗
              </span>
            </div>

            {repo.short_summary && (
              <p className="mt-2 text-sm leading-relaxed text-white/60 line-clamp-3">
                {repo.short_summary}
              </p>
            )}

            <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
              {(repo.tags?.languages || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/70"
                >
                  {tag}
                </span>
              ))}
              {repo.language && !repo.tags?.languages?.includes(repo.language) && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/70">
                  {repo.language}
                </span>
              )}
            </div>
          </div>
        </a>
      </TiltCard>
    </motion.div>
  );
}

export function Blogs() {
  if (blogRepos.length === 0) return null;

  return (
    <section id="blogs" className="bg-[#0a0a0a] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50"
        >
          Notes & Guides
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-[-0.02em] text-white"
        >
          Blogs
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
        >
          {blogRepos.map((repo) => (
            <BlogCard key={repo.name} repo={repo} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}