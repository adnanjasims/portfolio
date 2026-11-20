import { useRef, useState } from "react";
import { PROJECTS } from "../data/projects";
import { GITHUB_URL, LINKEDIN_URL } from "../social";
import { playHover, playMove, playSelect } from "../utils/arcadeSfx";
import { SkillPixelIcon } from "./SkillPixelIcons";
import { GitHubPixelLogo, LinkedInPixelLogo } from "./SocialPixelIcons";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

const MINI_SKILLS = [
  { group: "LANG", items: ["Python", "TypeScript", "JavaScript (Next, React, Node)", "SQL", "Java", "C"] },
  { group: "DATA", items: ["PostgreSQL", "Pandas", "NumPy", "Scikit-Learn", "BigQuery", "GraphQL"] },
  { group: "AI/ML", items: ["PyTorch", "TensorFlow", "RAG", "Reinforcement Learning", "MCP", "Gemini API"] },
  { group: "CLOUD", items: ["AWS", "Docker", "Kubernetes", "Git", "CI/CD", "Linux"] },
];

const MINI_EXPERIENCE = [
  {
    role: "Software Developer",
    company: "GleamCo",
    period: "May 2026 - Aug 2026",
    note: "TypeScript/Next.js/SQL CRM migration, NextAuth RBAC, $80k+ processed, quotes 10m to <2m.",
  },
  {
    role: "Sales Representative",
    company: "TELUS Communications Inc.",
    period: "May 2024 - Aug 2024",
    note: "Generated $59,256 in technology service contracts.",
  },
];

const BROWSER_TABS = [
  { id: "hero", label: "TOP" },
  { id: "skills", label: "SKILLS" },
  { id: "edu", label: "EDU" },
  { id: "exp", label: "EXP" },
  { id: "proj", label: "PROJ" },
  { id: "chess", label: "CHESS" },
  { id: "links", label: "LINKS" },
];

/**
 * Low-res pixelized scrollable mini-browser inside Tiny OS rendering Adnan's portfolio.
 */
export default function TinyOsBrowserApp({ onOpenProject }) {
  const scrollBoxRef = useRef(null);
  const sectionRefs = useRef({});
  const [lofiMode, setLofiMode] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const [expandedProjId, setExpandedProjId] = useState(PROJECTS[0].id);

  const jumpTo = (secId) => {
    playMove();
    setActiveTab(secId);
    const box = scrollBoxRef.current;
    const target = sectionRefs.current[secId];
    if (box && target) {
      box.scrollTo({
        top: Math.max(0, target.offsetTop - box.offsetTop - 6),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#030706]">
      {/* Browser Address + Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-cyan-500/35 bg-[#081316] px-2 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            onClick={() => jumpTo("hero")}
            className="cursor-pointer border border-cyan-500/40 bg-black/60 px-1.5 py-0.5 text-[7px] text-cyan-300 hover:bg-cyan-500/20"
            style={PIXEL_FONT}
            title="Home"
          >
            HOME
          </button>
          <div className="arcade-body flex min-w-0 flex-1 items-center border border-cyan-500/30 bg-black/80 px-2 py-0.5 text-[10px] text-emerald-300">
            <span className="truncate">http://adnan.local/#{activeTab}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playSelect();
            setLofiMode((v) => !v);
          }}
          className={`cursor-pointer border px-1.5 py-0.5 text-[7px] transition ${
            lofiMode
              ? "border-amber-400/80 bg-amber-950/60 text-amber-300"
              : "border-cyan-400/60 bg-cyan-950/50 text-cyan-200"
          }`}
          style={PIXEL_FONT}
          title="Toggle retro pixel CRT filter"
        >
          {lofiMode ? "8-BIT:ON" : "8-BIT:OFF"}
        </button>
      </div>

      {/* Quick Nav Strip */}
      <div className="flex flex-wrap gap-1 border-b border-white/10 bg-[#050b0b] px-2 py-1">
        {BROWSER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => jumpTo(tab.id)}
            className={`cursor-pointer border px-1.5 py-0.5 text-[6.5px] transition ${
              activeTab === tab.id
                ? "border-cyan-300 bg-cyan-400 text-black"
                : "border-white/15 bg-black/50 text-white/70 hover:border-cyan-400/60 hover:text-cyan-200"
            }`}
            style={PIXEL_FONT}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pixelized Scrollable Mini-Portfolio Viewport */}
      <div
        ref={scrollBoxRef}
        className={`relative flex-1 space-y-3 overflow-y-auto overscroll-contain p-2.5 ${
          lofiMode ? "tiny-browser-lofi" : ""
        }`}
        style={{
          imageRendering: "pixelated",
          backgroundImage: lofiMode
            ? "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px), radial-gradient(circle at top center, rgba(16,185,129,0.08), rgba(2,6,23,0.95))"
            : "none",
        }}
      >
        {/* Pixel Hero Card */}
        <section
          ref={(el) => {
            sectionRefs.current.hero = el;
          }}
          className="border-2 border-amber-400/70 bg-black/85 p-2.5 shadow-[3px_3px_0_rgba(251,191,36,0.25)]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-amber-500/30 pb-1.5">
            <span className="text-[8px] text-amber-300" style={PIXEL_FONT}>
              ADNAN.OS // MINI WEB
            </span>
            <span className="border border-emerald-400/60 bg-emerald-950/70 px-1 py-0.5 text-[6px] text-emerald-300" style={PIXEL_FONT}>
              1996 EDITION
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-white" style={PIXEL_FONT}>
            Hi, I&apos;m Adnan.
            <span className="intro-cursor-blink ml-1.5 inline-block h-[0.8em] w-[0.55em] bg-amber-400 align-middle" />
          </p>
          <p className="arcade-body mt-1 text-[11px] text-emerald-200/80">
            CS @ University of Alberta · Full-Stack, ML &amp; Systems
          </p>
        </section>

        {/* Pixel Dither Divider */}
        <div
          aria-hidden="true"
          className="h-1.5 w-full opacity-55"
          style={{
            backgroundImage: "repeating-conic-gradient(#fbbf24 0% 25%, #06120c 0% 50%)",
            backgroundSize: "6px 6px",
          }}
        />

        {/* Pixel Skills */}
        <section
          ref={(el) => {
            sectionRefs.current.skills = el;
          }}
          className="border-2 border-white/25 bg-black/80 p-2.5 shadow-[3px_3px_0_rgba(255,255,255,0.08)]"
        >
          <h3 className="mb-2 text-[8px] uppercase text-amber-300" style={PIXEL_FONT}>
            [ SKILLS MATRIX ]
          </h3>
          <div className="space-y-2">
            {MINI_SKILLS.map((cat) => (
              <div key={cat.group} className="border border-white/15 bg-[#070b0a] p-1.5">
                <p className="mb-1 text-[6.5px] text-cyan-300" style={PIXEL_FONT}>
                  {cat.group}
                </p>
                <div className="flex flex-wrap gap-1">
                  {cat.items.map((skill) => (
                    <span
                      key={skill}
                      onMouseEnter={() => playHover()}
                      className="arcade-body inline-flex items-center gap-1 border border-white/20 bg-black px-1.5 py-0.5 text-[10px] text-white/85"
                    >
                      <SkillPixelIcon name={skill} className="h-3 w-3 shrink-0" />
                      <span>{skill.split(" (")[0]}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pixel Education Plaque */}
        <section
          ref={(el) => {
            sectionRefs.current.edu = el;
          }}
          className="border-2 border-[#275D38] bg-[#061c10] p-2.5 shadow-[3px_3px_0_rgba(39,93,56,0.45)]"
        >
          <p className="text-[8px] text-[#FECB00]" style={PIXEL_FONT}>
            UALBERTA · B.S. CS
          </p>
          <p className="arcade-body mt-1 text-[11px] text-[#d5f0df]">
            Sep 2022 - Dec 2026 · GPA 3.6 · Dean&apos;s Honor Roll
          </p>
        </section>

        {/* Pixel Experience */}
        <section
          ref={(el) => {
            sectionRefs.current.exp = el;
          }}
          className="border-2 border-amber-500/45 bg-black/80 p-2.5 shadow-[3px_3px_0_rgba(251,191,36,0.16)]"
        >
          <h3 className="mb-2 text-[8px] uppercase text-amber-300" style={PIXEL_FONT}>
            [ EXPERIENCE LOG ]
          </h3>
          <div className="space-y-2">
            {MINI_EXPERIENCE.map((exp) => (
              <div key={exp.company} className="border border-white/15 bg-[#09090d] p-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <span className="text-[7px] text-white" style={PIXEL_FONT}>
                    {exp.role} @ {exp.company}
                  </span>
                  <span className="arcade-body text-[10px] text-amber-300/80">{exp.period}</span>
                </div>
                <p className="arcade-body mt-1 text-[10.5px] leading-snug text-white/75">{exp.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pixel Projects */}
        <section
          ref={(el) => {
            sectionRefs.current.proj = el;
          }}
          className="border-2 border-cyan-500/45 bg-black/80 p-2.5 shadow-[3px_3px_0_rgba(34,211,238,0.15)]"
        >
          <h3 className="mb-2 text-[8px] uppercase text-cyan-300" style={PIXEL_FONT}>
            [ PROJECT CARTRIDGES ]
          </h3>
          <div className="space-y-1.5">
            {PROJECTS.map((proj, idx) => {
              const isOpen = expandedProjId === proj.id;
              return (
                <div key={proj.id} className="border border-white/15 bg-[#05080b]">
                  <button
                    type="button"
                    onClick={() => {
                      playMove();
                      setExpandedProjId(isOpen ? null : proj.id);
                    }}
                    className="flex w-full cursor-pointer items-center justify-between px-2 py-1 text-left hover:bg-cyan-500/10"
                  >
                    <span className="text-[7px] text-amber-200" style={PIXEL_FONT}>
                      {String(idx + 1).padStart(2, "0")}. {proj.label}
                    </span>
                    <span className="arcade-body text-[10px] text-cyan-300">
                      {isOpen ? "[-]" : "[+]"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/10 px-2 py-1.5">
                      <p className="arcade-body text-[10.5px] leading-snug text-white/80">
                        {proj.description}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="arcade-body text-[10px] text-emerald-300/80">
                          {proj.stack}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            playSelect();
                            onOpenProject?.(proj.id);
                          }}
                          className="cursor-pointer border border-amber-400/70 bg-amber-950/60 px-1.5 py-0.5 text-[6.5px] text-amber-300 hover:bg-amber-400 hover:text-black"
                          style={PIXEL_FONT}
                        >
                          LAUNCH MODAL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Pixel Chess Club Preview */}
        <section
          ref={(el) => {
            sectionRefs.current.chess = el;
          }}
          className="border-2 border-[#275D38] bg-[#06140c] p-2.5 shadow-[3px_3px_0_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="h-10 w-10 shrink-0 border-2 border-amber-400/60"
              style={{
                backgroundImage: "repeating-conic-gradient(#d1fae5 0% 25%, #064e3b 0% 50%)",
                backgroundSize: "10px 10px",
              }}
            />
            <div>
              <p className="text-[7.5px] text-emerald-300" style={PIXEL_FONT}>
                CHESS CLUB CABINET
              </p>
              <p className="arcade-body mt-1 text-[10.5px] text-emerald-100/80">
                Python &amp; C++ UCI engine with alpha-beta search. Scroll down to play live.
              </p>
            </div>
          </div>
        </section>

        {/* Pixel Links Footer */}
        <section
          ref={(el) => {
            sectionRefs.current.links = el;
          }}
          className="flex flex-wrap items-center justify-between gap-2 border-2 border-amber-500/40 bg-black/90 p-2.5"
        >
          <span className="arcade-body text-[10.5px] text-white/70">adnan.local · 8-bit mirror</span>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-amber-400/60 bg-amber-950/50 px-2 py-1 text-[6.5px] text-amber-300 hover:bg-amber-400 hover:text-black"
              style={PIXEL_FONT}
            >
              <GitHubPixelLogo className="h-3 w-3 shrink-0" />
              <span>GITHUB</span>
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-amber-400/60 bg-amber-950/50 px-2 py-1 text-[6.5px] text-amber-300 hover:bg-amber-400 hover:text-black"
              style={PIXEL_FONT}
            >
              <LinkedInPixelLogo className="h-3 w-3 shrink-0" />
              <span>LINKEDIN</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
