/**
 * Iframe embed for the chess engine when VITE_CHESS_ENGINE_URL is set to a deployed URL.
 */
const CHESS_ENGINE_URL = import.meta.env.VITE_CHESS_ENGINE_URL || "";

export default function ChessEngineEmbed() {
  const hasUrl = CHESS_ENGINE_URL && CHESS_ENGINE_URL.startsWith("http");

  return (
    <section className="arcade-screen relative mx-auto w-full max-w-3xl px-4 py-4">
      <div className="mx-auto mb-4 max-w-xl text-center">
        <p className="text-[6px] uppercase tracking-widest text-emerald-500/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          CHESS ENGINE
        </p>
        <p className="mt-2 text-[5px] leading-relaxed text-emerald-600/70" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          PYTHON UCI ENGINE WITH ALPHA-BETA SEARCH. PLAY BELOW AT EASY / MEDIUM / HARD, OR RUN IT LOCALLY AND PLUG INTO ARENA OR LICHESS.
        </p>
      </div>
      <div className="rounded border-2 border-emerald-800/60 bg-[#0a140a] p-3 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
        <p className="mb-2 text-center text-[6px] uppercase tracking-widest text-emerald-500/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
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
            <p className="text-[8px] text-emerald-400/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
              CHESS ENGINE NOT CONNECTED
            </p>
            <p className="mt-3 text-[6px] leading-relaxed text-emerald-600/80" style={{ fontFamily: '"Press Start 2P", cursive' }}>
              ENGINE IS IN REPO (CHESS-ENGINE FOLDER). RUN LOCALLY OR DEPLOY AND SET VITE_CHESS_ENGINE_URL TO EMBED HERE.
            </p>
            <p className="mt-2 text-[5px] text-emerald-700/60" style={{ fontFamily: '"Press Start 2P", cursive' }}>
              SEE CHESS-ENGINE README · SERVER.PY + WEB BUILD
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
