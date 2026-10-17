/**
 * Retro arcade cabinet: detailed bezel, CRT-style screen (pixel grid, scanlines),
 * two-player control panel. Screen content is B&W pixel style.
 */
export default function ArcadeCabinet({ children }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0c0c0f] p-3 md:p-6">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl border-[8px] border-[#1c1c22] bg-[#12121a] shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)]">
        {/* Top marquee strip */}
        <div className="border-b-4 border-[#2a2a32] bg-[#18181f] px-4 py-2">
          <p className="text-center font-black uppercase tracking-[0.35em] text-amber-500/95" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: "12px" }}>
            PORTFOLIO
          </p>
        </div>

        {/* Screen housing: thick bezel + CRT effect */}
        <div className="relative mx-5 mt-5 flex flex-col rounded-sm border-[6px] border-[#252530] bg-[#0a0a0e] p-2 shadow-[inset_0_0_80px_rgba(0,0,0,0.95)]">
          {/* Inner bezel (black) - 4:3 CRT shape */}
          <div className="relative flex aspect-[4/3] min-h-[280px] w-full max-w-full items-stretch justify-center overflow-hidden rounded-sm bg-black">
            {/* Pixel-style content area */}
            <div
              className="arcade-screen relative min-h-0 w-full flex-1 overflow-hidden bg-black"
              style={{
                imageRendering: "pixelated",
              }}
            >
              {children}
            </div>
            {/* Scanlines overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, black 1px, black 2px)",
              }}
            />
            {/* Very subtle CRT curve (vignette) */}
            <div
              className="pointer-events-none absolute inset-0 rounded-sm opacity-30"
              style={{
                boxShadow: "inset 0 0 60px 8px rgba(0,0,0,0.8)",
              }}
            />
          </div>
        </div>

        {/* Two-player control panel: square pixel buttons, muted palette */}
        <div className="mt-4 flex items-end justify-between gap-4 border-t-4 border-[#22222c] bg-gradient-to-b from-[#16161e] to-[#0e0e14] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="h-10 w-10 rounded-sm border-2 border-[#333340] bg-[#252530] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500" style={{ fontFamily: '"Press Start 2P", cursive' }}>P1</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-5 rounded-none border-2 border-[#2a2a35] bg-amber-950 shadow-[inset_0_1px_0_rgba(251,191,36,0.15)]" />
                ))}
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-5 rounded-none border-2 border-[#2a2a35] bg-amber-950 shadow-[inset_0_1px_0_rgba(251,191,36,0.15)]" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-8 rounded-none border-2 border-[#333340] bg-[#1a1a24]" />
            <span className="text-[8px] uppercase text-slate-500" style={{ fontFamily: '"Press Start 2P", cursive' }}>COIN</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-5 rounded-none border-2 border-[#2a2a35] bg-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
                ))}
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-5 rounded-none border-2 border-[#2a2a35] bg-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-10 w-10 rounded-sm border-2 border-[#333340] bg-[#252530] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500" style={{ fontFamily: '"Press Start 2P", cursive' }}>P2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
