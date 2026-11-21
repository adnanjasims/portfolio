import { useEffect, useState } from "react";
import { TOP_RUNS } from "../data/projects";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

function RetroComputerIcon({ className = "h-12 w-12" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Square CRT monitor casing */}
      <rect x="2" y="1" width="12" height="10" fill="#cbd5e1" />
      <rect x="2" y="1" width="12" height="1" fill="#f8fafc" />
      <rect x="2" y="10" width="12" height="1" fill="#64748b" />
      {/* Dark recessed CRT screen */}
      <rect x="3" y="2" width="10" height="7" fill="#04120c" />
      {/* Pixel prompt inside CRT */}
      <rect x="4" y="4" width="1" height="1" fill="#34d399" />
      <rect x="5" y="5" width="1" height="1" fill="#34d399" />
      <rect x="4" y="6" width="1" height="1" fill="#34d399" />
      <rect x="7" y="6" width="3" height="1" fill="#fbbf24" />
      {/* Power LED */}
      <rect x="11" y="9" width="1" height="1" fill="#34d399" />
      {/* Desktop CPU / floppy base */}
      <rect x="4" y="11" width="8" height="1" fill="#64748b" />
      <rect x="2" y="12" width="12" height="3" fill="#94a3b8" />
      <rect x="3" y="13" width="5" height="1" fill="#1e293b" />
      <rect x="10" y="13" width="2" height="1" fill="#fbbf24" />
    </svg>
  );
}

function RetroRebootIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="2" width="6" height="2" />
      <rect x="3" y="4" width="2" height="3" />
      <rect x="11" y="4" width="2" height="2" />
      <rect x="10" y="5" width="4" height="2" />
      <rect x="12" y="3" width="2" height="2" />
      <rect x="3" y="9" width="2" height="3" />
      <rect x="5" y="12" width="6" height="2" />
      <rect x="11" y="9" width="2" height="3" />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "intro", label: "INTRO" },
  { id: "skills", label: "SKILLS" },
  { id: "education", label: "EDUCATION" },
  { id: "os", label: "TINY OS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "chess", label: "CHESS" },
];

/**
 * Left and right arcade walls: identity, interactive nav, clickable TOP RUNS, credits & boot replay.
 */
export default function ArcadeSidePanels({
  selectedProjectId,
  onSelectTopRun,
  onJumpSection,
  credits = 0,
  onInsertCoin,
  onReplayBoot,
  onOpenTerminal,
}) {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.id);
    const updateActive = () => {
      const offset = 180;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <>
      {/* Mobile quick-jump & status bar (< md) */}
      <nav
        aria-label="Mobile section navigation"
        className="arcade-screen sticky top-0 z-20 flex items-center gap-1.5 overflow-x-auto border-b-2 border-amber-500/35 bg-[#08080c]/95 px-2.5 py-2 md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onJumpSection?.(item.id)}
              className={`shrink-0 cursor-pointer rounded border px-2 py-1 text-[7px] uppercase transition focus:outline-none ${isActive
                ? "border-amber-300 bg-amber-400 text-black"
                : "border-white/20 bg-black/70 text-white/75 hover:border-amber-400/60 hover:text-amber-300"
                }`}
              style={PIXEL_FONT}
            >
              {item.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onInsertCoin?.()}
          className="ml-auto shrink-0 cursor-pointer rounded border border-emerald-500/50 bg-emerald-950/60 px-2 py-1 text-[7px] tabular-nums text-emerald-300"
          style={PIXEL_FONT}
          title="Insert coin"
        >
          CRD {String(credits).padStart(2, "0")}
        </button>
      </nav>

      <aside className="arcade-screen fixed left-0 top-16 z-10 hidden h-[calc(100vh-4rem)] w-[190px] flex-shrink-0 flex-col items-center overflow-y-auto border-r-4 border-amber-500/30 bg-[#08080c]/65 py-5 md:flex lg:w-[228px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, rgba(251,191,36,0.03) 8px, rgba(251,191,36,0.03) 10px)",
          }}
        />
        <div className="relative flex w-full flex-col items-center gap-4 px-3">
          <div className="w-full rounded border-2 border-amber-500/40 bg-black/80 p-3 text-center">
            <p className="text-[8px] text-amber-400/90 lg:text-[9px]" style={PIXEL_FONT}>
              PLAYER
            </p>
            <p className="mt-2 text-[13px] text-amber-300 lg:text-[15px]" style={PIXEL_FONT}>
              ADNAN
            </p>
          </div>

          <nav aria-label="Section quick jump" className="w-full rounded border-2 border-white/20 bg-black/60 p-3">
            <p className="mb-2 text-[8px] text-white/75" style={PIXEL_FONT}>
              STAGE MAP
            </p>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onJumpSection?.(item.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-1.5 py-1 text-left text-[7px] transition focus:outline-none ${isActive
                      ? "bg-amber-400/15 text-amber-300"
                      : "text-white/55 hover:bg-white/10 hover:text-white"
                      }`}
                    style={PIXEL_FONT}
                  >
                    <span>{item.label}</span>
                    {isActive && <span>&lt;</span>}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="w-full rounded border-2 border-white/20 bg-black/60 p-3">
            <p className="mb-2 text-[8px] text-white/75" style={PIXEL_FONT}>
              TOP RUNS
            </p>
            <div className="space-y-1">
              {TOP_RUNS.map((run) => {
                const isCurrent = selectedProjectId === run.id;
                return (
                  <button
                    key={run.id}
                    type="button"
                    onClick={() => onSelectTopRun?.(run.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-1.5 py-1 text-left text-[7px] leading-relaxed transition focus:outline-none ${isCurrent
                      ? "bg-amber-400 text-black"
                      : "text-white/60 hover:bg-white/10 hover:text-amber-300"
                      }`}
                    style={PIXEL_FONT}
                  >
                    <span>
                      {run.rank}. {run.label}
                    </span>
                    {isCurrent && <span>&gt;</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <aside className="arcade-screen fixed right-0 top-16 z-10 hidden h-[calc(100vh-4rem)] w-[190px] flex-shrink-0 flex-col items-center overflow-y-auto border-l-4 border-amber-500/30 bg-[#08080c]/65 py-5 md:flex lg:w-[228px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-90deg, transparent 0, transparent 8px, rgba(251,191,36,0.03) 8px, rgba(251,191,36,0.03) 10px)",
          }}
        />
        <div className="relative flex w-full flex-col items-center gap-3.5 px-3">
          <div className="w-full rounded border-2 border-amber-500/40 bg-black/80 p-3 text-center">
            <p className="mb-2 text-[7.5px] leading-relaxed text-amber-400/90 lg:text-[8.5px]" style={PIXEL_FONT}>
              BUILT WITH
            </p>
            <div className="space-y-1.5 text-[7px] text-white/65 lg:text-[8px]" style={PIXEL_FONT}>
              <p>REACT</p>
              <p>VITE</p>
              <p>TAILWIND</p>
              <p>KABOOM</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onInsertCoin?.()}
            className="w-full cursor-pointer rounded border-2 border-emerald-500/35 bg-black/60 p-2.5 text-center transition hover:border-emerald-400 hover:bg-emerald-950/30 active:translate-y-0.5 focus:outline-none"
            title="Insert coin"
          >
            <p className="text-[8px] leading-relaxed text-emerald-400/90 lg:text-[9px]" style={PIXEL_FONT}>
              CREDITS
            </p>
            <p className="mt-1 text-[11px] tabular-nums text-emerald-300" style={PIXEL_FONT}>
              {String(credits).padStart(2, "0")}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onReplayBoot?.()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded border-2 border-amber-500/50 bg-black/75 px-3 py-3 text-[8px] uppercase text-amber-300/90 transition hover:border-amber-400 hover:bg-amber-950/45 hover:text-amber-200 active:translate-y-0.5 focus:outline-none lg:text-[9px]"
            style={PIXEL_FONT}
            title="Reboot CRT startup sequence"
          >
            <RetroRebootIcon className="h-4 w-4 shrink-0" />
            <span>REBOOT</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenTerminal?.()}
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded border-2 border-emerald-500/60 bg-emerald-950/40 p-3 text-emerald-300 shadow-[inset_0_1px_0_rgba(52,211,153,0.18)] transition hover:border-emerald-300 hover:bg-emerald-900/45 active:translate-y-0.5 focus:outline-none"
            style={PIXEL_FONT}
            title="Open Tiny OS Terminal (~)"
          >
            <RetroComputerIcon className="h-24 w-24 lg:h-28 lg:w-28" />
            <span className="text-[7.5px] uppercase lg:text-[8.5px]">TERM (~)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
