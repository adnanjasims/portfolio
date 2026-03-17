/**
 * Left and right arcade "walls": posters, signs, neon strips, pixel details.
 */
export default function ArcadeSidePanels() {
  return (
    <>
      {/* Left panel */}
      <aside className="arcade-screen fixed left-0 top-0 z-0 hidden h-full w-[200px] flex-shrink-0 flex-col items-center border-r-4 border-amber-500/30 bg-[#08080c] py-8 md:flex lg:w-[240px]">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 8px, rgba(251,191,36,0.03) 8px, rgba(251,191,36,0.03) 10px)" }} />
        <div className="relative flex w-full flex-col items-center gap-6 px-3">
          <div className="w-full rounded border-2 border-amber-500/40 bg-black/80 p-3 text-center">
            <p className="text-[6px] text-amber-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>INSERT</p>
            <p className="text-[6px] text-amber-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>COIN</p>
          </div>
          <div className="w-full rounded border-2 border-white/20 bg-black/60 p-3">
            <p className="mb-2 text-[6px] text-white/60" style={{ fontFamily: '"Press Start 2P", cursive' }}>HIGH SCORES</p>
            <p className="text-[5px] leading-relaxed text-white/40" style={{ fontFamily: '"Press Start 2P", cursive' }}>1. CHIRP</p>
            <p className="text-[5px] leading-relaxed text-white/40" style={{ fontFamily: '"Press Start 2P", cursive' }}>2. SMART SUPPLY</p>
            <p className="text-[5px] leading-relaxed text-white/40" style={{ fontFamily: '"Press Start 2P", cursive' }}>3. CHESS</p>
          </div>
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 w-12 rounded-sm bg-amber-500/20" />
            ))}
          </div>
          <div className="w-full rounded border-2 border-red-500/30 bg-black/60 p-2 text-center">
            <p className="text-[5px] text-red-400/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>1 PLAYER</p>
            <p className="text-[5px] text-red-400/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>ONLY</p>
          </div>
        </div>
      </aside>

      {/* Right panel */}
      <aside className="arcade-screen fixed right-0 top-0 z-0 hidden h-full w-[200px] flex-shrink-0 flex-col items-center border-l-4 border-amber-500/30 bg-[#08080c] py-8 md:flex lg:w-[240px]">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(-90deg, transparent 0, transparent 8px, rgba(251,191,36,0.03) 8px, rgba(251,191,36,0.03) 10px)" }} />
        <div className="relative flex w-full flex-col items-center gap-6 px-3">
          <div className="w-full rounded border-2 border-amber-500/40 bg-black/80 p-3 text-center">
            <p className="text-[6px] text-amber-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>CREDITS</p>
            <p className="mt-1 text-[5px] text-white/50" style={{ fontFamily: '"Press Start 2P", cursive' }}>REACT</p>
            <p className="text-[5px] text-white/50" style={{ fontFamily: '"Press Start 2P", cursive' }}>VITE</p>
            <p className="text-[5px] text-white/50" style={{ fontFamily: '"Press Start 2P", cursive' }}>TAILWIND</p>
          </div>
          <div className="w-full rounded border-2 border-white/20 bg-black/60 p-3">
            <p className="mb-2 text-[6px] text-white/60" style={{ fontFamily: '"Press Start 2P", cursive' }}>CONTROLS</p>
            <p className="text-[5px] leading-relaxed text-white/40" style={{ fontFamily: '"Press Start 2P", cursive' }}>CLICK = SELECT</p>
            <p className="text-[5px] leading-relaxed text-white/40" style={{ fontFamily: '"Press Start 2P", cursive' }}>ESC = CLOSE</p>
          </div>
          <div className="h-8 w-16 rounded border-2 border-slate-600 bg-slate-800/80" />
          <div className="w-full rounded border-2 border-emerald-500/30 bg-black/60 p-2 text-center">
            <p className="text-[5px] text-emerald-400/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>PLAY</p>
            <p className="text-[5px] text-emerald-400/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>MODE</p>
          </div>
        </div>
      </aside>
    </>
  );
}
