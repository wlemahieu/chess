import { create } from "zustand";
import type { Color, BoardPosition, Piece } from "./types";
import { isKingInCheck, isCheckmate, isStalemate } from "../utils/chessRules";

interface GameState {
  currentTurn: Color;
  inCheck: Color | null;
  checkmate: boolean;
  stalemate: boolean;
  lastMove: { from: BoardPosition; to: BoardPosition; piece: Piece } | null;
  capturedPieces: { white: Piece[]; black: Piece[] };
  promotionPosition: BoardPosition | null;

  switchTurn: () => void;
  updateGameStatus: (board: Map<BoardPosition, any>) => void;
  addCapturedPiece: (piece: Piece) => void;
  setPromotionPosition: (position: BoardPosition | null) => void;
  resetGame: () => void;
}

export const gameStore = create<GameState>((set, get) => ({
  currentTurn: "white",
  inCheck: null,
  checkmate: false,
  stalemate: false,
  lastMove: null,
  capturedPieces: { white: [], black: [] },
  promotionPosition: null,

  switchTurn: () =>
    set((state) => ({
      currentTurn: state.currentTurn === "white" ? "black" : "white",
    })),

  updateGameStatus: (board) => {
    const { currentTurn } = get();
    const nextTurn = currentTurn === "white" ? "black" : "white";
    const inCheck = isKingInCheck(board, nextTurn) ? nextTurn : null;
    const checkmate = inCheck ? isCheckmate(board, nextTurn) : false;
    const stalemate = !inCheck ? isStalemate(board, nextTurn) : false;

    set({ inCheck, checkmate, stalemate });
  },

  addCapturedPiece: (piece) =>
    set((state) => {
      const enemyColor = piece.color === "white" ? "black" : "white";
      return {
        capturedPieces: {
          ...state.capturedPieces,
          [enemyColor]: [...state.capturedPieces[enemyColor], piece],
        },
      };
    }),

  setPromotionPosition: (position) => set({ promotionPosition: position }),

  resetGame: () =>
    set({
      currentTurn: "white",
      inCheck: null,
      checkmate: false,
      stalemate: false,
      lastMove: null,
      capturedPieces: { white: [], black: [] },
      promotionPosition: null,
    }),
}));
