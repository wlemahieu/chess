import { useMemo } from "react";
import { create } from "zustand";

type Color = "black" | "white";

type PieceName = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
type Piece = {
  name: PieceName;
  color: Color;
};
type BoardLetters = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type BoardNumbers = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type BoardPosition = `${BoardLetters}${BoardNumbers}`;
type Board = Map<BoardPosition, TileData>;
type Pieces = Array<{
  name: PieceName;
  initialPositions: Array<BoardPosition>;
}>;
type BoardStore = Map<BoardPosition, TileData>;

type TileData = { color: Color; piece: Piece };
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

const pieces: Pieces = [
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
    initialPositions: ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7"],
  },
];

function getPieceColorByPosition(position: BoardPosition): Color {
  return position.includes(`7`) || position.includes(`8`) ? "black" : "white";
}

function createBoard(): Board {
  const tileMap = new Map();
  const piecesMap = new Map<BoardPosition, Piece>();
  pieces.forEach(({ name, initialPositions }) => {
    initialPositions.forEach((position) =>
      piecesMap.set(position, {
        name,
        color: getPieceColorByPosition(position),
      })
    );
  });

  let tileColor: Color | null = null;

  new Array(8).fill(null).forEach((_, columnIndex) => {
    tileColor = columnIndex % 2 ? (tileColor = "white") : "black";
    new Array(8).fill(null).forEach((_, rowIndex) => {
      const columnLetter = boardLetters[columnIndex];
      const rowNumber = String(rowIndex + 1);
      const position = `${columnLetter}${rowNumber}` as BoardPosition;
      const piece = piecesMap.get(position);
      tileMap.set(position, {
        piece,
        color: tileColor,
      });
      tileColor = tileColor === "black" ? "white" : "black";
    });
  });

  return tileMap;
}

export const useBoardStore = create<BoardStore>(createBoard);

type Player = {
  name: string;
  color: Color;
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
    },
    {
      name: "",
      color: "white",
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
