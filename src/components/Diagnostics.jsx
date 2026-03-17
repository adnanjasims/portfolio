/**
 * On-screen diagnostics panel when ?diagnostics=1 or __PORTFOLIO_DIAGNOSTICS__ is set.
 */
const LOG_PREFIX = "[Portfolio]";

export function log(msg, data = null) {
  const payload = data !== null ? [msg, data] : [msg];
  console.log(`${LOG_PREFIX}`, ...payload);
}

export function logError(msg, err) {
  console.error(`${LOG_PREFIX}`, msg, err);
}

export function useDiagnostics() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("diagnostics") === "1" || window.__PORTFOLIO_DIAGNOSTICS__ === true;
}

export default function DiagnosticsPanel({ layoutMode, kaboomStatus, lastError, appMountedAt }) {
  const show = useDiagnostics();
  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9000] max-w-sm rounded-lg border border-amber-500/60 bg-slate-950/95 p-3 font-mono text-xs text-amber-100 shadow-xl">
      <div className="mb-2 font-bold text-amber-400">Diagnostics</div>
      <div className="space-y-1">
        <div>Layout: <span className="text-white">{layoutMode}</span></div>
        <div>Kaboom: <span className="text-white">{kaboomStatus}</span></div>
        <div>App mounted: <span className="text-white">{appMountedAt ? new Date(appMountedAt).toISOString() : "n/a"}</span></div>
        {lastError && (
          <div className="mt-2 rounded bg-red-950/50 p-2 text-red-200">
            Last error: {lastError}
          </div>
        )}
      </div>
    </div>
  );
}
