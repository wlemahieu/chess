import { memo, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import type { BoardPosition, TileData } from "../../stores/types";
import { uiStore } from "../../stores/uiStore";
import { gameStore } from "../../stores/gameStore";
import PieceDisplay from "./PieceDisplay";

interface BoardTileProps {
  position: BoardPosition;
  tileData: TileData;
  isValidMove: boolean;
  isSelected: boolean;
}

function BoardTile({
  position,
  tileData,
  isValidMove,
  isSelected,
}: BoardTileProps) {
  const currentTurn = gameStore((state) => state.currentTurn);
  const showBoardPositions = uiStore((state) => state.showBoardPositions);
  const setHoveredTile = uiStore((state) => state.setHoveredTile);
  const selectedTile = uiStore((state) => state.selectedTile);
  const setSelectedTile = uiStore((state) => state.setSelectedTile);
  const setDraggingPiece = uiStore((state) => state.setDraggingPiece);

  const handleMouseEnter = useCallback(() => {
    if (tileData?.piece && tileData.piece.color === currentTurn) {
      setHoveredTile(position);
    }
  }, [tileData, currentTurn, setHoveredTile, position]);

  const handleMouseLeave = useCallback(() => {
    setHoveredTile(null);
  }, [setHoveredTile]);

  const handleClick = useCallback(() => {
    if (selectedTile === position) {
      setSelectedTile(null);
      setDraggingPiece(null);
      return;
    }

    if (tileData?.piece && tileData.piece.color === currentTurn) {
      setSelectedTile(position);
      setDraggingPiece({
        name: tileData.piece.name,
        color: tileData.piece.color,
      });
    }
  }, [
    position,
    selectedTile,
    tileData,
    currentTurn,
    setSelectedTile,
    setDraggingPiece,
  ]);

  return (
    <div
      className={twMerge(
        "w-[100px] h-[100px] relative hover:bg-blue-500 flex items-center justify-center cursor-pointer",
        tileData?.color === "black"
          ? "bg-gray-700 text-gray-100"
          : "bg-gray-300 text-gray-900",
        isValidMove && "bg-pink-400",
        isSelected && "ring-4 ring-yellow-400"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showBoardPositions && (
        <span className="absolute bottom-1 left-1 text-xs italic">
          {position}
        </span>
      )}
      {tileData?.piece && <PieceDisplay piece={tileData.piece} />}
    </div>
  );
}

export default memo(BoardTile);
