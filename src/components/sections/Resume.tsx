"use client";

import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef, useState } from "react";

const RESUME_URL = "/resume/ProfessionalResume.pdf";

function ResumePreview({ url, onClose }: { url: string | null; onClose: () => void }) {
  if (!url) return null;

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
          className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h2 className="text-lg font-light text-white/90">Resume</h2>
            <div className="flex items-center gap-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.6rem] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white/80"
              >
                Open
              </a>
              <a
                href={url}
                download
                className="text-[0.6rem] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white/80"
              >
                Download
              </a>
              <button
                onClick={onClose}
                className="ml-2 text-sm text-white/50 transition-colors hover:text-white/70"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-[#0a0a0a] p-4">
            <iframe src={url} className="h-[70vh] w-full rounded-lg border-0" title="Resume preview" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Resume() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [preview, setPreview] = useState(false);

  return (
    <section id="resume" className="bg-[#0a0a0a] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50"
        >
          Resume
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-8 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
        >
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-[-0.02em] text-white">
              My Resume
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
              View or download my latest resume to learn more about my experience,
              education, and the work I&apos;ve done.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setPreview(true)}
              className="rounded-full border border-white/15 px-6 py-3 text-[0.7rem] uppercase tracking-[0.15em] text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              View
            </button>
            <a
              href={RESUME_URL}
              download
              className="rounded-full border border-white/15 px-6 py-3 text-[0.7rem] uppercase tracking-[0.15em] text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              Download
            </a>
          </div>
        </motion.div>
      </div>

      <ResumePreview url={preview ? RESUME_URL : null} onClose={() => setPreview(false)} />
    </section>
  );
}