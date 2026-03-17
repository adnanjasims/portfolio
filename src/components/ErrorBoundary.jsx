import { Component } from "react";

const LOG_PREFIX = "[Portfolio]";

/**
 * Fallback UI when a child component throws. Logs to console with [Portfolio] prefix.
 */
export default class ErrorBoundary extends Component {
  state = {
    error: null,
    errorInfo: null,
    eventId: null,
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    const eventId = Date.now();
    this.setState({ errorInfo, eventId });

    console.error(
      `${LOG_PREFIX} ErrorBoundary caught an error (id=${eventId}):`,
      error,
      errorInfo
    );
    console.error(`${LOG_PREFIX} Error message:`, error?.message);
    console.error(`${LOG_PREFIX} Component stack:`, errorInfo?.componentStack);
    if (error?.stack) {
      console.error(`${LOG_PREFIX} Stack trace:`, error.stack);
    }
  }

  handleRetry = () => {
    this.setState({ error: null, errorInfo: null, eventId: null });
  };

  render() {
    if (this.state.error) {
      const { error, errorInfo, eventId } = this.state;
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg border-2 border-red-500/80 bg-slate-950 p-6 text-left shadow-xl">
            <h2 className="mb-3 text-lg font-bold text-red-400">
              Something went wrong (event #{eventId})
            </h2>
            <p className="mb-2 font-mono text-sm text-red-200">
              {error?.message ?? String(error)}
            </p>
            {error?.stack && (
              <pre className="mb-4 max-h-48 overflow-auto rounded bg-black/60 p-3 text-xs text-slate-300 whitespace-pre-wrap break-words">
                {error.stack}
              </pre>
            )}
            {errorInfo?.componentStack && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-slate-400">
                  Component stack
                </summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-black/60 p-3 text-xs text-slate-400 whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="rounded border border-red-500/80 bg-red-950/50 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-900/30"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => {
                  console.error(`${LOG_PREFIX} Full error object:`, error);
                  console.error(`${LOG_PREFIX} Full errorInfo:`, errorInfo);
                }}
                className="rounded border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
              >
                Log full details to console
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
