import { useMemo } from "react";
import { create } from "zustand";

type Color = "black" | "white";
type PieceName = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
type Path = Array<{ position: BoardPosition }>;
type Piece = {
  name: PieceName;
  color: Color;
  path: Path;
  hasMoved?: boolean;
};
type MoveType = "move" | "capture" | "both";
type Move = {
  direction: string;
  steps: number;
  moveType?: MoveType;
  customRule?: (piece: Piece) => boolean;
};
type BoardLetters = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type BoardNumbers = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type BoardPosition = `${BoardLetters}${BoardNumbers}`;
type Board = Map<BoardPosition, TileData>;
type InitialPiece = {
  name: PieceName;
  initialPositions: Array<BoardPosition>;
};
type InitialPieces = Array<InitialPiece>;
type BoardStore = Map<BoardPosition, TileData>;
export type TileData = { color: Color; piece?: Piece; value?: number };
export type Tile = [BoardPosition, TileData];
export type { BoardPosition };
type MatrixColumn = Tile;
type Matrix = Array<Array<MatrixColumn>>;

const boardLetters: Array<BoardLetters> = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
];

const initialPieces: InitialPieces = [
  {
    name: "king",
    initialPositions: ["E1", "E8"],
  },
  {
    name: "queen",
    initialPositions: ["D1", "D8"],
  },
  {
    name: "rook",
    initialPositions: ["A1", "A8", "H1", "H8"],
  },
  {
    name: "bishop",
    initialPositions: ["C1", "C8", "F1", "F8"],
  },
  {
    name: "knight",
    initialPositions: ["B1", "B8", "G1", "G8"],
  },
  {
    name: "pawn",
    initialPositions: [
      "A2",
      "B2",
      "C2",
      "D2",
      "E2",
      "F2",
      "G2",
      "H2",
      "A7",
      "B7",
      "C7",
      "D7",
      "E7",
      "F7",
      "G7",
      "H7",
    ],
  },
];

function getPieceColor(position: BoardPosition): Color {
  return position.includes(`7`) || position.includes(`8`) ? "black" : "white";
}

const movement = new Map<PieceName, Move[]>([
  [
    "pawn",
    [
      { direction: "forward", steps: 1, moveType: "move" },
      {
        direction: "forward",
        steps: 2,
        moveType: "move",
        customRule: (piece: Piece) => !piece.hasMoved,
      },
      { direction: "diagonal-forward-left", steps: 1, moveType: "capture" },
      { direction: "diagonal-forward-right", steps: 1, moveType: "capture" },
    ],
  ],
  [
    "rook",
    [
      // Vertical and horizontal moves up to 7 squares
      { direction: "forward", steps: 1 },
      { direction: "forward", steps: 2 },
      { direction: "forward", steps: 3 },
      { direction: "forward", steps: 4 },
      { direction: "forward", steps: 5 },
      { direction: "forward", steps: 6 },
      { direction: "forward", steps: 7 },
      { direction: "backward", steps: 1 },
      { direction: "backward", steps: 2 },
      { direction: "backward", steps: 3 },
      { direction: "backward", steps: 4 },
      { direction: "backward", steps: 5 },
      { direction: "backward", steps: 6 },
      { direction: "backward", steps: 7 },
      { direction: "left", steps: 1 },
      { direction: "left", steps: 2 },
      { direction: "left", steps: 3 },
      { direction: "left", steps: 4 },
      { direction: "left", steps: 5 },
      { direction: "left", steps: 6 },
      { direction: "left", steps: 7 },
      { direction: "right", steps: 1 },
      { direction: "right", steps: 2 },
      { direction: "right", steps: 3 },
      { direction: "right", steps: 4 },
      { direction: "right", steps: 5 },
      { direction: "right", steps: 6 },
      { direction: "right", steps: 7 },
    ],
  ],
  [
    "bishop",
    [
      // Diagonal moves up to 7 squares
      { direction: "diagonal-forward-left", steps: 1 },
      { direction: "diagonal-forward-left", steps: 2 },
      { direction: "diagonal-forward-left", steps: 3 },
      { direction: "diagonal-forward-left", steps: 4 },
      { direction: "diagonal-forward-left", steps: 5 },
      { direction: "diagonal-forward-left", steps: 6 },
      { direction: "diagonal-forward-left", steps: 7 },
      { direction: "diagonal-forward-right", steps: 1 },
      { direction: "diagonal-forward-right", steps: 2 },
      { direction: "diagonal-forward-right", steps: 3 },
      { direction: "diagonal-forward-right", steps: 4 },
      { direction: "diagonal-forward-right", steps: 5 },
      { direction: "diagonal-forward-right", steps: 6 },
      { direction: "diagonal-forward-right", steps: 7 },
      { direction: "diagonal-backward-left", steps: 1 },
      { direction: "diagonal-backward-left", steps: 2 },
      { direction: "diagonal-backward-left", steps: 3 },
      { direction: "diagonal-backward-left", steps: 4 },
      { direction: "diagonal-backward-left", steps: 5 },
      { direction: "diagonal-backward-left", steps: 6 },
      { direction: "diagonal-backward-left", steps: 7 },
      { direction: "diagonal-backward-right", steps: 1 },
      { direction: "diagonal-backward-right", steps: 2 },
      { direction: "diagonal-backward-right", steps: 3 },
      { direction: "diagonal-backward-right", steps: 4 },
      { direction: "diagonal-backward-right", steps: 5 },
      { direction: "diagonal-backward-right", steps: 6 },
      { direction: "diagonal-backward-right", steps: 7 },
    ],
  ],
  [
    "knight",
    [
      // L-shaped moves: 2 squares in one direction, 1 in perpendicular
      { direction: "knight-forward-left", steps: 1 },
      { direction: "knight-forward-right", steps: 1 },
      { direction: "knight-backward-left", steps: 1 },
      { direction: "knight-backward-right", steps: 1 },
      { direction: "knight-left-forward", steps: 1 },
      { direction: "knight-left-backward", steps: 1 },
      { direction: "knight-right-forward", steps: 1 },
      { direction: "knight-right-backward", steps: 1 },
    ],
  ],
  [
    "queen",
    [
      // Combination of rook and bishop moves
      // Vertical and horizontal
      { direction: "forward", steps: 1 },
      { direction: "forward", steps: 2 },
      { direction: "forward", steps: 3 },
      { direction: "forward", steps: 4 },
      { direction: "forward", steps: 5 },
      { direction: "forward", steps: 6 },
      { direction: "forward", steps: 7 },
      { direction: "backward", steps: 1 },
      { direction: "backward", steps: 2 },
      { direction: "backward", steps: 3 },
      { direction: "backward", steps: 4 },
      { direction: "backward", steps: 5 },
      { direction: "backward", steps: 6 },
      { direction: "backward", steps: 7 },
      { direction: "left", steps: 1 },
      { direction: "left", steps: 2 },
      { direction: "left", steps: 3 },
      { direction: "left", steps: 4 },
      { direction: "left", steps: 5 },
      { direction: "left", steps: 6 },
      { direction: "left", steps: 7 },
      { direction: "right", steps: 1 },
      { direction: "right", steps: 2 },
      { direction: "right", steps: 3 },
      { direction: "right", steps: 4 },
      { direction: "right", steps: 5 },
      { direction: "right", steps: 6 },
      { direction: "right", steps: 7 },
      // Diagonals
      { direction: "diagonal-forward-left", steps: 1 },
      { direction: "diagonal-forward-left", steps: 2 },
      { direction: "diagonal-forward-left", steps: 3 },
      { direction: "diagonal-forward-left", steps: 4 },
      { direction: "diagonal-forward-left", steps: 5 },
      { direction: "diagonal-forward-left", steps: 6 },
      { direction: "diagonal-forward-left", steps: 7 },
      { direction: "diagonal-forward-right", steps: 1 },
      { direction: "diagonal-forward-right", steps: 2 },
      { direction: "diagonal-forward-right", steps: 3 },
      { direction: "diagonal-forward-right", steps: 4 },
      { direction: "diagonal-forward-right", steps: 5 },
      { direction: "diagonal-forward-right", steps: 6 },
      { direction: "diagonal-forward-right", steps: 7 },
      { direction: "diagonal-backward-left", steps: 1 },
      { direction: "diagonal-backward-left", steps: 2 },
      { direction: "diagonal-backward-left", steps: 3 },
      { direction: "diagonal-backward-left", steps: 4 },
      { direction: "diagonal-backward-left", steps: 5 },
      { direction: "diagonal-backward-left", steps: 6 },
      { direction: "diagonal-backward-left", steps: 7 },
      { direction: "diagonal-backward-right", steps: 1 },
      { direction: "diagonal-backward-right", steps: 2 },
      { direction: "diagonal-backward-right", steps: 3 },
      { direction: "diagonal-backward-right", steps: 4 },
      { direction: "diagonal-backward-right", steps: 5 },
      { direction: "diagonal-backward-right", steps: 6 },
      { direction: "diagonal-backward-right", steps: 7 },
    ],
  ],
  [
    "king",
    [
      // One square in any direction
      { direction: "forward", steps: 1 },
      { direction: "backward", steps: 1 },
      { direction: "left", steps: 1 },
      { direction: "right", steps: 1 },
      { direction: "diagonal-forward-left", steps: 1 },
      { direction: "diagonal-forward-right", steps: 1 },
      { direction: "diagonal-backward-left", steps: 1 },
      { direction: "diagonal-backward-right", steps: 1 },
    ],
  ],
]);

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
    // Knight moves (L-shape: 2 squares in one direction, 1 in perpendicular)
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

function getPiecePath(
  position: BoardPosition,
  piece: Piece,
  board: BoardStore
): Path {
  const pieceName = piece.name;
  const [columnLetter, rowNumber] = position;
  const moves = movement.get(pieceName);
  if (!moves) return [];

  const pieceColor = piece.color;
  const columnIndex = boardLetters.indexOf(columnLetter as BoardLetters);
  const validMoves: Path = [];

  // Group moves by direction for path blocking
  const movesByDirection: Record<string, typeof moves> = {};
  moves.forEach((move) => {
    if (!movesByDirection[move.direction]) {
      movesByDirection[move.direction] = [];
    }
    movesByDirection[move.direction].push(move);
  });

  // Process each direction
  for (const [direction, dirMoves] of Object.entries(movesByDirection)) {
    // Sort moves by steps to check them in order
    const sortedMoves = dirMoves.sort((a, b) => a.steps - b.steps);

    for (const move of sortedMoves) {
      // Check custom rules (like pawn's first move)
      if (move.customRule && !move.customRule(piece)) {
        continue;
      }

      const dirModifier = getDirectionModifier(move.direction, pieceColor);
      const newRowIndex = Number(rowNumber) + move.steps * dirModifier.row;
      const newColIndex = columnIndex + move.steps * dirModifier.col;

      // Check bounds
      if (
        newRowIndex < 1 ||
        newRowIndex > 8 ||
        newColIndex < 0 ||
        newColIndex > 7
      ) {
        continue;
      }

      const newColumnLetter = boardLetters[newColIndex];
      const targetPosition = `${newColumnLetter}${newRowIndex}` as BoardPosition;
      const targetTile = board.get(targetPosition);

      // Special rules for pawns
      if (pieceName === "pawn") {
        const moveType = move.moveType || "both";

        if (moveType === "move") {
          // Pawns can only move forward to empty squares
          if (targetTile?.piece) {
            // Can't move forward into any piece
            break; // Block further moves in this direction
          } else {
            // Empty square - can move there
            validMoves.push({ position: targetPosition });
          }
        } else if (moveType === "capture") {
          // Pawns can only capture diagonally if there's an enemy piece
          if (targetTile?.piece && targetTile.piece.color !== pieceColor) {
            // Enemy piece - can capture
            validMoves.push({ position: targetPosition });
          }
          // If no enemy piece or friendly piece, pawn can't move diagonally
          continue;
        }
      } else {
        // Normal piece movement rules
        // Check if there's a piece at the target position
        if (targetTile?.piece) {
          // Can't land on friendly pieces
          if (targetTile.piece.color === pieceColor) {
            // Knights can jump but still can't land on friendlies
            if (pieceName === "knight") {
              continue;
            }
            // For non-knights, block this entire direction
            break;
          } else {
            // Enemy piece - can capture
            validMoves.push({ position: targetPosition });
            // For non-knights, can't continue past enemy piece
            if (pieceName !== "knight") {
              break;
            }
          }
        } else {
          // Empty square - can move there
          validMoves.push({ position: targetPosition });
        }
      }

      // For pieces that need clear paths (non-knights), check intermediate squares
      if (pieceName !== "knight" && move.steps > 1) {
        // Check all squares between current position and target
        let blocked = false;
        for (let step = 1; step < move.steps; step++) {
          const intermediateRow = Number(rowNumber) + step * dirModifier.row;
          const intermediateCol = columnIndex + step * dirModifier.col;

          if (
            intermediateRow < 1 ||
            intermediateRow > 8 ||
            intermediateCol < 0 ||
            intermediateCol > 7
          ) {
            blocked = true;
            break;
          }

          const intermediateColumn = boardLetters[intermediateCol];
          const intermediatePosition = `${intermediateColumn}${intermediateRow}` as BoardPosition;
          const intermediateTile = board.get(intermediatePosition);

          if (intermediateTile?.piece) {
            // Path is blocked
            blocked = true;
            break;
          }
        }

        if (blocked) {
          // Remove this move and stop checking further moves in this direction
          validMoves.pop();
          break;
        }
      }
    }
  }

  return validMoves;
}

function createBoard(): Board {
  const tileMap = new Map() as Board;
  const piecesMap = new Map<BoardPosition, Omit<Piece, 'path'>>();

  // First, create all pieces without paths
  initialPieces.forEach((piece) => {
    const { name, initialPositions } = piece;
    initialPositions.forEach((position) =>
      piecesMap.set(position, {
        name,
        color: getPieceColor(position),
        hasMoved: false,
      })
    );
  });

  // Create the board with tiles and pieces (without paths)
  let tileColor: Color | null = null;
  for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
    tileColor = columnIndex % 2 ? (tileColor = "white") : "black";
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      const columnLetter = boardLetters[columnIndex];
      const rowNumber = String(rowIndex + 1);
      const position = `${columnLetter}${rowNumber}` as BoardPosition;
      const pieceData = piecesMap.get(position);

      tileMap.set(position, {
        piece: pieceData ? { ...pieceData, path: [] } as Piece : undefined,
        color: tileColor,
      });
      tileColor = tileColor === "black" ? "white" : "black";
    }
  }

  // Now calculate paths with the complete board
  for (const [position, tileData] of tileMap.entries()) {
    if (tileData.piece) {
      tileData.piece.path = getPiecePath(position, tileData.piece, tileMap);
    }
  }

  return tileMap;
}

interface BoardStoreState {
  board: BoardStore;
  movePiece: (from: BoardPosition, to: BoardPosition) => void;
}

export const useBoardStore = create<BoardStoreState>((set) => ({
  board: createBoard(),
  movePiece: (from: BoardPosition, to: BoardPosition) => {
    set((state) => {
      const newBoard = new Map(state.board) as BoardStore;
      const sourceTile = newBoard.get(from);
      const destTile = newBoard.get(to);

      if (sourceTile?.piece && destTile) {
        // Move piece to destination and mark it as having moved
        const movedPiece = { ...sourceTile.piece, hasMoved: true };
        newBoard.set(to, {
          ...destTile,
          piece: movedPiece
        });

        // Clear source tile
        newBoard.set(from, {
          ...sourceTile,
          piece: undefined
        });

        // Recalculate paths for all pieces after the move
        for (const [position, tileData] of newBoard.entries()) {
          if (tileData.piece) {
            tileData.piece.path = getPiecePath(position, tileData.piece, newBoard);
          }
        }
      }

      return { board: newBoard };
    });
  },
}));

type Player = {
  name: string;
  color: Color;
  moves: number;
};
type Players = [Player, Player];
type MetadataStore = {
  players: Players;
  turn: Color;
};

export const useMetadataStore = create<MetadataStore>(() => ({
  players: [
    {
      name: "",
      color: "black",
      moves: 0,
    },
    {
      name: "",
      color: "white",
      moves: 0,
    },
  ],
  turn: "white",
}));

// Store Abstractions

/**
 * useBoard
 * @returns
 */
export const useBoardMatrix = (): Matrix => {
  const { board } = useBoardStore();

  const entries: Array<MatrixColumn> = useMemo(() => {
    return Array.from(board.entries());
  }, [board]);

  const matrix = useMemo(() => {
    let columns: Matrix = [];
    let column: Array<MatrixColumn> = [];
    let currentLetter = "";

    entries.forEach((entry) => {
      const [[tileLetter]] = entry;
      if (tileLetter !== currentLetter) {
        if (column.length > 0) {
          columns.push([...column]);
        }
        currentLetter = tileLetter;
        column = [entry];
      } else {
        column.unshift(entry);
      }
    });

    if (column.length > 0) {
      columns.push([...column]);
    }

    return columns;
  }, [entries]);

  return matrix;
};
