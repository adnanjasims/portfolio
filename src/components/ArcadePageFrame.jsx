/**
 * Top marquee strip, social links, and frame around main content.
 */
import { GITHUB_URL, LINKEDIN_URL } from "../social";

export default function ArcadePageFrame({ children }) {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b-4 border-amber-500/50 bg-gradient-to-b from-amber-950/80 to-black px-4 py-3">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_20px,rgba(251,191,36,0.03)_20px,rgba(251,191,36,0.03)_22px)]" />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 text-[7px] uppercase tracking-widest text-amber-400/80 hover:text-amber-300"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          GitHub
        </a>
        <button
          type="button"
          onClick={scrollToProjects}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToProjects();
            }
          }}
          className="arcade-marquee-pulse relative z-10 cursor-pointer border-none bg-transparent p-0 text-center text-[12px] font-black uppercase tracking-[0.5em] text-amber-400/95 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)] transition hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:ring-offset-2 focus:ring-offset-black"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
          aria-label="Press start to scroll to projects"
        >
          PRESS START
        </button>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 text-[7px] uppercase tracking-widest text-amber-400/80 hover:text-amber-300"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          LinkedIn
        </a>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 md:ml-[200px] md:mr-[200px] lg:ml-[240px] lg:mr-[240px]">
        <div className="arcade-frame relative w-full max-w-4xl flex-1 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
