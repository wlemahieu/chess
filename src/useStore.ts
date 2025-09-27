import { useMemo } from "react";
import { create } from "zustand";

type Color = "black" | "white";
type PieceName = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
type Path = Array<{ position: BoardPosition }>;
type Piece = {
  name: PieceName;
  color: Color;
  path: Path;
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
type TileData = { color: Color; piece: Piece; value: number };
export type Tile = [BoardPosition, TileData];
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

const movement = new Map([
  [
    "pawn",
    [
      { direction: "forward", steps: 1 },
      {
        direction: "forward",
        steps: 2,
        customRule: (player: Player) => player.moves === 0,
      },
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
    default:
      return { row: 0, col: 0 };
  }
}

function getPiecePath(
  position: BoardPosition,
  pieceName: PieceName,
  player?: Player
): Path {
  const [columnLetter, rowNumber] = position;
  const moves = movement.get(pieceName);
  if (!moves) return [];

  const pieceColor = getPieceColor(position);
  const columnIndex = boardLetters.indexOf(columnLetter as BoardLetters);

  return moves
    .filter((move) => {
      return !player || !move.customRule || move.customRule(player);
    })
    .map((move) => {
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
        return null;
      }

      const newColumnLetter = boardLetters[newColIndex];
      const position = `${newColumnLetter}${newRowIndex}` as BoardPosition;
      return { position };
    })
    .filter(Boolean) as Path;
}

function createBoard(): Board {
  const tileMap = new Map();
  const piecesMap = new Map<BoardPosition, Piece>();
  initialPieces.forEach((piece) => {
    const { name, initialPositions } = piece;
    initialPositions.forEach((position) =>
      piecesMap.set(position, {
        name,
        color: getPieceColor(position),
        path: getPiecePath(position, piece.name),
      })
    );
  });

  let tileColor: Color | null = null;

  for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
    tileColor = columnIndex % 2 ? (tileColor = "white") : "black";
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      const columnLetter = boardLetters[columnIndex];
      const rowNumber = String(rowIndex + 1);
      const position = `${columnLetter}${rowNumber}` as BoardPosition;
      const piece = piecesMap.get(position);
      if (position === "A2") console.log("getPiecePath", { position, piece });

      tileMap.set(position, {
        piece,
        color: tileColor,
      });
      tileColor = tileColor === "black" ? "white" : "black";
    }
  }

  return tileMap;
}

export const useBoardStore = create<BoardStore>(createBoard);

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
  const board = useBoardStore();

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
