/**
 * Alpha-beta search with iterative deepening, PVS, LMR, null-move pruning,
 * quiescence, SEE move ordering, Zobrist TT, and opening book.
 * Ported directly from chess-engine/cpp/src/search.cpp.
 */
import {
  BB,
  BISHOP_DELTAS,
  BK,
  BN,
  BP,
  BQ,
  BR,
  Board,
  EMPTY,
  KING_DELTAS,
  KNIGHT_DELTAS,
  QUEEN_DELTAS,
  ROOK_DELTAS,
  WB,
  WK,
  WN,
  WP,
  WQ,
  WR,
  isWhitePiece,
  moveFrom,
  movePromo,
  moveTo,
  moveToUci,
  pieceType,
  uciToMove,
} from "./board.js";
import { evaluate } from "./evaluation.js";
import { legalMoves } from "./moves.js";

export const MATE_SCORE = 100000;
export const INF = 1000000;

const MAX_PLY = 64;
const TT_EXACT = 0;
const TT_ALPHA = 1;
const TT_BETA = 2;
const LMR_FULL_DEPTH_MOVES = 3;
const LMR_REDUCTION_LIMIT = 3;

// 512K transposition table entries (~12 MB flat typed arrays, zero GC).
const TT_SIZE = 1 << 19;
const TT_MASK = TT_SIZE - 1;
const TT_KEY_HI = new Uint32Array(TT_SIZE);
const TT_KEY_LO = new Uint32Array(TT_SIZE);
const TT_SCORE = new Int32Array(TT_SIZE);
const TT_DEPTH = new Int16Array(TT_SIZE);
const TT_FLAG = new Uint8Array(TT_SIZE);
const TT_MOVE = new Int32Array(TT_SIZE);

TT_DEPTH.fill(-1);

export function clearTranspositionTable() {
  TT_KEY_HI.fill(0);
  TT_KEY_LO.fill(0);
  TT_SCORE.fill(0);
  TT_DEPTH.fill(-1);
  TT_FLAG.fill(0);
  TT_MOVE.fill(0);
}

// ---- Deterministic 64-bit Zobrist tables (hi/lo 32-bit pairs) ----

const Z_PIECE_HI = new Uint32Array(12 * 64);
const Z_PIECE_LO = new Uint32Array(12 * 64);
const Z_CASTLE_HI = new Uint32Array(16);
const Z_CASTLE_LO = new Uint32Array(16);
const Z_EP_HI = new Uint32Array(8);
const Z_EP_LO = new Uint32Array(8);
let zSideHi = 0;
let zSideLo = 0;

(() => {
  let state = 0x9e3779b9 >>> 0;
  const next32 = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  };
  for (let i = 0; i < 12 * 64; i += 1) {
    Z_PIECE_HI[i] = next32();
    Z_PIECE_LO[i] = next32();
  }
  for (let i = 0; i < 16; i += 1) {
    Z_CASTLE_HI[i] = next32();
    Z_CASTLE_LO[i] = next32();
  }
  for (let i = 0; i < 8; i += 1) {
    Z_EP_HI[i] = next32();
    Z_EP_LO[i] = next32();
  }
  zSideHi = next32();
  zSideLo = next32();
})();

let zobristHiOut = 0;
let zobristLoOut = 0;

function computeZobrist(board) {
  let hi = 0;
  let lo = 0;
  const sqs = board.squares;
  for (let sq = 0; sq < 64; sq += 1) {
    const p = sqs[sq];
    if (p !== EMPTY) {
      const idx = (p - 1) * 64 + sq;
      hi ^= Z_PIECE_HI[idx];
      lo ^= Z_PIECE_LO[idx];
    }
  }
  const cr = board.castling & 15;
  hi ^= Z_CASTLE_HI[cr];
  lo ^= Z_CASTLE_LO[cr];
  if (board.epSquare >= 0) {
    const f = board.epSquare & 7;
    hi ^= Z_EP_HI[f];
    lo ^= Z_EP_LO[f];
  }
  if (!board.turnWhite) {
    hi ^= zSideHi;
    lo ^= zSideLo;
  }
  zobristHiOut = hi >>> 0;
  zobristLoOut = lo >>> 0;
}

// ---- Opening Book ----

const OPENING_BOOK = [
  ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -", ["e2e4", "d2d4", "c2c4", "g1f3"]],
  ["rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3", ["e7e5", "c7c5", "e7e6", "c7c6"]],
  ["rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -", ["e7e5", "c7c5", "e7e6", "c7c6"]],
  ["rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3", ["d7d5", "g8f6", "e7e6"]],
  ["rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -", ["d7d5", "g8f6", "e7e6"]],
  ["rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3", ["e7e5", "g8f6", "c7c5"]],
  ["rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq -", ["e7e5", "g8f6", "c7c5"]],
  ["rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -", ["d7d5", "g8f6", "c7c5"]],
  ["rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6", ["g1f3", "f1c4"]],
  ["rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -", ["g1f3", "f1c4"]],
  ["rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -", ["b8c6", "g8f6"]],
  ["r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -", ["f1b5", "f1c4", "d2d4"]],
  ["r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -", ["a7a6", "g8f6"]],
  ["r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -", ["f8c5", "g8f6"]],
  ["rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6", ["g1f3", "b1c3"]],
  ["rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -", ["g1f3", "b1c3"]],
  ["rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -", ["d7d6", "b8c6", "e7e6"]],
  ["rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -", ["d2d4", "f1b5"]],
  ["rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -", ["d2d4", "b1c3"]],
  ["rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -", ["d2d4"]],
  ["rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3", ["d7d5"]],
  ["rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq -", ["d7d5"]],
  ["rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3", ["d7d5"]],
  ["rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq -", ["d7d5"]],
  ["rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6", ["c2c4", "g1f3"]],
  ["rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -", ["c2c4", "g1f3"]],
  ["rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3", ["e7e6", "c7c6"]],
  ["rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq -", ["e7e6", "c7c6"]],
  ["rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -", ["c2c4", "g1f3"]],
  ["rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3", ["e7e6", "g7g6"]],
  ["rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq -", ["e7e6", "g7g6"]],
];

function probeOpeningBook(board, legal) {
  if (board.fullmoveNumber > 6) return 0;
  const fen = board.getFen(false);
  for (let i = 0; i < OPENING_BOOK.length; i += 1) {
    if (fen !== OPENING_BOOK[i][0]) continue;
    const bookMoves = OPENING_BOOK[i][1];
    const candidates = [];
    for (let j = 0; j < bookMoves.length; j += 1) {
      const m = uciToMove(bookMoves[j]);
      if (legal.includes(m)) candidates.push(m);
    }
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  return 0;
}

// ---- SEE (Static Exchange Evaluation) ----

const SEE_PIECE_VAL = new Int16Array([0, 100, 320, 330, 500, 900, 20000, 100, 320, 330, 500, 900, 20000]);
const SEE_REMOVED = new Uint8Array(64);
const SEE_GAIN = new Int32Array(32);

let attackerPieceOut = EMPTY;

function findLeastValuableAttacker(squares, targetSq, whiteSide) {
  const tf = targetSq & 7;
  const tr = targetSq >> 3;

  // 1. Pawns
  const pawnR = whiteSide ? tr - 1 : tr + 1;
  const pawnP = whiteSide ? WP : BP;
  if (pawnR >= 0 && pawnR < 8) {
    const base = pawnR << 3;
    if (tf > 0) {
      const sq = base + tf - 1;
      if (!SEE_REMOVED[sq] && squares[sq] === pawnP) {
        attackerPieceOut = pawnP;
        return sq;
      }
    }
    if (tf < 7) {
      const sq = base + tf + 1;
      if (!SEE_REMOVED[sq] && squares[sq] === pawnP) {
        attackerPieceOut = pawnP;
        return sq;
      }
    }
  }

  // 2. Knights
  const knightP = whiteSide ? WN : BN;
  for (let i = 0; i < KNIGHT_DELTAS.length; i += 1) {
    const nf = tf + KNIGHT_DELTAS[i][0];
    const nr = tr + KNIGHT_DELTAS[i][1];
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const sq = (nr << 3) | nf;
      if (!SEE_REMOVED[sq] && squares[sq] === knightP) {
        attackerPieceOut = knightP;
        return sq;
      }
    }
  }

  // 3. Bishops
  const bishopP = whiteSide ? WB : BB;
  for (let i = 0; i < BISHOP_DELTAS.length; i += 1) {
    const df = BISHOP_DELTAS[i][0];
    const dr = BISHOP_DELTAS[i][1];
    let nf = tf + df;
    let nr = tr + dr;
    while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const sq = (nr << 3) | nf;
      if (!SEE_REMOVED[sq] && squares[sq] !== EMPTY) {
        if (squares[sq] === bishopP) {
          attackerPieceOut = bishopP;
          return sq;
        }
        break;
      }
      nf += df;
      nr += dr;
    }
  }

  // 4. Rooks
  const rookP = whiteSide ? WR : BR;
  for (let i = 0; i < ROOK_DELTAS.length; i += 1) {
    const df = ROOK_DELTAS[i][0];
    const dr = ROOK_DELTAS[i][1];
    let nf = tf + df;
    let nr = tr + dr;
    while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const sq = (nr << 3) | nf;
      if (!SEE_REMOVED[sq] && squares[sq] !== EMPTY) {
        if (squares[sq] === rookP) {
          attackerPieceOut = rookP;
          return sq;
        }
        break;
      }
      nf += df;
      nr += dr;
    }
  }

  // 5. Queens
  const queenP = whiteSide ? WQ : BQ;
  for (let i = 0; i < QUEEN_DELTAS.length; i += 1) {
    const df = QUEEN_DELTAS[i][0];
    const dr = QUEEN_DELTAS[i][1];
    let nf = tf + df;
    let nr = tr + dr;
    while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const sq = (nr << 3) | nf;
      if (!SEE_REMOVED[sq] && squares[sq] !== EMPTY) {
        if (squares[sq] === queenP) {
          attackerPieceOut = queenP;
          return sq;
        }
        break;
      }
      nf += df;
      nr += dr;
    }
  }

  // 6. King
  const kingP = whiteSide ? WK : BK;
  for (let i = 0; i < KING_DELTAS.length; i += 1) {
    const nf = tf + KING_DELTAS[i][0];
    const nr = tr + KING_DELTAS[i][1];
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const sq = (nr << 3) | nf;
      if (!SEE_REMOVED[sq] && squares[sq] === kingP) {
        attackerPieceOut = kingP;
        return sq;
      }
    }
  }

  return -1;
}

export function seeScore(board, move) {
  const sqs = board.squares;
  const fromSq = moveFrom(move);
  const toSq = moveTo(move);
  const promo = movePromo(move);
  const attacker = sqs[fromSq];
  if (attacker === EMPTY) return 0;

  const target = sqs[toSq];
  let initialGain = target !== EMPTY ? SEE_PIECE_VAL[target] : 0;
  if (target === EMPTY && board.epSquare >= 0 && toSq === board.epSquare && pieceType(attacker) === WP) {
    initialGain = 100;
  }
  if (promo) {
    initialGain += SEE_PIECE_VAL[promo] - 100;
  }

  SEE_REMOVED.fill(0);
  SEE_REMOVED[fromSq] = 1;

  let d = 0;
  SEE_GAIN[0] = initialGain;
  let currentVal = promo ? SEE_PIECE_VAL[promo] : SEE_PIECE_VAL[attacker];
  let sideWhite = !board.turnWhite;

  while (d < 30) {
    const sq = findLeastValuableAttacker(sqs, toSq, sideWhite);
    if (sq < 0) break;
    SEE_REMOVED[sq] = 1;
    d += 1;
    SEE_GAIN[d] = currentVal - SEE_GAIN[d - 1];
    if (Math.max(-SEE_GAIN[d - 1], SEE_GAIN[d]) < 0) break;
    currentVal = SEE_PIECE_VAL[attackerPieceOut];
    sideWhite = !sideWhite;
  }

  while (--d >= 0) {
    SEE_GAIN[d] = -Math.max(-SEE_GAIN[d], SEE_GAIN[d + 1]);
  }
  return SEE_GAIN[0];
}

// ---- Move Ordering ----

const MVV_LVA_TYPE = new Int8Array([0, 1, 3, 3, 5, 9, 99]);

function isCaptureBeforeMove(board, move) {
  const toSq = moveTo(move);
  if (board.squares[toSq] !== EMPTY) return true;
  if (board.epSquare >= 0 && toSq === board.epSquare) {
    const pt = pieceType(board.squares[moveFrom(move)]);
    if (pt === WP) return true;
  }
  return false;
}

function scoreMove(board, move, info, ply, ttMove, prevMove) {
  if (ttMove !== 0 && ttMove === move) return 10000000;

  const fromSq = moveFrom(move);
  const toSq = moveTo(move);
  const promo = movePromo(move);
  const captured = board.squares[toSq];
  const ptAttacker = pieceType(board.squares[fromSq]);
  const isEp = captured === EMPTY && board.epSquare >= 0 && toSq === board.epSquare && ptAttacker === WP;

  if (captured !== EMPTY || isEp) {
    const s = seeScore(board, move);
    const victimVal = isEp ? 1 : MVV_LVA_TYPE[pieceType(captured)];
    const attackerVal = MVV_LVA_TYPE[ptAttacker];
    if (s >= 0) {
      return 2000000 + victimVal * 10 - attackerVal;
    }
    return -100000 + s;
  }

  if (promo) {
    return promo === 5 ? 1500000 : 1400000;
  }

  if (ply < MAX_PLY) {
    const base = ply * 2;
    if (info.killers[base] === move) return 1200000;
    if (info.killers[base + 1] === move) return 1100000;
  }

  const fromTo = (fromSq << 6) | toSq;
  if (prevMove !== 0) {
    const prevKey = (moveFrom(prevMove) << 6) | moveTo(prevMove);
    if (info.countermoves[prevKey] === move) return 1050000;
  }

  return info.history[fromTo];
}

// Per-ply preallocated score buffers so ordering causes zero allocations.
const PLY_SCORE_BUFS = Array.from({ length: MAX_PLY + 4 }, () => new Int32Array(256));

function prepareScores(board, moves, info, ply, ttMove, prevMove) {
  const buf = PLY_SCORE_BUFS[ply < PLY_SCORE_BUFS.length ? ply : PLY_SCORE_BUFS.length - 1];
  for (let i = 0; i < moves.length; i += 1) {
    buf[i] = scoreMove(board, moves[i], info, ply, ttMove, prevMove);
  }
  return buf;
}

function pickNextMove(moves, scores, startIdx) {
  let bestIdx = startIdx;
  let bestScore = scores[startIdx];
  for (let j = startIdx + 1; j < moves.length; j += 1) {
    if (scores[j] > bestScore) {
      bestScore = scores[j];
      bestIdx = j;
    }
  }
  if (bestIdx !== startIdx) {
    const tmpM = moves[startIdx];
    moves[startIdx] = moves[bestIdx];
    moves[bestIdx] = tmpM;
    const tmpS = scores[startIdx];
    scores[startIdx] = scores[bestIdx];
    scores[bestIdx] = tmpS;
  }
}

// ---- Search Info ----

class SearchInfo {
  constructor(timeLimitSeconds, gamePositions) {
    this.startTime = performance.now();
    this.deadline =
      timeLimitSeconds != null ? this.startTime + timeLimitSeconds * 1000 : Number.POSITIVE_INFINITY;
    this.nodes = 0;
    this.stopped = false;
    this.killers = new Int32Array(MAX_PLY * 2);
    this.history = new Int32Array(64 * 64);
    this.countermoves = new Int32Array(64 * 64);

    // Search path stack for fast O(ply) repetition check
    this.pathHi = new Uint32Array(MAX_PLY + 8);
    this.pathLo = new Uint32Array(MAX_PLY + 8);
    this.pathLen = 0;

    // Prior game position hashes for threefold repetition avoidance
    this.gameHi = [];
    this.gameLo = [];
    this.gameCount = [];
    if (gamePositions && gamePositions.length > 0) {
      const tmp = new Board();
      for (let i = 0; i < gamePositions.length; i += 1) {
        try {
          tmp.setFen(gamePositions[i]);
          computeZobrist(tmp);
          let found = false;
          for (let j = 0; j < this.gameHi.length; j += 1) {
            if (this.gameHi[j] === zobristHiOut && this.gameLo[j] === zobristLoOut) {
              this.gameCount[j] += 1;
              found = true;
              break;
            }
          }
          if (!found) {
            this.gameHi.push(zobristHiOut);
            this.gameLo.push(zobristLoOut);
            this.gameCount.push(1);
          }
        } catch {
          // Ignore malformed history FENs
        }
      }
    }
  }

  checkTime() {
    if (!this.stopped && performance.now() >= this.deadline) {
      this.stopped = true;
    }
    return this.stopped;
  }

  isRepetition(hi, lo) {
    for (let i = this.pathLen - 1; i >= 0; i -= 1) {
      if (this.pathHi[i] === hi && this.pathLo[i] === lo) return true;
    }
    for (let i = 0; i < this.gameHi.length; i += 1) {
      if (this.gameHi[i] === hi && this.gameLo[i] === lo && this.gameCount[i] >= 2) {
        return true;
      }
    }
    return false;
  }

  pushPath(hi, lo) {
    this.pathHi[this.pathLen] = hi;
    this.pathLo[this.pathLen] = lo;
    this.pathLen += 1;
  }

  popPath() {
    if (this.pathLen > 0) this.pathLen -= 1;
  }
}

// ---- Quiescence & Alpha-Beta ----

function quiesce(board, alpha, beta, info) {
  info.nodes += 1;
  if ((info.nodes & 2047) === 0 && info.checkTime()) return 0;

  const standPat = (board.turnWhite ? 1 : -1) * evaluate(board);
  if (standPat >= beta) return beta;
  let curAlpha = alpha;
  if (curAlpha < standPat) curAlpha = standPat;

  const moves = legalMoves(board);
  const tacticalMoves = [];
  const tacticalScores = [];

  for (let i = 0; i < moves.length; i += 1) {
    const m = moves[i];
    const isCap = isCaptureBeforeMove(board, m);
    const isQueenPromo = movePromo(m) === 5;
    if (!isCap && !isQueenPromo) continue;

    if (!isQueenPromo) {
      const cap = board.squares[moveTo(m)];
      const capVal = cap !== EMPTY ? SEE_PIECE_VAL[cap] : 100;
      if (standPat + capVal + 200 < curAlpha) continue;
    }

    const see = seeScore(board, m);
    if (see < 0) continue;

    tacticalMoves.push(m);
    tacticalScores.push(see + (isQueenPromo ? 900 : 0));
  }

  for (let i = 0; i < tacticalMoves.length; i += 1) {
    pickNextMove(tacticalMoves, tacticalScores, i);
    const m = tacticalMoves[i];
    board.makeMove(m);
    const score = -quiesce(board, -beta, -curAlpha, info);
    board.unmakeMove(m);
    if (info.stopped) return 0;
    if (score >= beta) return beta;
    if (score > curAlpha) curAlpha = score;
  }
  return curAlpha;
}

function hasNonPawnMaterial(board) {
  const sideWhite = board.turnWhite;
  const sqs = board.squares;
  for (let sq = 0; sq < 64; sq += 1) {
    const p = sqs[sq];
    if (p === EMPTY) continue;
    if (isWhitePiece(p) !== sideWhite) continue;
    const pt = pieceType(p);
    if (pt === WN || pt === WB || pt === WR || pt === WQ) return true;
  }
  return false;
}

function alphaBeta(board, depthIn, alphaIn, beta, info, ply, doNull, prevMove) {
  info.nodes += 1;
  if ((info.nodes & 2047) === 0 && info.checkTime()) return 0;

  if (ply >= MAX_PLY) {
    return (board.turnWhite ? 1 : -1) * evaluate(board);
  }

  computeZobrist(board);
  const keyHi = zobristHiOut;
  const keyLo = zobristLoOut;

  if (ply > 0 && info.isRepetition(keyHi, keyLo)) {
    return 0;
  }

  let depth = depthIn;
  let alpha = alphaIn;
  let ttMove = 0;
  const ttIdx = keyLo & TT_MASK;
  if (TT_KEY_HI[ttIdx] === keyHi && TT_KEY_LO[ttIdx] === keyLo) {
    ttMove = TT_MOVE[ttIdx];
    if (TT_DEPTH[ttIdx] >= depth) {
      const flag = TT_FLAG[ttIdx];
      const ttVal = TT_SCORE[ttIdx];
      if (flag === TT_EXACT) return ttVal;
      if (flag === TT_BETA && ttVal >= beta) return beta;
      if (flag === TT_ALPHA && ttVal <= alpha) return alpha;
    }
  }

  if (depth <= 0) {
    return quiesce(board, alpha, beta, info);
  }

  const inCheck = board.inCheck(board.turnWhite);
  if (inCheck && ply < 50) depth += 1;

  const staticEval = inCheck ? -INF : (board.turnWhite ? 1 : -1) * evaluate(board);

  // Reverse futility pruning
  if (doNull && !inCheck && depth <= 3 && Math.abs(beta) < MATE_SCORE - 100) {
    if (staticEval - 120 * depth >= beta) {
      return staticEval - 120 * depth;
    }
  }

  // Adaptive null-move pruning
  const nullR = depth >= 6 ? 3 : 2;
  if (doNull && depth >= nullR + 1 && !inCheck && hasNonPawnMaterial(board)) {
    board.turnWhite = !board.turnWhite;
    const oldEp = board.epSquare;
    board.epSquare = -1;
    const score = -alphaBeta(
      board,
      depth - 1 - nullR,
      -beta,
      -beta + 1,
      info,
      ply + 1,
      false,
      0
    );
    board.turnWhite = !board.turnWhite;
    board.epSquare = oldEp;
    if (info.stopped) return 0;
    if (score >= beta) return beta;
  }

  const moves = legalMoves(board);
  if (moves.length === 0) {
    if (inCheck) return -MATE_SCORE + ply;
    return 0;
  }

  const scores = prepareScores(board, moves, info, ply, ttMove, prevMove);

  let bestScore = -INF;
  let bestMove = 0;
  const originalAlpha = alpha;
  let movesSearched = 0;
  const futilityPrunable =
    !inCheck && depth <= 2 && alpha > -MATE_SCORE + 100 && staticEval + 150 * depth <= alpha;

  const quietTried = [];
  info.pushPath(keyHi, keyLo);

  for (let i = 0; i < moves.length; i += 1) {
    pickNextMove(moves, scores, i);
    const m = moves[i];
    const isCap = isCaptureBeforeMove(board, m);
    const isQuiet = !isCap && movePromo(m) === 0;

    board.makeMove(m);
    const givesCheck = board.inCheck(board.turnWhite);

    if (futilityPrunable && movesSearched > 0 && isQuiet && !givesCheck) {
      board.unmakeMove(m);
      continue;
    }

    let score;
    if (
      movesSearched >= LMR_FULL_DEPTH_MOVES &&
      depth >= LMR_REDUCTION_LIMIT &&
      !inCheck &&
      !givesCheck &&
      isQuiet
    ) {
      const reduction = depth >= 6 && movesSearched >= 8 ? 2 : 1;
      const newDepth = Math.max(1, depth - 1 - reduction);
      score = -alphaBeta(board, newDepth, -alpha - 1, -alpha, info, ply + 1, true, m);
      if (score > alpha) {
        score = -alphaBeta(board, depth - 1, -beta, -alpha, info, ply + 1, true, m);
      }
    } else if (movesSearched > 0) {
      score = -alphaBeta(board, depth - 1, -alpha - 1, -alpha, info, ply + 1, true, m);
      if (alpha < score && score < beta) {
        score = -alphaBeta(board, depth - 1, -beta, -alpha, info, ply + 1, true, m);
      }
    } else {
      score = -alphaBeta(board, depth - 1, -beta, -alpha, info, ply + 1, true, m);
    }

    board.unmakeMove(m);

    if (info.stopped) {
      info.popPath();
      return 0;
    }

    movesSearched += 1;

    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
      if (score > alpha) {
        alpha = score;
        if (isQuiet) {
          const fromTo = (moveFrom(m) << 6) | moveTo(m);
          info.history[fromTo] = Math.min(8000, info.history[fromTo] + depth * depth);
        }
      }
    }

    if (alpha >= beta) {
      if (isQuiet) {
        if (ply < MAX_PLY) {
          const base = ply * 2;
          if (info.killers[base] !== m) {
            info.killers[base + 1] = info.killers[base];
            info.killers[base] = m;
          }
        }
        if (prevMove !== 0) {
          const prevKey = (moveFrom(prevMove) << 6) | moveTo(prevMove);
          info.countermoves[prevKey] = m;
        }
        for (let q = 0; q < quietTried.length; q += 1) {
          const qm = quietTried[q];
          const fromTo = (moveFrom(qm) << 6) | moveTo(qm);
          info.history[fromTo] = Math.max(-8000, info.history[fromTo] - depth * depth);
        }
      }
      break;
    }

    if (isQuiet) {
      quietTried.push(m);
    }
  }

  info.popPath();

  if (!info.stopped) {
    const matchesExisting = TT_KEY_HI[ttIdx] === keyHi && TT_KEY_LO[ttIdx] === keyLo;
    if (!matchesExisting || depth >= TT_DEPTH[ttIdx]) {
      TT_KEY_HI[ttIdx] = keyHi;
      TT_KEY_LO[ttIdx] = keyLo;
      TT_DEPTH[ttIdx] = depth;
      TT_SCORE[ttIdx] = bestScore;
      TT_FLAG[ttIdx] =
        bestScore <= originalAlpha ? TT_ALPHA : bestScore >= beta ? TT_BETA : TT_EXACT;
      TT_MOVE[ttIdx] = bestMove;
    }
  }

  return bestScore;
}

export function search(board, depth = 8, timeLimitSeconds = null, gamePositions = null) {
  const moves = legalMoves(board);
  if (moves.length === 0) {
    if (board.inCheck(board.turnWhite)) {
      const mateEval = board.turnWhite ? -MATE_SCORE : MATE_SCORE;
      return { bestMoveUci: null, score: mateEval, depth: 0, nodes: 0, fromBook: false };
    }
    return { bestMoveUci: null, score: 0, depth: 0, nodes: 0, fromBook: false };
  }

  const bookMove = probeOpeningBook(board, moves);
  if (bookMove !== 0) {
    return {
      bestMoveUci: moveToUci(bookMove),
      score: evaluate(board),
      depth: 0,
      nodes: 1,
      fromBook: true,
    };
  }

  const info = new SearchInfo(timeLimitSeconds, gamePositions);

  let bestMove = moves[0];
  let bestScore = 0;
  let completedDepth = 0;
  computeZobrist(board);
  const rootKeyHi = zobristHiOut;
  const rootKeyLo = zobristLoOut;

  for (let d = 1; d <= depth; d += 1) {
    if (info.checkTime()) break;

    let delta = 35;
    let alpha = d >= 4 ? bestScore - delta : -INF;
    let beta = d >= 4 ? bestScore + delta : INF;

    const rootMoves = [bestMove];
    for (let i = 0; i < moves.length; i += 1) {
      if (moves[i] !== bestMove) rootMoves.push(moves[i]);
    }

    while (true) {
      let currentBest = 0;
      let currentScore = -INF;
      let curAlpha = alpha;

      info.pushPath(rootKeyHi, rootKeyLo);
      for (let i = 0; i < rootMoves.length; i += 1) {
        const m = rootMoves[i];
        board.makeMove(m);
        const score = -alphaBeta(board, d - 1, -beta, -curAlpha, info, 1, true, m);
        board.unmakeMove(m);

        if (info.stopped) break;

        if (score > currentScore) {
          currentScore = score;
          currentBest = m;
        }
        if (currentScore > curAlpha) curAlpha = currentScore;
      }
      info.popPath();

      if (info.stopped) break;

      if (currentScore <= alpha && alpha > -INF) {
        alpha = delta > 500 ? -INF : alpha - delta;
        delta *= 2;
        continue;
      }
      if (currentScore >= beta && beta < INF) {
        beta = delta > 500 ? INF : beta + delta;
        delta *= 2;
        continue;
      }

      if (currentBest !== 0) {
        bestMove = currentBest;
        bestScore = currentScore;
        completedDepth = d;
      }
      break;
    }

    if (info.stopped) break;
  }

  const scoreForWhite = board.turnWhite ? bestScore : -bestScore;
  return {
    bestMoveUci: bestMove !== 0 ? moveToUci(bestMove) : null,
    score: scoreForWhite,
    depth: completedDepth,
    nodes: info.nodes,
    fromBook: false,
  };
}
