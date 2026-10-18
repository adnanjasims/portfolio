import { useEffect, useState } from "react";

const BOOT_LINES = [
  "ROM CHECK .............. OK",
  "GPU INIT ............... OK",
  "LOADING PORTFOLIO ...... OK",
  "CHESS ENGINE ........... READY",
  "INSERT COIN TO CONTINUE",
];

const FILL_MS = 5500;
const HOLD_MS = 1500;
const DISSOLVE_MS = 500;
const COLLAPSE_MS = 900;
const TICK_MS = 50;
const LINE_INTERVAL_MS = 900;

/** One-shot boot overlay before the portfolio shows. */
export default function ArcadeBootScreen({ onReveal, onDone }) {
  const [progress, setProgress] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [phase, setPhase] = useState("boot"); // boot | dissolve | collapse | done

  useEffect(() => {
    let progressTimer = 0;
    let lineTimer = 0;
    let holdTimer = 0;
    let dissolveTimer = 0;
    let collapseTimer = 0;
    let cancelled = false;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // shorter timings when the user prefers reduced motion
    const fillMs = prefersReduced ? 2200 : FILL_MS;
    const holdMs = prefersReduced ? 600 : HOLD_MS;
    const dissolveMs = prefersReduced ? 200 : DISSOLVE_MS;
    const collapseMs = prefersReduced ? 350 : COLLAPSE_MS;
    const startedAt = performance.now();

    setProgress(0);
    setLineCount(0);

    const finish = () => {
      if (cancelled) return;
      // panel text dissolves first, then CRT collapses while content reveals under
      setPhase("dissolve");
      dissolveTimer = window.setTimeout(() => {
        if (cancelled) return;
        setPhase("collapse");
        onReveal?.();
        collapseTimer = window.setTimeout(() => {
          if (cancelled) return;
          setPhase("done");
          onDone?.();
        }, collapseMs);
      }, dissolveMs);
    };

    progressTimer = window.setInterval(() => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;
      const next = Math.min(100, Math.round((elapsed / fillMs) * 100));
      setProgress(next);
      if (next >= 100) {
        clearInterval(progressTimer);
        setProgress(100);
        holdTimer = window.setTimeout(finish, holdMs);
      }
    }, TICK_MS);

    let i = 0;
    lineTimer = window.setInterval(() => {
      i += 1;
      setLineCount(Math.min(i, BOOT_LINES.length));
      if (i >= BOOT_LINES.length) clearInterval(lineTimer);
    }, prefersReduced ? 400 : LINE_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(progressTimer);
      clearInterval(lineTimer);
      clearTimeout(holdTimer);
      clearTimeout(dissolveTimer);
      clearTimeout(collapseTimer);
    };
  }, [onReveal, onDone]);

  if (phase === "done") return null;

  const phaseClass =
    phase === "dissolve"
      ? "arcade-boot--dissolve"
      : phase === "collapse"
        ? "arcade-boot--collapse"
        : "";

  return (
    <div
      className={`arcade-boot fixed inset-0 z-50 flex items-center justify-center bg-black ${phaseClass}`}
      aria-live="polite"
      aria-busy={phase === "boot"}
    >
      <div className="arcade-boot__crt pointer-events-none absolute inset-0" />
      <div className="arcade-boot__scanlines pointer-events-none absolute inset-0" />
      <div className="arcade-boot__glow pointer-events-none absolute inset-0" />

      <div className="arcade-boot__panel relative z-10 w-full max-w-md px-6 text-center">
        <p className="arcade-boot__title mb-6 text-[12px] uppercase tracking-[0.35em] text-amber-400">
          PORTFOLIO OS
        </p>
        <p className="mb-4 text-[10px] uppercase tracking-widest text-white/70">
          BOOTING SYSTEM
        </p>

        <div className="mx-auto mb-6 h-3 w-full max-w-xs overflow-hidden rounded-sm border-2 border-amber-500/60 bg-black">
          <div
            className="h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            style={{ width: `${progress}%`, transition: "none" }}
          />
        </div>

        <p className="mb-4 text-[10px] tabular-nums text-amber-300/90">
          {progress}%
        </p>

        <ul className="mx-auto max-w-xs space-y-2 text-left">
          {BOOT_LINES.slice(0, lineCount).map((line) => (
            <li
              key={line}
              className="arcade-boot__line text-[8px] leading-relaxed text-white/60"
            >
              {line}
            </li>
          ))}
        </ul>

        {progress >= 100 && (
          <p className="arcade-boot__blink mt-8 text-[10px] uppercase tracking-[0.4em] text-amber-400">
            PRESS START
          </p>
        )}
      </div>
    </div>
  );
}
