import { useMemo } from "react";
import { create } from "zustand";

type Color = "black" | "white";
export type PieceName =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";
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

export type TileData = { color: Color; piece?: Piece; value?: number };

type BoardLetters = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type BoardNumbers = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type BoardPosition = `${BoardLetters}${BoardNumbers}`;
type Board = Map<BoardPosition, TileData>;

type InitialPiece = {
  name: PieceName;
  initialPositions: Array<BoardPosition>;
};
type InitialPieces = Array<InitialPiece>;

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

  const movesByDirection: Record<string, typeof moves> = {};
  moves.forEach((move) => {
    if (!movesByDirection[move.direction]) {
      movesByDirection[move.direction] = [];
    }
    movesByDirection[move.direction].push(move);
  });

  for (const [_direction, dirMoves] of Object.entries(movesByDirection)) {
    const sortedMoves = dirMoves.sort((a, b) => a.steps - b.steps);

    for (const move of sortedMoves) {
      if (move.customRule && !move.customRule(piece)) {
        continue;
      }

      const dirModifier = getDirectionModifier(move.direction, pieceColor);
      const newRowIndex = Number(rowNumber) + move.steps * dirModifier.row;
      const newColIndex = columnIndex + move.steps * dirModifier.col;

      if (
        newRowIndex < 1 ||
        newRowIndex > 8 ||
        newColIndex < 0 ||
        newColIndex > 7
      ) {
        continue;
      }

      const newColumnLetter = boardLetters[newColIndex];
      const targetPosition =
        `${newColumnLetter}${newRowIndex}` as BoardPosition;
      const targetTile = board.get(targetPosition);

      if (pieceName === "pawn") {
        const moveType = move.moveType || "both";

        if (moveType === "move") {
          if (targetTile?.piece) {
            break;
          } else {
            validMoves.push({ position: targetPosition });
          }
        } else if (moveType === "capture") {
          if (targetTile?.piece && targetTile.piece.color !== pieceColor) {
            validMoves.push({ position: targetPosition });
          }
          continue;
        }
      } else {
        if (targetTile?.piece) {
          if (targetTile.piece.color === pieceColor) {
            if (pieceName === "knight") {
              continue;
            }
            break;
          } else {
            validMoves.push({ position: targetPosition });
            if (pieceName !== "knight") {
              break;
            }
          }
        } else {
          validMoves.push({ position: targetPosition });
        }
      }

      if (pieceName !== "knight" && move.steps > 1) {
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
          const intermediatePosition =
            `${intermediateColumn}${intermediateRow}` as BoardPosition;
          const intermediateTile = board.get(intermediatePosition);

          if (intermediateTile?.piece) {
            blocked = true;
            break;
          }
        }

        if (blocked) {
          validMoves.pop();
          break;
        }
      }
    }
  }

  return validMoves;
}

function findKing(board: BoardStore, color: Color): BoardPosition | null {
  for (const [position, tile] of board.entries()) {
    if (tile.piece?.name === "king" && tile.piece.color === color) {
      return position;
    }
  }
  return null;
}

function isPositionUnderAttack(
  board: BoardStore,
  position: BoardPosition,
  byColor: Color
): boolean {
  for (const [piecePos, tile] of board.entries()) {
    if (tile.piece && tile.piece.color === byColor) {
      const pieceMoves = getPiecePath(piecePos, tile.piece, board);
      if (pieceMoves.some((move) => move.position === position)) {
        return true;
      }
    }
  }
  return false;
}

function isKingInCheck(board: BoardStore, kingColor: Color): boolean {
  const kingPosition = findKing(board, kingColor);
  if (!kingPosition) return false;
  return isPositionUnderAttack(
    board,
    kingPosition,
    kingColor === "white" ? "black" : "white"
  );
}

function wouldMoveLeaveKingInCheck(
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

function getAllLegalMoves(
  board: BoardStore,
  color: Color
): Array<{ from: BoardPosition; to: BoardPosition }> {
  const legalMoves: Array<{ from: BoardPosition; to: BoardPosition }> = [];

  for (const [position, tile] of board.entries()) {
    if (tile.piece && tile.piece.color === color) {
      const pieceMoves = getPiecePath(position, tile.piece, board);
      for (const move of pieceMoves) {
        if (
          !wouldMoveLeaveKingInCheck(board, position, move.position, tile.piece)
        ) {
          legalMoves.push({ from: position, to: move.position });
        }
      }
    }
  }

  return legalMoves;
}

function isCheckmate(board: BoardStore, color: Color): boolean {
  if (!isKingInCheck(board, color)) return false;
  return getAllLegalMoves(board, color).length === 0;
}

function isStalemate(board: BoardStore, color: Color): boolean {
  if (isKingInCheck(board, color)) return false;
  return getAllLegalMoves(board, color).length === 0;
}

function createBoard(): Board {
  const tileMap = new Map() as Board;
  const piecesMap = new Map<BoardPosition, Omit<Piece, "path">>();

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

  let tileColor: Color | null = null;
  for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
    tileColor = columnIndex % 2 ? (tileColor = "white") : "black";
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      const columnLetter = boardLetters[columnIndex];
      const rowNumber = String(rowIndex + 1);
      const position = `${columnLetter}${rowNumber}` as BoardPosition;
      const pieceData = piecesMap.get(position);

      tileMap.set(position, {
        piece: pieceData ? ({ ...pieceData, path: [] } as Piece) : undefined,
        color: tileColor,
      });
      tileColor = tileColor === "black" ? "white" : "black";
    }
  }

  for (const [position, tileData] of tileMap.entries()) {
    if (tileData.piece) {
      tileData.piece.path = getPiecePath(position, tileData.piece, tileMap);
    }
  }

  return tileMap;
}

type BoardStore = Map<BoardPosition, TileData>;
type BoardStoreState = {
  board: BoardStore;
  currentTurn: Color;
  capturedPieces: { white: Piece[]; black: Piece[] };
  showBoardPositions: boolean;
  promotionPosition: BoardPosition | null;
  inCheck: Color | null;
  checkmate: boolean;
  stalemate: boolean;
  lastMove: { from: BoardPosition; to: BoardPosition; piece: Piece } | null;
  movePiece: (from: BoardPosition, to: BoardPosition) => void;
  toggleBoardPositions: () => void;
  promotePawn: (position: BoardPosition, promoteTo: PieceName) => void;
};

export const useBoardStore = create<BoardStoreState>((set) => ({
  board: createBoard(),
  currentTurn: "white",
  capturedPieces: { white: [], black: [] },
  showBoardPositions: true,
  promotionPosition: null,
  inCheck: null,
  checkmate: false,
  stalemate: false,
  lastMove: null,
  movePiece: (from: BoardPosition, to: BoardPosition) => {
    set((state) => {
      const newBoard = new Map(state.board) as BoardStore;
      const sourceTile = newBoard.get(from);
      const destTile = newBoard.get(to);

      if (
        sourceTile?.piece &&
        destTile &&
        sourceTile.piece.color === state.currentTurn
      ) {
        const movedPiece = { ...sourceTile.piece, hasMoved: true };

        const newCapturedPieces = { ...state.capturedPieces };
        if (destTile.piece) {
          const capturedPiece = destTile.piece;
          if (capturedPiece.color === "white") {
            newCapturedPieces.white = [
              ...newCapturedPieces.white,
              capturedPiece,
            ];
          } else {
            newCapturedPieces.black = [
              ...newCapturedPieces.black,
              capturedPiece,
            ];
          }
        }

        newBoard.set(to, {
          ...destTile,
          piece: movedPiece,
        });

        newBoard.set(from, {
          ...sourceTile,
          piece: undefined,
        });

        for (const [position, tileData] of newBoard.entries()) {
          if (tileData.piece) {
            tileData.piece.path = getPiecePath(
              position,
              tileData.piece,
              newBoard
            );
          }
        }

        if (wouldMoveLeaveKingInCheck(newBoard, from, to, movedPiece)) {
          return state;
        }

        const isPawnPromotion =
          movedPiece.name === "pawn" &&
          ((movedPiece.color === "white" && to.includes("8")) ||
            (movedPiece.color === "black" && to.includes("1")));

        if (isPawnPromotion) {
          return {
            board: newBoard,
            currentTurn: state.currentTurn,
            capturedPieces: newCapturedPieces,
            promotionPosition: to,
            inCheck: state.inCheck,
            checkmate: false,
            stalemate: false,
            lastMove: { from, to, piece: movedPiece },
          };
        }

        const nextTurn = state.currentTurn === "white" ? "black" : "white";
        const inCheck = isKingInCheck(newBoard, nextTurn) ? nextTurn : null;
        const checkmate = inCheck ? isCheckmate(newBoard, nextTurn) : false;
        const stalemate = !inCheck ? isStalemate(newBoard, nextTurn) : false;

        return {
          board: newBoard,
          currentTurn: nextTurn,
          capturedPieces: newCapturedPieces,
          promotionPosition: null,
          inCheck,
          checkmate,
          stalemate,
          lastMove: { from, to, piece: movedPiece },
        };
      }

      return state;
    });
  },
  toggleBoardPositions: () => {
    set((state) => ({ showBoardPositions: !state.showBoardPositions }));
  },
  promotePawn: (position: BoardPosition, promoteTo: PieceName) => {
    set((state) => {
      const newBoard = new Map(state.board) as BoardStore;
      const tile = newBoard.get(position);
      const pawn = tile?.piece;

      if (tile && pawn && pawn.name === "pawn") {
        const newPiece: Piece = {
          name: promoteTo,
          color: pawn.color,
          hasMoved: true,
          path: [],
        };

        newBoard.set(position, {
          ...tile,
          piece: newPiece,
        });

        for (const [pos, tileData] of newBoard.entries()) {
          if (tileData.piece) {
            tileData.piece.path = getPiecePath(pos, tileData.piece, newBoard);
          }
        }

        const nextTurn = state.currentTurn === "white" ? "black" : "white";
        const inCheck = isKingInCheck(newBoard, nextTurn) ? nextTurn : null;
        const checkmate = inCheck ? isCheckmate(newBoard, nextTurn) : false;
        const stalemate = !inCheck ? isStalemate(newBoard, nextTurn) : false;

        return {
          board: newBoard,
          currentTurn: nextTurn,
          capturedPieces: state.capturedPieces,
          promotionPosition: null,
          inCheck,
          checkmate,
          stalemate,
          lastMove: state.lastMove,
        };
      }

      return state;
    });
  },
}));

type Player = {
  name: string;
  color: Color;
  moves: number;
};
type Players = [Player, Player];
interface MetadataStore {
  players: Players;
  setPlayerName: (color: Color, name: string) => void;
}

export const useMetadataStore = create<MetadataStore>((set) => ({
  players: [
    {
      name: "Player 1",
      color: "white",
      moves: 0,
    },
    {
      name: "Player 2",
      color: "black",
      moves: 0,
    },
  ],
  setPlayerName: (color: Color, name: string) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.color === color ? { ...p, name } : p
      ) as Players,
    }));
  },
}));

// Store Abstractions
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
