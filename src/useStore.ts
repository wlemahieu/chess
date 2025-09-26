import { useMemo } from "react";
import { create } from "zustand";

type Color = "black" | "white";
type Player = {
  name: string;
  color: Color;
};
type Players = [Player, Player];
type PieceName = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
type Piece = {
  name: PieceName;
  color: Color;
};
type BoardLetters = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type BoardNumbers = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type BoardPosition = `${BoardLetters}${BoardNumbers}`;
type Board = Map<BoardPosition, null | Piece>;
type Pieces = Array<{
  name: PieceName;
  initialPositions: Array<BoardPosition>;
}>;
type BoardStore = Map<BoardPosition, null | Piece>;
type MetadataStore = {
  players: Players;
  turn: Color;
};

type MatrixColumn = [BoardPosition, Piece | null];

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
    initialPositions: ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2"],
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
export const useBoard = () => {
  const board = useBoardStore();

  const entries: Array<MatrixColumn> = useMemo(() => {
    return Array.from(board.entries());
  }, [board]);

  const matrix = useMemo(() => {
    let columns: Array<Array<MatrixColumn>> = [];
    let column: Array<MatrixColumn> = [];
    let currentLetter = "";

    entries.forEach((entry) => {
      const [key] = entry;
      const tileLetter = key[0];
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
