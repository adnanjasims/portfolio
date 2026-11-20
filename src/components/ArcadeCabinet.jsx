import { useEffect, useRef, useState } from "react";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

/**
 * Retro arcade cabinet: detailed bezel, CRT-style screen (pixel grid, scanlines),
 * interactive two-player control panel (4-way stick + B/A/GO + COIN + shortcuts).
 */
export default function ArcadeCabinet({
  children,
  onMoveSelection,
  onLaunchSelected,
  onArcadeInput,
  credits = 0,
  onInsertCoin,
  onJumpSection,
  onReplayBoot,
}) {
  const [stickDir, setStickDir] = useState(""); // up | down | left | right | ""
  const [coinFlash, setCoinFlash] = useState(false);
  const stickTimerRef = useRef(null);
  const coinTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stickTimerRef.current) window.clearTimeout(stickTimerRef.current);
      if (coinTimerRef.current) window.clearTimeout(coinTimerRef.current);
    };
  }, []);

  const pulseStick = (dir, keyName, moveDelta = 0) => {
    setStickDir(dir);
    if (moveDelta !== 0) onMoveSelection?.(moveDelta);
    onArcadeInput?.(keyName);
    if (stickTimerRef.current) window.clearTimeout(stickTimerRef.current);
    stickTimerRef.current = window.setTimeout(() => setStickDir(""), 140);
  };

  const handleCoin = () => {
    setCoinFlash(true);
    onInsertCoin?.();
    if (coinTimerRef.current) window.clearTimeout(coinTimerRef.current);
    coinTimerRef.current = window.setTimeout(() => setCoinFlash(false), 450);
  };

  const stickOffsetClass =
    stickDir === "up"
      ? "-translate-y-1.5"
      : stickDir === "down"
        ? "translate-y-1.5"
        : stickDir === "left"
          ? "-translate-x-1.5"
          : stickDir === "right"
            ? "translate-x-1.5"
            : "";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0c0c0f] p-3 md:p-6">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl border-[8px] border-[#1c1c22] bg-[#12121a] shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)]">
        {/* Top marquee strip */}
        <div className="flex items-center justify-between border-b-4 border-[#2a2a32] bg-[#18181f] px-4 py-2">
          <span className="hidden text-[8px] text-amber-500/60 sm:inline" style={PIXEL_FONT}>
            1P READY
          </span>
          <p className="mx-auto text-center font-black uppercase tracking-[0.35em] text-amber-500/95" style={{ ...PIXEL_FONT, fontSize: "12px" }}>
            PROJECT PORTFOLIO
          </p>
          <span
            className={`hidden text-[8px] tabular-nums transition-colors sm:inline ${
              coinFlash ? "text-amber-300" : "text-amber-500/70"
            }`}
            style={PIXEL_FONT}
          >
            CRD {String(credits).padStart(2, "0")}
          </span>
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

        {/* Two-player interactive control panel */}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t-4 border-[#22222c] bg-gradient-to-b from-[#16161e] to-[#0e0e14] px-5 py-5 sm:px-6">
          {/* Player 1 interactive 4-way joystick + D-pad + B / A / GO buttons */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-sm border-2 border-[#333340] bg-[#252530] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <button
                  type="button"
                  onClick={() => pulseStick("up", "arrowup", -1)}
                  aria-label="Up"
                  title="Up"
                  className="absolute inset-x-3 top-0 h-4 cursor-pointer text-[6px] leading-none text-amber-300/70 hover:text-amber-200 focus:outline-none"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("down", "arrowdown", 1)}
                  aria-label="Down"
                  title="Down"
                  className="absolute inset-x-3 bottom-0 h-4 cursor-pointer text-[6px] leading-none text-amber-300/70 hover:text-amber-200 focus:outline-none"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("left", "arrowleft")}
                  aria-label="Left"
                  title="Left"
                  className="absolute inset-y-3 left-0 w-4 cursor-pointer text-[6px] leading-none text-amber-300/70 hover:text-amber-200 focus:outline-none"
                >
                  ◄
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("right", "arrowright")}
                  aria-label="Right"
                  title="Right"
                  className="absolute inset-y-3 right-0 w-4 cursor-pointer text-[6px] leading-none text-amber-300/70 hover:text-amber-200 focus:outline-none"
                >
                  ►
                </button>
                <div
                  className={`pointer-events-none h-4 w-4 rounded-full border border-amber-400/50 bg-amber-600 shadow-sm transition-transform duration-100 ${stickOffsetClass}`}
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400" style={PIXEL_FONT}>P1</span>
            </div>

            <div className="flex flex-col gap-1">
              {/* Row 1: 4-way directional buttons */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => pulseStick("left", "arrowleft")}
                  title="Left"
                  aria-label="Left button"
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-none border-2 border-[#3a3a4a] bg-amber-950 text-[7px] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.2)] transition active:translate-y-0.5 hover:border-amber-400/70 hover:bg-amber-900/70 focus:outline-none"
                >
                  ◄
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("up", "arrowup", -1)}
                  title="Up"
                  aria-label="Up button"
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-none border-2 border-[#3a3a4a] bg-amber-950 text-[7px] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.2)] transition active:translate-y-0.5 hover:border-amber-400/70 hover:bg-amber-900/70 focus:outline-none"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("down", "arrowdown", 1)}
                  title="Down"
                  aria-label="Down button"
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-none border-2 border-[#3a3a4a] bg-amber-950 text-[7px] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.2)] transition active:translate-y-0.5 hover:border-amber-400/70 hover:bg-amber-900/70 focus:outline-none"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("right", "arrowright")}
                  title="Right"
                  aria-label="Right button"
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-none border-2 border-[#3a3a4a] bg-amber-950 text-[7px] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.2)] transition active:translate-y-0.5 hover:border-amber-400/70 hover:bg-amber-900/70 focus:outline-none"
                >
                  ►
                </button>
              </div>
              {/* Row 2: B, A, and GO action buttons */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onArcadeInput?.("b")}
                  title="B button"
                  aria-label="B button"
                  className="flex h-6 w-7 cursor-pointer items-center justify-center rounded-none border-2 border-rose-500/60 bg-rose-950/70 text-[8px] text-rose-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition active:translate-y-0.5 hover:bg-rose-800/80 focus:outline-none"
                  style={PIXEL_FONT}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => onArcadeInput?.("a")}
                  title="A button"
                  aria-label="A button"
                  className="flex h-6 w-7 cursor-pointer items-center justify-center rounded-none border-2 border-emerald-500/60 bg-emerald-950/70 text-[8px] text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition active:translate-y-0.5 hover:bg-emerald-800/80 focus:outline-none"
                  style={PIXEL_FONT}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchSelected?.()}
                  title="Open Selected Project"
                  aria-label="Open selected project"
                  className="flex h-6 flex-1 cursor-pointer items-center justify-center rounded-none border-2 border-amber-500/70 bg-amber-600/80 px-2 text-[7px] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition active:translate-y-0.5 hover:bg-amber-400 focus:outline-none"
                  style={PIXEL_FONT}
                >
                  GO
                </button>
              </div>
            </div>
          </div>

          {/* Center working COIN slot */}
          <button
            type="button"
            onClick={handleCoin}
            title="Insert coin"
            className="group flex cursor-pointer flex-col items-center gap-1 rounded px-2 py-1 transition hover:bg-white/5 active:translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400/60"
          >
            <div
              className={`h-2.5 w-10 rounded-none border-2 transition ${
                coinFlash
                  ? "border-amber-400 bg-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  : "border-[#3a3a4a] bg-[#1a1a24] group-hover:border-amber-400/60"
              }`}
            />
            <span
              className={`text-[8px] uppercase transition ${
                coinFlash ? "text-amber-300" : "text-slate-400 group-hover:text-amber-300"
              }`}
              style={PIXEL_FONT}
            >
              {coinFlash ? "+1 CRD" : "COIN"}
            </span>
          </button>

          {/* Player 2 quick-action buttons */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onJumpSection?.("intro")}
                  title="Scroll to Top"
                  className="h-6 cursor-pointer rounded-none border-2 border-[#333342] bg-slate-800 px-2 text-[7px] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition active:translate-y-0.5 hover:border-slate-400 hover:text-white focus:outline-none"
                  style={PIXEL_FONT}
                >
                  TOP
                </button>
                <button
                  type="button"
                  onClick={() => onJumpSection?.("chess")}
                  title="Jump to Chess"
                  className="h-6 cursor-pointer rounded-none border-2 border-emerald-700/60 bg-emerald-950/80 px-2 text-[7px] text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition active:translate-y-0.5 hover:border-emerald-400 hover:text-emerald-200 focus:outline-none"
                  style={PIXEL_FONT}
                >
                  CHESS
                </button>
                <button
                  type="button"
                  onClick={() => onReplayBoot?.()}
                  title="Replay Boot Screen"
                  className="h-6 cursor-pointer rounded-none border-2 border-[#333342] bg-slate-800 px-2 text-[7px] text-amber-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition active:translate-y-0.5 hover:border-amber-400 hover:text-amber-200 focus:outline-none"
                  style={PIXEL_FONT}
                >
                  BOOT
                </button>
              </div>
              <span className="text-[7px] uppercase tracking-wider text-slate-500" style={PIXEL_FONT}>
                SHORTCUTS
              </span>
            </div>
            <div className="hidden flex-col items-center gap-1 sm:flex">
              <div className="h-10 w-10 rounded-sm border-2 border-[#333340] bg-[#252530] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500" style={PIXEL_FONT}>P2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
