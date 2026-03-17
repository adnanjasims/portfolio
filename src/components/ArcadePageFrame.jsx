/**
 * Top marquee strip and optional frame around main content.
 */
export default function ArcadePageFrame({ children }) {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Full-width top marquee - click or Enter to scroll to projects */}
      <div className="relative z-10 flex shrink-0 items-center justify-center border-b-4 border-amber-500/50 bg-gradient-to-b from-amber-950/80 to-black px-4 py-3">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_20px,rgba(251,191,36,0.03)_20px,rgba(251,191,36,0.03)_22px)]" />
        <button
          type="button"
          onClick={scrollToProjects}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToProjects();
            }
          }}
          className="relative cursor-pointer border-none bg-transparent p-0 text-center text-[10px] font-black uppercase tracking-[0.5em] text-amber-400/95 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)] transition hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:ring-offset-2 focus:ring-offset-black"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
          aria-label="Press start to scroll to projects"
        >
          PRESS START
        </button>
      </div>

      {/* Main content with left/right padding for center column */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4 md:ml-[200px] md:mr-[200px] lg:ml-[240px] lg:mr-[240px]">
        <div className="arcade-frame relative w-full max-w-4xl flex-1 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
