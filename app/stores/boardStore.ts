import { create } from "zustand";
import type { BoardPosition, TileData, Piece, PieceName } from "./types";
import { createInitialBoard } from "../utils/boardSetup";
import { getBoardSetup } from "../utils/boardSetupPresets";
import { getPiecePath } from "../utils/pieceMovement";
import {
  wouldMoveLeaveKingInCheck,
  isKingInCheck,
  isCheckmate,
} from "../utils/chessRules";
import { gameStore } from "./gameStore";
import { playerStore } from "./playerStore";
import type { BoardSetupMode } from "./uiStore";

type BoardStore = Map<BoardPosition, TileData>;

interface BoardState {
  board: BoardStore;

  movePiece: (from: BoardPosition, to: BoardPosition) => boolean;
  promotePawn: (position: BoardPosition, promoteTo: PieceName) => void;
  updateAllPaths: () => void;
  getPieceAt: (position: BoardPosition) => Piece | undefined;
  getTileAt: (position: BoardPosition) => TileData | undefined;
  resetBoard: () => void;
  loadSetup: (setupMode: BoardSetupMode) => void;
}

export const boardStore = create<BoardState>((set, get) => ({
  board: createInitialBoard(),

  movePiece: (from, to) => {
    const board = get().board;
    const sourceTile = board.get(from);
    const destTile = board.get(to);
    const currentTurn = gameStore.getState().currentTurn;

    if (!sourceTile?.piece || !destTile) return false;
    if (sourceTile.piece.color !== currentTurn) return false;

    const newBoard = new Map(board) as BoardStore;
    const movedPiece = { ...sourceTile.piece, hasMoved: true };

    if (wouldMoveLeaveKingInCheck(newBoard, from, to, movedPiece)) {
      return false;
    }

    if (destTile.piece) {
      gameStore.getState().addCapturedPiece(destTile.piece);
    }

    newBoard.set(to, {
      ...destTile,
      piece: movedPiece,
    });

    newBoard.set(from, {
      ...sourceTile,
      piece: undefined,
    });

    set({ board: newBoard });
    get().updateAllPaths();

    const [, toRow] = to;
    if (
      movedPiece.name === "pawn" &&
      ((movedPiece.color === "white" && toRow === "8") ||
        (movedPiece.color === "black" && toRow === "1"))
    ) {
      gameStore.getState().setPromotionPosition(to);
    }

    playerStore.getState().incrementPlayerMoves(movedPiece.color);
    gameStore.getState().updateGameStatus(newBoard);
    gameStore.getState().switchTurn();

    return true;
  },

  promotePawn: (position, promoteTo) => {
    const board = get().board;
    const tile = board.get(position);
    const pawn = tile?.piece;

    if (!tile || !pawn || pawn.name !== "pawn") return;

    const newBoard = new Map(board) as BoardStore;
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

    set({ board: newBoard });
    get().updateAllPaths();

    gameStore.getState().setPromotionPosition(null);

    const updatedBoard = get().board;
    const opponentColor = pawn.color === "white" ? "black" : "white";

    if (isKingInCheck(updatedBoard, opponentColor)) {
      const checkmate = isCheckmate(updatedBoard, opponentColor);
      gameStore.setState({
        inCheck: opponentColor,
        checkmate,
        stalemate: false,
      });
    }
  },

  updateAllPaths: () => {
    const board = get().board;
    const newBoard = new Map(board) as BoardStore;

    for (const [position, tileData] of newBoard.entries()) {
      if (tileData.piece) {
        tileData.piece.path = getPiecePath(position, tileData.piece, newBoard);
      }
    }

    set({ board: newBoard });
  },

  getPieceAt: (position) => {
    return get().board.get(position)?.piece;
  },

  getTileAt: (position) => {
    return get().board.get(position);
  },

  resetBoard: () => {
    set({ board: createInitialBoard() });
  },

  loadSetup: (setupMode) => {
    const newBoard = getBoardSetup(setupMode);
    set({ board: newBoard });

    gameStore.getState().resetGame();
    playerStore.getState().resetPlayers();
  },
}));
