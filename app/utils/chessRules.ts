import type { BoardPosition, Color, Piece, TileData } from "../stores/types";
import { getPiecePath } from "./pieceMovement";

type BoardStore = Map<BoardPosition, TileData>;

export function findKing(board: BoardStore, color: Color): BoardPosition | null {
  for (const [position, tile] of board.entries()) {
    if (tile.piece?.name === "king" && tile.piece.color === color) {
      return position;
    }
  }
  return null;
}

export function isPositionUnderAttack(
  board: BoardStore,
  position: BoardPosition,
  byColor: Color
): boolean {
  for (const [piecePos, tile] of board.entries()) {
    if (tile.piece && tile.piece.color === byColor) {
      const pieceMoves = getPiecePath(piecePos, tile.piece, board);
      if (pieceMoves.some(move => move.position === position)) {
        return true;
      }
    }
  }
  return false;
}

export function isKingInCheck(board: BoardStore, kingColor: Color): boolean {
  const kingPosition = findKing(board, kingColor);
  if (!kingPosition) return false;

  const enemyColor = kingColor === "white" ? "black" : "white";
  return isPositionUnderAttack(board, kingPosition, enemyColor);
}

export function wouldMoveLeaveKingInCheck(
  board: BoardStore,
  from: BoardPosition,
  to: BoardPosition,
  movingPiece: Piece
): boolean {
  const testBoard = new Map(board) as BoardStore;
  const destTile = testBoard.get(to);
  const sourceTile = testBoard.get(from);

  if (destTile && sourceTile) {
    testBoard.set(to, { ...destTile, piece: movingPiece });
    testBoard.set(from, { ...sourceTile, piece: undefined });
  }

  return isKingInCheck(testBoard, movingPiece.color);
}

export function getAllLegalMoves(
  board: BoardStore,
  color: Color
): Array<{ from: BoardPosition; to: BoardPosition }> {
  const legalMoves: Array<{ from: BoardPosition; to: BoardPosition }> = [];

  for (const [position, tile] of board.entries()) {
    if (tile.piece && tile.piece.color === color) {
      const pieceMoves = getPiecePath(position, tile.piece, board);
      for (const move of pieceMoves) {
        if (!wouldMoveLeaveKingInCheck(board, position, move.position, tile.piece)) {
          legalMoves.push({ from: position, to: move.position });
        }
      }
    }
  }

  return legalMoves;
}

export function isCheckmate(board: BoardStore, color: Color): boolean {
  if (!isKingInCheck(board, color)) return false;
  return getAllLegalMoves(board, color).length === 0;
}

export function isStalemate(board: BoardStore, color: Color): boolean {
  if (isKingInCheck(board, color)) return false;
  return getAllLegalMoves(board, color).length === 0;
}