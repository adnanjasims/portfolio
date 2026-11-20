import { useEffect, useState } from "react";
import { TOP_RUNS } from "../data/projects";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

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
      <aside className="arcade-screen fixed left-0 top-0 z-10 hidden h-full w-[200px] flex-shrink-0 flex-col items-center overflow-y-auto border-r-4 border-amber-500/30 bg-[#08080c]/65 py-6 md:flex lg:w-[240px]">
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
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-1.5 py-1 text-left text-[7px] transition focus:outline-none ${
                      isActive
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
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-1.5 py-1 text-left text-[7px] leading-relaxed transition focus:outline-none ${
                      isCurrent
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

      <aside className="arcade-screen fixed right-0 top-0 z-10 hidden h-full w-[200px] flex-shrink-0 flex-col items-center overflow-y-auto border-l-4 border-amber-500/30 bg-[#08080c]/65 py-6 md:flex lg:w-[240px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-90deg, transparent 0, transparent 8px, rgba(251,191,36,0.03) 8px, rgba(251,191,36,0.03) 10px)",
          }}
        />
        <div className="relative flex w-full flex-col items-center gap-4 px-3">
          <div className="w-full rounded border-2 border-white/20 bg-black/60 p-3 text-center">
            <p className="mb-2 text-[8px] text-white/75" style={PIXEL_FONT}>
              HOME BASE
            </p>
            <p className="text-[7px] leading-relaxed text-white/65 lg:text-[8px]" style={PIXEL_FONT}>
              UALBERTA
            </p>
            <p className="mt-1 text-[7px] leading-relaxed text-white/50" style={PIXEL_FONT}>
              CS · EDMONTON
            </p>
          </div>

          <div className="w-full rounded border-2 border-amber-500/40 bg-black/80 p-3 text-center">
            <p className="mb-2 text-[8px] text-amber-400/90 lg:text-[9px]" style={PIXEL_FONT}>
              BUILD
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
            onClick={() => onOpenTerminal?.()}
            className="w-full cursor-pointer rounded border-2 border-emerald-500/50 bg-emerald-950/35 px-2 py-2 text-[7px] uppercase text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-900/40 active:translate-y-0.5 focus:outline-none lg:text-[8px]"
            style={PIXEL_FONT}
          >
            TERMINAL (~)
          </button>

          <button
            type="button"
            onClick={() => onReplayBoot?.()}
            className="w-full cursor-pointer rounded border-2 border-amber-500/40 bg-black/70 px-2 py-2 text-[7px] uppercase text-amber-300/85 transition hover:border-amber-400 hover:bg-amber-950/40 hover:text-amber-200 active:translate-y-0.5 focus:outline-none lg:text-[8px]"
            style={PIXEL_FONT}
          >
            REPLAY BOOT
          </button>
        </div>
      </aside>
    </>
  );
}
