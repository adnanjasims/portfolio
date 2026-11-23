/**
 * Move generation, SAN formatting, and game termination checks
 * ported from chess-engine/cpp/src/moves.cpp and server.py.
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
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  KING_DELTAS,
  KNIGHT_DELTAS,
  PIECE_TO_CHAR,
  PROMO_B,
  PROMO_N,
  PROMO_NONE,
  PROMO_Q,
  PROMO_R,
  QUEEN_DELTAS,
  ROOK_DELTAS,
  WB,
  WK,
  WN,
  WP,
  WQ,
  WR,
  encodeMove,
  isBlackPiece,
  isWhitePiece,
  moveFrom,
  movePromo,
  moveTo,
  moveToUci,
  pieceType,
  squareToName,
  uciToMove,
} from "./board.js";

const PROMO_LIST = [PROMO_Q, PROMO_R, PROMO_N, PROMO_B];

function pushPawnMoves(board, sq, white, moves) {
  const f = sq & 7;
  const r = sq >> 3;
  const dir = white ? 1 : -1;
  const startRank = white ? 1 : 6;
  const promRank = white ? 7 : 0;
  const sqs = board.squares;

  const r1 = r + dir;
  if (r1 >= 0 && r1 < 8) {
    const toSq = (r1 << 3) | f;
    if (sqs[toSq] === EMPTY) {
      if (r1 === promRank) {
        for (let i = 0; i < PROMO_LIST.length; i += 1) {
          moves.push(encodeMove(sq, toSq, PROMO_LIST[i]));
        }
      } else {
        moves.push(encodeMove(sq, toSq, PROMO_NONE));
      }
      if (r === startRank) {
        const r2 = r + 2 * dir;
        const toSq2 = (r2 << 3) | f;
        if (sqs[toSq2] === EMPTY) {
          moves.push(encodeMove(sq, toSq2, PROMO_NONE));
        }
      }
    }
  }

  for (let df = -1; df <= 1; df += 2) {
    const nf = f + df;
    const nr = r + dir;
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const toSq = (nr << 3) | nf;
      const target = sqs[toSq];
      const isEnemy = target !== EMPTY && (white ? isBlackPiece(target) : isWhitePiece(target));
      if (isEnemy) {
        if (nr === promRank) {
          for (let i = 0; i < PROMO_LIST.length; i += 1) {
            moves.push(encodeMove(sq, toSq, PROMO_LIST[i]));
          }
        } else {
          moves.push(encodeMove(sq, toSq, PROMO_NONE));
        }
      } else if (board.epSquare >= 0 && toSq === board.epSquare) {
        moves.push(encodeMove(sq, toSq, PROMO_NONE));
      }
    }
  }
}

function pushKnightMoves(board, sq, white, moves) {
  const f = sq & 7;
  const r = sq >> 3;
  const sqs = board.squares;
  for (let i = 0; i < KNIGHT_DELTAS.length; i += 1) {
    const nf = f + KNIGHT_DELTAS[i][0];
    const nr = r + KNIGHT_DELTAS[i][1];
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const toSq = (nr << 3) | nf;
      const target = sqs[toSq];
      if (target === EMPTY || isWhitePiece(target) !== white) {
        moves.push(encodeMove(sq, toSq, PROMO_NONE));
      }
    }
  }
}

function pushSlidingMoves(board, sq, deltas, white, moves) {
  const f = sq & 7;
  const r = sq >> 3;
  const sqs = board.squares;
  for (let i = 0; i < deltas.length; i += 1) {
    const df = deltas[i][0];
    const dr = deltas[i][1];
    let nf = f + df;
    let nr = r + dr;
    while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const toSq = (nr << 3) | nf;
      const target = sqs[toSq];
      if (target === EMPTY) {
        moves.push(encodeMove(sq, toSq, PROMO_NONE));
      } else {
        if (isWhitePiece(target) !== white) {
          moves.push(encodeMove(sq, toSq, PROMO_NONE));
        }
        break;
      }
      nf += df;
      nr += dr;
    }
  }
}

function pushKingMoves(board, sq, white, moves) {
  const f = sq & 7;
  const r = sq >> 3;
  const sqs = board.squares;
  for (let i = 0; i < KING_DELTAS.length; i += 1) {
    const nf = f + KING_DELTAS[i][0];
    const nr = r + KING_DELTAS[i][1];
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
      const toSq = (nr << 3) | nf;
      const target = sqs[toSq];
      if (target === EMPTY || isWhitePiece(target) !== white) {
        moves.push(encodeMove(sq, toSq, PROMO_NONE));
      }
    }
  }

  const enemy = !white;
  if (white) {
    if (!board.isAttacked(sq, enemy)) {
      if (
        (board.castling & CASTLE_WK) !== 0 &&
        sqs[5] === EMPTY &&
        sqs[6] === EMPTY &&
        !board.isAttacked(5, enemy) &&
        !board.isAttacked(6, enemy)
      ) {
        moves.push(encodeMove(4, 6, PROMO_NONE));
      }
      if (
        (board.castling & CASTLE_WQ) !== 0 &&
        sqs[1] === EMPTY &&
        sqs[2] === EMPTY &&
        sqs[3] === EMPTY &&
        !board.isAttacked(2, enemy) &&
        !board.isAttacked(3, enemy)
      ) {
        moves.push(encodeMove(4, 2, PROMO_NONE));
      }
    }
  } else if (!board.isAttacked(sq, enemy)) {
    if (
      (board.castling & CASTLE_BK) !== 0 &&
      sqs[61] === EMPTY &&
      sqs[62] === EMPTY &&
      !board.isAttacked(61, enemy) &&
      !board.isAttacked(62, enemy)
    ) {
      moves.push(encodeMove(60, 62, PROMO_NONE));
    }
    if (
      (board.castling & CASTLE_BQ) !== 0 &&
      sqs[57] === EMPTY &&
      sqs[58] === EMPTY &&
      sqs[59] === EMPTY &&
      !board.isAttacked(58, enemy) &&
      !board.isAttacked(59, enemy)
    ) {
      moves.push(encodeMove(60, 58, PROMO_NONE));
    }
  }
}

export function pseudoLegalMoves(board) {
  const moves = [];
  const white = board.turnWhite;
  const sqs = board.squares;
  for (let sq = 0; sq < 64; sq += 1) {
    const p = sqs[sq];
    if (p === EMPTY) continue;
    if (white ? !isWhitePiece(p) : !isBlackPiece(p)) continue;

    if (p === WP || p === BP) {
      pushPawnMoves(board, sq, white, moves);
    } else if (p === WN || p === BN) {
      pushKnightMoves(board, sq, white, moves);
    } else if (p === WB || p === BB) {
      pushSlidingMoves(board, sq, BISHOP_DELTAS, white, moves);
    } else if (p === WR || p === BR) {
      pushSlidingMoves(board, sq, ROOK_DELTAS, white, moves);
    } else if (p === WQ || p === BQ) {
      pushSlidingMoves(board, sq, QUEEN_DELTAS, white, moves);
    } else if (p === WK || p === BK) {
      pushKingMoves(board, sq, white, moves);
    }
  }
  return moves;
}

export function legalMoves(board) {
  const pseudo = pseudoLegalMoves(board);
  const result = [];
  for (let i = 0; i < pseudo.length; i += 1) {
    const m = pseudo[i];
    board.makeMove(m);
    if (!board.inCheck(!board.turnWhite)) {
      result.push(m);
    }
    board.unmakeMove(m);
  }
  return result;
}

export function isInsufficientMaterial(board) {
  let minorWhite = 0;
  let minorBlack = 0;
  const bishopColors = [];
  const sqs = board.squares;

  for (let sq = 0; sq < 64; sq += 1) {
    const p = sqs[sq];
    if (p === EMPTY || p === WK || p === BK) continue;
    const pt = pieceType(p);
    if (pt === WP || pt === WR || pt === WQ) return false;
    if (pt === WN) {
      if (p <= WK) minorWhite += 1;
      else minorBlack += 1;
    } else if (pt === WB) {
      bishopColors.push(((sq & 7) + (sq >> 3)) & 1);
      if (p <= WK) minorWhite += 1;
      else minorBlack += 1;
    }
  }

  const totalMinors = minorWhite + minorBlack;
  if (totalMinors <= 1) return true;
  if (minorWhite === 1 && minorBlack === 1 && bishopColors.length === 2) {
    return bishopColors[0] === bishopColors[1];
  }
  return false;
}

export function getGameStatus(board, legal, historyKeys) {
  const inCheck = board.inCheck(board.turnWhite);
  if (legal.length === 0) {
    if (inCheck) {
      const winner = board.turnWhite ? "Black" : "White";
      return { inCheck: true, gameOver: `Checkmate! ${winner} wins.` };
    }
    return { inCheck: false, gameOver: "Draw by stalemate." };
  }
  if (board.halfmoveClock >= 100) {
    return { inCheck, gameOver: "Draw by 50-move rule." };
  }
  if (isInsufficientMaterial(board)) {
    return { inCheck, gameOver: "Draw by insufficient material." };
  }
  if (historyKeys && historyKeys.length > 0) {
    const key = board.getFen(false);
    let count = 0;
    for (let i = 0; i < historyKeys.length; i += 1) {
      if (historyKeys[i] === key) count += 1;
    }
    if (count >= 3) {
      return { inCheck, gameOver: "Draw by threefold repetition." };
    }
  }
  return { inCheck, gameOver: null };
}

export function moveToSan(board, move, legal) {
  const fromSq = moveFrom(move);
  const toSq = moveTo(move);
  const promo = movePromo(move);
  const piece = board.squares[fromSq];
  const pt = pieceType(piece);
  const fromName = squareToName(fromSq);
  const toName = squareToName(toSq);

  const isCapture =
    board.squares[toSq] !== EMPTY ||
    (pt === WP && board.epSquare >= 0 && toSq === board.epSquare);

  let san = "";
  if (pt === WK && Math.abs((toSq & 7) - (fromSq & 7)) === 2) {
    san = (toSq & 7) > (fromSq & 7) ? "O-O" : "O-O-O";
  } else if (pt === WP) {
    const prefix = isCapture ? `${fromName[0]}x` : "";
    const promoPart = promo ? `=${PIECE_TO_CHAR[promo].toUpperCase()}` : "";
    san = `${prefix}${toName}${promoPart}`;
  } else {
    let disambigFile = false;
    let disambigRank = false;
    const ff = fromSq & 7;
    const fr = fromSq >> 3;
    for (let i = 0; i < legal.length; i += 1) {
      const om = legal[i];
      if (om === move || moveTo(om) !== toSq) continue;
      const oFrom = moveFrom(om);
      if (board.squares[oFrom] === piece) {
        const of = oFrom & 7;
        const orank = oFrom >> 3;
        if (of !== ff) {
          disambigFile = true;
        } else if (orank !== fr) {
          disambigRank = true;
        } else {
          disambigFile = true;
          disambigRank = true;
        }
      }
    }
    let disambig = "";
    if (disambigFile) disambig += fromName[0];
    if (disambigRank) disambig += fromName[1];
    const capSym = isCapture ? "x" : "";
    san = `${PIECE_TO_CHAR[piece].toUpperCase()}${disambig}${capSym}${toName}`;
  }

  board.makeMove(move);
  const oppInCheck = board.inCheck(board.turnWhite);
  const oppLegal = legalMoves(board);
  board.unmakeMove(move);

  if (oppInCheck) {
    san += oppLegal.length === 0 ? "#" : "+";
  }
  return san;
}

export function getLegalState(fen, historyKeys = []) {
  const b = new Board();
  b.setFen(fen);
  const moves = legalMoves(b);
  const { inCheck, gameOver } = getGameStatus(b, moves, historyKeys);
  return {
    moves: moves.map(moveToUci),
    inCheck,
    gameOver,
  };
}

export function applyUciMove(fen, uci, historyKeys = []) {
  const b = new Board();
  b.setFen(fen);
  const move = uciToMove(uci);
  const legal = legalMoves(b);
  if (!legal.includes(move)) {
    throw new Error(`Illegal move: ${uci}`);
  }
  const san = moveToSan(b, move, legal);
  b.makeMove(move);
  const nextLegal = legalMoves(b);
  const nextFen = b.getFen(true);
  const positionKey = b.getFen(false);
  const updatedHistory = [...historyKeys, positionKey];
  const { inCheck, gameOver } = getGameStatus(b, nextLegal, updatedHistory);
  return {
    fen: nextFen,
    positionKey,
    moves: nextLegal.map(moveToUci),
    san,
    inCheck,
    gameOver,
  };
}
