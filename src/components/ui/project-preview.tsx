"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import type { Repo } from "../../data/repos";

interface ProjectPreviewProps {
  repo: Repo | null;
  onClose: () => void;
}

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div>
      <span className="text-[0.5rem] uppercase tracking-[0.2em] text-white/20">
        {label}
      </span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white/5 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.1em] text-white/40"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProjectPreview({ repo, onClose }: ProjectPreviewProps) {
  const [activeImage, setActiveImage] = useState(0);

  if (!repo) return null;

  const imgs = repo.screenshots || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-light text-white/90">
                  {repo.name.replace(/-/g, " ")}
                </h2>
                {repo.pinned && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.45rem] uppercase tracking-[0.15em] text-white/40">
                    Pinned
                  </span>
                )}
              </div>
              {repo.page_title && (
                <p className="mt-0.5 text-xs text-white/30">
                  {repo.page_title}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {repo.pages_enabled && repo.pages_url && (
                <a
                  href={repo.pages_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.6rem] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/80"
                >
                  Live Site
                </a>
              )}
              <a
                href={repo.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.6rem] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/80"
              >
                Source
              </a>
              <button
                onClick={onClose}
                className="ml-2 text-sm text-white/30 transition-colors hover:text-white/70"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            <div className="relative flex-1 overflow-auto bg-[#0a0a0a] p-4">
              {imgs.length > 0 ? (
                <img
                  src={imgs[activeImage]?.file}
                  alt={imgs[activeImage]?.label || repo.name}
                  className="h-full w-full rounded-lg object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/20">
                  No screenshots available
                </div>
              )}
            </div>

            <div className="flex w-full flex-col border-t border-white/5 md:w-72 md:border-t-0 md:border-l">
              {imgs.length > 1 && (
                <div className="flex gap-1 overflow-x-auto border-b border-white/5 p-3 md:flex-col md:overflow-y-auto">
                  {imgs.map((img, i) => (
                    <button
                      key={img.file}
                      onClick={() => setActiveImage(i)}
                      className={`relative shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                        i === activeImage
                          ? "border-white/40 opacity-100"
                          : "border-white/5 opacity-50 hover:opacity-80"
                      }`}
                      style={{ width: 80, height: 56 }}
                    >
                      <img
                        src={img.file}
                        alt={img.label}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[0.45rem] uppercase tracking-[0.1em] text-white/60">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-auto p-4">
                <p className="text-xs leading-relaxed text-white/50">
                  {repo.long_summary || repo.short_summary || repo.description}
                </p>

                <div className="mt-4 space-y-3">
                  <TagGroup label="Languages" tags={repo.tags?.languages} />
                  <TagGroup label="Domain" tags={repo.tags?.domain} />
                  <TagGroup label="Tools & Technologies" tags={repo.tags?.tools} />
                  <TagGroup label="Type" tags={repo.tags?.type} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
