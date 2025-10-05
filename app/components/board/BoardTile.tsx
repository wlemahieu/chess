import { memo, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import type { BoardPosition, TileData } from "~/stores/types";
import { uiStore } from "~/stores/uiStore";
import { gameStore } from "~/stores/gameStore";
import PieceDisplay from "~/components/board/PieceDisplay";

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
  const showTileHover = uiStore((state) => state.showTileHover);
  const showMovePaths = uiStore((state) => state.showMovePaths);
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
        "w-full h-full relative flex items-center justify-center cursor-pointer",
        showTileHover && "hover:bg-blue-500 hover:z-10",
        tileData?.color === "black"
          ? "bg-gray-700 text-gray-100"
          : "bg-gray-300 text-gray-900",
        isValidMove && showMovePaths && "bg-pink-400",
        isSelected && "ring-4 ring-yellow-400 z-20"
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
      <div className="flex flex-col items-center justify-center grow-0 shrink-0 min-h-[50px] min-w-[50px]">
        {tileData?.piece && <PieceDisplay piece={tileData.piece} />}
      </div>
    </div>
  );
}

export default memo(BoardTile);
