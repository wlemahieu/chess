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

  const setupWhitePieces = () => {
    setPiece(board, "e1", createPiece("king", "white", true));
    setPiece(board, "a1", createPiece("rook", "white"));
    setPiece(board, "h1", createPiece("rook", "white"));
    setPiece(board, "c1", createPiece("bishop", "white"));
    setPiece(board, "f1", createPiece("bishop", "white"));
  };

  const setupWhitePromotionPawn = () => {
    setPiece(board, "d7", createPiece("pawn", "white", true));
  };

  const setupWhitePawns = () => {
    setPiece(board, "a2", createPiece("pawn", "white"));
    setPiece(board, "b2", createPiece("pawn", "white"));
    setPiece(board, "g2", createPiece("pawn", "white"));
    setPiece(board, "h2", createPiece("pawn", "white"));
  };

  const setupBlackKingForPromotion = () => {
    setPiece(board, "e8", createPiece("king", "black", true));
  };

  const setupBlackPieces = () => {
    setPiece(board, "a8", createPiece("rook", "black"));
    setPiece(board, "h8", createPiece("rook", "black"));
    setPiece(board, "b8", createPiece("knight", "black"));
    setPiece(board, "c8", createPiece("bishop", "black"));
  };

  const setupBlackDefensivePawns = () => {
    setPiece(board, "f7", createPiece("pawn", "black"));
    setPiece(board, "g7", createPiece("pawn", "black"));
    setPiece(board, "h7", createPiece("pawn", "black"));
    setPiece(board, "a7", createPiece("pawn", "black"));
  };

  setupWhitePieces();
  setupWhitePromotionPawn();
  setupWhitePawns();
  setupBlackKingForPromotion();
  setupBlackPieces();
  setupBlackDefensivePawns();

  return board;
}

function createEndgamePracticeSetup(): BoardStore {
  const board = createEmptyBoard();

  const setupMinimalEndgamePieces = () => {
    setPiece(board, "e1", createPiece("king", "white", true));
    setPiece(board, "d2", createPiece("queen", "white", true));
    setPiece(board, "a1", createPiece("rook", "white", true));

    setPiece(board, "e8", createPiece("king", "black", true));
    setPiece(board, "h8", createPiece("rook", "black", true));
  };

  setupMinimalEndgamePieces();
  setPiece(board, "b7", createPiece("pawn", "black", true));
  setPiece(board, "c7", createPiece("pawn", "black", true));

  return board;
}

function createCheckPracticeSetup(): BoardStore {
  const board = createEmptyBoard();

  const setupWhiteAttackPieces = () => {
    setPiece(board, "e1", createPiece("king", "white", true));
    setPiece(board, "d1", createPiece("queen", "white"));
    setPiece(board, "a1", createPiece("rook", "white"));
    setPiece(board, "h1", createPiece("rook", "white"));
    setPiece(board, "c1", createPiece("bishop", "white"));
    setPiece(board, "f1", createPiece("bishop", "white"));
  };

  const setupVulnerableBlackKing = () => {
    setPiece(board, "e8", createPiece("king", "black", true));
    setPiece(board, "f7", createPiece("pawn", "black", true));
    setPiece(board, "g7", createPiece("pawn", "black"));
    setPiece(board, "h7", createPiece("pawn", "black"));
    setPiece(board, "a8", createPiece("rook", "black"));
  };

  setupWhiteAttackPieces();
  setupVulnerableBlackKing();

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

  for (const [position, tileData] of board.entries()) {
    if (tileData.piece) {
      tileData.piece.path = getPiecePath(position, tileData.piece, board);
    }
  }

  return board;
}
