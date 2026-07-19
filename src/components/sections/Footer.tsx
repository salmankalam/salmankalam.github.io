"use client";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] px-6 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20">
          &copy; {new Date().getFullYear()} Salman Kalam
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/salmankalam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 transition-colors hover:text-white/60"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/salmankalam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 transition-colors hover:text-white/60"
          >
            LinkedIn
          </a>
          <a
            href="mailto:salman@example.com"
            className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 transition-colors hover:text-white/60"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
