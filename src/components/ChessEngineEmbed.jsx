import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { START_FEN, nameToSquare, squareToName } from "../chess/board";
import { applyUciMove, getLegalState } from "../chess/moves";
import { playMove, playSelect } from "../utils/arcadeSfx";
import ChessBoard, { ChessPieceSvg } from "./ChessBoard";

/**
 * Native Chess Club x Arcade Cabinet fusion housing powered locally
 * by a Web Worker port of the C++/Python UCI alpha-beta chess engine.
 */
const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };
const CLOCK_SECONDS = 300;
const MATE_THRESHOLD = 90000;

const DIFFICULTY_CONFIG = {
  easy: { label: "EASY", depth: 4, timeLimit: 0.5, dotClass: "bg-emerald-400" },
  medium: { label: "MED", depth: 8, timeLimit: 1.8, dotClass: "bg-amber-400" },
  hard: { label: "HARD", depth: 14, timeLimit: 4.0, dotClass: "bg-rose-400" },
};

const INITIAL_LEGAL_MOVES = getLegalState(START_FEN).moves;

function fenPositionKey(fen) {
  return String(fen || "").split(/\s+/).slice(0, 4).join(" ");
}

function fenIsWhiteTurn(fen) {
  return (String(fen || "").split(/\s+/)[1] || "w") === "w";
}

function fenToPieceCounts(fen) {
  const pos = String(fen || "").split(/\s+/)[0] || "";
  const counts = {};
  for (const ch of pos) {
    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
      counts[ch] = (counts[ch] || 0) + 1;
    }
  }
  return counts;
}

function computeCapturedAndDiff(fen) {
  const startCounts = { P: 8, N: 2, B: 2, R: 2, Q: 1, p: 8, n: 2, b: 2, r: 2, q: 1 };
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const current = fenToPieceCounts(fen);

  const capturedByWhite = [];
  const capturedByBlack = [];
  let whiteMat = 0;
  let blackMat = 0;

  for (const kind of ["q", "r", "b", "n", "p"]) {
    const missingBlack = Math.max(0, startCounts[kind] - (current[kind] || 0));
    for (let i = 0; i < missingBlack; i += 1) capturedByWhite.push(kind);
    blackMat += (current[kind] || 0) * values[kind];

    const upper = kind.toUpperCase();
    const missingWhite = Math.max(0, startCounts[upper] - (current[upper] || 0));
    for (let i = 0; i < missingWhite; i += 1) capturedByBlack.push(upper);
    whiteMat += (current[upper] || 0) * values[kind];
  }

  return {
    capturedByWhite,
    capturedByBlack,
    materialDiff: whiteMat - blackMat,
  };
}

function formatClock(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = String(Math.floor(clamped / 60)).padStart(2, "0");
  const secs = String(clamped % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatEvalLabel(cp) {
  if (Math.abs(cp) >= MATE_THRESHOLD) {
    return cp >= 0 ? "+MATE" : "-MATE";
  }
  const pawns = cp / 100;
  return `${pawns >= 0 ? "+" : ""}${pawns.toFixed(1)}`;
}

function whiteBarPercent(cp) {
  if (Math.abs(cp) >= MATE_THRESHOLD) {
    return cp >= 0 ? 96 : 4;
  }
  return 50 + Math.tanh(cp / 420) * 46;
}

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

function PixelUndoArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left arrowhead */}
      <rect x="2" y="6" width="2" height="2" />
      <rect x="4" y="4" width="2" height="6" />
      <rect x="6" y="2" width="2" height="10" />
      {/* Curved return shaft */}
      <rect x="8" y="6" width="5" height="2" />
      <rect x="12" y="8" width="2" height="4" />
      <rect x="8" y="11" width="4" height="2" />
    </svg>
  );
}

function PixelQuestionIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="2" width="6" height="2" />
      <rect x="3" y="4" width="2" height="2" />
      <rect x="11" y="4" width="2" height="3" />
      <rect x="9" y="7" width="2" height="2" />
      <rect x="7" y="9" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
    </svg>
  );
}

function PixelPlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="7" y="2" width="2" height="12" />
      <rect x="2" y="7" width="12" height="2" />
    </svg>
  );
}

function PixelToppledKingIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Ground shadow line */}
      <rect x="1" y="13" width="13" height="1" fill="currentColor" opacity="0.35" />
      {/* Fallen King base on left */}
      <rect x="1" y="5" width="2" height="7" fill="currentColor" />
      {/* King torso lying horizontally */}
      <rect x="3" y="7" width="5" height="3" fill="currentColor" />
      <rect x="3" y="6" width="5" height="1" fill="currentColor" opacity="0.85" />
      <rect x="3" y="10" width="5" height="1" fill="currentColor" opacity="0.85" />
      {/* Collar & crown band */}
      <rect x="8" y="6" width="2" height="5" fill="#fecb00" />
      <rect x="10" y="7" width="2" height="3" fill="currentColor" />
      {/* Tipped King cross on right */}
      <rect x="12" y="8" width="4" height="1" fill="#fecb00" />
      <rect x="13" y="6" width="1" height="5" fill="#fecb00" />
    </svg>
  );
}

export default function ChessEngineEmbed() {
  const [fen, setFen] = useState(START_FEN);
  const [legalMoves, setLegalMoves] = useState(INITIAL_LEGAL_MOVES);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [lastFrom, setLastFrom] = useState(null);
  const [lastTo, setLastTo] = useState(null);
  const [hintFrom, setHintFrom] = useState(null);
  const [hintTo, setHintTo] = useState(null);
  const [inCheck, setInCheck] = useState(false);
  const [playerColor, setPlayerColor] = useState("white");
  const [difficulty, setDifficulty] = useState("medium");
  const [gameOver, setGameOver] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [hinting, setHinting] = useState(false);
  const [hintText, setHintText] = useState("");
  const [moveLog, setMoveLog] = useState([]);
  const [snapshots, setSnapshots] = useState([
    {
      fen: START_FEN,
      legalMoves: INITIAL_LEGAL_MOVES,
      lastFrom: null,
      lastTo: null,
      inCheck: false,
      san: "",
      evalCp: 0,
    },
  ]);
  const [pendingPromo, setPendingPromo] = useState(null);
  const [evalCp, setEvalCp] = useState(0);
  const [searchMeta, setSearchMeta] = useState(null);
  const [whiteClockSec, setWhiteClockSec] = useState(CLOCK_SECONDS);
  const [blackClockSec, setBlackClockSec] = useState(CLOCK_SECONDS);
  const [clickSeq, setClickSeq] = useState({
    undo: 0,
    hint: 0,
    newGame: 0,
    resign: 0,
    white: 0,
    black: 0,
  });

  const pulseButton = (key) => {
    setClickSeq((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const positionHistoryRef = useRef([fenPositionKey(START_FEN)]);
  const gameSeqRef = useRef(0);
  const workerRef = useRef(null);
  const pendingWorkerReqRef = useRef(null);
  const requestSeqRef = useRef(0);
  const moveListContainerRef = useRef(null);
  const clocksRef = useRef({ white: CLOCK_SECONDS, black: CLOCK_SECONDS });

  const playAsWhite = playerColor === "white";
  const whiteTurn = fenIsWhiteTurn(fen);
  const isUserTurn = !gameOver && (playAsWhite ? whiteTurn : !whiteTurn);

  const terminateWorker = useCallback(() => {
    if (pendingWorkerReqRef.current) {
      pendingWorkerReqRef.current.resolve({ aborted: true });
      pendingWorkerReqRef.current = null;
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  useEffect(() => () => terminateWorker(), [terminateWorker]);

  useEffect(() => {
    const el = moveListContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [moveLog.length]);

  // Live chess clock ticking once the first move is played
  useEffect(() => {
    if (moveLog.length === 0 || gameOver) return undefined;

    const timer = window.setInterval(() => {
      if (whiteTurn) {
        const nextWhite = Math.max(0, clocksRef.current.white - 1);
        clocksRef.current.white = nextWhite;
        setWhiteClockSec(nextWhite);
        if (nextWhite === 0) {
          gameSeqRef.current += 1;
          terminateWorker();
          setThinking(false);
          setHinting(false);
          setHintText("");
          setPendingPromo(null);
          setLegalMoves([]);
          setGameOver("Time out! Black wins.");
        }
      } else {
        const nextBlack = Math.max(0, clocksRef.current.black - 1);
        clocksRef.current.black = nextBlack;
        setBlackClockSec(nextBlack);
        if (nextBlack === 0) {
          gameSeqRef.current += 1;
          terminateWorker();
          setThinking(false);
          setHinting(false);
          setHintText("");
          setPendingPromo(null);
          setLegalMoves([]);
          setGameOver("Time out! White wins.");
        }
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [moveLog.length, gameOver, whiteTurn, terminateWorker]);

  const runWorkerSearch = useCallback((searchFen, depth, timeLimitSeconds, history) => {
    if (pendingWorkerReqRef.current) {
      pendingWorkerReqRef.current.resolve({ aborted: true });
      pendingWorkerReqRef.current = null;
    }

    if (!workerRef.current) {
      const worker = new Worker(new URL("../chess/engineWorker.js", import.meta.url), {
        type: "module",
      });
      worker.onmessage = (event) => {
        const msg = event.data;
        if (!msg || typeof msg !== "object") return;
        const pending = pendingWorkerReqRef.current;
        if (!pending || pending.requestId !== msg.requestId) return;
        pendingWorkerReqRef.current = null;
        if (msg.type === "result") {
          pending.resolve({
            aborted: false,
            bestmove: msg.bestmove,
            score: msg.score,
            depth: msg.depth,
            nodes: msg.nodes,
            fromBook: msg.fromBook,
          });
        } else {
          pending.reject(new Error(msg.message || "Search error"));
        }
      };
      worker.onerror = (err) => {
        const pending = pendingWorkerReqRef.current;
        if (pending) {
          pendingWorkerReqRef.current = null;
          pending.reject(new Error(err?.message || "Worker execution error"));
        }
      };
      workerRef.current = worker;
    }

    const requestId = ++requestSeqRef.current;
    return new Promise((resolve, reject) => {
      pendingWorkerReqRef.current = { requestId, resolve, reject };
      workerRef.current.postMessage({
        type: "search",
        requestId,
        fen: searchFen,
        depth,
        timeLimitSeconds,
        history,
      });
    });
  }, []);

  const runEngineMove = useCallback(
    async (currentFen, seq, diff) => {
      const cfg = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.medium;
      setThinking(true);
      setHintText("");
      try {
        const res = await runWorkerSearch(
          currentFen,
          cfg.depth,
          cfg.timeLimit,
          positionHistoryRef.current
        );
        if (res.aborted || seq !== gameSeqRef.current) return;

        if (!res.bestmove) {
          const fallback = getLegalState(currentFen, positionHistoryRef.current);
          setGameOver(fallback.gameOver || "Game over.");
          return;
        }

        const applied = applyUciMove(currentFen, res.bestmove, positionHistoryRef.current);
        if (seq !== gameSeqRef.current) return;

        positionHistoryRef.current.push(applied.positionKey);
        const fromSq = nameToSquare(res.bestmove.slice(0, 2));
        const toSq = nameToSquare(res.bestmove.slice(2, 4));
        const nextEval = typeof res.score === "number" ? res.score : 0;

        setLastFrom(fromSq);
        setLastTo(toSq);
        setFen(applied.fen);
        setLegalMoves(applied.moves);
        setInCheck(applied.inCheck);
        setSelectedSquare(null);
        setHintFrom(null);
        setHintTo(null);
        setEvalCp(nextEval);
        setSearchMeta({ depth: res.depth, nodes: res.nodes, fromBook: res.fromBook });
        setMoveLog((prev) => [...prev, applied.san]);
        setSnapshots((prev) => [
          ...prev,
          {
            fen: applied.fen,
            legalMoves: applied.moves,
            lastFrom: fromSq,
            lastTo: toSq,
            inCheck: applied.inCheck,
            san: applied.san,
            evalCp: nextEval,
          },
        ]);
        playMove();

        if (applied.gameOver) {
          setGameOver(applied.gameOver);
        }
      } catch (err) {
        if (seq !== gameSeqRef.current) return;
        console.error("chess engine error", err);
        setHintText("Engine error. Click New Game to reset.");
      } finally {
        if (seq === gameSeqRef.current) {
          setThinking(false);
        }
      }
    },
    [runWorkerSearch]
  );

  const startNewGame = useCallback(
    (sideColor = playerColor) => {
      gameSeqRef.current += 1;
      const seq = gameSeqRef.current;
      terminateWorker();

      clocksRef.current = { white: CLOCK_SECONDS, black: CLOCK_SECONDS };
      setWhiteClockSec(CLOCK_SECONDS);
      setBlackClockSec(CLOCK_SECONDS);

      setPlayerColor(sideColor);
      setFen(START_FEN);
      setLegalMoves(INITIAL_LEGAL_MOVES);
      setSelectedSquare(null);
      setLastFrom(null);
      setLastTo(null);
      setHintFrom(null);
      setHintTo(null);
      setInCheck(false);
      setGameOver(null);
      setThinking(false);
      setHinting(false);
      setHintText("");
      setPendingPromo(null);
      setEvalCp(0);
      setSearchMeta(null);
      setMoveLog([]);
      setSnapshots([
        {
          fen: START_FEN,
          legalMoves: INITIAL_LEGAL_MOVES,
          lastFrom: null,
          lastTo: null,
          inCheck: false,
          san: "",
          evalCp: 0,
        },
      ]);
      positionHistoryRef.current = [fenPositionKey(START_FEN)];
      playSelect();

      if (sideColor === "black") {
        runEngineMove(START_FEN, seq, difficulty);
      }
    },
    [difficulty, playerColor, runEngineMove, terminateWorker]
  );

  const submitUserMove = async (moveUci, fromSq, toSq) => {
    const seq = gameSeqRef.current;
    setPendingPromo(null);
    setSelectedSquare(null);
    setHintFrom(null);
    setHintTo(null);
    setHintText("");

    try {
      const applied = applyUciMove(fen, moveUci, positionHistoryRef.current);
      positionHistoryRef.current.push(applied.positionKey);

      setLastFrom(fromSq);
      setLastTo(toSq);
      setFen(applied.fen);
      setLegalMoves(applied.moves);
      setInCheck(applied.inCheck);
      setMoveLog((prev) => [...prev, applied.san]);
      setSnapshots((prev) => [
        ...prev,
        {
          fen: applied.fen,
          legalMoves: applied.moves,
          lastFrom: fromSq,
          lastTo: toSq,
          inCheck: applied.inCheck,
          san: applied.san,
          evalCp,
        },
      ]);
      playMove();

      if (applied.gameOver) {
        setGameOver(applied.gameOver);
        return;
      }

      await runEngineMove(applied.fen, seq, difficulty);
    } catch (err) {
      if (seq !== gameSeqRef.current) return;
      console.error("apply move error", err);
      setHintText("Illegal move or board state error.");
    }
  };

  const handleSquareClick = (sq) => {
    if (gameOver || thinking || pendingPromo || !isUserTurn) return;
    const sqName = squareToName(sq);

    if (selectedSquare !== null) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        return;
      }
      const fromName = squareToName(selectedSquare);
      const matches = legalMoves.filter(
        (m) => m.slice(0, 2) === fromName && m.slice(2, 4) === sqName
      );
      if (matches.length > 0) {
        if (matches.length > 1) {
          setPendingPromo({ fromSq: selectedSquare, toSq: sq, choices: matches });
          return;
        }
        submitUserMove(matches[0], selectedSquare, sq);
        return;
      }
      const isOwnPiece = legalMoves.some((m) => m.slice(0, 2) === sqName);
      setSelectedSquare(isOwnPiece ? sq : null);
      return;
    }

    if (legalMoves.some((m) => m.slice(0, 2) === sqName)) {
      setSelectedSquare(sq);
    }
  };

  const undoLastTurn = () => {
    if (thinking || hinting || pendingPromo) return;
    const minIdx = playAsWhite ? 0 : 1;
    if (snapshots.length <= minIdx + 1) return;

    let targetIdx = snapshots.length - 2;
    while (targetIdx > minIdx) {
      const snapWhite = fenIsWhiteTurn(snapshots[targetIdx].fen);
      const snapUserTurn = playAsWhite ? snapWhite : !snapWhite;
      if (snapUserTurn) break;
      targetIdx -= 1;
    }

    const target = snapshots[targetIdx];
    const nextSnaps = snapshots.slice(0, targetIdx + 1);
    setSnapshots(nextSnaps);
    setMoveLog((prev) => prev.slice(0, targetIdx));
    positionHistoryRef.current = nextSnaps.map((s) => fenPositionKey(s.fen));
    setFen(target.fen);
    setLegalMoves(target.legalMoves);
    setLastFrom(target.lastFrom);
    setLastTo(target.lastTo);
    setInCheck(target.inCheck);
    setEvalCp(target.evalCp || 0);
    setSelectedSquare(null);
    setHintFrom(null);
    setHintTo(null);
    setHintText("");
    setGameOver(null);
    playSelect();
  };

  const resignGame = () => {
    if (gameOver || thinking || hinting) return;
    terminateWorker();
    const winner = playAsWhite ? "Black" : "White";
    setGameOver(`You resigned. ${winner} wins.`);
    setLegalMoves([]);
    setSelectedSquare(null);
    setHintFrom(null);
    setHintTo(null);
    setHintText("");
  };

  const getHint = async () => {
    if (gameOver || thinking || hinting || !isUserTurn) return;
    const seq = gameSeqRef.current;
    setHinting(true);
    setHintFrom(null);
    setHintTo(null);
    setHintText("Searching...");

    try {
      const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
      const hintDepth = Math.min(8, cfg.depth);
      const hintTime = Math.min(1.5, cfg.timeLimit);
      const res = await runWorkerSearch(fen, hintDepth, hintTime, positionHistoryRef.current);
      if (res.aborted || seq !== gameSeqRef.current) return;

      if (!res.bestmove) {
        setHintText("No hint available.");
        return;
      }

      const fromName = res.bestmove.slice(0, 2);
      const toName = res.bestmove.slice(2, 4);
      const promo = res.bestmove.length === 5 ? `=${res.bestmove[4].toUpperCase()}` : "";
      const fromSq = nameToSquare(fromName);

      setHintFrom(fromSq);
      setHintTo(nameToSquare(toName));
      setHintText(`Hint: ${fromName} -> ${toName}${promo}`);
    } catch (err) {
      if (seq !== gameSeqRef.current) return;
      console.error("hint error", err);
      setHintText("Could not compute hint.");
    } finally {
      if (seq === gameSeqRef.current) {
        setHinting(false);
      }
    }
  };

  const { capturedByWhite, capturedByBlack, materialDiff } = useMemo(
    () => computeCapturedAndDiff(fen),
    [fen]
  );

  const movePairs = useMemo(() => {
    const rows = [];
    for (let i = 0; i < moveLog.length; i += 2) {
      rows.push({
        num: Math.floor(i / 2) + 1,
        white: moveLog[i],
        black: moveLog[i + 1],
      });
    }
    return rows;
  }, [moveLog]);

  const canUndo =
    !thinking && !hinting && !pendingPromo && snapshots.length > (playAsWhite ? 1 : 2);

  const topCaptured = playAsWhite ? capturedByBlack : capturedByWhite;
  const bottomCaptured = playAsWhite ? capturedByWhite : capturedByBlack;
  const topAdvantage = playAsWhite
    ? materialDiff < 0
      ? `+${-materialDiff}`
      : ""
    : materialDiff > 0
      ? `+${materialDiff}`
      : "";
  const bottomAdvantage = playAsWhite
    ? materialDiff > 0
      ? `+${materialDiff}`
      : ""
    : materialDiff < 0
      ? `+${-materialDiff}`
      : "";

  const userClockSec = playAsWhite ? whiteClockSec : blackClockSec;
  const engineClockSec = playAsWhite ? blackClockSec : whiteClockSec;
  const evalWhitePct = whiteBarPercent(evalCp);

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
          Python/C++ Chess engine: grandmaster playing level.
        </p>
      </div>

      {/* Chess Club x Arcade Cabinet Frame */}
      <div className="overflow-hidden rounded-xl border-[6px] border-[#3c2a1a] bg-gradient-to-b from-[#1f160e] via-[#131914] to-[#08120c] shadow-[0_30px_70px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(251,191,36,0.18)]">
        {/* Top Club Marquee */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b-4 border-[#3c2a1a] bg-gradient-to-b from-[#0f2919] to-[#07180e] px-5 py-3">
          <div className="flex items-center gap-2 justify-self-start text-amber-300/90">
            <PixelKnightIcon className="h-5 w-5" />
            <span className="hidden text-[9px] uppercase tracking-wider sm:inline" style={PIXEL_FONT}>
              BOARD 01
            </span>
          </div>

          <p
            className="justify-self-center text-center text-[11px] uppercase tracking-[0.28em] text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] sm:text-[13px]"
            style={PIXEL_FONT}
          >
            CHESS ENGINE
          </p>

          <div className="flex items-center gap-2 justify-self-end">
            <span
              className={`h-2 w-2 rounded-full ${
                thinking || hinting
                  ? "animate-pulse bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                  : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
              }`}
            />
            <span
              className="hidden text-[8.5px] uppercase tracking-wider text-emerald-300/85 sm:inline"
              style={PIXEL_FONT}
            >
              {thinking ? "BUSY" : "READY"}
            </span>
          </div>
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
            {/* Native Embedded Chess UI */}
            <div className="rounded-sm border-2 border-amber-400/35 bg-gradient-to-b from-[#06120a] to-[#040a06] p-3 sm:p-4">
              {/* Board + Controls Split Layout */}
              <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                {/* Left Column: Engine Bar + Board + User Bar + Turn Actions (Undo / Hint) */}
                <div className="flex flex-col gap-2">
                  {/* Top Opponent Strip */}
                  <div className="mx-auto flex w-full max-w-[460px] items-center justify-between rounded border border-[#275D38]/75 bg-[#08150d] px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          !isUserTurn && !gameOver ? "bg-emerald-400 animate-pulse" : "bg-white/25"
                        }`}
                      />
                      <span className="arcade-body text-[14px] font-semibold text-emerald-100">
                        Engine ({playAsWhite ? "Black" : "White"})
                      </span>
                      {!isUserTurn && inCheck && !gameOver && (
                        <span className="arcade-body rounded bg-rose-500/25 px-1.5 py-0.5 text-[11px] font-bold uppercase text-rose-300">
                          Check
                        </span>
                      )}
                    </div>
                    <div className="flex min-h-[20px] items-center gap-0.5">
                      {topCaptured.map((p, idx) => (
                        <ChessPieceSvg key={idx} piece={p} className="h-4 w-4" />
                      ))}
                      {topAdvantage && (
                        <span className="arcade-body ml-1 text-[13px] font-semibold text-amber-300">
                          {topAdvantage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interactive 8x8 ChessBoard */}
                  <ChessBoard
                    fen={fen}
                    legalMoves={legalMoves}
                    selectedSquare={selectedSquare}
                    lastFrom={lastFrom}
                    lastTo={lastTo}
                    orientation={playerColor}
                    hintFrom={hintFrom}
                    hintTo={hintTo}
                    inCheck={inCheck}
                    pendingPromo={pendingPromo}
                    onSquareClick={handleSquareClick}
                    onSelectPromo={(uci) => {
                      if (pendingPromo) {
                        submitUserMove(uci, pendingPromo.fromSq, pendingPromo.toSq);
                      }
                    }}
                    onCancelPromo={() => setPendingPromo(null)}
                    disabled={!!gameOver || thinking || !!pendingPromo}
                  />

                  {/* Bottom Player Strip */}
                  <div className="mx-auto flex w-full max-w-[460px] items-center justify-between rounded border border-[#275D38]/75 bg-[#08150d] px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isUserTurn ? "bg-amber-400 animate-pulse" : "bg-white/25"
                        }`}
                      />
                      <span className="arcade-body text-[14px] font-semibold text-amber-200">
                        You ({playAsWhite ? "White" : "Black"})
                      </span>
                      {isUserTurn && inCheck && !gameOver && (
                        <span className="arcade-body rounded bg-rose-500/25 px-1.5 py-0.5 text-[11px] font-bold uppercase text-rose-300">
                          Check
                        </span>
                      )}
                    </div>
                    <div className="flex min-h-[20px] items-center gap-0.5">
                      {bottomCaptured.map((p, idx) => (
                        <ChessPieceSvg key={idx} piece={p} className="h-4 w-4" />
                      ))}
                      {bottomAdvantage && (
                        <span className="arcade-body ml-1 text-[13px] font-semibold text-amber-300">
                          {bottomAdvantage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Turn-Assist Controls directly under the board (Undo / Hint) */}
                  <div className="mx-auto grid w-full max-w-[460px] grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        pulseButton("undo");
                        undoLastTurn();
                      }}
                      disabled={!canUndo}
                      className="group arcade-body flex cursor-pointer items-center justify-center gap-2 rounded border border-white/20 bg-black/60 px-3 py-2 text-[13px] font-semibold text-white/85 transition-all duration-150 enabled:hover:-translate-y-0.5 enabled:hover:border-amber-300/60 enabled:hover:bg-white/10 enabled:hover:text-white enabled:hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] enabled:active:translate-y-0.5 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none"
                    >
                      <span
                        key={clickSeq.undo}
                        className={`inline-flex transition-transform duration-150 group-enabled:group-hover:-translate-x-1 ${
                          clickSeq.undo > 0 ? "chess-anim-undo" : ""
                        }`}
                      >
                        <PixelUndoArrowIcon className="h-4 w-4" />
                      </span>
                      <span>Undo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        pulseButton("hint");
                        getHint();
                      }}
                      disabled={!!gameOver || thinking || hinting || !isUserTurn}
                      className="group arcade-body flex cursor-pointer items-center justify-center gap-2 rounded border border-cyan-500/45 bg-cyan-950/45 px-3 py-2 text-[13px] font-semibold text-cyan-200 transition-all duration-150 enabled:hover:-translate-y-0.5 enabled:hover:border-cyan-300/80 enabled:hover:bg-cyan-900/65 enabled:hover:text-cyan-100 enabled:hover:shadow-[0_4px_14px_rgba(34,211,238,0.22)] enabled:active:translate-y-0.5 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none"
                    >
                      <span
                        key={clickSeq.hint}
                        className={`inline-flex transition-transform duration-150 group-enabled:group-hover:-translate-y-0.5 group-enabled:group-hover:rotate-12 group-enabled:group-hover:scale-110 ${
                          clickSeq.hint > 0 ? "chess-anim-hint" : ""
                        }`}
                      >
                        <PixelQuestionIcon className="h-4 w-4" />
                      </span>
                      <span>Hint</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Side Options, Eval Bar, Match Controls (New Game / Resign), and Move Log */}
                <div className="flex flex-col gap-3">
                  {/* Side Options (White / Black) */}
                  <div className="grid grid-cols-2 gap-1.5 rounded border border-[#275D38]/75 bg-[#08150d] p-2">
                    <button
                      type="button"
                      onClick={() => {
                        pulseButton("white");
                        if (!playAsWhite || moveLog.length > 0 || gameOver) {
                          startNewGame("white");
                        }
                      }}
                      className={`group flex cursor-pointer items-center justify-center gap-1.5 rounded border px-2 py-1.5 text-[13px] font-semibold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 focus:outline-none ${
                        playAsWhite
                          ? "border-amber-300 bg-amber-400/20 text-amber-200 shadow-[0_3px_10px_rgba(251,191,36,0.18)]"
                          : "border-white/15 bg-black/50 text-white/70 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <span
                        key={clickSeq.white}
                        className={`inline-flex transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:scale-110 ${
                          clickSeq.white > 0 ? "chess-anim-pop" : ""
                        }`}
                      >
                        <ChessPieceSvg piece="K" className="h-4 w-4" />
                      </span>
                      <span className="arcade-body">White</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        pulseButton("black");
                        if (playAsWhite || moveLog.length > 0 || gameOver) {
                          startNewGame("black");
                        }
                      }}
                      className={`group flex cursor-pointer items-center justify-center gap-1.5 rounded border px-2 py-1.5 text-[13px] font-semibold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 focus:outline-none ${
                        !playAsWhite
                          ? "border-amber-300 bg-amber-400/20 text-amber-200 shadow-[0_3px_10px_rgba(251,191,36,0.18)]"
                          : "border-white/15 bg-black/50 text-white/70 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <span
                        key={clickSeq.black}
                        className={`inline-flex transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:scale-110 ${
                          clickSeq.black > 0 ? "chess-anim-pop" : ""
                        }`}
                      >
                        <ChessPieceSvg piece="k" className="h-4 w-4" />
                      </span>
                      <span className="arcade-body">Black</span>
                    </button>
                  </div>

                  {/* Horizontal Advantage Meter */}
                  <div className="rounded border border-[#275D38]/75 bg-[#08150d] p-2.5">
                    <div className="mb-1.5 flex items-center justify-between text-[12px] text-white/75">
                      <span className="arcade-body">White</span>
                      <span className="arcade-body font-semibold text-amber-300">
                        {formatEvalLabel(evalCp)}
                      </span>
                      <span className="arcade-body">Black</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-sm border border-white/15 bg-[#1b2220]">
                      <div
                        className="h-full bg-gradient-to-r from-[#f8f3e3] to-amber-300 transition-all duration-300"
                        style={{ width: `${evalWhitePct.toFixed(1)}%` }}
                      />
                    </div>
                  </div>

                  {/* Match Lifecycle Controls (New Game / Resign) */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        pulseButton("newGame");
                        startNewGame(playerColor);
                      }}
                      className="group arcade-body flex cursor-pointer items-center justify-center gap-1.5 rounded border border-amber-400/60 bg-amber-500/20 px-2 py-2 text-[13px] font-semibold text-amber-200 transition-all duration-150 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-400/35 hover:shadow-[0_4px_14px_rgba(251,191,36,0.22)] active:translate-y-0.5 active:scale-95 focus:outline-none"
                    >
                      <span
                        key={clickSeq.newGame}
                        className={`inline-flex transition-transform duration-150 group-hover:rotate-90 group-hover:scale-110 ${
                          clickSeq.newGame > 0 ? "chess-anim-new" : ""
                        }`}
                      >
                        <PixelPlusIcon className="h-3.5 w-3.5" />
                      </span>
                      <span>New Game</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        pulseButton("resign");
                        resignGame();
                      }}
                      disabled={!!gameOver || thinking || hinting}
                      className="group arcade-body flex cursor-pointer items-center justify-center gap-1.5 rounded border border-rose-500/45 bg-rose-950/45 px-2 py-2 text-[13px] font-semibold text-rose-200 transition-all duration-150 enabled:hover:-translate-y-0.5 enabled:hover:border-rose-400 enabled:hover:bg-rose-900/65 enabled:hover:shadow-[0_4px_14px_rgba(244,63,94,0.22)] enabled:active:translate-y-0.5 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none"
                    >
                      <span
                        key={clickSeq.resign}
                        className={`inline-flex transition-transform duration-150 group-enabled:group-hover:translate-y-0.5 group-enabled:group-hover:rotate-12 ${
                          clickSeq.resign > 0 ? "chess-anim-resign" : ""
                        }`}
                      >
                        <PixelToppledKingIcon className="h-4 w-4" />
                      </span>
                      <span>Resign</span>
                    </button>
                  </div>

                  {/* Scrollable SAN Move Log */}
                  <div className="flex flex-col rounded border border-[#275D38]/75 bg-[#060f09] p-2.5">
                    <div className="mb-1.5 flex items-center justify-center">
                      <span className="arcade-body text-[12px] font-semibold uppercase tracking-wider text-emerald-300/80">
                        Moves
                      </span>
                    </div>

                    {gameOver && (
                      <div className="mb-2 rounded border border-amber-400/50 bg-amber-950/45 px-2.5 py-1.5 text-center">
                        <p className="arcade-body text-[12.5px] font-semibold text-amber-200">
                          {gameOver}
                        </p>
                      </div>
                    )}

                    {!gameOver && hintText && (
                      <div className="mb-2 rounded border border-cyan-400/40 bg-cyan-950/40 px-2.5 py-1 text-center">
                        <p className="arcade-body text-[12.5px] font-medium text-cyan-200">
                          {hintText}
                        </p>
                      </div>
                    )}

                    <div
                      ref={moveListContainerRef}
                      className="h-[225px] overflow-y-auto pr-1 text-[13px] tabular-nums lg:h-[260px]"
                    >
                      {movePairs.length === 0 ? (
                        <p className="arcade-body py-6 text-center text-[13px] text-white/45">
                          Click a piece to begin.
                        </p>
                      ) : (
                        <ol className="space-y-1">
                          {movePairs.map((pair) => (
                            <li
                              key={pair.num}
                              className="grid grid-cols-[28px_1fr_1fr] items-center rounded bg-white/[0.03] px-2 py-0.5 text-emerald-100/90"
                            >
                              <span className="arcade-body text-white/45">{pair.num}.</span>
                              <span className="arcade-body font-medium text-amber-200">{pair.white}</span>
                              <span className="arcade-body font-medium text-emerald-200">{pair.black || ""}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Chess Club Control Deck (Live Clocks + Interactive Difficulty + Local Engine) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-4 border-[#3c2a1a] bg-gradient-to-b from-[#17120c] to-[#0d0a07] px-5 py-4 sm:px-6">
          {/* Live Dual Chess Clock */}
          <div className="flex items-center gap-2 rounded border-2 border-[#4d3822] bg-[#070a08] px-3 py-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]">
            <div className="text-center">
              <p className="text-[7px] text-amber-300/75" style={PIXEL_FONT}>
                YOU ({playAsWhite ? "W" : "B"})
              </p>
              <p
                className={`mt-1 text-[11px] tabular-nums ${
                  userClockSec <= 30
                    ? "text-rose-400"
                    : isUserTurn
                      ? "text-amber-300"
                      : "text-amber-300/55"
                }`}
                style={PIXEL_FONT}
              >
                {formatClock(userClockSec)}
              </p>
            </div>
            <span className="h-6 w-px bg-[#3c2a1a]" />
            <div className="text-center">
              <p className="text-[7px] text-emerald-400/75" style={PIXEL_FONT}>
                ENGINE ({playAsWhite ? "B" : "W"})
              </p>
              <p
                className={`mt-1 text-[11px] tabular-nums ${
                  engineClockSec <= 30
                    ? "text-rose-400"
                    : !isUserTurn && !gameOver
                      ? "text-emerald-300"
                      : "text-emerald-300/55"
                }`}
                style={PIXEL_FONT}
              >
                {formatClock(engineClockSec)}
              </p>
            </div>
          </div>

          {/* Interactive Club Difficulty Lamps */}
          <div className="flex items-center gap-2.5" role="group" aria-label="Engine difficulty">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => {
              const active = difficulty === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={thinking}
                  onClick={() => {
                    setDifficulty(key);
                    playSelect();
                  }}
                  title={`Set difficulty to ${cfg.label} (Depth ${cfg.depth})`}
                  className={`group flex cursor-pointer flex-col items-center gap-1 rounded border px-2.5 py-1.5 transition-all duration-150 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0.5 enabled:active:scale-95 focus:outline-none disabled:cursor-not-allowed ${
                    active
                      ? "border-amber-400/70 bg-amber-950/35"
                      : "border-transparent enabled:hover:border-white/20 enabled:hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-transform duration-150 group-enabled:group-hover:scale-125 ${cfg.dotClass} ${
                      active ? "opacity-100 shadow-[0_0_10px_currentColor]" : "opacity-30 group-enabled:group-hover:opacity-75"
                    }`}
                  />
                  <span
                    className={`text-[7px] transition-colors ${active ? "text-amber-200" : "text-white/50 group-enabled:group-hover:text-white/80"}`}
                    style={PIXEL_FONT}
                  >
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Local Engine Status Badge */}
          <div className="rounded border-2 border-[#8c6a2b]/70 bg-gradient-to-b from-[#2f2310] to-[#1a1308] px-3 py-1.5 text-center">
            <p className="text-[8px] uppercase tracking-widest text-amber-300/90" style={PIXEL_FONT}>
              {thinking
                ? "THINKING..."
                : searchMeta
                  ? searchMeta.fromBook
                    ? "BOOK · ALPHA-BETA"
                    : `DEPTH ${searchMeta.depth} · ALPHA-BETA`
                  : "LOCAL WORKER · ALPHA-BETA"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
