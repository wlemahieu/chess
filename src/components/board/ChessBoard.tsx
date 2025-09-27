import { useMemo, useEffect, useCallback } from "react";
import type { BoardPosition, TileData } from "../../stores/types";
import { boardStore } from "../../stores/boardStore";
import { uiStore } from "../../stores/uiStore";
import { BOARD_LETTERS } from "../../utils/constants";
import BoardTile from "./BoardTile";

function ChessBoard() {
  const board = boardStore((state) => state.board);
  const movePiece = boardStore((state) => state.movePiece);
  const hoveredTile = uiStore((state) => state.hoveredTile);
  const selectedTile = uiStore((state) => state.selectedTile);
  const clearSelection = uiStore((state) => state.clearSelection);

  const matrix = useMemo(() => {
    const result: Array<Array<[BoardPosition, TileData | undefined]>> = [];

    BOARD_LETTERS.forEach((letter) => {
      const column: Array<[BoardPosition, TileData | undefined]> = [];
      for (let num = 8; num >= 1; num--) {
        const position = `${letter}${num}` as BoardPosition;
        column.push([position, board.get(position)]);
      }
      result.push(column);
    });

    return result;
  }, [board]);

  const validMoves = useMemo(() => {
    const activeTile = selectedTile || hoveredTile;
    if (!activeTile) return new Set<string>();

    const tileData = board.get(activeTile);
    if (!tileData?.piece?.path) return new Set<string>();

    return new Set(tileData.piece.path.map((move) => move.position));
  }, [selectedTile, hoveredTile, board]);

  const handleTileClick = useCallback(
    (position: BoardPosition) => {
      if (selectedTile && validMoves.has(position)) {
        movePiece(selectedTile, position);
        clearSelection();
      }
    },
    [selectedTile, validMoves, movePiece, clearSelection]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".chess-board")) {
        clearSelection();
      }
    };

    if (selectedTile) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [selectedTile, clearSelection]);

  return (
    <div className="chess-board flex w-[800px] shadow-xl">
      {matrix.map((letterColumn, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex flex-col w-[100px]">
          {letterColumn.map((tile, tileIndex) => {
            const [position, tileData] = tile;
            if (!tileData) return null;
            return (
              <div
                onClick={() => handleTileClick(position)}
                key={`column-${columnIndex}-tile-${tileIndex}`}
              >
                <BoardTile
                  position={position}
                  tileData={tileData}
                  isValidMove={validMoves.has(position)}
                  isSelected={selectedTile === position}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ChessBoard;
