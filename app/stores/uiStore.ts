import { create } from "zustand";
import type { BoardPosition } from "./types";

export type PieceDisplayMode = "text" | "regular";
export type BoardSetupMode =
  | "normal"
  | "pawn-pre-promotion"
  | "endgame-practice"
  | "check-practice";

interface UIState {
  hoveredTile: BoardPosition | null;
  selectedTile: BoardPosition | null;
  draggingPiece: { name: string; color: string } | null;
  showBoardPositions: boolean;
  showOptions: boolean;
  showNameInput: boolean;
  mousePosition: { x: number; y: number };
  pieceDisplayMode: PieceDisplayMode;
  boardSetupMode: BoardSetupMode;
  showTileHover: boolean;
  showMovePaths: boolean;

  setHoveredTile: (tile: BoardPosition | null) => void;
  setSelectedTile: (tile: BoardPosition | null) => void;
  setDraggingPiece: (piece: { name: string; color: string } | null) => void;
  toggleBoardPositions: () => void;
  setShowOptions: (show: boolean) => void;
  setShowNameInput: (show: boolean) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setPieceDisplayMode: (mode: PieceDisplayMode) => void;
  setBoardSetupMode: (mode: BoardSetupMode) => void;
  toggleTileHover: () => void;
  toggleMovePaths: () => void;
  clearSelection: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  hoveredTile: null,
  selectedTile: null,
  draggingPiece: null,
  showBoardPositions: false,
  showOptions: false,
  showNameInput: true,
  mousePosition: { x: 0, y: 0 },
  pieceDisplayMode: "regular",
  boardSetupMode: "normal",
  showTileHover: false,
  showMovePaths: false,

  setHoveredTile: (tile) => set({ hoveredTile: tile }),
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  setDraggingPiece: (piece) => set({ draggingPiece: piece }),
  toggleBoardPositions: () =>
    set((state) => ({ showBoardPositions: !state.showBoardPositions })),
  setShowOptions: (show) => set({ showOptions: show }),
  setShowNameInput: (show) => set({ showNameInput: show }),
  setMousePosition: (position) => set({ mousePosition: position }),
  setPieceDisplayMode: (mode) => set({ pieceDisplayMode: mode }),
  setBoardSetupMode: (mode) => set({ boardSetupMode: mode }),
  toggleTileHover: () =>
    set((state) => ({ showTileHover: !state.showTileHover })),
  toggleMovePaths: () =>
    set((state) => ({ showMovePaths: !state.showMovePaths })),
  clearSelection: () => set({ selectedTile: null, draggingPiece: null }),
}));
