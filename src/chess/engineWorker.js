/**
 * Dedicated Web Worker running the ported C++ alpha-beta search off the main UI thread.
 */
import { Board } from "./board.js";
import { clearTranspositionTable, search } from "./search.js";

self.onmessage = (event) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "reset") {
    clearTranspositionTable();
    return;
  }

  if (msg.type === "search") {
    const { requestId, fen, depth, timeLimitSeconds, history } = msg;
    try {
      const board = new Board();
      board.setFen(fen);
      const res = search(board, depth, timeLimitSeconds, history);
      self.postMessage({
        type: "result",
        requestId,
        bestmove: res.bestMoveUci,
        score: res.score,
        depth: res.depth,
        nodes: res.nodes,
        fromBook: res.fromBook,
      });
    } catch (err) {
      self.postMessage({
        type: "error",
        requestId,
        message: err?.message || "Search failed",
      });
    }
  }
};
