import React from "react";
import { twMerge } from "tailwind-merge";
import type { Piece } from "../../stores/types";

interface PieceDisplayProps {
  piece: Piece;
}

function PieceDisplay({ piece }: PieceDisplayProps) {
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

export default React.memo(PieceDisplay);