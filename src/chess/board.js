/**
 * Board representation, FEN serialization, attack detection, and fast make/unmake
 * ported from chess-engine/cpp/src/board.cpp.
 */

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const FILE_NAMES = "abcdefgh";
export const RANK_NAMES = "12345678";

export const EMPTY = 0;
export const WP = 1;
export const WN = 2;
export const WB = 3;
export const WR = 4;
export const WQ = 5;
export const WK = 6;
export const BP = 7;
export const BN = 8;
export const BB = 9;
export const BR = 10;
export const BQ = 11;
export const BK = 12;

export const PIECE_TO_CHAR = ["", "P", "N", "B", "R", "Q", "K", "p", "n", "b", "r", "q", "k"];
export const CHAR_TO_PIECE = {
  P: WP,
  N: WN,
  B: WB,
  R: WR,
  Q: WQ,
  K: WK,
  p: BP,
  n: BN,
  b: BB,
  r: BR,
  q: BQ,
  k: BK,
};

// Promotion codes match pieceType constants (2=N, 3=B, 4=R, 5=Q).
export const PROMO_NONE = 0;
export const PROMO_N = 2;
export const PROMO_B = 3;
export const PROMO_R = 4;
export const PROMO_Q = 5;

const PROMO_TO_CHAR = ["", "", "n", "b", "r", "q"];
const CHAR_TO_PROMO = { n: PROMO_N, b: PROMO_B, r: PROMO_R, q: PROMO_Q };

export const CASTLE_WK = 1;
export const CASTLE_WQ = 2;
export const CASTLE_BK = 4;
export const CASTLE_BQ = 8;

export const ROOK_DELTAS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
export const BISHOP_DELTAS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];
export const QUEEN_DELTAS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];
export const KNIGHT_DELTAS = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];
export const KING_DELTAS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function isWhitePiece(piece) {
  return piece >= WP && piece <= WK;
}

export function isBlackPiece(piece) {
  return piece >= BP && piece <= BK;
}

export function pieceType(piece) {
  if (piece === EMPTY) return 0;
  return piece <= WK ? piece : piece - 6;
}

export function encodeMove(fromSq, toSq, promo = PROMO_NONE) {
  return (fromSq & 63) | ((toSq & 63) << 6) | ((promo & 7) << 12);
}

export function moveFrom(move) {
  return move & 63;
}

export function moveTo(move) {
  return (move >> 6) & 63;
}

export function movePromo(move) {
  return (move >> 12) & 7;
}

export function squareToFile(sq) {
  return sq & 7;
}

export function squareToRank(sq) {
  return sq >> 3;
}

export function fileRankToSquare(file, rank) {
  return (rank << 3) | file;
}

export function squareToName(sq) {
  return FILE_NAMES[sq & 7] + RANK_NAMES[sq >> 3];
}

export function nameToSquare(name) {
  if (typeof name !== "string" || name.length !== 2) {
    throw new Error(`Invalid square name: ${name}`);
  }
  const f = FILE_NAMES.indexOf(name[0].toLowerCase());
  const r = RANK_NAMES.indexOf(name[1]);
  if (f < 0 || r < 0) {
    throw new Error(`Invalid square name: ${name}`);
  }
  return (r << 3) | f;
}

export function moveToUci(move) {
  const s = squareToName(move & 63) + squareToName((move >> 6) & 63);
  const promo = (move >> 12) & 7;
  return promo ? s + PROMO_TO_CHAR[promo] : s;
}

export function uciToMove(uciIn) {
  const uci = String(uciIn || "").trim().toLowerCase();
  if (uci.length < 4) {
    throw new Error(`Invalid UCI move: ${uciIn}`);
  }
  const fromSq = nameToSquare(uci.slice(0, 2));
  const toSq = nameToSquare(uci.slice(2, 4));
  let promo = PROMO_NONE;
  if (uci.length > 4) {
    const p = CHAR_TO_PROMO[uci[4]];
    if (!p) {
      throw new Error(`Invalid promotion piece: ${uci[4]}`);
    }
    promo = p;
  }
  return encodeMove(fromSq, toSq, promo);
}

const INITIAL_UNDO_CAP = 512;

export class Board {
  constructor() {
    this.squares = new Uint8Array(64);
    this.turnWhite = true;
    this.castling = CASTLE_WK | CASTLE_WQ | CASTLE_BK | CASTLE_BQ;
    this.epSquare = -1;
    this.halfmoveClock = 0;
    this.fullmoveNumber = 1;
    this.whiteKingSq = -1;
    this.blackKingSq = -1;

    this._undoCap = INITIAL_UNDO_CAP;
    this._undoCaptured = new Uint8Array(INITIAL_UNDO_CAP);
    this._undoCastling = new Uint8Array(INITIAL_UNDO_CAP);
    this._undoEp = new Int8Array(INITIAL_UNDO_CAP);
    this._undoHalfmove = new Int16Array(INITIAL_UNDO_CAP);
    this._undoWkSq = new Int8Array(INITIAL_UNDO_CAP);
    this._undoBkSq = new Int8Array(INITIAL_UNDO_CAP);
    this._undoTop = 0;
  }

  _growUndo() {
    const nextCap = this._undoCap * 2;
    const growU8 = (arr) => {
      const next = new Uint8Array(nextCap);
      next.set(arr);
      return next;
    };
    const growI8 = (arr) => {
      const next = new Int8Array(nextCap);
      next.set(arr);
      return next;
    };
    const growI16 = (arr) => {
      const next = new Int16Array(nextCap);
      next.set(arr);
      return next;
    };
    this._undoCaptured = growU8(this._undoCaptured);
    this._undoCastling = growU8(this._undoCastling);
    this._undoEp = growI8(this._undoEp);
    this._undoHalfmove = growI16(this._undoHalfmove);
    this._undoWkSq = growI8(this._undoWkSq);
    this._undoBkSq = growI8(this._undoBkSq);
    this._undoCap = nextCap;
  }

  copy() {
    const b = new Board();
    b.squares.set(this.squares);
    b.turnWhite = this.turnWhite;
    b.castling = this.castling;
    b.epSquare = this.epSquare;
    b.halfmoveClock = this.halfmoveClock;
    b.fullmoveNumber = this.fullmoveNumber;
    b.whiteKingSq = this.whiteKingSq;
    b.blackKingSq = this.blackKingSq;
    return b;
  }

  setFen(fen) {
    const parts = String(fen || "").trim().split(/\s+/);
    if (!parts[0]) {
      throw new Error("Empty FEN");
    }

    this.squares.fill(EMPTY);
    this.whiteKingSq = -1;
    this.blackKingSq = -1;

    let rank = 7;
    let file = 0;
    for (const ch of parts[0]) {
      if (ch === "/") {
        rank -= 1;
        file = 0;
        continue;
      }
      if (ch >= "1" && ch <= "8") {
        file += ch.charCodeAt(0) - 48;
        continue;
      }
      const piece = CHAR_TO_PIECE[ch];
      if (piece) {
        const sq = (rank << 3) | file;
        this.squares[sq] = piece;
        if (piece === WK) this.whiteKingSq = sq;
        else if (piece === BK) this.blackKingSq = sq;
      }
      file += 1;
    }

    this.turnWhite = parts.length < 2 || parts[1] === "w" || parts[1] === "W";

    this.castling = 0;
    if (parts.length > 2 && parts[2] !== "-") {
      for (const ch of parts[2]) {
        if (ch === "K") this.castling |= CASTLE_WK;
        else if (ch === "Q") this.castling |= CASTLE_WQ;
        else if (ch === "k") this.castling |= CASTLE_BK;
        else if (ch === "q") this.castling |= CASTLE_BQ;
      }
    }

    this.epSquare = -1;
    if (parts.length > 3 && parts[3] !== "-") {
      this.epSquare = nameToSquare(parts[3]);
    }

    this.halfmoveClock = parts.length > 4 ? Number.parseInt(parts[4], 10) || 0 : 0;
    this.fullmoveNumber = parts.length > 5 ? Number.parseInt(parts[5], 10) || 1 : 1;
    this._undoTop = 0;
  }

  getFen(includeClocks = true) {
    const rows = [];
    for (let rank = 7; rank >= 0; rank -= 1) {
      let empty = 0;
      let row = "";
      for (let file = 0; file < 8; file += 1) {
        const p = this.squares[(rank << 3) | file];
        if (p === EMPTY) {
          empty += 1;
        } else {
          if (empty > 0) {
            row += String(empty);
            empty = 0;
          }
          row += PIECE_TO_CHAR[p];
        }
      }
      if (empty > 0) {
        row += String(empty);
      }
      rows.push(row);
    }

    let cr = "";
    if (this.castling & CASTLE_WK) cr += "K";
    if (this.castling & CASTLE_WQ) cr += "Q";
    if (this.castling & CASTLE_BK) cr += "k";
    if (this.castling & CASTLE_BQ) cr += "q";

    const base =
      `${rows.join("/")} ${this.turnWhite ? "w" : "b"} ${cr || "-"} ` +
      `${this.epSquare >= 0 ? squareToName(this.epSquare) : "-"}`;

    if (!includeClocks) return base;
    return `${base} ${this.halfmoveClock} ${this.fullmoveNumber}`;
  }

  isAttacked(sq, byWhite) {
    const f = sq & 7;
    const r = sq >> 3;
    const sqs = this.squares;

    // 1. Pawns
    const pawnRank = byWhite ? r - 1 : r + 1;
    if (pawnRank >= 0 && pawnRank < 8) {
      const targetPawn = byWhite ? WP : BP;
      const base = pawnRank << 3;
      if (f > 0 && sqs[base + f - 1] === targetPawn) return true;
      if (f < 7 && sqs[base + f + 1] === targetPawn) return true;
    }

    // 2. Knights
    const targetKnight = byWhite ? WN : BN;
    for (let i = 0; i < KNIGHT_DELTAS.length; i += 1) {
      const nf = f + KNIGHT_DELTAS[i][0];
      const nr = r + KNIGHT_DELTAS[i][1];
      if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8 && sqs[(nr << 3) | nf] === targetKnight) {
        return true;
      }
    }

    // 3. King
    const targetKing = byWhite ? WK : BK;
    for (let i = 0; i < KING_DELTAS.length; i += 1) {
      const nf = f + KING_DELTAS[i][0];
      const nr = r + KING_DELTAS[i][1];
      if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8 && sqs[(nr << 3) | nf] === targetKing) {
        return true;
      }
    }

    // 4. Orthogonal sliders (Rook / Queen)
    const targetRook = byWhite ? WR : BR;
    const targetQueen = byWhite ? WQ : BQ;
    for (let i = 0; i < ROOK_DELTAS.length; i += 1) {
      const df = ROOK_DELTAS[i][0];
      const dr = ROOK_DELTAS[i][1];
      let nf = f + df;
      let nr = r + dr;
      while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const p = sqs[(nr << 3) | nf];
        if (p !== EMPTY) {
          if (p === targetRook || p === targetQueen) return true;
          break;
        }
        nf += df;
        nr += dr;
      }
    }

    // 5. Diagonal sliders (Bishop / Queen)
    const targetBishop = byWhite ? WB : BB;
    for (let i = 0; i < BISHOP_DELTAS.length; i += 1) {
      const df = BISHOP_DELTAS[i][0];
      const dr = BISHOP_DELTAS[i][1];
      let nf = f + df;
      let nr = r + dr;
      while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const p = sqs[(nr << 3) | nf];
        if (p !== EMPTY) {
          if (p === targetBishop || p === targetQueen) return true;
          break;
        }
        nf += df;
        nr += dr;
      }
    }

    return false;
  }

  inCheck(white) {
    let ksq = white ? this.whiteKingSq : this.blackKingSq;
    if (ksq < 0) {
      const target = white ? WK : BK;
      for (let sq = 0; sq < 64; sq += 1) {
        if (this.squares[sq] === target) {
          ksq = sq;
          break;
        }
      }
    }
    if (ksq < 0) return false;
    return this.isAttacked(ksq, !white);
  }

  makeMove(move) {
    const fromSq = move & 63;
    const toSq = (move >> 6) & 63;
    const promo = (move >> 12) & 7;
    const sqs = this.squares;
    const piece = sqs[fromSq];

    if (this._undoTop >= this._undoCap) {
      this._growUndo();
    }
    const idx = this._undoTop;
    this._undoTop += 1;

    const castlingBefore = this.castling;
    const epBefore = this.epSquare;
    this._undoCastling[idx] = castlingBefore;
    this._undoEp[idx] = epBefore;
    this._undoHalfmove[idx] = this.halfmoveClock;
    this._undoWkSq[idx] = this.whiteKingSq;
    this._undoBkSq[idx] = this.blackKingSq;

    let captured = EMPTY;
    if ((piece === WP || piece === BP) && epBefore >= 0 && toSq === epBefore) {
      const capSq = piece === WP ? epBefore - 8 : epBefore + 8;
      captured = sqs[capSq];
      sqs[capSq] = EMPTY;
    } else {
      captured = sqs[toSq];
    }
    this._undoCaptured[idx] = captured;

    if (piece === WK) {
      this.castling &= ~(CASTLE_WK | CASTLE_WQ);
      this.whiteKingSq = toSq;
    } else if (piece === BK) {
      this.castling &= ~(CASTLE_BK | CASTLE_BQ);
      this.blackKingSq = toSq;
    }
    if (fromSq === 0 || toSq === 0) this.castling &= ~CASTLE_WQ;
    if (fromSq === 7 || toSq === 7) this.castling &= ~CASTLE_WK;
    if (fromSq === 56 || toSq === 56) this.castling &= ~CASTLE_BQ;
    if (fromSq === 63 || toSq === 63) this.castling &= ~CASTLE_BK;

    this.epSquare = -1;
    if ((piece === WP || piece === BP) && Math.abs((toSq >> 3) - (fromSq >> 3)) === 2) {
      this.epSquare = (fromSq + toSq) >> 1;
    }

    if ((piece === WK || piece === BK) && Math.abs(toSq - fromSq) === 2) {
      const kingSide = toSq > fromSq;
      const rookFrom = kingSide ? fromSq + 3 : fromSq - 4;
      const rookTo = kingSide ? fromSq + 1 : fromSq - 1;
      sqs[rookTo] = sqs[rookFrom];
      sqs[rookFrom] = EMPTY;
    }

    const placedPiece = promo ? (this.turnWhite ? promo : promo + 6) : piece;
    sqs[fromSq] = EMPTY;
    sqs[toSq] = placedPiece;

    if (piece === WP || piece === BP || captured !== EMPTY) {
      this.halfmoveClock = 0;
    } else {
      this.halfmoveClock += 1;
    }

    if (!this.turnWhite) {
      this.fullmoveNumber += 1;
    }
    this.turnWhite = !this.turnWhite;
  }

  unmakeMove(move) {
    const fromSq = move & 63;
    const toSq = (move >> 6) & 63;
    const promo = (move >> 12) & 7;
    const sqs = this.squares;

    this.turnWhite = !this.turnWhite;
    if (!this.turnWhite) {
      this.fullmoveNumber -= 1;
    }

    this._undoTop -= 1;
    const idx = this._undoTop;
    const captured = this._undoCaptured[idx];
    const castlingBefore = this._undoCastling[idx];
    const epBefore = this._undoEp[idx];

    const movedPiece = promo ? (this.turnWhite ? WP : BP) : sqs[toSq];
    sqs[fromSq] = movedPiece;

    if (epBefore >= 0 && (movedPiece === WP || movedPiece === BP) && toSq === epBefore) {
      sqs[toSq] = EMPTY;
      const capSq = movedPiece === WP ? epBefore - 8 : epBefore + 8;
      sqs[capSq] = captured;
    } else {
      sqs[toSq] = captured;
    }

    if ((movedPiece === WK || movedPiece === BK) && Math.abs(toSq - fromSq) === 2) {
      const kingSide = toSq > fromSq;
      const rookFrom = kingSide ? fromSq + 1 : fromSq - 1;
      const rookTo = kingSide ? fromSq + 3 : fromSq - 4;
      sqs[rookTo] = sqs[rookFrom];
      sqs[rookFrom] = EMPTY;
    }

    this.castling = castlingBefore;
    this.epSquare = epBefore;
    this.halfmoveClock = this._undoHalfmove[idx];
    this.whiteKingSq = this._undoWkSq[idx];
    this.blackKingSq = this._undoBkSq[idx];
  }
}

export function startingPosition() {
  const b = new Board();
  b.setFen(START_FEN);
  return b;
}
