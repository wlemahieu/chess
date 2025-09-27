import type { BoardPosition, TileData, Piece, Color } from "../stores/types";
import { BOARD_LETTERS, BOARD_NUMBERS } from "./constants";
import { getPiecePath } from "./pieceMovement";

type BoardStore = Map<BoardPosition, TileData>;

function createPiece(name: Piece["name"], color: Color): Piece {
  return {
    name,
    color,
    hasMoved: false,
    path: []
  };
}

export function createInitialBoard(): BoardStore {
  const board = new Map<BoardPosition, TileData>();

  BOARD_LETTERS.forEach((letter, colIndex) => {
    BOARD_NUMBERS.forEach((number) => {
      const position = `${letter}${number}` as BoardPosition;
      const isBlackTile = (colIndex + number) % 2 === 0;

      let piece: Piece | undefined = undefined;

      if (number === 1) {
        switch (letter) {
          case "a":
          case "h":
            piece = createPiece("rook", "white");
            break;
          case "b":
          case "g":
            piece = createPiece("knight", "white");
            break;
          case "c":
          case "f":
            piece = createPiece("bishop", "white");
            break;
          case "d":
            piece = createPiece("queen", "white");
            break;
          case "e":
            piece = createPiece("king", "white");
            break;
        }
      } else if (number === 2) {
        piece = createPiece("pawn", "white");
      } else if (number === 7) {
        piece = createPiece("pawn", "black");
      } else if (number === 8) {
        switch (letter) {
          case "a":
          case "h":
            piece = createPiece("rook", "black");
            break;
          case "b":
          case "g":
            piece = createPiece("knight", "black");
            break;
          case "c":
          case "f":
            piece = createPiece("bishop", "black");
            break;
          case "d":
            piece = createPiece("queen", "black");
            break;
          case "e":
            piece = createPiece("king", "black");
            break;
        }
      }

      board.set(position, {
        color: isBlackTile ? "black" : "white",
        piece
      });
    });
  });

  for (const [position, tileData] of board.entries()) {
    if (tileData.piece) {
      tileData.piece.path = getPiecePath(position, tileData.piece, board);
    }
  }

  return board;
}