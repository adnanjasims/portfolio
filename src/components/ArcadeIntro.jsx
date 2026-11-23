import { useEffect, useRef, useState } from "react";
import { playHover, playKeyBlip, playSelect } from "../utils/arcadeSfx";
import { SkillPixelIcon } from "./SkillPixelIcons";

/**
 * Arcade-style intro: typed greeting with interactive cursor gag, retro skills grid, and UAlberta education plaque.
 */
const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };
const INTRO_TEXT = "Hi, I'm Adnan. Welcome to my website.";
const INTRO_GAG_TEXT = "Why are you trying to type here? Scroll.";
const TYPING_DURATION_MS = 3000;

const DEANS_HONOR_ROLL_PDF_URL =
  "https://www.ualberta.ca/en/science/media-library/studentservices/dhr-2024-2025-updated.pdf";

function PixelParchmentIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* White parchment scroll body */}
      <rect x="3" y="2" width="10" height="12" fill="#f8fafc" />
      <rect x="2" y="2" width="1" height="3" fill="#cbd5e1" />
      <rect x="13" y="1" width="1" height="3" fill="#e2e8f0" />
      <rect x="2" y="12" width="11" height="2" fill="#e2e8f0" />
      <rect x="3" y="1" width="10" height="1" fill="#94a3b8" />
      <rect x="3" y="14" width="10" height="1" fill="#64748b" />
      {/* Subtle parchment text lines */}
      <rect x="5" y="4" width="6" height="1" fill="#94a3b8" />
      <rect x="5" y="6" width="6" height="1" fill="#94a3b8" />
      <rect x="5" y="8" width="4" height="1" fill="#94a3b8" />
      {/* Red ribbon & wax seal */}
      <rect x="9" y="9" width="4" height="4" fill="#ef4444" />
      <rect x="10" y="10" width="2" height="2" fill="#dc2626" />
      <rect x="9" y="13" width="1" height="2" fill="#b91c1c" />
      <rect x="12" y="13" width="1" height="2" fill="#b91c1c" />
    </svg>
  );
}

function PixelCodeLogo({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left < */}
      <rect x="3" y="4" width="2" height="2" />
      <rect x="1" y="6" width="2" height="4" />
      <rect x="3" y="10" width="2" height="2" />
      {/* Middle / */}
      <rect x="7" y="3" width="2" height="2" opacity="0.7" />
      <rect x="6" y="5" width="2" height="6" opacity="0.85" />
      <rect x="5" y="11" width="2" height="2" opacity="0.7" />
      {/* Right > + blinking compiler cursor */}
      <rect x="9" y="4" width="2" height="2" />
      <rect x="11" y="6" width="2" height="4" />
      <rect x="9" y="10" width="2" height="2" />
      <rect x="13" y="11" width="2" height="2" className="skill-anim-cursor" />
    </svg>
  );
}

function PixelDataLogo({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Database cylinder + animated data cleaning/sorting bars */}
      <rect x="2" y="2" width="12" height="2" />
      <rect x="2" y="4" width="2" height="10" />
      <rect x="12" y="4" width="2" height="10" />
      <rect x="2" y="13" width="12" height="1" />
      <rect x="5" y="5" width="4" height="2" className="skill-anim-data-1" />
      <rect x="5" y="8" width="6" height="2" className="skill-anim-data-2" />
      <rect x="5" y="11" width="5" height="1" className="skill-anim-data-3" />
    </svg>
  );
}

function PixelAiMlLogo({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Input layer nodes */}
      <rect x="1" y="3" width="2" height="2" className="skill-anim-nn-1" />
      <rect x="1" y="7" width="2" height="2" className="skill-anim-nn-1" />
      <rect x="1" y="11" width="2" height="2" className="skill-anim-nn-1" />
      {/* Synapses */}
      <rect x="3" y="4" width="4" height="1" opacity="0.45" className="skill-anim-nn-2" />
      <rect x="3" y="8" width="4" height="1" opacity="0.45" className="skill-anim-nn-2" />
      <rect x="3" y="11" width="4" height="1" opacity="0.45" className="skill-anim-nn-2" />
      {/* Hidden core */}
      <rect x="7" y="4" width="2" height="2" className="skill-anim-nn-2" />
      <rect x="7" y="7" width="2" height="2" className="skill-anim-nn-2" />
      <rect x="7" y="10" width="2" height="2" className="skill-anim-nn-2" />
      {/* Output synapses + node */}
      <rect x="9" y="6" width="4" height="1" opacity="0.5" className="skill-anim-nn-3" />
      <rect x="9" y="9" width="4" height="1" opacity="0.5" className="skill-anim-nn-3" />
      <rect x="13" y="6" width="2" height="4" className="skill-anim-nn-3" />
    </svg>
  );
}

function PixelToolsLogo({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Classic crossed 8-bit Wrench & Screwdriver (unambiguous Tools icon) */}
      <g className="skill-anim-tool">
        {/* Wrench jaw (top-left) */}
        <rect x="1" y="2" width="2" height="3" />
        <rect x="2" y="1" width="3" height="2" />
        <rect x="4" y="2" width="2" height="2" />
        <rect x="2" y="4" width="2" height="2" />
        {/* Wrench diagonal shaft -> bottom-right handle */}
        <rect x="4" y="4" width="2" height="2" />
        <rect x="6" y="6" width="2" height="2" />
        <rect x="8" y="8" width="2" height="2" />
        <rect x="10" y="10" width="2" height="2" />
        <rect x="11" y="11" width="3" height="3" />
      </g>
      {/* Screwdriver (top-right -> bottom-left) */}
      <g className="skill-anim-driver" opacity="0.85">
        <rect x="12" y="1" width="3" height="2" />
        <rect x="11" y="2" width="2" height="2" />
        <rect x="9" y="4" width="2" height="2" />
        <rect x="5" y="8" width="2" height="2" />
        <rect x="3" y="10" width="2" height="2" />
        <rect x="1" y="12" width="3" height="3" />
      </g>
    </svg>
  );
}

function UAlbertaPixelCrest({ className = "h-16 w-14" }) {
  return (
    <svg
      viewBox="0 0 20 24"
      className={className}
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Inner UAlberta Green shield field */}
      <rect x="3" y="2" width="14" height="13" fill="#275D38" />
      <rect x="4" y="15" width="12" height="2" fill="#275D38" />
      <rect x="5" y="17" width="10" height="1" fill="#275D38" />
      <rect x="6" y="18" width="8" height="1" fill="#275D38" />
      <rect x="7" y="19" width="6" height="1" fill="#275D38" />
      <rect x="8" y="20" width="4" height="1" fill="#275D38" />

      {/* Deep green lower shadow band for subtle depth */}
      <rect x="4" y="12" width="12" height="4" fill="#1b4629" />
      <rect x="6" y="16" width="8" height="4" fill="#1b4629" />

      {/* Gold chief with dancetty (mountain) teeth */}
      <rect x="3" y="2" width="14" height="4" fill="#FECB00" />
      <rect x="3" y="6" width="2" height="1" fill="#FECB00" />
      <rect x="7" y="6" width="2" height="1" fill="#FECB00" />
      <rect x="11" y="6" width="2" height="1" fill="#FECB00" />
      <rect x="15" y="6" width="2" height="1" fill="#FECB00" />

      {/* Open book in chief */}
      <rect x="6" y="3" width="3" height="2" fill="#FFFDF5" />
      <rect x="11" y="3" width="3" height="2" fill="#FFFDF5" />
      <rect x="9" y="3" width="2" height="2" fill="#1b4629" />
      <rect x="6" y="5" width="8" height="1" fill="#1b4629" />

      {/* Silver-white wavy river bar */}
      <rect x="3" y="9" width="3" height="1" fill="#E6F5EC" />
      <rect x="8" y="9" width="4" height="1" fill="#E6F5EC" />
      <rect x="14" y="9" width="3" height="1" fill="#E6F5EC" />
      <rect x="5" y="10" width="4" height="1" fill="#CBEBD8" />
      <rect x="11" y="10" width="4" height="1" fill="#CBEBD8" />

      {/* Golden wheat stalks in base */}
      <rect x="9" y="13" width="2" height="1" fill="#FECB00" />
      <rect x="9" y="15" width="2" height="1" fill="#FECB00" />
      <rect x="9" y="17" width="2" height="2" fill="#D9A800" />
      <rect x="6" y="14" width="2" height="1" fill="#FECB00" />
      <rect x="7" y="16" width="1" height="1" fill="#D9A800" />
      <rect x="12" y="14" width="2" height="1" fill="#FECB00" />
      <rect x="12" y="16" width="1" height="1" fill="#D9A800" />

      {/* Gold shield border */}
      <rect x="2" y="1" width="16" height="1" fill="#FECB00" />
      <rect x="2" y="2" width="1" height="13" fill="#FECB00" />
      <rect x="17" y="2" width="1" height="13" fill="#FECB00" />
      <rect x="3" y="15" width="1" height="2" fill="#FECB00" />
      <rect x="16" y="15" width="1" height="2" fill="#FECB00" />
      <rect x="4" y="17" width="1" height="1" fill="#FECB00" />
      <rect x="15" y="17" width="1" height="1" fill="#FECB00" />
      <rect x="5" y="18" width="1" height="1" fill="#FECB00" />
      <rect x="14" y="18" width="1" height="1" fill="#FECB00" />
      <rect x="6" y="19" width="1" height="1" fill="#FECB00" />
      <rect x="13" y="19" width="1" height="1" fill="#FECB00" />
      <rect x="7" y="20" width="1" height="1" fill="#FECB00" />
      <rect x="12" y="20" width="1" height="1" fill="#FECB00" />
      <rect x="8" y="21" width="4" height="1" fill="#FECB00" />
    </svg>
  );
}

const SKILL_CATEGORIES = [
  {
    id: "languages",
    title: "Languages & Frameworks",
    Logo: PixelCodeLogo,
    items: [
      "Python",
      "TypeScript",
      "JavaScript (Next, React, Node)",
      "SQL",
      "Java",
      "C",
      "HTML/CSS",
    ],
  },
  {
    id: "data",
    title: "Data",
    Logo: PixelDataLogo,
    items: [
      "PostgreSQL",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "BigQuery",
      "GraphQL",
      "NoSQL",
      "SQLite",
      "R",
    ],
  },
  {
    id: "ai-ml",
    title: "AI & ML",
    Logo: PixelAiMlLogo,
    items: [
      "PyTorch",
      "TensorFlow",
      "RAG",
      "Reinforcement Learning",
      "MCP",
      "Gemini API",
      "Claude",
      "Cursor",
      "Copilot",
      "Ollama",
    ],
  },
  {
    id: "cloud-devops",
    title: "Cloud, DevOps, & Tools",
    Logo: PixelToolsLogo,
    items: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "Linux",
      "Gradle",
    ],
  },
];

export default function ArcadeIntro({ startTyping = false }) {
  const [typedCount, setTypedCount] = useState(0);
  const [introArmed, setIntroArmed] = useState(false);
  const [gagCount, setGagCount] = useState(0);
  const introBoxRef = useRef(null);

  useEffect(() => {
    if (!startTyping) return undefined;

    let frameId = 0;
    let startDelayTimer = 0;

    // Wait briefly after the boot screen unmounts so the first letter is clearly visible.
    startDelayTimer = window.setTimeout(() => {
      const startedAt = performance.now();
      let lastTyped = 0;

      const tick = (now) => {
        const elapsed = now - startedAt;
        const progress = Math.min(1, elapsed / TYPING_DURATION_MS);
        const nextCount = Math.floor(progress * INTRO_TEXT.length);
        if (nextCount > lastTyped) {
          lastTyped = nextCount;
          if (INTRO_TEXT[nextCount - 1] !== " ") {
            playKeyBlip();
          }
          setTypedCount(nextCount);
        }

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        } else {
          setTypedCount(INTRO_TEXT.length);
        }
      };

      frameId = window.requestAnimationFrame(tick);
    }, 120);

    return () => {
      window.clearTimeout(startDelayTimer);
      window.cancelAnimationFrame(frameId);
    };
  }, [startTyping]);

  // Disarm intro typing capture when clicking outside the intro greeting block
  useEffect(() => {
    if (!introArmed) return undefined;

    const onDocPointerDown = (e) => {
      if (introBoxRef.current && !introBoxRef.current.contains(e.target)) {
        setIntroArmed(false);
      }
    };

    const onWindowKeyDown = (e) => {
      if (e.key === "Escape") {
        setIntroArmed(false);
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Tab" || e.key.startsWith("Arrow") || e.key === "PageUp" || e.key === "PageDown") {
        return;
      }
      if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        setTypedCount(INTRO_TEXT.length);
        setGagCount((prev) => Math.min(INTRO_GAG_TEXT.length, prev + 1));
        playKeyBlip();
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    window.addEventListener("keydown", onWindowKeyDown, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      window.removeEventListener("keydown", onWindowKeyDown, { capture: true });
    };
  }, [introArmed]);

  const handleArmIntro = () => {
    setIntroArmed(true);
    playSelect();
    introBoxRef.current?.focus({ preventScroll: true });
  };

  const displayedIntro = INTRO_TEXT.slice(0, typedCount);
  const displayedGag = INTRO_GAG_TEXT.slice(0, gagCount);
  const cursorStyleClass = introArmed
    ? "bg-sky-300 ring-2 ring-[#1d4ed8] shadow-[0_0_10px_rgba(56,189,248,0.75)]"
    : "bg-amber-400";

  return (
    <header
      id="intro"
      className="arcade-screen relative mx-auto w-full max-w-[65.5rem] px-4 pb-8 pt-10 text-left sm:px-5"
    >
      <div className="absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2 border-amber-500/50" />
      <div className="absolute right-2 top-2 h-6 w-6 border-r-2 border-t-2 border-amber-500/50" />
      <div className="absolute bottom-4 left-2 h-6 w-6 border-b-2 border-l-2 border-amber-500/50" />
      <div className="absolute bottom-4 right-2 h-6 w-6 border-b-2 border-r-2 border-amber-500/50" />

      <div
        ref={introBoxRef}
        tabIndex={0}
        onClick={handleArmIntro}
        role="textbox"
        aria-readonly="true"
        aria-label={INTRO_TEXT}
        className={`relative mb-8 cursor-text rounded px-2.5 py-2 transition-colors focus:outline-none ${introArmed
          ? "bg-[#040e24]/85 ring-2 ring-[#1e40af] shadow-[inset_0_0_24px_rgba(2,8,24,0.9),0_0_16px_rgba(30,64,175,0.28)]"
          : "hover:bg-[#040d21]/45"
          }`}
      >
        <div className="relative">
          <h1
            aria-hidden="true"
            className="invisible select-none text-[22px] leading-relaxed sm:text-[29px]"
            style={PIXEL_FONT}
          >
            {INTRO_TEXT}
            <span className="ml-2 inline-block h-[0.85em] w-[0.55em]" />
          </h1>
          <p
            aria-hidden="true"
            className="absolute inset-0 text-[22px] leading-relaxed text-white sm:text-[29px]"
            style={PIXEL_FONT}
          >
            {displayedIntro}
            {gagCount === 0 && (
              <span
                className={`intro-cursor-blink ml-2 inline-block h-[0.85em] w-[0.55em] align-middle ${cursorStyleClass}`}
              />
            )}
          </p>
        </div>

        {gagCount > 0 && (
          <div className="mt-2.5 flex min-h-[20px] items-center gap-2">
            <p className="arcade-body text-[13px] text-sky-200 sm:text-[15px]">
              <span className="mr-1.5 text-amber-400">&gt;</span>
              {displayedGag}
              <span
                className={`intro-cursor-blink ml-1.5 inline-block h-[0.95em] w-[0.55em] align-middle ${cursorStyleClass}`}
              />
            </p>
          </div>
        )}
      </div>

      {/* Skills grid */}
      <section id="skills" aria-labelledby="skills-heading" className="text-left">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-0.5 w-14 bg-amber-500/40" />
          <h2
            id="skills-heading"
            className="text-[11.5px] uppercase tracking-[0.25em] text-amber-400/95 sm:text-[14px]"
            style={PIXEL_FONT}
          >
            SKILLS
          </h2>
          <span className="h-0.5 w-14 bg-amber-500/40" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {SKILL_CATEGORIES.map((category) => {
            const Logo = category.Logo;
            return (
              <div
                key={category.id}
                className="group relative rounded border-2 border-white/20 bg-black/65 p-5 shadow-[0_10px_24px_rgba(0,0,0,0.45),inset_0_0_24px_rgba(0,0,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/80 hover:bg-gradient-to-b hover:from-amber-950/35 hover:to-black/85 hover:shadow-[0_14px_30px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(251,191,36,0.2)]"
              >
                <div className="mb-3.5 flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded border-2 border-amber-500/45 bg-black/80 text-amber-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)] transition-all duration-200 group-hover:scale-110 group-hover:border-amber-300 group-hover:bg-amber-400 group-hover:text-black group-hover:shadow-[0_6px_16px_rgba(251,191,36,0.3)]">
                    <Logo className="h-6 w-6 transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  <h3
                    className="text-[11.5px] leading-snug text-amber-300/95 transition-colors duration-200 group-hover:text-amber-200 sm:text-[13px]"
                    style={PIXEL_FONT}
                  >
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((skill) => (
                    <span
                      key={skill}
                      onMouseEnter={() => playHover()}
                      className="arcade-body inline-flex cursor-default items-center gap-2 rounded border border-white/15 bg-black/80 px-2.5 py-1 text-[12.5px] font-medium leading-snug text-white/85 transition-all duration-150 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-400 hover:text-black hover:shadow-[0_4px_12px_rgba(251,191,36,0.28)] sm:text-[14px]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-black/85 p-0.5">
                        <SkillPixelIcon name={skill} className="h-4 w-4" />
                      </span>
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Education section */}
      <section id="education" aria-labelledby="education-heading" className="mt-8 text-left">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-0.5 w-14 bg-amber-500/40" />
          <h2
            id="education-heading"
            className="text-[11.5px] uppercase tracking-[0.25em] text-amber-400/95 sm:text-[14px]"
            style={PIXEL_FONT}
          >
            EDUCATION
          </h2>
          <span className="h-0.5 w-14 bg-amber-500/40" />
        </div>

        <div className="rounded border-2 border-[#275D38] bg-gradient-to-b from-[#0b2919] via-[#071c11] to-[#04120b] p-5 text-left shadow-[0_14px_30px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(254,203,0,0.14)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded border-2 border-[#275D38] bg-[#04120b] shadow-[inset_0_2px_10px_rgba(0,0,0,0.85)]">
              <UAlbertaPixelCrest className="h-14 w-12" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3
                    className="text-[15px] leading-snug tracking-wide text-[#FECB00] sm:text-[17px]"
                    style={PIXEL_FONT}
                  >
                    University of Alberta
                  </h3>
                  <p className="arcade-body mt-1 text-[13.5px] text-[#a7d4ba] sm:text-[14.5px]">
                    Edmonton, Alberta, Canada
                  </p>
                </div>
                <p className="arcade-body shrink-0 text-[14.5px] font-medium tabular-nums text-[#a7d4ba] sm:text-[16px]">
                  Sep 2022 – Dec 2026
                </p>
              </div>

              <p className="arcade-body mt-1.5 text-[17px] font-semibold leading-snug tracking-wide text-[#f3faf5] sm:text-[19px]">
                Bachelor of Science (B.Sc.), Computer Science
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#275D38]/80 pt-2.5">
                <p className="arcade-body text-[15px] text-[#b7dec8] sm:text-[17px]">
                  <span className="font-semibold tabular-nums text-[#FECB00]">3.6</span>{" "}
                  GPA
                </p>
                <span className="text-[#275D38]" aria-hidden="true">
                  |
                </span>
                <a
                  href={DEANS_HONOR_ROLL_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Faculty of Science Dean's Honor Roll list (PDF)"
                  className="arcade-body inline-flex items-center gap-2 rounded border-2 border-[#FECB00]/60 bg-[#04120b]/90 px-3 py-1 text-[14.5px] font-semibold text-[#f3faf5] shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:border-[#FECB00] hover:bg-[#0d3320] hover:text-[#FECB00] sm:text-[16px]"
                >
                  <PixelParchmentIcon className="h-6 w-6 shrink-0" />
                  <span>Faculty of Science Dean&apos;s Honor Roll</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}
