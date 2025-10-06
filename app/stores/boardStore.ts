import { create } from "zustand";
import type { BoardPosition, TileData, Piece, PieceName, MoveHistory } from "./types";
import { createInitialBoard } from "../utils/boardSetup";
import { getBoardSetup } from "../utils/boardSetupPresets";
import { getPiecePath } from "../utils/pieceMovement";
import {
  wouldMoveLeaveKingInCheck,
  isKingInCheck,
  isCheckmate,
} from "../utils/chessRules";
import { useGameStore } from "./gameStore";
import { usePlayerStore } from "./playerStore";
import { useOnlineGameStore } from "./onlineGameStore";
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

export const useBoardStore = create<BoardState>((set, get) => ({
  board: createInitialBoard(),

  movePiece: (from, to) => {
    const board = get().board;
    const sourceTile = board.get(from);
    const destTile = board.get(to);
    const currentTurn = useGameStore.getState().currentTurn;
    const onlineGameStore = useOnlineGameStore.getState();
    const isOnlineMode = onlineGameStore.gameMode === "online";

    if (!sourceTile?.piece || !destTile) return false;
    if (sourceTile.piece.color !== currentTurn) return false;

    // In online mode, validate player can make this move
    if (isOnlineMode) {
      const { gameState, playerId } = onlineGameStore;

      // Security: Validate against Firestore game state (source of truth)
      if (!gameState || !playerId) {
        console.error("Missing game state or player ID");
        return false;
      }

      // Check if this player is actually allowed to make moves for this color
      const isWhitePlayer = gameState.players.white?.id === playerId;
      const isBlackPlayer = gameState.players.black?.id === playerId;

      if (!isWhitePlayer && !isBlackPlayer) {
        console.error("Player not in this game");
        return false;
      }

      // Verify the player is moving their own pieces
      const playerActualColor = isWhitePlayer ? "white" : "black";
      if (sourceTile.piece.color !== playerActualColor) {
        console.error("Cannot move opponent's pieces");
        return false;
      }

      // Verify it's actually their turn (from Firestore)
      if (gameState.currentTurn !== playerActualColor) {
        console.error("Not your turn");
        return false;
      }
    }

    const newBoard = new Map(board) as BoardStore;
    const movedPiece = { ...sourceTile.piece, hasMoved: true };

    if (wouldMoveLeaveKingInCheck(newBoard, from, to, movedPiece)) {
      return false;
    }

    const capturedPiece = destTile.piece;

    if (capturedPiece) {
      useGameStore.getState().addCapturedPiece(capturedPiece);
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
    const isPromotion =
      movedPiece.name === "pawn" &&
      ((movedPiece.color === "white" && toRow === "8") ||
        (movedPiece.color === "black" && toRow === "1"));

    if (isPromotion) {
      useGameStore.getState().setPromotionPosition(to);
    }

    usePlayerStore.getState().incrementPlayerMoves(movedPiece.color);
    useGameStore.getState().updateGameStatus(newBoard);
    useGameStore.getState().switchTurn();

    // Sync with Firestore in online mode
    if (isOnlineMode) {
      const moveRecord: MoveHistory = {
        from,
        to,
        piece: movedPiece.name,
        color: movedPiece.color,
        timestamp: Date.now(),
        capturedPiece: capturedPiece?.name,
      };

      onlineGameStore.recordMove(moveRecord);
      onlineGameStore.updateBoardState(newBoard);
    }

    return true;
  },

  promotePawn: (position, promoteTo) => {
    const board = get().board;
    const tile = board.get(position);
    const pawn = tile?.piece;
    const onlineGameStore = useOnlineGameStore.getState();
    const isOnlineMode = onlineGameStore.gameMode === "online";

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

    useGameStore.getState().setPromotionPosition(null);

    const updatedBoard = get().board;
    const opponentColor = pawn.color === "white" ? "black" : "white";

    if (isKingInCheck(updatedBoard, opponentColor)) {
      const checkmate = isCheckmate(updatedBoard, opponentColor);
      useGameStore.setState({
        inCheck: opponentColor,
        checkmate,
        stalemate: false,
      });
    }

    // Sync promotion with Firestore in online mode
    if (isOnlineMode) {
      onlineGameStore.updateBoardState(newBoard);
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

    useGameStore.getState().resetGame();
    usePlayerStore.getState().resetPlayers();
  },
}));
