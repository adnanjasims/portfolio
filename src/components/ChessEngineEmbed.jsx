import { useEffect, useState } from "react";

/**
 * Chess Club x Arcade Cabinet fusion housing for the UCI chess engine embed.
 */
const CHESS_ENGINE_URL = import.meta.env.VITE_CHESS_ENGINE_URL || "";
const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

function PixelKnightIcon({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true" style={{ imageRendering: "pixelated" }}>
      <rect x="6" y="2" width="4" height="2" />
      <rect x="4" y="4" width="7" height="2" />
      <rect x="3" y="6" width="8" height="2" />
      <rect x="5" y="7" width="1" height="1" fill="#041009" />
      <rect x="7" y="8" width="4" height="3" />
      <rect x="5" y="11" width="6" height="2" />
      <rect x="4" y="13" width="8" height="2" />
    </svg>
  );
}

export default function ChessEngineEmbed() {
  const hasUrl = typeof CHESS_ENGINE_URL === "string" && /^https?:\/\//i.test(CHESS_ENGINE_URL.trim());
  const [reloadSeq, setReloadSeq] = useState(0);

  // Wake up Render-hosted chess server silently on mount so it responds quickly when scrolled into view.
  useEffect(() => {
    if (!hasUrl) return;
    fetch(`${CHESS_ENGINE_URL.replace(/\/$/, "")}/api/health`, {
      mode: "no-cors",
    }).catch(() => {});
  }, [hasUrl]);

  return (
    <section className="arcade-screen relative mx-auto w-full max-w-[64rem] px-3 py-6 sm:px-5">
      <div className="mx-auto mb-5 max-w-2xl text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-0.5 w-12 bg-emerald-500/40" />
          <h2
            className="text-[12px] uppercase tracking-[0.25em] text-emerald-400/95 sm:text-[14px]"
            style={PIXEL_FONT}
          >
            CHESS ENGINE
          </h2>
          <span className="h-0.5 w-12 bg-emerald-500/40" />
        </div>
        <p className="arcade-body text-[14px] leading-relaxed text-emerald-100/80">
          Python &amp; C++ UCI engine with alpha-beta search.
        </p>
      </div>

      {/* Chess Club x Arcade Cabinet Frame */}
      <div className="overflow-hidden rounded-xl border-[6px] border-[#3c2a1a] bg-gradient-to-b from-[#1f160e] via-[#131914] to-[#08120c] shadow-[0_30px_70px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(251,191,36,0.18)]">
        {/* Top Club Marquee */}
        <div className="flex items-center justify-between border-b-4 border-[#3c2a1a] bg-gradient-to-b from-[#0f2919] to-[#07180e] px-5 py-3">
          <div className="flex items-center gap-2 text-amber-300/90">
            <PixelKnightIcon className="h-5 w-5" />
            <span className="hidden text-[8px] uppercase tracking-wider sm:inline" style={PIXEL_FONT}>
              BOARD 01
            </span>
          </div>

          <p
            className="text-center text-[10px] uppercase tracking-[0.28em] text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] sm:text-[12px]"
            style={PIXEL_FONT}
          >
            CHESS CLUB CABINET
          </p>

          <span className="text-[8px] uppercase tracking-wider text-emerald-300/80" style={PIXEL_FONT}>
            UCI
          </span>
        </div>

        {/* Checkered Chessboard Border Housing */}
        <div className="mx-3 mt-4 rounded border-4 border-[#275D38] bg-[#0a1d12] p-2 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] sm:mx-5 sm:mt-5 sm:p-2.5">
          <div
            className="rounded-sm p-1.5 sm:p-2"
            style={{
              backgroundImage:
                "repeating-conic-gradient(#12331f 0% 25%, #07160d 0% 50%)",
              backgroundSize: "16px 16px",
            }}
          >
            <div className="overflow-hidden rounded-sm border-2 border-amber-400/35 bg-[#040a06]">
              {hasUrl ? (
                <div className="relative h-[680px] w-full bg-[#020617] sm:h-[750px]">
                  <iframe
                    key={reloadSeq}
                    title="Chess engine"
                    src={CHESS_ENGINE_URL}
                    referrerPolicy="no-referrer"
                    className="h-full w-full border-0"
                    allow="fullscreen"
                  />
                </div>
              ) : (
                <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden bg-[#050e08] p-6 text-center">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-conic-gradient(#143b24 0% 25%, #06120b 0% 50%)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div className="relative z-10 flex max-w-md flex-col items-center rounded border-2 border-emerald-500/45 bg-[#040c07]/90 px-6 py-6 shadow-[0_14px_30px_rgba(0,0,0,0.75)]">
                    <PixelKnightIcon className="mb-3 h-10 w-10 text-amber-300" />
                    <p
                      className="text-[12px] leading-relaxed text-emerald-300 sm:text-[14px]"
                      style={PIXEL_FONT}
                    >
                      CHESS ENGINE STANDBY
                    </p>
                    <p className="arcade-body mt-3 text-[13px] leading-relaxed text-emerald-100/80">
                      Engine lives in <code className="text-amber-300">chess-engine/</code>. Run locally or set <code className="text-amber-300">VITE_CHESS_ENGINE_URL</code> to play live on this board.
                    </p>
                    <p className="arcade-body mt-2 text-[12px] text-emerald-300/70">
                      server.py + web build · Alpha-Beta Search
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lower Chess Club Control Deck (Digital Clock + Difficulty Lamps + Reload/Fullscreen) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-4 border-[#3c2a1a] bg-gradient-to-b from-[#17120c] to-[#0d0a07] px-5 py-4 sm:px-6">
          {/* Retro Dual Chess Clock */}
          <div className="flex items-center gap-2 rounded border-2 border-[#4d3822] bg-[#070a08] px-3 py-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]">
            <div className="text-center">
              <p className="text-[6px] text-white/55" style={PIXEL_FONT}>WHITE</p>
              <p className="mt-1 text-[10px] tabular-nums text-amber-300" style={PIXEL_FONT}>05:00</p>
            </div>
            <span className="h-6 w-px bg-[#3c2a1a]" />
            <div className="text-center">
              <p className="text-[6px] text-emerald-400/75" style={PIXEL_FONT}>ENGINE</p>
              <p className="mt-1 text-[10px] tabular-nums text-emerald-300" style={PIXEL_FONT}>05:00</p>
            </div>
          </div>

          {/* Club Difficulty Lamps */}
          <div className="flex items-center gap-3">
            {[
              { label: "EASY", color: "bg-emerald-400" },
              { label: "MED", color: "bg-amber-400" },
              { label: "HARD", color: "bg-rose-400" },
            ].map((mode) => (
              <div key={mode.label} className="flex flex-col items-center gap-1">
                <span className={`h-2.5 w-2.5 rounded-full ${mode.color} opacity-85 shadow-[0_0_8px_currentColor]`} />
                <span className="text-[6px] text-white/60" style={PIXEL_FONT}>
                  {mode.label}
                </span>
              </div>
            ))}
          </div>

          {/* Board controls */}
          {hasUrl ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReloadSeq((n) => n + 1)}
                className="cursor-pointer rounded border-2 border-emerald-600/70 bg-emerald-950/60 px-2.5 py-1.5 text-[7px] uppercase text-emerald-200 hover:bg-emerald-800/50"
                style={PIXEL_FONT}
              >
                Reload
              </button>
              <a
                href={CHESS_ENGINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border-2 border-[#8c6a2b]/80 bg-gradient-to-b from-[#2f2310] to-[#1a1308] px-2.5 py-1.5 text-[7px] uppercase text-amber-300 hover:text-amber-200"
                style={PIXEL_FONT}
              >
                Open Tab
              </a>
            </div>
          ) : (
            <div className="rounded border-2 border-[#8c6a2b]/70 bg-gradient-to-b from-[#2f2310] to-[#1a1308] px-3 py-1.5 text-center">
              <p className="text-[7px] uppercase tracking-widest text-amber-300/90" style={PIXEL_FONT}>
                ALPHA-BETA · UCI
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
