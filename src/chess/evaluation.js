/**
 * Static position evaluation ported from chess-engine/cpp/src/evaluation.cpp.
 * Returns score in centipawns from White's perspective.
 */
import {
  BB,
  BISHOP_DELTAS,
  BK,
  BN,
  BP,
  BQ,
  BR,
  EMPTY,
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
  pieceType,
} from "./board.js";

const PAWN_PST = new Int16Array([
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
]);

const PAWN_EG_PST = new Int16Array([
  0, 0, 0, 0, 0, 0, 0, 0,
  80, 80, 80, 80, 80, 80, 80, 80,
  50, 50, 50, 50, 50, 50, 50, 50,
  30, 30, 30, 30, 30, 30, 30, 30,
  20, 20, 20, 20, 20, 20, 20, 20,
  10, 10, 10, 10, 10, 10, 10, 10,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
]);

const KNIGHT_PST = new Int16Array([
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
]);

const BISHOP_PST = new Int16Array([
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 5, 5, 10, 10, 5, 5, -10,
  -10, 0, 10, 10, 10, 10, 0, -10,
  -10, 10, 10, 10, 10, 10, 10, -10,
  -10, 5, 0, 0, 0, 0, 5, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
]);

const ROOK_PST = new Int16Array([
  0, 0, 0, 0, 0, 0, 0, 0,
  5, 10, 10, 10, 10, 10, 10, 5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  0, 0, 0, 5, 5, 0, 0, 0,
]);

const QUEEN_PST = new Int16Array([
  -20, -10, -10, -5, -5, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -5, 0, 5, 5, 5, 5, 0, -5,
  0, 0, 5, 5, 5, 5, 0, -5,
  -10, 5, 5, 5, 5, 5, 0, -10,
  -10, 0, 5, 0, 0, 0, 0, -10,
  -20, -10, -10, -5, -5, -10, -10, -20,
]);

const KING_MG_PST = new Int16Array([
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
  20, 20, 0, 0, 0, 0, 20, 20,
  20, 30, 10, 0, 0, 10, 30, 20,
]);

const KING_EG_PST = new Int16Array([
  -50, -40, -30, -20, -20, -30, -40, -50,
  -30, -20, -10, 0, 0, -10, -20, -30,
  -30, -10, 20, 30, 30, 20, -10, -30,
  -30, -10, 30, 40, 40, 30, -10, -30,
  -30, -10, 30, 40, 40, 30, -10, -30,
  -30, -10, 20, 30, 30, 20, -10, -30,
  -30, -30, 0, 0, 0, 0, -30, -30,
  -50, -30, -30, -30, -30, -30, -30, -50,
]);

const TOTAL_NPM_START = (320 * 2 + 330 * 2 + 500 * 2 + 900) * 2;

const PIECE_VAL = new Int16Array([0, 100, 320, 330, 500, 900, 0, -100, -320, -330, -500, -900, 0]);
const PIECE_ABS = new Int16Array([0, 100, 320, 330, 500, 900, 0, 100, 320, 330, 500, 900, 0]);

const CENTER_SQUARES = [27, 28, 35, 36];
const EXTENDED_CENTER_SQUARES = [18, 19, 20, 21, 26, 29, 34, 37, 42, 43, 44, 45];

// Scratch arrays reused inside synchronous evaluate() calls to avoid heap allocation.
const W_FILE_PAWNS = new Int8Array(8);
const B_FILE_PAWNS = new Int8Array(8);
const W_ROOK_SQ = new Int8Array(10);
const B_ROOK_SQ = new Int8Array(10);

export function pieceValueAbs(piece) {
  return PIECE_ABS[piece] || 0;
}

function pstScorePiece(piece, sq, egWeight) {
  const f = sq & 7;
  const r = sq >> 3;
  const isWhite = piece <= WK;
  const rank = isWhite ? 7 - r : r;
  const idx = (rank << 3) | f;
  const sign = isWhite ? 1 : -1;
  const pt = piece <= WK ? piece : piece - 6;

  if (pt === WK) {
    return sign * Math.trunc(KING_MG_PST[idx] * (1.0 - egWeight) + KING_EG_PST[idx] * egWeight);
  }
  if (pt === WP) {
    return sign * Math.trunc(PAWN_PST[idx] * (1.0 - egWeight) + PAWN_EG_PST[idx] * egWeight);
  }
  if (pt === WN) return sign * KNIGHT_PST[idx];
  if (pt === WB) return sign * BISHOP_PST[idx];
  if (pt === WR) return sign * ROOK_PST[idx];
  if (pt === WQ) return sign * QUEEN_PST[idx];
  return 0;
}

function isKnightOutpost(squares, f, r, isWhite) {
  if (isWhite) {
    if (r < 3 || r > 5) return false;
    const base = (r - 1) << 3;
    const supported = (f > 0 && squares[base + f - 1] === WP) || (f < 7 && squares[base + f + 1] === WP);
    if (!supported) return false;
    for (let cr = r + 1; cr < 7; cr += 1) {
      const cbase = cr << 3;
      if (f > 0 && squares[cbase + f - 1] === BP) return false;
      if (f < 7 && squares[cbase + f + 1] === BP) return false;
    }
    return true;
  }
  if (r < 2 || r > 4) return false;
  const base = (r + 1) << 3;
  const supported = (f > 0 && squares[base + f - 1] === BP) || (f < 7 && squares[base + f + 1] === BP);
  if (!supported) return false;
  for (let cr = 1; cr < r; cr += 1) {
    const cbase = cr << 3;
    if (f > 0 && squares[cbase + f - 1] === WP) return false;
    if (f < 7 && squares[cbase + f + 1] === WP) return false;
  }
  return true;
}

function clearBetween(squares, sqA, sqB) {
  const af = sqA & 7;
  const ar = sqA >> 3;
  const bf = sqB & 7;
  const br = sqB >> 3;
  const df = af === bf ? 0 : bf > af ? 1 : -1;
  const dr = ar === br ? 0 : br > ar ? 1 : -1;
  let cf = af + df;
  let cr = ar + dr;
  while (cf !== bf || cr !== br) {
    if (squares[(cr << 3) | cf] !== EMPTY) return false;
    cf += df;
    cr += dr;
  }
  return true;
}

export function evaluate(board) {
  const sqs = board.squares;
  let npmVal = 0;
  let materialScore = 0;
  let wb = 0;
  let bb = 0;
  let wkSq = -1;
  let bkSq = -1;

  W_FILE_PAWNS.fill(0);
  B_FILE_PAWNS.fill(0);

  for (let sq = 0; sq < 64; sq += 1) {
    const p = sqs[sq];
    if (p === EMPTY) continue;
    const pt = pieceType(p);
    if (pt === WN || pt === WB || pt === WR || pt === WQ) {
      npmVal += PIECE_ABS[p];
    }
    materialScore += PIECE_VAL[p];
    if (p === WB) wb += 1;
    else if (p === BB) bb += 1;
    else if (p === WK) wkSq = sq;
    else if (p === BK) bkSq = sq;
    else if (p === WP) W_FILE_PAWNS[sq & 7] += 1;
    else if (p === BP) B_FILE_PAWNS[sq & 7] += 1;
  }

  const eg = Math.max(0.0, Math.min(1.0, 1.0 - npmVal / TOTAL_NPM_START));
  let score = materialScore;

  if (wb >= 2) score += 30;
  if (bb >= 2) score -= 30;

  const doubledPen = Math.trunc(14 + 6 * eg);
  const isolatedPen = Math.trunc(15 + 3 * eg);
  const connectedBon = Math.trunc(8 + 4 * eg);
  for (let f = 0; f < 8; f += 1) {
    if (W_FILE_PAWNS[f] > 1) score -= doubledPen * (W_FILE_PAWNS[f] - 1);
    if (B_FILE_PAWNS[f] > 1) score += doubledPen * (B_FILE_PAWNS[f] - 1);
  }

  const wkF = wkSq >= 0 ? wkSq & 7 : -10;
  const wkR = wkSq >= 0 ? wkSq >> 3 : -10;
  const bkF = bkSq >= 0 ? bkSq & 7 : -10;
  const bkR = bkSq >= 0 ? bkSq >> 3 : -10;

  let wKingAttackers = 0;
  let wKingWeight = 0;
  let bKingAttackers = 0;
  let bKingWeight = 0;
  let wRookCount = 0;
  let bRookCount = 0;

  for (let sq = 0; sq < 64; sq += 1) {
    const p = sqs[sq];
    if (p === EMPTY) continue;
    score += pstScorePiece(p, sq, eg);

    const f = sq & 7;
    const r = sq >> 3;
    const isWhite = p <= WK;
    const sign = isWhite ? 1 : -1;
    const pt = isWhite ? p : p - 6;

    if (pt === WP) {
      let passed = true;
      const enemyPawn = isWhite ? BP : WP;
      if (isWhite) {
        for (let cr = r + 1; cr < 8 && passed; cr += 1) {
          const cbase = cr << 3;
          for (let df = -1; df <= 1; df += 1) {
            const cf = f + df;
            if (cf >= 0 && cf < 8 && sqs[cbase + cf] === enemyPawn) {
              passed = false;
              break;
            }
          }
        }
        if (passed) {
          let bonus = 20 + (r - 1) * 10;
          if (r >= 5 && sqs[((r + 1) << 3) | f] === EMPTY) bonus += 15;
          score += bonus;
        }
        const hasAdj = (f > 0 && W_FILE_PAWNS[f - 1] > 0) || (f < 7 && W_FILE_PAWNS[f + 1] > 0);
        if (!hasAdj) {
          score -= isolatedPen;
        } else {
          const sup =
            (f > 0 && ((r > 0 && sqs[((r - 1) << 3) | (f - 1)] === WP) || sqs[(r << 3) | (f - 1)] === WP)) ||
            (f < 7 && ((r > 0 && sqs[((r - 1) << 3) | (f + 1)] === WP) || sqs[(r << 3) | (f + 1)] === WP));
          if (sup) score += connectedBon;
        }
      } else {
        for (let cr = r - 1; cr >= 0 && passed; cr -= 1) {
          const cbase = cr << 3;
          for (let df = -1; df <= 1; df += 1) {
            const cf = f + df;
            if (cf >= 0 && cf < 8 && sqs[cbase + cf] === enemyPawn) {
              passed = false;
              break;
            }
          }
        }
        if (passed) {
          let bonus = 20 + (6 - r) * 10;
          if (r <= 2 && sqs[((r - 1) << 3) | f] === EMPTY) bonus += 15;
          score -= bonus;
        }
        const hasAdj = (f > 0 && B_FILE_PAWNS[f - 1] > 0) || (f < 7 && B_FILE_PAWNS[f + 1] > 0);
        if (!hasAdj) {
          score += isolatedPen;
        } else {
          const sup =
            (f > 0 && ((r < 7 && sqs[((r + 1) << 3) | (f - 1)] === BP) || sqs[(r << 3) | (f - 1)] === BP)) ||
            (f < 7 && ((r < 7 && sqs[((r + 1) << 3) | (f + 1)] === BP) || sqs[(r << 3) | (f + 1)] === BP));
          if (sup) score -= connectedBon;
        }
      }
    } else if (pt === WN) {
      let mob = 0;
      let hitsKing = false;
      const ekf = isWhite ? bkF : wkF;
      const ekr = isWhite ? bkR : wkR;
      for (let i = 0; i < KNIGHT_DELTAS.length; i += 1) {
        const nf = f + KNIGHT_DELTAS[i][0];
        const nr = r + KNIGHT_DELTAS[i][1];
        if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
          const target = sqs[(nr << 3) | nf];
          if (target === EMPTY || isWhitePiece(target) !== isWhite) mob += 1;
          if (Math.abs(nf - ekf) <= 1 && Math.abs(nr - ekr) <= 1) hitsKing = true;
        }
      }
      score += sign * (mob - 4) * 4;
      if (isKnightOutpost(sqs, f, r, isWhite)) score += sign * 25;
      if (hitsKing) {
        if (isWhite) {
          bKingAttackers += 1;
          bKingWeight += 2;
        } else {
          wKingAttackers += 1;
          wKingWeight += 2;
        }
      }
    } else if (pt === WB || pt === WR || pt === WQ) {
      let mob = 0;
      let hitsKing = false;
      const ekf = isWhite ? bkF : wkF;
      const ekr = isWhite ? bkR : wkR;
      const deltas = pt === WB ? BISHOP_DELTAS : pt === WR ? ROOK_DELTAS : QUEEN_DELTAS;
      for (let i = 0; i < deltas.length; i += 1) {
        const df = deltas[i][0];
        const dr = deltas[i][1];
        let nf = f + df;
        let nr = r + dr;
        while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
          if (Math.abs(nf - ekf) <= 1 && Math.abs(nr - ekr) <= 1) hitsKing = true;
          const target = sqs[(nr << 3) | nf];
          if (target === EMPTY) {
            mob += 1;
          } else {
            if (isWhitePiece(target) !== isWhite) mob += 1;
            break;
          }
          nf += df;
          nr += dr;
        }
      }
      if (pt === WB) {
        score += sign * (mob - 7) * 4;
      } else if (pt === WR) {
        score += sign * (mob - 7) * 3;
        const ownP = isWhite ? W_FILE_PAWNS[f] : B_FILE_PAWNS[f];
        const enemyP = isWhite ? B_FILE_PAWNS[f] : W_FILE_PAWNS[f];
        if (ownP === 0 && enemyP === 0) score += sign * 20;
        else if (ownP === 0) score += sign * 10;
        if (isWhite) {
          if (wRookCount < W_ROOK_SQ.length) W_ROOK_SQ[wRookCount++] = sq;
          if (r === 6) score += Math.trunc(20 + 10 * eg);
        } else {
          if (bRookCount < B_ROOK_SQ.length) B_ROOK_SQ[bRookCount++] = sq;
          if (r === 1) score -= Math.trunc(20 + 10 * eg);
        }
      } else {
        score += sign * (mob - 14) * 2;
      }
      if (hitsKing) {
        const w = pt === WB ? 2 : pt === WR ? 3 : 4;
        if (isWhite) {
          bKingAttackers += 1;
          bKingWeight += w;
        } else {
          wKingAttackers += 1;
          wKingWeight += w;
        }
      }
    }
  }

  if (wRookCount === 2) {
    const a = W_ROOK_SQ[0];
    const b = W_ROOK_SQ[1];
    if ((a & 7) === (b & 7) || (a >> 3) === (b >> 3)) {
      if (clearBetween(sqs, a, b)) score += 14;
    }
  }
  if (bRookCount === 2) {
    const a = B_ROOK_SQ[0];
    const b = B_ROOK_SQ[1];
    if ((a & 7) === (b & 7) || (a >> 3) === (b >> 3)) {
      if (clearBetween(sqs, a, b)) score -= 14;
    }
  }

  if (eg <= 0.7) {
    const mg = 1.0 - eg;
    if (wkSq >= 0) {
      let shield = 0;
      const sr = wkR + 1;
      for (let df = -1; df <= 1; df += 1) {
        const sf = wkF + df;
        if (sf >= 0 && sf < 8) {
          if (sr < 8 && sqs[(sr << 3) | sf] === WP) shield += 12;
          else if (W_FILE_PAWNS[sf] === 0) shield -= 14;
        }
      }
      score += Math.trunc(shield * mg);
    }
    if (bkSq >= 0) {
      let shield = 0;
      const sr = bkR - 1;
      for (let df = -1; df <= 1; df += 1) {
        const sf = bkF + df;
        if (sf >= 0 && sf < 8) {
          if (sr >= 0 && sqs[(sr << 3) | sf] === BP) shield += 12;
          else if (B_FILE_PAWNS[sf] === 0) shield -= 14;
        }
      }
      score -= Math.trunc(shield * mg);
    }
  }

  if (eg < 0.75) {
    const mg = 1.0 - eg;
    if (bKingAttackers >= 2) score += Math.trunc(bKingWeight * bKingAttackers * 5 * mg);
    if (wKingAttackers >= 2) score -= Math.trunc(wKingWeight * wKingAttackers * 5 * mg);
  }

  for (let i = 0; i < CENTER_SQUARES.length; i += 1) {
    const p = sqs[CENTER_SQUARES[i]];
    if (p !== EMPTY) score += p <= WK ? 10 : -10;
  }
  for (let i = 0; i < EXTENDED_CENTER_SQUARES.length; i += 1) {
    const p = sqs[EXTENDED_CENTER_SQUARES[i]];
    if (p !== EMPTY) score += p <= WK ? 3 : -3;
  }

  // Development penalty
  if (sqs[1] === WN) score -= 15;
  if (sqs[6] === WN) score -= 15;
  if (sqs[2] === WB) score -= 15;
  if (sqs[5] === WB) score -= 15;
  if (sqs[57] === BN) score += 15;
  if (sqs[62] === BN) score += 15;
  if (sqs[58] === BB) score += 15;
  if (sqs[61] === BB) score += 15;

  // Endgame mop-up
  if (eg >= 0.6 && Math.abs(materialScore) >= 200 && wkSq >= 0 && bkSq >= 0) {
    const dist = Math.abs(wkF - bkF) + Math.abs(wkR - bkR);
    if (materialScore > 0) {
      const edge = Math.max(Math.abs(bkF - 3.5), Math.abs(bkR - 3.5));
      score += Math.trunc((edge * 10.0 + (14 - dist) * 4.0) * eg);
    } else {
      const edge = Math.max(Math.abs(wkF - 3.5), Math.abs(wkR - 3.5));
      score -= Math.trunc((edge * 10.0 + (14 - dist) * 4.0) * eg);
    }
  }

  score += board.turnWhite ? 10 : -10;
  return score;
}
