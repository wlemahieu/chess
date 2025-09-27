import { memo } from "react";
import { twMerge } from "tailwind-merge";
import type { Piece } from "../../stores/types";
import { uiStore } from "../../stores/uiStore";

interface PieceDisplayProps {
  piece: Piece;
}

function getPieceDisplayName(pieceName: string): string {
  return pieceName.charAt(0).toUpperCase() + pieceName.slice(1);
}

function PieceDisplay({ piece }: PieceDisplayProps) {
  const pieceDisplayMode = uiStore((state) => state.pieceDisplayMode);

  if (pieceDisplayMode === "text") {
    return (
      <div className="flex flex-col items-center">
        <span className={twMerge(
          "text-sm font-bold",
          piece.color === "black" ? "text-black" : "text-white"
        )}>
          {getPieceDisplayName(piece.name)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-semibold">{piece.name}</span>
      <span
        className={twMerge(
          "text-xs",
          piece.color === "black" ? "text-black" : "text-white"
        )}
      >
        {piece.color === "black" ? "●" : "○"}
      </span>
    </div>
  );
}

export default memo(PieceDisplay);
