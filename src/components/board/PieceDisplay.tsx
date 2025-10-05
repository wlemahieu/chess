import { memo } from "react";
import type { Piece } from "../../stores/types";
import KingB from "../pieces/kingb";
import KingW from "../pieces/kingw";
import QueenB from "../pieces/queenb";
import QueenW from "../pieces/queenw";
import RookB from "../pieces/rookb";
import RookW from "../pieces/rookw";
import BishopB from "../pieces/bishopb";
import BishopW from "../pieces/bishopw";
import KnightB from "../pieces/knightb";
import KnightW from "../pieces/knightw";
import PawnB from "../pieces/pawnb";
import PawnW from "../pieces/pawnw";

interface PieceDisplayProps {
  piece: Piece;
}

const pieceComponents = {
  black: {
    king: KingB,
    queen: QueenB,
    rook: RookB,
    bishop: BishopB,
    knight: KnightB,
    pawn: PawnB,
  },
  white: {
    king: KingW,
    queen: QueenW,
    rook: RookW,
    bishop: BishopW,
    knight: KnightW,
    pawn: PawnW,
  },
};

function PieceDisplay({ piece }: PieceDisplayProps) {
  const PieceComponent = pieceComponents[piece.color]?.[piece.name as keyof typeof pieceComponents.black];

  if (!PieceComponent) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <PieceComponent className="w-16 h-16" />
    </div>
  );
}

export default memo(PieceDisplay);
