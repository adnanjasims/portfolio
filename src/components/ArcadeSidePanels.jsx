/**
 * Left and right arcade walls: identity, high scores, build credits.
 */
export default function ArcadeSidePanels() {
  return (
    <>
      <aside className="arcade-screen fixed left-0 top-0 z-0 hidden h-full w-[200px] flex-shrink-0 flex-col items-center border-r-4 border-amber-500/30 bg-[#08080c] py-8 md:flex lg:w-[240px]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, rgba(251,191,36,0.03) 8px, rgba(251,191,36,0.03) 10px)",
          }}
        />
        <div className="relative flex w-full flex-col items-center gap-6 px-3">
          <div className="w-full rounded border-2 border-amber-500/40 bg-black/80 p-3 text-center">
            <p
              className="text-[8px] text-amber-400/90"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              PLAYER
            </p>
            <p
              className="mt-2 text-[14px] text-amber-300"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              AJ
            </p>
          </div>
          <div className="w-full rounded border-2 border-white/20 bg-black/60 p-3 text-center">
            <p
              className="mb-2 text-[8px] text-white/60"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              HOME BASE
            </p>
            <p
              className="text-[7px] leading-relaxed text-white/50"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              UALBERTA
            </p>
            <p
              className="mt-1 text-[7px] leading-relaxed text-white/40"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              CS · EDMONTON
            </p>
          </div>
          <div className="w-full rounded border-2 border-white/20 bg-black/60 p-3">
            <p
              className="mb-2 text-[8px] text-white/60"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              TOP RUNS
            </p>
            <p
              className="text-[7px] leading-relaxed text-white/40"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              1. LEGACY LIFT
            </p>
            <p
              className="text-[7px] leading-relaxed text-white/40"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              2. DOC INTEL
            </p>
            <p
              className="text-[7px] leading-relaxed text-white/40"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              3. RAIL INTERLOCK
            </p>
            <p
              className="text-[7px] leading-relaxed text-white/40"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              4. WAREHOUSE
            </p>
            <p
              className="text-[7px] leading-relaxed text-white/40"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              5. CHESS
            </p>
          </div>
        </div>
      </aside>

      <aside className="arcade-screen fixed right-0 top-0 z-0 hidden h-full w-[200px] flex-shrink-0 flex-col items-center border-l-4 border-amber-500/30 bg-[#08080c] py-8 md:flex lg:w-[240px]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-90deg, transparent 0, transparent 8px, rgba(251,191,36,0.03) 8px, rgba(251,191,36,0.03) 10px)",
          }}
        />
        <div className="relative flex w-full flex-col items-center gap-6 px-3">
          <div className="w-full rounded border-2 border-amber-500/40 bg-black/80 p-3 text-center">
            <p
              className="mb-2 text-[8px] text-amber-400/90"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              BUILD
            </p>
            <p
              className="text-[7px] text-white/50"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              REACT
            </p>
            <p
              className="text-[7px] text-white/50"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              VITE
            </p>
            <p
              className="text-[7px] text-white/50"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              TAILWIND
            </p>
            <p
              className="text-[7px] text-white/50"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              KABOOM
            </p>
          </div>
          <div className="w-full rounded border-2 border-emerald-500/30 bg-black/60 p-2 text-center">
            <p
              className="text-[7px] text-emerald-400/80"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              STAGE
            </p>
            <p
              className="text-[7px] text-emerald-400/80"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              CLEAR
            </p>
          </div>
          <div className="h-8 w-16 rounded border-2 border-slate-600 bg-slate-800/80" />
        </div>
      </aside>
    </>
  );
}
