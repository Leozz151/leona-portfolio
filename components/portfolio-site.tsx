"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import type { PortfolioContent } from "@/lib/portfolio-content";

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-xs uppercase tracking-[0.28em] text-blue-deep">{eyebrow}</p>
      <h2 className="font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h2>
      {intro ? <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{intro}</p> : null}
    </div>
  );
}

function HeroFactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/80 px-4 py-4 shadow-[0_18px_45px_rgba(30,79,151,0.06)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-blue-deep">{label}</p>
      <p className="mt-2 text-sm font-medium leading-7 text-ink">{value}</p>
    </div>
  );
}

export function PortfolioSite({ content }: { content: PortfolioContent }) {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.dataset.modalOpen = activeTimelineIndex !== null ? "true" : "false";
    return () => {
      document.body.dataset.modalOpen = "false";
    };
  }, [activeTimelineIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveTimelineIndex(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const orderedSections = useMemo(
    () =>
      content.sectionOrder.map((id) => {
        switch (id) {
          case "about":
            return (
              <section key={id} id="about" className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-aurora backdrop-blur-xl md:p-8">
                <SectionTitle eyebrow="Core Strengths" title={content.about.title} intro={content.about.intro} />
                <div className="grid gap-6 md:grid-cols-3">
                  {content.about.items.map((item) => (
                    <article key={item.title} className="rounded-[1.6rem] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(30,79,151,0.08)]">
                      <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                      <p className="mt-3 leading-8 text-muted">{item.text}</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          case "journey":
            return (
              <section key={id} id="journey" className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-aurora backdrop-blur-xl md:p-8">
                <SectionTitle eyebrow="The Journey Timeline" title={content.journey.title} intro={content.journey.intro} />
                <div className="overflow-x-auto pb-4">
                  <div className="relative grid min-w-[860px] grid-cols-3 gap-8 px-4 pt-12">
                    <div className="absolute left-10 right-10 top-[5.6rem] h-[3px] rounded-full bg-gradient-to-r from-blue-glow via-sky-300 to-coral" />
                    {content.journey.items.map((item, index) => (
                      <button
                        key={`${item.date}-${item.title}`}
                        type="button"
                        onClick={() => setActiveTimelineIndex(index)}
                        className={clsx(
                          "group relative rounded-[1.5rem] border border-transparent px-4 pb-5 pt-3 text-left transition-all duration-200 hover:-translate-y-1 hover:border-slate-200/80 hover:bg-white/70",
                          activeTimelineIndex === index && "border-slate-200/80 bg-white/80 shadow-[0_18px_45px_rgba(30,79,151,0.08)]"
                        )}
                      >
                        <span className="mb-5 mt-[2.35rem] block size-[18px] rounded-full bg-[radial-gradient(circle,white_18%,#39bfff_22%,#ff7b68_85%)] shadow-[0_0_18px_rgba(57,191,255,0.5)] transition-transform duration-200 group-hover:scale-110" />
                        <span className="block text-xs uppercase tracking-[0.24em] text-blue-deep">{item.date}</span>
                        <span className="mt-3 block max-w-[16ch] text-lg font-semibold text-ink">{item.title}</span>
                        <span className="mt-3 inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-medium text-coral">
                          {item.badge}
                        </span>
                        <p className="mt-4 max-w-[26ch] text-sm leading-7 text-muted">{item.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            );
          case "projects":
            return (
              <section key={id} id="projects" className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-aurora backdrop-blur-xl md:p-8">
                <SectionTitle eyebrow="Featured Projects" title={content.projects.title} intro={content.projects.intro} />
                <div className="grid gap-6">
                  {content.projects.items.map((item) => (
                    <article
                      key={item.title}
                      className={clsx(
                        "grid gap-5 rounded-[1.8rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(30,79,151,0.08)] md:grid-cols-[0.88fr_1.12fr]",
                        item.featured && "bg-[linear-gradient(135deg,rgba(57,191,255,0.1),rgba(255,123,104,0.1)_64%,rgba(255,255,255,0.95))]"
                      )}
                    >
                      <div className="relative min-h-[280px] overflow-hidden rounded-[1.5rem]">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                      </div>
                      <div className="flex flex-col p-2">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-blue-deep">
                          <span>{item.metaLeft}</span>
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium tracking-[0.22em] text-blue-deep">
                            {item.metaRight}
                          </span>
                        </div>
                        <h3 className="text-2xl font-semibold text-ink">{item.title}</h3>
                        <p className="mt-4 leading-8 text-muted">{item.text}</p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          {item.bullets.map((bullet) => (
                            <div
                              key={bullet}
                              className="rounded-[1.1rem] border border-slate-200/70 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-muted"
                            >
                              {bullet}
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200/80 pt-5">
                          <p className="text-sm text-muted">適合在面試時延伸說明你的角色、方法與成果指標。</p>
                          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink">
                            Case Study
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          case "skills":
            return (
              <section key={id} id="skills" className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-aurora backdrop-blur-xl md:p-8">
                <SectionTitle eyebrow="Technical Stack" title={content.skills.title} />
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { title: content.skills.hardTitle, items: content.skills.hardItems, tone: "blue" },
                    { title: content.skills.softTitle, items: content.skills.softItems, tone: "coral" },
                  ].map((group) => (
                    <article key={group.title} className="rounded-[1.6rem] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(30,79,151,0.08)]">
                      <h3 className="text-xl font-semibold text-ink">{group.title}</h3>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {group.items.map((item, index) => (
                          <span
                            key={item}
                            className={clsx(
                              "inline-flex rounded-full px-4 py-2 text-sm",
                              group.tone === "blue"
                                ? [
                                    "bg-sky-100 text-sky-700",
                                    "bg-blue-100 text-blue-700",
                                    "bg-cyan-100 text-cyan-700",
                                    "bg-indigo-100 text-indigo-700",
                                    "bg-sky-50 text-sky-800",
                                  ][index % 5]
                                : [
                                    "bg-rose-100 text-rose-700",
                                    "bg-orange-100 text-orange-700",
                                    "bg-amber-100 text-amber-700",
                                    "bg-red-100 text-red-700",
                                    "bg-orange-50 text-orange-800",
                                  ][index % 5]
                            )}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          case "beyond":
            return (
              <section key={id} id="beyond" className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-aurora backdrop-blur-xl md:p-8">
                <SectionTitle eyebrow="Beyond the Resume" title={content.beyond.title} />
                <div className="rounded-[1.7rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(57,191,255,0.08),rgba(255,123,104,0.1))] p-6">
                  <p className="leading-8 text-muted">{content.beyond.text}</p>
                  <blockquote className="mt-6 rounded-[1.2rem] border-l-4 border-blue-glow bg-white/75 px-5 py-4 text-ink">
                    {content.beyond.highlight}
                  </blockquote>
                </div>
              </section>
            );
          default:
            return null;
        }
      }),
    [content, activeTimelineIndex]
  );

  const activeTimelineItem = activeTimelineIndex !== null ? content.journey.items[activeTimelineIndex] : null;

  return (
    <div className="mx-auto w-[min(1200px,calc(100%-20px))] py-4 md:w-[min(1200px,calc(100%-32px))]">
      <header className="relative min-h-[88vh] overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-aurora backdrop-blur-xl">
        <div className="absolute -right-10 -top-12 h-72 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,123,104,0.22),rgba(255,123,104,0))] blur-xl" />
        <div className="absolute -left-14 bottom-2 h-64 w-80 rounded-full bg-[radial-gradient(circle,rgba(57,191,255,0.28),rgba(57,191,255,0))] blur-xl" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))]" />

        <nav className="relative z-10 mb-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="#top" className="text-sm uppercase tracking-[0.2em] text-ink">
            {content.hero.englishName}
          </Link>
          <div className="flex flex-wrap gap-4 text-sm text-ink">
            <Link href="#projects">{content.nav.projects}</Link>
            <Link href="#about">{content.nav.strengths}</Link>
            <Link href="#journey">{content.nav.journey}</Link>
            <Link href="#skills">{content.nav.skills}</Link>
            <Link href="#contact">{content.nav.contact}</Link>
            <Link href="/admin">{content.nav.admin}</Link>
          </div>
        </nav>

        <section id="top" className="relative z-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/75 px-4 py-2 shadow-[0_16px_32px_rgba(30,79,151,0.06)]">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-glow to-coral" />
              <p className="text-[11px] uppercase tracking-[0.28em] text-blue-deep">{content.hero.eyebrow}</p>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.32em] text-coral">{content.hero.englishName}</p>
            <h1 className="mt-4 max-w-[11ch] font-serif text-5xl font-semibold leading-[1.02] text-ink md:text-7xl">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted md:text-lg">{content.hero.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={content.hero.primaryHref} className="rounded-full bg-gradient-to-r from-blue-deep to-blue-glow px-5 py-3 text-sm font-medium text-white shadow-[0_16px_40px_rgba(31,120,255,0.25)]">
                {content.hero.primaryLabel}
              </Link>
              <Link href={content.hero.secondaryHref} className="rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-ink">
                {content.hero.secondaryLabel}
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <HeroFactCard label="Focus" value={content.hero.quickFacts[0] ?? ""} />
              <HeroFactCard label="Research" value={content.hero.quickFacts[1] ?? ""} />
              <HeroFactCard label="Execution" value={content.hero.quickFacts[2] ?? ""} />
            </div>
          </div>

          <aside className="rounded-[1.9rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(30,79,151,0.08)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
              <Image src={content.hero.portraitUrl} alt={content.hero.portraitAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 32vw" />
            </div>
            <div className="grid gap-4 px-2 pb-2 pt-5">
              <div>
                <p className="text-base font-medium text-ink">自然光影中的專業印象</p>
                <p className="mt-2 text-sm leading-7 text-muted">穩定、可信賴、適合求職首頁的專業形象，讓第一眼更像正式作品集。</p>
              </div>
              <div className="grid gap-3 rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-blue-deep">Target Role</p>
                    <p className="mt-2 text-sm font-medium text-ink">Product Manager / Associate PM</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Open to Work</span>
                </div>
                <p className="text-sm leading-7 text-muted">用更接近履歷摘要的方式，快速交代你的定位與求職狀態。</p>
              </div>
            </div>
          </aside>
        </section>
      </header>

      <main className="mt-6 grid gap-6">{orderedSections}</main>

      <footer id="contact" className="mt-6 grid gap-6 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-aurora backdrop-blur-xl md:grid-cols-[1.2fr_0.8fr] md:items-end md:p-8">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-blue-deep">Contact & CTA</p>
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">{content.contact.title}</h2>
        </div>
        <div className="grid gap-3 text-left md:text-right">
          <a href={`mailto:${content.contact.email}`} className="text-ink underline-offset-4 hover:underline">
            {content.contact.email}
          </a>
          <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="text-ink underline-offset-4 hover:underline">
            {content.contact.linkedinLabel}
          </a>
          <a
            href={content.contact.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[linear-gradient(135deg,rgba(255,123,104,0.16),rgba(57,191,255,0.16))] px-5 py-3 text-sm font-medium text-ink md:ml-auto"
          >
            {content.contact.resumeLabel}
          </a>
        </div>
      </footer>

      {activeTimelineItem ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/55 p-6 backdrop-blur-md" onClick={() => setActiveTimelineIndex(null)}>
          <div
            className="relative w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/95 p-8 shadow-[0_40px_100px_rgba(10,22,48,0.3)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-2xl text-ink"
              onClick={() => setActiveTimelineIndex(null)}
            >
              &times;
            </button>
            <p className="text-xs uppercase tracking-[0.24em] text-blue-deep">{activeTimelineItem.date}</p>
            <h3 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-6xl">{activeTimelineItem.title}</h3>
            <p className="mt-6 inline-flex rounded-full bg-coral/15 px-4 py-2 text-sm text-coral">{activeTimelineItem.badge}</p>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-muted">{activeTimelineItem.text}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
