/**
 * Iframe embed for the chess engine when VITE_CHESS_ENGINE_URL is set to a deployed URL.
 */
const CHESS_ENGINE_URL = import.meta.env.VITE_CHESS_ENGINE_URL || "";

export default function ChessEngineEmbed() {
  const hasUrl = CHESS_ENGINE_URL && CHESS_ENGINE_URL.startsWith("http");

  return (
    <section className="arcade-screen relative mx-auto w-full max-w-3xl px-4 py-4">
      <div className="mx-auto mb-4 max-w-2xl text-center">
        <p className="text-[13px] uppercase tracking-widest text-emerald-400/90 sm:text-[15px]" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          CHESS ENGINE
        </p>
        <p className="arcade-body mt-2.5 text-[14px] leading-relaxed text-emerald-200/80">
          Python UCI engine with alpha-beta search. Play below at Easy / Medium / Hard, or run it locally and plug into Arena or Lichess.
        </p>
      </div>
      <div className="rounded border-2 border-emerald-800/60 bg-[#0a140a] p-3 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
        <p className="mb-2.5 text-center text-[12px] uppercase tracking-widest text-emerald-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          Play the engine
        </p>
        {hasUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded border-2 border-emerald-900/80 bg-black min-h-[320px]">
            <iframe
              title="Chess engine"
              src={CHESS_ENGINE_URL}
              className="h-full w-full border-0"
              allow="fullscreen"
            />
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded border-2 border-dashed border-emerald-800/50 bg-[#061006] p-6 text-center">
            <p className="text-[14px] text-emerald-400/95 sm:text-[16px]" style={{ fontFamily: '"Press Start 2P", cursive' }}>
              CHESS ENGINE NOT CONNECTED
            </p>
            <p className="arcade-body mt-3 text-[13.5px] leading-relaxed text-emerald-200/75">
              Engine is in repo (<code className="text-emerald-300">chess-engine</code> folder). Run locally or deploy and set <code className="text-emerald-300">VITE_CHESS_ENGINE_URL</code> to embed here.
            </p>
            <p className="arcade-body mt-2 text-[13px] text-emerald-400/70">
              See chess-engine README · server.py + web build
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
