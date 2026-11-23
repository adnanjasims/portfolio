import { FILE_NAMES, nameToSquare, squareToName } from "../chess/board";

const PROMO_OPTIONS = [
  { code: "q", label: "Queen" },
  { code: "r", label: "Rook" },
  { code: "b", label: "Bishop" },
  { code: "n", label: "Knight" },
];

/**
 * Crisp Staunton-style SVG chess piece silhouette with high-contrast fills
 * for both light and dark squares.
 */
export function ChessPieceSvg({ piece, className = "h-[82%] w-[82%]" }) {
  const isWhite = piece === piece.toUpperCase();
  const type = piece.toUpperCase();

  const fill = isWhite ? "#f8f3e3" : "#181c22";
  const stroke = isWhite ? "#1c140d" : "#e5d5ad";
  const accent = isWhite ? "#b45309" : "#d4b475";
  const strokeWidth = isWhite ? "2" : "1.8";

  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      aria-hidden="true"
      style={{
        filter: isWhite
          ? "drop-shadow(0 2px 2px rgba(0,0,0,0.45))"
          : "drop-shadow(0 2px 3px rgba(0,0,0,0.75))",
      }}
    >
      {type === "P" && (
        <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fill}
          />
          <path d="M16 35.5h13" stroke={accent} strokeWidth="1.4" fill="none" />
        </g>
      )}

      {type === "R" && (
        <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM14 29.5v-13h17v13H14z" fill={fill} />
          <path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" fill={fill} />
          <path d="M12 35.5h21M14 29.5h17" stroke={accent} strokeWidth="1.4" fill="none" />
        </g>
      )}

      {type === "N" && (
        <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
            fill={fill}
          />
          <path
            d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
            fill={fill}
          />
          <circle cx="15" cy="15.5" r="1" fill={accent} stroke="none" />
          <path d="M17 35h18" stroke={accent} strokeWidth="1.4" fill="none" />
        </g>
      )}

      {type === "B" && (
        <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <g fill={fill}>
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
            <circle cx="22.5" cy="8" r="2.5" />
          </g>
          <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke={accent} strokeWidth="1.5" fill="none" />
        </g>
      )}

      {type === "Q" && (
        <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <g fill={fill}>
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="14" cy="9" r="2.5" />
            <circle cx="22.5" cy="8" r="2.5" />
            <circle cx="31" cy="9" r="2.5" />
            <circle cx="39" cy="12" r="2.5" />
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" />
            <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
          </g>
          <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" stroke={accent} strokeWidth="1.4" fill="none" />
        </g>
      )}

      {type === "K" && (
        <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" stroke={accent} strokeWidth="2.2" fill="none" />
          <path
            d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
            fill={fill}
          />
          <path
            d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"
            fill={fill}
          />
          <path
            d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
            stroke={accent}
            strokeWidth="1.4"
            fill="none"
          />
        </g>
      )}
    </svg>
  );
}

function fenToSquares(fen) {
  const squares = new Array(64).fill(null);
  const pos = (fen || "").split(/\s+/)[0] || "";
  let rank = 7;
  let file = 0;
  for (const ch of pos) {
    if (ch === "/") {
      rank -= 1;
      file = 0;
      continue;
    }
    if (ch >= "1" && ch <= "8") {
      file += Number.parseInt(ch, 10);
      continue;
    }
    squares[(rank << 3) | file] = ch;
    file += 1;
  }
  return squares;
}

/**
 * Interactive 8x8 chessboard with legal move dots, last-move / hint / check
 * highlights, coordinates, and inline pawn promotion overlay.
 */
export default function ChessBoard({
  fen,
  legalMoves,
  selectedSquare,
  lastFrom,
  lastTo,
  orientation = "white",
  hintFrom,
  hintTo,
  inCheck = false,
  pendingPromo = null,
  onSquareClick,
  onSelectPromo,
  onCancelPromo,
  disabled = false,
}) {
  const board = fenToSquares(fen);
  const turnPart = (fen || "").split(/\s+/)[1] || "w";
  const whiteTurn = turnPart === "w";
  const kingChar = whiteTurn ? "K" : "k";
  const checkSq = inCheck ? board.findIndex((p) => p === kingChar) : -1;

  const files = orientation === "white" ? FILE_NAMES.split("") : FILE_NAMES.split("").reverse();
  const ranks =
    orientation === "white"
      ? ["8", "7", "6", "5", "4", "3", "2", "1"]
      : ["1", "2", "3", "4", "5", "6", "7", "8"];

  const bottomRank = ranks[ranks.length - 1];
  const leftFile = files[0];

  const selectedName = selectedSquare != null ? squareToName(selectedSquare) : null;
  const legalTargets = selectedName
    ? new Set(
        legalMoves
          .filter((m) => m.slice(0, 2) === selectedName)
          .map((m) => nameToSquare(m.slice(2, 4)))
      )
    : null;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px] select-none overflow-hidden rounded border-2 border-[#5a4126] bg-[#0a140d] shadow-[0_14px_34px_rgba(0,0,0,0.75)]">
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {ranks.map((rankStr) =>
          files.map((fileStr) => {
            const rank = Number.parseInt(rankStr, 10);
            const fileIndex = FILE_NAMES.indexOf(fileStr);
            const sq = (rank - 1) * 8 + fileIndex;
            const piece = board[sq];
            const isLight = (fileIndex + (rank - 1)) % 2 === 1;
            const isSelected = selectedSquare === sq;
            const isLast = lastFrom === sq || lastTo === sq;
            const isHintFrom = hintFrom === sq;
            const isHintTo = hintTo === sq;
            const isTarget = legalTargets?.has(sq) ?? false;
            const isCheck = sq === checkSq;
            const showRank = fileStr === leftFile;
            const showFile = rankStr === bottomRank;

            return (
              <button
                key={`${fileStr}${rankStr}`}
                type="button"
                disabled={disabled && !pendingPromo}
                onClick={() => !disabled && onSquareClick?.(sq)}
                aria-label={piece ? `${piece} on ${fileStr}${rankStr}` : `${fileStr}${rankStr}`}
                className={`relative flex aspect-square items-center justify-center p-0 transition-colors focus:outline-none ${
                  isLight ? "bg-[#dfd4b8]" : "bg-[#2c5d41]"
                } ${disabled ? "cursor-default" : "cursor-pointer"}`}
              >
                {/* Last move highlight */}
                {isLast && (
                  <span className="pointer-events-none absolute inset-0 bg-amber-400/35" />
                )}

                {/* Selected square */}
                {isSelected && (
                  <span className="pointer-events-none absolute inset-0 bg-amber-300/45 ring-2 ring-inset ring-amber-400" />
                )}

                {/* King in check glow */}
                {isCheck && (
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(185,28,28,0.45) 55%, transparent 80%)",
                    }}
                  />
                )}

                {/* Hint square highlight */}
                {(isHintFrom || isHintTo) && (
                  <span
                    className={`pointer-events-none absolute inset-0 animate-pulse ring-2 ring-inset ${
                      isHintFrom
                        ? "bg-cyan-400/25 ring-cyan-300"
                        : "bg-cyan-300/35 ring-cyan-200"
                    }`}
                  />
                )}

                {/* Edge coordinates */}
                {showRank && (
                  <span
                    className={`pointer-events-none absolute left-0.5 top-0.5 text-[10px] font-bold leading-none ${
                      isLight ? "text-[#2c5d41]/80" : "text-[#dfd4b8]/75"
                    }`}
                  >
                    {rankStr}
                  </span>
                )}
                {showFile && (
                  <span
                    className={`pointer-events-none absolute bottom-0.5 right-0.5 text-[10px] font-bold leading-none ${
                      isLight ? "text-[#2c5d41]/80" : "text-[#dfd4b8]/75"
                    }`}
                  >
                    {fileStr}
                  </span>
                )}

                {/* Piece */}
                {piece && (
                  <span className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center">
                    <ChessPieceSvg piece={piece} />
                  </span>
                )}

                {/* Legal target indicator */}
                {isTarget &&
                  (piece ? (
                    <span className="pointer-events-none absolute inset-[6%] z-20 rounded-full border-[3px] border-amber-400/85" />
                  ) : (
                    <span
                      className={`pointer-events-none z-20 h-[28%] w-[28%] rounded-full ${
                        isLight ? "bg-[#173623]/40" : "bg-[#f8e7b0]/45"
                      }`}
                    />
                  ))}
              </button>
            );
          })
        )}
      </div>

      {/* Inline promotion dialog */}
      {pendingPromo && (
        <div
          role="dialog"
          aria-label="Choose promotion piece"
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 p-4 backdrop-blur-[1px]"
        >
          <div className="w-full max-w-[260px] rounded border-2 border-amber-400/80 bg-[#0b1810] p-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <p className="arcade-body mb-3 text-[14.5px] font-semibold uppercase tracking-wider text-amber-300">
              Promote Pawn
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PROMO_OPTIONS.map((opt) => {
                const match =
                  pendingPromo.choices.find((m) => m.endsWith(opt.code)) ||
                  pendingPromo.choices[0];
                const pieceChar = whiteTurn ? opt.code.toUpperCase() : opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    title={opt.label}
                    aria-label={`Promote to ${opt.label}`}
                    onClick={() => onSelectPromo?.(match)}
                    className="flex aspect-square cursor-pointer items-center justify-center rounded border-2 border-[#2c5d41] bg-[#13291b] p-1 transition hover:border-amber-300 hover:bg-[#1e3f2a] focus:outline-none"
                  >
                    <ChessPieceSvg piece={pieceChar} className="h-9 w-9" />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => onCancelPromo?.()}
              className="arcade-body mt-3 cursor-pointer text-[12px] text-white/65 underline-offset-2 hover:text-amber-300 hover:underline focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
