import type { BoardPosition, TileData, Piece, Color } from "../stores/types";
import type { BoardSetupMode } from "../stores/uiStore";
import { BOARD_LETTERS, BOARD_NUMBERS } from "./constants";
import { getPiecePath } from "./pieceMovement";
import { createInitialBoard } from "./boardSetup";

type BoardStore = Map<BoardPosition, TileData>;

function createPiece(
  name: Piece["name"],
  color: Color,
  hasMoved: boolean = false
): Piece {
  return {
    name,
    color,
    hasMoved,
    path: [],
  };
}

function createEmptyBoard(): BoardStore {
  const board = new Map<BoardPosition, TileData>();

  BOARD_LETTERS.forEach((letter, colIndex) => {
    BOARD_NUMBERS.forEach((number) => {
      const position = `${letter}${number}` as BoardPosition;
      const isBlackTile = (colIndex + number) % 2 === 0;

      board.set(position, {
        color: isBlackTile ? "black" : "white",
        piece: undefined,
      });
    });
  });

  return board;
}

function setPiece(
  board: BoardStore,
  position: BoardPosition,
  piece: Piece | undefined
): void {
  const tile = board.get(position);
  if (tile) {
    board.set(position, { ...tile, piece });
  }
}

function createPawnPrePromotionSetup(): BoardStore {
  const board = createEmptyBoard();

  // White pieces
  setPiece(board, "e1", createPiece("king", "white", true));
  setPiece(board, "a1", createPiece("rook", "white"));
  setPiece(board, "h1", createPiece("rook", "white"));

  // White pawn one move from promotion - next to where black king will be
  setPiece(board, "d7", createPiece("pawn", "white", true));

  // Some other white pawns
  setPiece(board, "a2", createPiece("pawn", "white"));
  setPiece(board, "b2", createPiece("pawn", "white"));
  setPiece(board, "g2", createPiece("pawn", "white"));
  setPiece(board, "h2", createPiece("pawn", "white"));

  // Black king positioned next to where the pawn will promote
  setPiece(board, "e8", createPiece("king", "black", true));

  // Black pieces - positioned away from the promotion square
  setPiece(board, "a8", createPiece("rook", "black"));
  setPiece(board, "h8", createPiece("rook", "black"));
  setPiece(board, "b8", createPiece("knight", "black"));

  // Black pawns - keeping some protection around the king
  setPiece(board, "f7", createPiece("pawn", "black"));
  setPiece(board, "g7", createPiece("pawn", "black"));
  setPiece(board, "h7", createPiece("pawn", "black"));
  setPiece(board, "a7", createPiece("pawn", "black"));

  // Add some bishops
  setPiece(board, "c1", createPiece("bishop", "white"));
  setPiece(board, "f1", createPiece("bishop", "white"));
  setPiece(board, "c8", createPiece("bishop", "black"));

  return board;
}

function createEndgamePracticeSetup(): BoardStore {
  const board = createEmptyBoard();

  // Minimal endgame setup
  setPiece(board, "e1", createPiece("king", "white", true));
  setPiece(board, "d2", createPiece("queen", "white", true));
  setPiece(board, "a1", createPiece("rook", "white", true));

  setPiece(board, "e8", createPiece("king", "black", true));
  setPiece(board, "h8", createPiece("rook", "black", true));
  setPiece(board, "b7", createPiece("pawn", "black", true));
  setPiece(board, "c7", createPiece("pawn", "black", true));

  return board;
}

function createCheckPracticeSetup(): BoardStore {
  const board = createEmptyBoard();

  // Setup where white can easily check black
  setPiece(board, "e1", createPiece("king", "white", true));
  setPiece(board, "d1", createPiece("queen", "white"));
  setPiece(board, "a1", createPiece("rook", "white"));
  setPiece(board, "h1", createPiece("rook", "white"));
  setPiece(board, "c1", createPiece("bishop", "white"));
  setPiece(board, "f1", createPiece("bishop", "white"));

  // Black king in a vulnerable position
  setPiece(board, "e8", createPiece("king", "black", true));
  setPiece(board, "f7", createPiece("pawn", "black", true));
  setPiece(board, "g7", createPiece("pawn", "black"));
  setPiece(board, "h7", createPiece("pawn", "black"));
  setPiece(board, "a8", createPiece("rook", "black"));

  return board;
}

export function getBoardSetup(setupMode: BoardSetupMode): BoardStore {
  let board: BoardStore;

  switch (setupMode) {
    case "pawn-pre-promotion":
      board = createPawnPrePromotionSetup();
      break;
    case "endgame-practice":
      board = createEndgamePracticeSetup();
      break;
    case "check-practice":
      board = createCheckPracticeSetup();
      break;
    case "normal":
    default:
      board = createInitialBoard();
      break;
  }

  // Update all piece paths after setting up the board
  for (const [position, tileData] of board.entries()) {
    if (tileData.piece) {
      tileData.piece.path = getPiecePath(position, tileData.piece, board);
    }
  }

  return board;
}
