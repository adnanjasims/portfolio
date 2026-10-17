/**
 * Chess section: ToxicChunk, dark green chess.com vibe, retro pixel style.
 */
export default function ArcadeChessSection() {
  const chessProfileUrl = "https://www.chess.com/member/ToxicChunk";

  return (
    <section className="arcade-screen relative mx-auto w-full max-w-2xl px-4 py-8">
      {/* Divider */}
      <div className="mx-auto mb-6 flex w-full max-w-md items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-600/40" />
        <span className="text-[8px] text-emerald-500/70" style={{ fontFamily: '"Press Start 2P", cursive' }}> CHESS </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-600/40" />
      </div>

      <div className="rounded border-2 border-emerald-800/80 bg-gradient-to-b from-[#0d1f0d] to-[#061006] p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,197,94,0.2)]">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Pixel king */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded border-2 border-emerald-700/60 bg-[#0a180a]">
              <svg viewBox="0 0 16 16" className="h-8 w-8 text-emerald-400/90" fill="currentColor" style={{ imageRendering: "pixelated" }}>
                <rect x="5" y="2" width="6" height="2" />
                <rect x="6" y="4" width="4" height="2" />
                <rect x="4" y="6" width="8" height="2" />
                <rect x="6" y="8" width="4" height="4" />
                <rect x="2" y="10" width="4" height="2" />
                <rect x="10" y="10" width="4" height="2" />
                <rect x="7" y="12" width="2" height="4" />
              </svg>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-emerald-500/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                Play me on Chess.com
              </p>
              <p className="mt-1 text-[12px] font-bold tracking-wide text-emerald-300/95" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                ToxicChunk
              </p>
            </div>
          </div>
          <a
            href={chessProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex-shrink-0 rounded border-2 border-emerald-600/80 bg-emerald-950/80 px-4 py-2 text-[10px] uppercase text-emerald-300 transition hover:bg-emerald-800/40 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 sm:mt-0"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            Open profile
          </a>
        </div>
        <p className="mt-4 text-center text-[7px] text-emerald-600/70" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          CHALLENGE ME · BLITZ · RAPID · BULLET
        </p>
      </div>
    </section>
  );
}
