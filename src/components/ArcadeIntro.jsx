/**
 * Arcade-style intro: tagline, bio, and Focus / What I like / Looking for in pixel aesthetic.
 */
export default function ArcadeIntro() {
  return (
    <header className="arcade-screen relative w-full max-w-2xl mx-auto px-6 py-8 pb-12 text-center">
      {/* Decorative corner brackets */}
      <div className="absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2 border-amber-500/50" />
      <div className="absolute right-2 top-2 h-6 w-6 border-r-2 border-t-2 border-amber-500/50" />
      <div className="absolute bottom-4 left-2 h-6 w-6 border-b-2 border-l-2 border-amber-500/50" />
      <div className="absolute bottom-4 right-2 h-6 w-6 border-b-2 border-r-2 border-amber-500/50" />

      <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-amber-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        Software engineering · DevOps · ML · Data science · Web · Search & planning
      </p>
      <h1 className="mb-4 text-[16px] leading-relaxed text-white" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        MY GITHUB BUT DRESSED UP.
      </h1>
      <p className="mb-8 text-[10px] leading-relaxed text-white/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        OPEN TO SWE, DEVOPS, MACHINE LEARNING, DATA SCIENCE, SEARCH, PLANNING, WEB DEV & MORE. PICK A PROJECT BELOW.
      </p>

      <div className="my-6 flex justify-center gap-2">
        <span className="h-0.5 w-12 bg-amber-500/40" />
        <span className="text-[8px] text-amber-500/60" style={{ fontFamily: '"Press Start 2P", cursive' }}> * * * </span>
        <span className="h-0.5 w-12 bg-amber-500/40" />
      </div>

      <div className="grid gap-4 text-left sm:grid-cols-3">
        <div className="rounded border-2 border-white/20 bg-black/60 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <p className="mb-2 text-[10px] text-amber-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>FOCUS</p>
          <p className="text-[8px] leading-relaxed text-white/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            SWE · DEVOPS · ML · DATA SCIENCE · SEARCH · PLANNING · WEB
          </p>
        </div>
        <div className="rounded border-2 border-white/20 bg-black/60 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <p className="mb-2 text-[10px] text-amber-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>WHAT I LIKE</p>
          <p className="text-[8px] leading-relaxed text-white/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            CLEAN APIS, SYSTEMS THINKING, MODELS & DATA, PLAYFUL BUT USABLE DESIGN
          </p>
        </div>
        <div className="rounded border-2 border-white/20 bg-black/60 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <p className="mb-2 text-[10px] text-amber-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>LOOKING FOR</p>
          <p className="text-[8px] leading-relaxed text-white/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            ROLES ACROSS SWE, DEVOPS, ML, WEB.
          </p>
        </div>
      </div>
    </header>
  );
}
