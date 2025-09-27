import type {
  BoardPosition,
  Color,
  Piece,
  Move,
  Path,
  TileData,
} from "../stores/types";
import { MOVEMENT_RULES } from "./movementRules";
import { BOARD_LETTERS } from "./constants";

type BoardStore = Map<BoardPosition, TileData>;

function getDirectionModifier(
  direction: string,
  pieceColor: Color
): { row: number; col: number } {
  const isBlack = pieceColor === "black";

  switch (direction) {
    case "forward":
      return { row: isBlack ? -1 : 1, col: 0 };
    case "backward":
      return { row: isBlack ? 1 : -1, col: 0 };
    case "left":
      return { row: 0, col: isBlack ? 1 : -1 };
    case "right":
      return { row: 0, col: isBlack ? -1 : 1 };
    case "diagonal-forward-left":
      return { row: isBlack ? -1 : 1, col: isBlack ? 1 : -1 };
    case "diagonal-forward-right":
      return { row: isBlack ? -1 : 1, col: isBlack ? -1 : 1 };
    case "diagonal-backward-left":
      return { row: isBlack ? 1 : -1, col: isBlack ? 1 : -1 };
    case "diagonal-backward-right":
      return { row: isBlack ? 1 : -1, col: isBlack ? -1 : 1 };
    case "knight-forward-left":
      return { row: isBlack ? -2 : 2, col: isBlack ? 1 : -1 };
    case "knight-forward-right":
      return { row: isBlack ? -2 : 2, col: isBlack ? -1 : 1 };
    case "knight-backward-left":
      return { row: isBlack ? 2 : -2, col: isBlack ? 1 : -1 };
    case "knight-backward-right":
      return { row: isBlack ? 2 : -2, col: isBlack ? -1 : 1 };
    case "knight-left-forward":
      return { row: isBlack ? -1 : 1, col: isBlack ? 2 : -2 };
    case "knight-left-backward":
      return { row: isBlack ? 1 : -1, col: isBlack ? 2 : -2 };
    case "knight-right-forward":
      return { row: isBlack ? -1 : 1, col: isBlack ? -2 : 2 };
    case "knight-right-backward":
      return { row: isBlack ? 1 : -1, col: isBlack ? -2 : 2 };
    default:
      return { row: 0, col: 0 };
  }
}

function isWithinBounds(rowIndex: number, colIndex: number): boolean {
  return rowIndex >= 1 && rowIndex <= 8 && colIndex >= 0 && colIndex <= 7;
}

function checkPawnMove(
  move: Move,
  targetTile: TileData | undefined,
  pieceColor: Color
): boolean {
  const moveType = move.moveType || "both";

  if (moveType === "move") {
    return !targetTile?.piece;
  }

  if (moveType === "capture") {
    return (
      targetTile?.piece !== undefined && targetTile.piece.color !== pieceColor
    );
  }

  return true;
}

function isPathBlocked(
  board: BoardStore,
  from: BoardPosition,
  _to: { row: number; col: number },
  steps: number,
  dirModifier: { row: number; col: number }
): boolean {
  const [columnLetter, rowNumber] = from;
  const startRow = Number(rowNumber);
  const startCol = BOARD_LETTERS.indexOf(columnLetter as any);

  for (let step = 1; step < steps; step++) {
    const intermediateRow = startRow + step * dirModifier.row;
    const intermediateCol = startCol + step * dirModifier.col;

    if (!isWithinBounds(intermediateRow, intermediateCol)) {
      return true;
    }

    const intermediateColumn = BOARD_LETTERS[intermediateCol];
    const intermediatePosition =
      `${intermediateColumn}${intermediateRow}` as BoardPosition;

    if (board.get(intermediatePosition)?.piece) {
      return true;
    }
  }

  return false;
}

export function getPiecePath(
  position: BoardPosition,
  piece: Piece,
  board: BoardStore
): Path {
  const pieceName = piece.name;
  const moves = MOVEMENT_RULES.get(pieceName);
  if (!moves) return [];

  const [columnLetter, rowNumber] = position;
  const pieceColor = piece.color;
  const columnIndex = BOARD_LETTERS.indexOf(columnLetter as any);
  const validMoves: Path = [];

  const movesByDirection: Record<string, Move[]> = {};
  moves.forEach((move) => {
    if (!movesByDirection[move.direction]) {
      movesByDirection[move.direction] = [];
    }
    movesByDirection[move.direction].push(move);
  });

  for (const [_, dirMoves] of Object.entries(movesByDirection)) {
    const sortedMoves = dirMoves.sort((a, b) => a.steps - b.steps);

    for (const move of sortedMoves) {
      if (move.customRule && !move.customRule(piece)) {
        continue;
      }

      const dirModifier = getDirectionModifier(move.direction, pieceColor);
      const newRowIndex = Number(rowNumber) + move.steps * dirModifier.row;
      const newColIndex = columnIndex + move.steps * dirModifier.col;

      if (!isWithinBounds(newRowIndex, newColIndex)) {
        continue;
      }

      const newColumnLetter = BOARD_LETTERS[newColIndex];
      const targetPosition =
        `${newColumnLetter}${newRowIndex}` as BoardPosition;
      const targetTile = board.get(targetPosition);

      if (pieceName === "pawn") {
        if (!checkPawnMove(move, targetTile, pieceColor)) {
          if (move.moveType === "move") break;
          continue;
        }
        validMoves.push({ position: targetPosition });
      } else {
        if (targetTile?.piece) {
          if (targetTile.piece.color === pieceColor) {
            if (pieceName === "knight") continue;
            break;
          } else {
            validMoves.push({ position: targetPosition });
            if (pieceName !== "knight") break;
          }
        } else {
          validMoves.push({ position: targetPosition });
        }
      }

      if (pieceName !== "knight" && move.steps > 1) {
        if (
          isPathBlocked(
            board,
            position,
            { row: newRowIndex, col: newColIndex },
            move.steps,
            dirModifier
          )
        ) {
          validMoves.pop();
          break;
        }
      }
    }
  }

  return validMoves;
}
