import { memo } from "react";
import type { Piece } from "~/stores/types";
import { useUIStore } from "~/stores/uiStore";
import KingB from "~/components/pieces/kingb";
import KingW from "~/components/pieces/kingw";
import QueenB from "~/components/pieces/queenb";
import QueenW from "~/components/pieces/queenw";
import RookB from "~/components/pieces/rookb";
import RookW from "~/components/pieces/rookw";
import BishopB from "~/components/pieces/bishopb";
import BishopW from "~/components/pieces/bishopw";
import KnightB from "~/components/pieces/knightb";
import KnightW from "~/components/pieces/knightw";
import PawnB from "~/components/pieces/pawnb";
import PawnW from "~/components/pieces/pawnw";

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
  const pieceDisplayMode = useUIStore((state) => state.pieceDisplayMode);

  if (pieceDisplayMode === "text") {
    return (
      <div className="text-xs md:text-sm font-bold select-none capitalize text-center">
        {piece.name}
      </div>
    );
  }

  const PieceComponent =
    pieceComponents[piece.color]?.[
      piece.name as keyof typeof pieceComponents.black
    ];

  if (!PieceComponent) {
    return null;
  }

  return <PieceComponent />;
}

export default memo(PieceDisplay);
