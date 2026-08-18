"use client";

import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef, useState } from "react";
import { certificates } from "../../data/certificates";
import type { Certificate } from "../../data/certificates";
import { TiltCard } from "../ui/tilt-card";
import { GlowingEffect } from "../ui/glowing-effect";

function CertificateCard({
  cert,
  onSelect,
  index,
}: {
  cert: Certificate;
  onSelect: (cert: Certificate) => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
      className="h-full"
    >
      <TiltCard className="relative h-full" tiltDegree={4}>
        <button
          onClick={() => onSelect(cert)}
          className="group relative flex aspect-[4/3] h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] text-left"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0">
            <img
              src={cert.image}
              alt={cert.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          </div>

          <GlowingEffect
            glow
            spread={50}
            className="rounded-2xl"
            style={{ "--glow-color": "rgba(150,110,220,0.25)" } as React.CSSProperties}
          />

          <div className="relative z-10 mt-auto flex flex-col p-5" style={{ transform: "translateZ(30px)" }}>
            <h3 className="text-base font-light text-white/90">
              {cert.name}
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cert.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-white/80"
                >
                  {tag}
                </span>
              ))}
              {cert.tags.length > 3 && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-white/80">
                  +{cert.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
}

function CertificatePreview({
  cert,
  onClose,
}: {
  cert: Certificate | null;
  onClose: () => void;
}) {
  if (!cert) return null;

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
              <h2 className="text-lg font-light text-white/90">{cert.name}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cert.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/80"
              >
                View Certificate
              </a>
              <button
                onClick={onClose}
                className="ml-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-[#0a0a0a] p-4">
            <img
              src={cert.image}
              alt={cert.name}
              className="mx-auto w-full rounded-lg object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Certificates() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="bg-[#0a0a0a] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50"
        >
          Credentials
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-[-0.02em] text-white"
        >
          Certificates
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
        >
          {certificates.map((cert, i) => (
            <CertificateCard
              key={cert.image}
              cert={cert}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </motion.div>
      </div>

      <CertificatePreview cert={selected} onClose={() => setSelected(null)} />
    </section>
  );
}