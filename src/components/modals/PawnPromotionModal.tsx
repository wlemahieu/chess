import { useMemo } from "react";
import type { PieceName } from "../../stores/types";
import { gameStore } from "../../stores/gameStore";
import { boardStore } from "../../stores/boardStore";

function PawnPromotionModal() {
  const promotionPosition = gameStore((state) => state.promotionPosition);
  const board = boardStore((state) => state.board);
  const promotePawn = boardStore((state) => state.promotePawn);

  const promotingPiece = useMemo(
    () => (promotionPosition ? board.get(promotionPosition)?.piece : null),
    [promotionPosition, board]
  );

  const promotionOptions: PieceName[] = ["queen", "rook", "bishop", "knight"];

  const handlePromote = (pieceName: PieceName) => {
    if (promotionPosition) {
      promotePawn(promotionPosition, pieceName);
    }
  };

  if (!promotionPosition) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Promote pawn to:</h2>
        <div className="grid grid-cols-2 gap-4">
          {promotionOptions.map((pieceName) => (
            <button
              key={pieceName}
              onClick={() => handlePromote(pieceName)}
              className="p-4 border rounded hover:bg-gray-200 flex flex-col items-center"
            >
              <span className="text-lg font-semibold capitalize">
                {pieceName}
              </span>
              <span className="text-2xl">
                {promotingPiece?.color === "white" ? "○" : "●"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PawnPromotionModal;
