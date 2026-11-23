import { useEffect, useRef, useState } from "react";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

function PixelCoinSprite() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-4 w-4 drop-shadow-[0_0_6px_rgba(251,191,36,0.75)]"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="3" y="1" width="6" height="1" fill="#fef08a" />
      <rect x="2" y="2" width="8" height="8" fill="#fbbf24" />
      <rect x="3" y="10" width="6" height="1" fill="#d97706" />
      <rect x="1" y="3" width="1" height="6" fill="#fef08a" />
      <rect x="10" y="3" width="1" height="6" fill="#d97706" />
      {/* Inner pixel coin glint & bar */}
      <rect x="5" y="3" width="2" height="6" fill="#fef9c3" />
      <rect x="4" y="4" width="1" height="4" fill="#b45309" />
      <rect x="7" y="4" width="1" height="4" fill="#b45309" />
    </svg>
  );
}

function PixelArrowIcon({ dir = "up", className = "h-3.5 w-3.5" }) {
  const rotation =
    dir === "right"
      ? "rotate-90"
      : dir === "down"
        ? "rotate-180"
        : dir === "left"
          ? "-rotate-90"
          : "";
  return (
    <svg
      viewBox="0 0 12 12"
      className={`${className} ${rotation}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Crisp 8-bit beveled arrow */}
      <rect x="5" y="1" width="2" height="2" />
      <rect x="4" y="3" width="4" height="2" />
      <rect x="2" y="5" width="8" height="2" />
      <rect x="5" y="7" width="2" height="4" />
    </svg>
  );
}

/**
 * Retro arcade cabinet: detailed bezel, CRT-style screen (pixel grid, scanlines),
 * interactive control panel (detailed red joystick + beveled D-pad + B/A/GO + COIN + CREDITS).
 */
export default function ArcadeCabinet({
  children,
  onMoveSelection,
  onLaunchSelected,
  onArcadeInput,
  credits = 0,
  onInsertCoin,
}) {
  const [stickDir, setStickDir] = useState(""); // up | down | left | right | ""
  const [coinFlash, setCoinFlash] = useState(false);
  const [coinDropId, setCoinDropId] = useState(0);
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
    setCoinDropId((id) => id + 1);
    onInsertCoin?.();
    if (coinTimerRef.current) window.clearTimeout(coinTimerRef.current);
    coinTimerRef.current = window.setTimeout(() => setCoinFlash(false), 520);
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
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0c0c0f] px-3 py-4 sm:px-5">
      <div className="flex w-full max-w-[64rem] flex-col overflow-hidden rounded-xl border-[8px] border-[#1c1c22] bg-[#12121a] shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)]">
        {/* Top marquee strip */}
        <div className="flex items-center justify-between border-b-4 border-[#2a2a32] bg-[#18181f] px-4 py-2">
          <span className="hidden text-[8px] text-amber-500/60 sm:inline" style={PIXEL_FONT}>
            1P READY
          </span>
          <p className="mx-auto text-center font-black uppercase tracking-[0.35em] text-amber-500/95" style={{ ...PIXEL_FONT, fontSize: "12px" }}>
            PROJECT PORTFOLIO
          </p>
          <span
            className={`hidden text-[8px] tabular-nums transition-colors sm:inline ${coinFlash ? "text-amber-300" : "text-amber-500/70"
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
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t-4 border-[#22222c] bg-gradient-to-b from-[#16161e] to-[#0e0e14] px-5 py-5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-6">
          {/* Player 1 detailed red arcade joystick + sculpted D-pad + B / A / GO buttons */}
          <div className="flex items-center gap-4 sm:justify-self-start">
            <div className="flex flex-col items-center gap-1.5">
              {/* Steel mounting plate with 4 corner screws + recessed gate */}
              <div className="relative h-16 w-16 rounded-sm border-2 border-[#3b3b4a] bg-gradient-to-b from-[#23232e] to-[#16161d] shadow-[inset_0_2px_6px_rgba(0,0,0,0.75)]">
                {/* 4 corner screws */}
                <span className="pointer-events-none absolute left-1 top-1 h-1 w-1 rounded-full bg-slate-500/70" />
                <span className="pointer-events-none absolute right-1 top-1 h-1 w-1 rounded-full bg-slate-500/70" />
                <span className="pointer-events-none absolute bottom-1 left-1 h-1 w-1 rounded-full bg-slate-500/70" />
                <span className="pointer-events-none absolute bottom-1 right-1 h-1 w-1 rounded-full bg-slate-500/70" />

                {/* Centered recessed circular dust washer */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full border-2 border-[#343442] bg-[#08080c] shadow-[inset_0_3px_8px_rgba(0,0,0,0.95)]" />
                </div>

                {/* Directional clickable quadrants */}
                <button
                  type="button"
                  onClick={() => pulseStick("up", "arrowup", -1)}
                  aria-label="Up"
                  title="Up"
                  className="absolute inset-x-4 top-0 z-10 flex h-4 cursor-pointer items-start justify-center pt-0.5 text-slate-400/75 hover:text-amber-300 focus:outline-none"
                >
                  <PixelArrowIcon dir="up" className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("down", "arrowdown", 1)}
                  aria-label="Down"
                  title="Down"
                  className="absolute inset-x-4 bottom-0 z-10 flex h-4 cursor-pointer items-end justify-center pb-0.5 text-slate-400/75 hover:text-amber-300 focus:outline-none"
                >
                  <PixelArrowIcon dir="down" className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("left", "arrowleft")}
                  aria-label="Left"
                  title="Left"
                  className="absolute inset-y-4 left-0 z-10 flex w-4 cursor-pointer items-center justify-start pl-0.5 text-slate-400/75 hover:text-amber-300 focus:outline-none"
                >
                  <PixelArrowIcon dir="left" className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("right", "arrowright")}
                  aria-label="Right"
                  title="Right"
                  className="absolute inset-y-4 right-0 z-10 flex w-4 cursor-pointer items-center justify-end pr-0.5 text-slate-400/75 hover:text-amber-300 focus:outline-none"
                >
                  <PixelArrowIcon dir="right" className="h-2.5 w-2.5" />
                </button>

                {/* Centered metallic shaft + glossy red ball-top */}
                <div
                  className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-transform duration-100 ${stickOffsetClass}`}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute top-2 h-3 w-2 rounded-b-sm border border-slate-500/70 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 shadow-md" />
                    <div className="relative h-6 w-6 rounded-full border-2 border-red-950 bg-gradient-to-br from-rose-400 via-red-600 to-red-900 shadow-[0_4px_10px_rgba(0,0,0,0.85),inset_0_-2px_4px_rgba(0,0,0,0.45)]">
                      <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/85" />
                      <span className="absolute left-2.5 top-2 h-1 w-1 rounded-full bg-rose-200/60" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-slate-400" style={PIXEL_FONT}>P1</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {/* Row 1: Sculpted 3D pixel directional arrow buttons */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => pulseStick("left", "arrowleft")}
                  title="Left"
                  aria-label="Left button"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-none border-2 border-[#4a4a5e] border-b-[#1a1a24] border-r-[#1a1a24] bg-gradient-to-b from-[#2c2112] to-[#171108] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.25)] transition active:translate-y-0.5 hover:border-amber-400/80 hover:from-[#3d2d16] hover:to-[#22180b] focus:outline-none"
                >
                  <PixelArrowIcon dir="left" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("up", "arrowup", -1)}
                  title="Up"
                  aria-label="Up button"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-none border-2 border-[#4a4a5e] border-b-[#1a1a24] border-r-[#1a1a24] bg-gradient-to-b from-[#2c2112] to-[#171108] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.25)] transition active:translate-y-0.5 hover:border-amber-400/80 hover:from-[#3d2d16] hover:to-[#22180b] focus:outline-none"
                >
                  <PixelArrowIcon dir="up" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("down", "arrowdown", 1)}
                  title="Down"
                  aria-label="Down button"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-none border-2 border-[#4a4a5e] border-b-[#1a1a24] border-r-[#1a1a24] bg-gradient-to-b from-[#2c2112] to-[#171108] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.25)] transition active:translate-y-0.5 hover:border-amber-400/80 hover:from-[#3d2d16] hover:to-[#22180b] focus:outline-none"
                >
                  <PixelArrowIcon dir="down" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => pulseStick("right", "arrowright")}
                  title="Right"
                  aria-label="Right button"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-none border-2 border-[#4a4a5e] border-b-[#1a1a24] border-r-[#1a1a24] bg-gradient-to-b from-[#2c2112] to-[#171108] text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.25)] transition active:translate-y-0.5 hover:border-amber-400/80 hover:from-[#3d2d16] hover:to-[#22180b] focus:outline-none"
                >
                  <PixelArrowIcon dir="right" className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* Row 2: B, A, and GO action buttons */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onArcadeInput?.("b")}
                  title="B button"
                  aria-label="B button"
                  className="flex h-7 w-8 cursor-pointer items-center justify-center rounded-none border-2 border-rose-500/60 bg-rose-950/70 text-[8px] text-rose-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition active:translate-y-0.5 hover:bg-rose-800/80 focus:outline-none"
                  style={PIXEL_FONT}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => onArcadeInput?.("a")}
                  title="A button"
                  aria-label="A button"
                  className="flex h-7 w-8 cursor-pointer items-center justify-center rounded-none border-2 border-emerald-500/60 bg-emerald-950/70 text-[8px] text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition active:translate-y-0.5 hover:bg-emerald-800/80 focus:outline-none"
                  style={PIXEL_FONT}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchSelected?.()}
                  title="Open Selected Project"
                  aria-label="Open selected project"
                  className="flex h-7 flex-1 cursor-pointer items-center justify-center rounded-none border-2 border-amber-500/70 bg-amber-600/80 px-2.5 text-[7px] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition active:translate-y-0.5 hover:bg-amber-400 focus:outline-none"
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
            className="group relative flex cursor-pointer flex-col items-center gap-1 rounded px-3 py-1 transition hover:bg-white/5 active:translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400/60 sm:justify-self-center"
          >
            <div className="relative flex items-center justify-center">
              {/* Clipped vertical coin-drop chute terminating inside the recessed slot */}
              {coinFlash && coinDropId > 0 && (
                <div className="pointer-events-none absolute bottom-[3px] left-1/2 z-20 flex h-9 w-8 -translate-x-1/2 items-end justify-center overflow-hidden">
                  <div key={coinDropId} className="coin-insert-anim">
                    <PixelCoinSprite />
                  </div>
                </div>
              )}

              {/* Recessed arcade coin slot bezel + dark inner slit */}
              <div
                className={`relative z-10 flex h-3 w-11 items-center justify-center rounded-none border-2 transition ${coinFlash
                  ? "border-amber-400 bg-amber-950/80 shadow-[0_0_12px_rgba(251,191,36,0.65)]"
                  : "border-[#3a3a4a] bg-[#1a1a24] group-hover:border-amber-400/60"
                  }`}
              >
                <span
                  className={`h-1 w-7 transition-colors ${coinFlash ? "bg-amber-300/80" : "bg-black"
                    }`}
                />
              </div>
            </div>
            <span
              className={`text-[8px] uppercase transition ${coinFlash ? "text-amber-300" : "text-slate-400 group-hover:text-amber-300"
                }`}
              style={PIXEL_FONT}
            >
              {coinFlash ? "+1 CRD" : "COIN"}
            </span>
          </button>

          {/* Arcade Cabinet CREDITS Counter (only on the project arcade machine) */}
          <div className="flex items-center gap-3 sm:justify-self-end">
            <div className="rounded border-2 border-emerald-500/45 bg-black/80 px-3.5 py-2 text-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
              <p className="text-[7px] uppercase tracking-wider text-emerald-400/90" style={PIXEL_FONT}>
                CREDITS
              </p>
              <p className="mt-1 text-[12px] tabular-nums text-emerald-300" style={PIXEL_FONT}>
                {String(credits).padStart(2, "0")}
              </p>
            </div>
            <div className="hidden flex-col items-center gap-1 sm:flex">
              <div className="h-10 w-10 rounded-sm border-2 border-[#333340] bg-[#252530] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
              <span className="text-[9px] uppercase tracking-widest text-slate-500" style={PIXEL_FONT}>P2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
