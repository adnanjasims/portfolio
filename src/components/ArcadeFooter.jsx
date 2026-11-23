/**
 * Arcade-style footer with social links.
 */
import { GITHUB_URL, LINKEDIN_URL } from "../social";
import { GitHubPixelLogo, LinkedInPixelLogo } from "./SocialPixelIcons";

function RetroRestartIcon({ className = "h-5 w-5" }) {
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
      <rect x="3" y="4" width="2" height="4" />
      <rect x="11" y="4" width="2" height="2" />
      <rect x="9" y="5" width="5" height="2" />
      <rect x="12" y="3" width="2" height="2" />
      <rect x="3" y="9" width="2" height="3" />
      <rect x="5" y="12" width="6" height="2" />
      <rect x="11" y="9" width="2" height="3" />
    </svg>
  );
}

export default function ArcadeFooter({ onReplayBoot }) {
  return (
    <footer className="arcade-screen relative mx-auto w-full max-w-2xl px-4 py-10 text-center">
      <div className="mx-auto mb-6 flex w-full max-w-md items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
        <span
          className="text-[12px] text-amber-400/75"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          {" "}
          CONTINUE?{" "}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded border-2 border-amber-500/60 bg-amber-950/40 px-5 py-2.5 text-[14px] uppercase text-amber-300 hover:bg-amber-500/20"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          <GitHubPixelLogo className="h-5 w-5 shrink-0" />
          <span>GitHub</span>
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded border-2 border-amber-500/60 bg-amber-950/40 px-5 py-2.5 text-[14px] uppercase text-amber-300 hover:bg-amber-500/20"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          <LinkedInPixelLogo className="h-5 w-5 shrink-0" />
          <span>LinkedIn</span>
        </a>
      </div>

      <p className="arcade-body text-[14.5px] tracking-wide text-white/65">
        Computer Science · University of Alberta
      </p>
      <p
        className="mt-3 text-[12px] text-white/55"
        style={{ fontFamily: '"Press Start 2P", cursive' }}
      >
        React · Vite · Tailwind · Kaboom
      </p>

      <div className="mx-auto mt-6 inline-block rounded border-2 border-white/20 bg-black/60 px-5 py-3 text-center">
        <p
          className="text-[9px] text-white/75"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          HOME BASE
        </p>
        <p
          className="mt-2 text-[8px] leading-relaxed text-white/65"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          UALBERTA
        </p>
        <p
          className="mt-1 text-[8px] leading-relaxed text-white/50"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          CS · EDMONTON
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-5">
        <span
          className="text-[12px] text-white/50"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          SWE
        </span>
        <span
          className="text-[12px] text-white/50"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          ML
        </span>
        <span
          className="text-[12px] text-white/50"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          DATA
        </span>
        <span
          className="text-[12px] text-white/50"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          WEB
        </span>
        <span
          className="text-[12px] text-white/50"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          SEARCH
        </span>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => onReplayBoot?.()}
          title="Restart CRT boot sequence"
          aria-label="Restart CRT boot sequence"
          className="inline-flex cursor-pointer items-center gap-2.5 rounded border-2 border-slate-500/60 bg-slate-900/75 px-5 py-3 text-[10px] uppercase tracking-wider text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:border-slate-300 hover:bg-slate-800 hover:text-white active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          <RetroRestartIcon className="h-5 w-5 shrink-0" />
          <span>REBOOT</span>
        </button>
      </div>
    </footer>
  );
}
