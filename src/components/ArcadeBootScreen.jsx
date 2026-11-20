import { useCallback, useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "ROM CHECK .............. OK",
  "GPU INIT ............... OK",
  "LOADING PORTFOLIO ...... OK",
  "CHESS ENGINE ........... READY",
  "CABINET ONLINE",
];

// total fill is 1s shorter than before; curve: fast to ~88%, lag, then snap finish
const FILL_MS = 4500;
const HOLD_MS = 1500;
const DISSOLVE_MS = 500;
const COLLAPSE_MS = 900;
const TICK_MS = 40;
const LINE_INTERVAL_MS = 750;

/** Maps elapsed fraction t in [0,1] to a 0-100 boot bar with a late lag. */
function progressFromTime(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 100;
  if (t < 0.45) return (t / 0.45) * 88;
  if (t < 0.85) return 88 + ((t - 0.45) / 0.4) * 6;
  return 94 + ((t - 0.85) / 0.15) * 6;
}

/** One-shot boot overlay before the portfolio shows. */
export default function ArcadeBootScreen({ onReveal, onDone }) {
  const [progress, setProgress] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [phase, setPhase] = useState("boot"); // boot | dissolve | collapse | done
  const finishingRef = useRef(false);
  const timersRef = useRef({
    progress: 0,
    line: 0,
    hold: 0,
    dissolve: 0,
    collapse: 0,
  });

  const triggerFinish = useCallback(
    (immediate = false) => {
      if (finishingRef.current) return;
      finishingRef.current = true;

      const t = timersRef.current;
      clearInterval(t.progress);
      clearInterval(t.line);
      clearTimeout(t.hold);

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dissolveMs = immediate ? 180 : prefersReduced ? 200 : DISSOLVE_MS;
      const collapseMs = immediate ? 350 : prefersReduced ? 350 : COLLAPSE_MS;

      if (immediate) {
        setProgress(100);
        setLineCount(BOOT_LINES.length);
      }

      setPhase("dissolve");
      t.dissolve = window.setTimeout(() => {
        setPhase("collapse");
        onReveal?.();
        t.collapse = window.setTimeout(() => {
          setPhase("done");
          onDone?.();
        }, collapseMs);
      }, dissolveMs);
    },
    [onDone, onReveal]
  );

  useEffect(() => {
    finishingRef.current = false;
    const t = timersRef.current;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fillMs = prefersReduced ? 1800 : FILL_MS;
    const holdMs = prefersReduced ? 500 : HOLD_MS;
    const startedAt = performance.now();

    t.progress = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const frac = Math.min(1, elapsed / fillMs);
      const next = Math.min(100, Math.round(progressFromTime(frac)));
      setProgress(next);
      if (frac >= 1) {
        clearInterval(t.progress);
        setProgress(100);
        t.hold = window.setTimeout(() => triggerFinish(false), holdMs);
      }
    }, TICK_MS);

    let i = 0;
    t.line = window.setInterval(() => {
      i += 1;
      setLineCount(Math.min(i, BOOT_LINES.length));
      if (i >= BOOT_LINES.length) clearInterval(t.line);
    }, prefersReduced ? 320 : LINE_INTERVAL_MS);

    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      triggerFinish(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(t.progress);
      clearInterval(t.line);
      clearTimeout(t.hold);
      clearTimeout(t.dissolve);
      clearTimeout(t.collapse);
    };
  }, [triggerFinish]);

  if (phase === "done") return null;

  const phaseClass =
    phase === "dissolve"
      ? "arcade-boot--dissolve"
      : phase === "collapse"
        ? "arcade-boot--collapse"
        : "";

  return (
    <div
      onClick={() => triggerFinish(true)}
      className={`arcade-boot fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black ${phaseClass}`}
      aria-live="polite"
      aria-busy={phase === "boot"}
      role="button"
      tabIndex={0}
      aria-label="Booting portfolio, click or press any key to skip"
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

        {progress >= 100 ? (
          <p className="arcade-boot__blink mt-8 text-[10px] uppercase tracking-[0.4em] text-amber-400">
            PRESS START
          </p>
        ) : (
          <p className="mt-8 text-[8px] uppercase tracking-[0.2em] text-white/40">
            CLICK OR PRESS ANY KEY TO SKIP
          </p>
        )}
      </div>
    </div>
  );
}
