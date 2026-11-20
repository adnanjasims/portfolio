/**
 * Arcade-style footer with social links.
 */
import { GITHUB_URL, LINKEDIN_URL } from "../social";

export default function ArcadeFooter() {
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
          className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-5 py-2.5 text-[14px] uppercase text-amber-300 hover:bg-amber-500/20"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          GitHub
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-5 py-2.5 text-[14px] uppercase text-amber-300 hover:bg-amber-500/20"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          LinkedIn
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
    </footer>
  );
}
