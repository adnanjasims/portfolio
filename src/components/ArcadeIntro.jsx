/**
 * Arcade-style intro: tagline, bio, and Focus / What I like / Looking for.
 */
export default function ArcadeIntro() {
  return (
    <header className="arcade-screen relative mx-auto w-full max-w-2xl px-6 py-8 pb-12 text-center">
      <div className="absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2 border-amber-500/50" />
      <div className="absolute right-2 top-2 h-6 w-6 border-r-2 border-t-2 border-amber-500/50" />
      <div className="absolute bottom-4 left-2 h-6 w-6 border-b-2 border-l-2 border-amber-500/50" />
      <div className="absolute bottom-4 right-2 h-6 w-6 border-b-2 border-r-2 border-amber-500/50" />

      <p
        className="mb-3 text-[10px] uppercase tracking-[0.35em] text-amber-400/90"
        style={{ fontFamily: '"Press Start 2P", cursive' }}
      >
        SWE · ML · Data · Web · Search
      </p>
      <h1
        className="mb-4 text-[16px] leading-relaxed text-white"
        style={{ fontFamily: '"Press Start 2P", cursive' }}
      >
        ADNAN JASIM | SOFTWARE ENGINEER
      </h1>
      <p className="arcade-body mx-auto mb-2 max-w-md text-[13px] leading-relaxed tracking-wide text-white/85">
        CS at UAlberta.
      </p>
      <p className="arcade-body mx-auto mb-8 max-w-md text-[12px] leading-relaxed tracking-wide text-white/60">
        Pick a title and read the stack.
      </p>

      <div className="my-6 flex justify-center gap-2">
        <span className="h-0.5 w-12 bg-amber-500/40" />
        <span
          className="text-[8px] text-amber-500/60"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          {" "}
          UALBERTA{" "}
        </span>
        <span className="h-0.5 w-12 bg-amber-500/40" />
      </div>

      <div className="grid gap-4 text-left sm:grid-cols-3">
        <div className="rounded border-2 border-white/20 bg-black/60 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <p
            className="mb-2 text-[10px] text-amber-400/90"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            FOCUS
          </p>
          <p className="arcade-body text-[12px] leading-relaxed tracking-wide text-white/80">
            SWE, ML, Data, Full-Stack, and Search.
          </p>
        </div>
        <div className="rounded border-2 border-white/20 bg-black/60 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <p
            className="mb-2 text-[10px] text-amber-400/90"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            WHAT I LIKE
          </p>
          <p className="arcade-body text-[12px] leading-relaxed tracking-wide text-white/80">
            Systems thinking and clean design.
          </p>
        </div>
        <div className="rounded border-2 border-white/20 bg-black/60 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <p
            className="mb-2 text-[10px] text-amber-400/90"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            LOOKING FOR
          </p>
          <p className="arcade-body text-[12px] leading-relaxed tracking-wide text-white/80">
            Roles in SWE, ML, and Data.
          </p>
        </div>
      </div>
    </header>
  );
}
