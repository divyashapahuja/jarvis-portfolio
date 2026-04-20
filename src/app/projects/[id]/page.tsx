import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/lib/projects";
import PhaseTracker from "./PhaseTracker";

const PHASES = [
  { key: "background", num: "01", label: "Background", heading: "The Origin" },
  { key: "research", num: "02", label: "Research", heading: "Discovery & Analysis" },
  { key: "implementation", num: "03", label: "Implementation", heading: "Crafting the Solution" },
  { key: "result", num: "04", label: "Result", heading: "The Outcome" },
  { key: "reflection", num: "05", label: "Reflection", heading: "Lessons Learned" },
] as const;

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  return { title: project ? `${project.name} — Case Study` : "Not Found" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <div className="relative min-h-screen" style={{ background: "var(--background)" }}>
      <div className="absolute inset-0 bg-grid opacity-[0.06] pointer-events-none" />

      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-neon/10" style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(12px)" }}>
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link
            href={`/#projects-${project.id}`}
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.12em] text-neon/60 transition-colors hover:text-neon sm:text-[11px] sm:tracking-[0.15em]"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-current">
              <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Projects
          </Link>

          <div className="flex min-w-0 items-center gap-3">
            <h1
              className="min-w-0 truncate text-xs font-bold uppercase tracking-[0.12em] text-glow text-white sm:text-sm sm:tracking-[0.15em]"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {project.name}
            </h1>
            <div
              className="h-2.5 w-2.5 shrink-0 animate-pulse-glow rounded-full"
              style={{ background: project.color, color: project.color }}
            />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        {/* Tools */}
        <div className="flex flex-wrap gap-2 mb-16">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1 text-[10px] border border-neon/20 rounded-sm text-neon/70 bg-neon/5"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="relative flex flex-col gap-2 lg:flex-row lg:gap-16">
          <PhaseTracker phases={PHASES.map((p) => p.key)} />

          <div className="min-w-0 flex-1 space-y-0">
            {PHASES.map((phase, i) => {
              const content = project[phase.key] ?? "";
              const showBrackets = i % 2 === 0;

              return (
                <section key={phase.key} id={`phase-${phase.key}`} className="scroll-mt-24">
                  {/* Divider between sections */}
                  {i > 0 && (
                    <div className="h-[1px] my-16 bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
                  )}

                  <div className="relative">
                    {/* Corner brackets */}
                    {showBrackets && (
                      <>
                        <div className="absolute -top-3 -left-4 w-5 h-5 border-l border-t border-neon/20" />
                        <div className="absolute -top-3 -right-4 w-5 h-5 border-r border-t border-neon/20" />
                        <div className="absolute -bottom-3 -left-4 w-5 h-5 border-l border-b border-neon/20" />
                        <div className="absolute -bottom-3 -right-4 w-5 h-5 border-r border-b border-neon/20" />
                      </>
                    )}

                    <p
                      className="text-[10px] tracking-[0.3em] uppercase text-neon/50 mb-4"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      Phase {phase.num} // {phase.label}
                    </p>

                    <h2
                      className="text-2xl lg:text-3xl font-bold text-white text-glow mb-6"
                      style={{ fontFamily: "Orbitron, sans-serif" }}
                    >
                      {phase.heading}
                    </h2>

                    <p
                      className="text-white/70 leading-relaxed text-[15px] max-w-2xl"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {content}
                    </p>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-24 flex flex-col gap-4 border-t border-neon/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs text-neon/60 hover:text-neon transition-colors"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-current">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Projects
          </Link>
          <p
            className="text-[10px] text-neon/20 tracking-[0.2em]"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            CASE.STUDY: {project.id.toUpperCase()}
          </p>
        </div>
      </main>
    </div>
  );
}
