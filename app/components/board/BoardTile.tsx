import { memo, useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import type { BoardPosition, TileData } from "~/stores/types";
import { useUIStore } from "~/stores/uiStore";
import { useGameStore } from "~/stores/gameStore";
import { useOnlineGameStore } from "~/stores/onlineGameStore";
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
  const currentTurn = useGameStore((state) => state.currentTurn);
  const showBoardPositions = useUIStore((state) => state.showBoardPositions);
  const showTileHover = useUIStore((state) => state.showTileHover);
  const showMovePaths = useUIStore((state) => state.showMovePaths);
  const setHoveredTile = useUIStore((state) => state.setHoveredTile);
  const selectedTile = useUIStore((state) => state.selectedTile);
  const setSelectedTile = useUIStore((state) => state.setSelectedTile);
  const setDraggingPiece = useUIStore((state) => state.setDraggingPiece);
  const gameMode = useOnlineGameStore((state) => state.gameMode);
  const playerColor = useOnlineGameStore((state) => state.playerColor);

  // Determine if this piece can be interacted with
  const canInteract = useMemo(() => {
    if (!tileData?.piece) return false;

    // In local mode, can interact with pieces of current turn
    if (gameMode === "local") {
      return tileData.piece.color === currentTurn;
    }

    // In online mode, can only interact with own pieces
    if (gameMode === "online") {
      return tileData.piece.color === playerColor;
    }

    return false;
  }, [tileData, gameMode, currentTurn, playerColor]);

  // Determine if this is an opponent's piece
  const isOpponentPiece = useMemo(() => {
    if (!tileData?.piece || gameMode !== "online") return false;
    return tileData.piece.color !== playerColor;
  }, [tileData, gameMode, playerColor]);

  const handleMouseEnter = useCallback(() => {
    if (canInteract) {
      setHoveredTile(position);
    }
  }, [canInteract, setHoveredTile, position]);

  const handleMouseLeave = useCallback(() => {
    setHoveredTile(null);
  }, [setHoveredTile]);

  const handleClick = useCallback(() => {
    if (selectedTile === position) {
      setSelectedTile(null);
      setDraggingPiece(null);
      return;
    }

    if (canInteract && tileData?.piece) {
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
    canInteract,
    setSelectedTile,
    setDraggingPiece,
  ]);

  return (
    <div
      className={twMerge(
        "w-full h-full relative flex items-center justify-center",
        canInteract && "cursor-pointer",
        isOpponentPiece && "cursor-not-allowed",
        !tileData?.piece && "cursor-default",
        showTileHover && canInteract && "hover:bg-blue-500 hover:z-10",
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
