/**
 * Top marquee strip, social links, SFX toggle, and frame around main content.
 */
import { GITHUB_URL, LINKEDIN_URL } from "../social";
import { GitHubPixelLogo, LinkedInPixelLogo } from "./SocialPixelIcons";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

function RetroSfxLogo({ enabled }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-5 w-5 ${enabled ? "sfx-icon-on" : ""}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Retro pixel speaker body */}
      <rect x="2" y="6" width="3" height="4" fill="currentColor" />
      <rect x="5" y="4" width="2" height="8" fill="currentColor" />
      <rect x="7" y="2" width="2" height="12" fill="currentColor" />

      {enabled ? (
        <>
          {/* Stepped pixel sound waves when ON */}
          <rect x="10" y="6" width="1" height="4" fill="#34d399" />
          <rect x="12" y="4" width="1" height="2" fill="#34d399" className="sfx-wave-pulse" />
          <rect x="13" y="6" width="1" height="4" fill="#34d399" className="sfx-wave-pulse" />
          <rect x="12" y="10" width="1" height="2" fill="#34d399" className="sfx-wave-pulse" />
        </>
      ) : (
        <>
          {/* Pixelated dark backing + red diagonal strike-through when OFF */}
          <rect x="2" y="1" width="2" height="2" fill="#060608" />
          <rect x="4" y="3" width="2" height="2" fill="#060608" />
          <rect x="6" y="5" width="2" height="2" fill="#060608" />
          <rect x="8" y="7" width="2" height="2" fill="#060608" />
          <rect x="10" y="9" width="2" height="2" fill="#060608" />
          <rect x="12" y="11" width="2" height="2" fill="#060608" />

          <rect x="1" y="2" width="2" height="2" fill="#ef4444" />
          <rect x="3" y="4" width="2" height="2" fill="#ef4444" />
          <rect x="5" y="6" width="2" height="2" fill="#ef4444" />
          <rect x="7" y="8" width="2" height="2" fill="#ef4444" />
          <rect x="9" y="10" width="2" height="2" fill="#ef4444" />
          <rect x="11" y="12" width="2" height="2" fill="#ef4444" />
          <rect x="13" y="13" width="2" height="2" fill="#ef4444" />
        </>
      )}
    </svg>
  );
}

export default function ArcadePageFrame({
  children,
  sfxEnabled = false,
  onToggleSfx,
  overclockUnlocked = false,
  overclock = false,
  onToggleOverclock,
}) {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="relative z-20 flex shrink-0 items-center justify-between gap-2 border-b-4 border-amber-500/50 bg-gradient-to-b from-amber-950/90 to-black px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_1fr] md:sticky md:top-0 md:h-16">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_20px,rgba(251,191,36,0.03)_20px,rgba(251,191,36,0.03)_22px)]" />
        <div className="relative z-10 flex items-center gap-3 justify-self-start sm:gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[8px] uppercase tracking-widest text-amber-400/90 hover:text-amber-200 sm:text-[9px]"
            style={PIXEL_FONT}
          >
            <GitHubPixelLogo className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span>GitHub</span>
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[8px] uppercase tracking-widest text-amber-400/90 hover:text-amber-200 sm:text-[9px]"
            style={PIXEL_FONT}
          >
            <LinkedInPixelLogo className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span>LinkedIn</span>
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
          className="arcade-marquee-pulse relative z-10 cursor-pointer justify-self-center whitespace-nowrap border-none bg-transparent p-0 text-center text-[10px] font-black uppercase tracking-[0.28em] text-amber-400/95 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)] transition hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:ring-offset-2 focus:ring-offset-black sm:text-[12px] sm:tracking-[0.45em]"
          style={PIXEL_FONT}
          aria-label="Press start to scroll to projects"
        >
          PRESS START
        </button>

        <div className="relative z-10 flex items-center gap-2 justify-self-end">
          {overclockUnlocked && (
            <button
              type="button"
              onClick={() => onToggleOverclock?.()}
              aria-pressed={overclock}
              className={`cursor-pointer rounded border px-2 py-1 text-[8px] uppercase tracking-wider transition focus:outline-none focus:ring-1 focus:ring-cyan-400 sm:text-[9px] ${overclock
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
            onClick={() => onToggleSfx?.()}
            aria-pressed={sfxEnabled}
            aria-label={sfxEnabled ? "Mute 8-bit sound effects" : "Enable 8-bit sound effects"}
            className={`cursor-pointer rounded border-2 p-1.5 transition focus:outline-none focus:ring-1 focus:ring-amber-400 ${sfxEnabled
              ? "border-emerald-400/80 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60"
              : "border-white/25 bg-black/60 text-white/65 hover:border-red-400/70 hover:text-white/90"
              }`}
            title={sfxEnabled ? "SFX ON (click to mute)" : "SFX OFF (click to unmute)"}
          >
            <RetroSfxLogo enabled={sfxEnabled} />
          </button>
        </div>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center px-3 sm:px-4 md:ml-[190px] md:mr-[190px] lg:ml-[228px] lg:mr-[228px]">
        <div className="arcade-frame relative w-full max-w-6xl flex-1 py-5 sm:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
