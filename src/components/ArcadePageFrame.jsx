/**
 * Top marquee strip, social links, SFX toggle, and frame around main content.
 */
import { GITHUB_URL, LINKEDIN_URL } from "../social";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

export default function ArcadePageFrame({
  children,
  sfxEnabled = false,
  onToggleSfx,
  onOpenTerminal,
  overclockUnlocked = false,
  overclock = false,
  onToggleOverclock,
}) {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b-4 border-amber-500/50 bg-gradient-to-b from-amber-950/80 to-black px-4 py-3">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_20px,rgba(251,191,36,0.03)_20px,rgba(251,191,36,0.03)_22px)]" />
        <div className="relative z-10 flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] uppercase tracking-widest text-amber-400/90 hover:text-amber-200 sm:text-[9px]"
            style={PIXEL_FONT}
          >
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] uppercase tracking-widest text-amber-400/90 hover:text-amber-200 sm:text-[9px]"
            style={PIXEL_FONT}
          >
            LinkedIn
          </a>
        </div>

        <button
          type="button"
          onClick={scrollToProjects}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToProjects();
            }
          }}
          className="arcade-marquee-pulse relative z-10 cursor-pointer border-none bg-transparent p-0 text-center text-[10px] font-black uppercase tracking-[0.45em] text-amber-400/95 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)] transition hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:ring-offset-2 focus:ring-offset-black sm:text-[12px]"
          style={PIXEL_FONT}
          aria-label="Press start to scroll to projects"
        >
          PRESS START
        </button>

        <div className="relative z-10 flex items-center gap-2">
          {overclockUnlocked && (
            <button
              type="button"
              onClick={() => onToggleOverclock?.()}
              aria-pressed={overclock}
              className={`cursor-pointer rounded border px-2 py-1 text-[8px] uppercase tracking-wider transition focus:outline-none focus:ring-1 focus:ring-cyan-400 sm:text-[9px] ${
                overclock
                  ? "border-cyan-400 bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900/60"
                  : "border-white/25 bg-black/60 text-white/60 hover:border-cyan-400/70 hover:text-cyan-300"
              }`}
              style={PIXEL_FONT}
              title="Toggle Overclock mode"
            >
              OC: {overclock ? "ON" : "OFF"}
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenTerminal?.()}
            className="cursor-pointer rounded border border-emerald-500/60 bg-emerald-950/50 px-2.5 py-1 text-[8px] uppercase tracking-wider text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-900/50 focus:outline-none focus:ring-1 focus:ring-emerald-400 sm:text-[9px]"
            style={PIXEL_FONT}
            title="Open Portfolio Terminal (~)"
          >
            TERM
          </button>
          <button
            type="button"
            onClick={() => onToggleSfx?.()}
            aria-pressed={sfxEnabled}
            className={`cursor-pointer rounded border px-2.5 py-1 text-[8px] uppercase tracking-wider transition focus:outline-none focus:ring-1 focus:ring-amber-400 sm:text-[9px] ${
              sfxEnabled
                ? "border-emerald-400/80 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60"
                : "border-white/25 bg-black/60 text-white/60 hover:border-amber-400/70 hover:text-amber-300"
            }`}
            style={PIXEL_FONT}
            title="Toggle 8-bit sound effects"
          >
            SFX: {sfxEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 md:ml-[200px] md:mr-[200px] lg:ml-[240px] lg:mr-[240px]">
        <div className="arcade-frame relative w-full max-w-5xl flex-1 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
