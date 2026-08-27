"use client";

import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef, useState } from "react";

const RESUME_URL = "resume/ProfessionalResume.pdf";
const RESUME_IMAGE = "resume/resume.png";

function ResumePreview({ onClose }: { onClose: () => void }) {
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
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-5 py-2 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-black transition-colors hover:bg-white/80"
              >
                Open
              </a>
              <a
                href={RESUME_URL}
                download
                className="rounded-full border border-white/30 bg-white/5 px-5 py-2 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/15 hover:border-white/50"
              >
                Download
              </a>
              <button
                onClick={onClose}
                className="ml-2 text-base text-white/60 transition-colors hover:text-white"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-[#0a0a0a]">
            <iframe
              src={RESUME_URL}
              title="Resume PDF"
              className="block h-[78vh] w-full border-0 bg-white"
            />
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
      <div className="mx-auto max-w-3xl">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50"
        >
          Resume
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-3 text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-white"
        >
          My Resume
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-3 max-w-lg text-base leading-relaxed text-white/75"
        >
          View or download my latest resume to learn more about my experience,
          education, and the work I&apos;ve done.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={() => setPreview(true)}
          className="group mt-16 block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition-colors hover:border-white/30"
        >
          <img
            src={RESUME_IMAGE}
            alt="Resume preview"
            className="mx-auto h-[75vh] w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </motion.button>
      </div>

      {preview && <ResumePreview onClose={() => setPreview(false)} />}
    </section>
  );
}