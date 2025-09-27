import { create } from "zustand";
import type { BoardPosition } from "./types";

interface UIState {
  hoveredTile: BoardPosition | null;
  selectedTile: BoardPosition | null;
  draggingPiece: { name: string; color: string } | null;
  showBoardPositions: boolean;
  showOptions: boolean;
  showNameInput: boolean;
  mousePosition: { x: number; y: number };

  setHoveredTile: (tile: BoardPosition | null) => void;
  setSelectedTile: (tile: BoardPosition | null) => void;
  setDraggingPiece: (piece: { name: string; color: string } | null) => void;
  toggleBoardPositions: () => void;
  setShowOptions: (show: boolean) => void;
  setShowNameInput: (show: boolean) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  clearSelection: () => void;
}

export const uiStore = create<UIState>((set) => ({
  hoveredTile: null,
  selectedTile: null,
  draggingPiece: null,
  showBoardPositions: true,
  showOptions: false,
  showNameInput: true,
  mousePosition: { x: 0, y: 0 },

  setHoveredTile: (tile) => set({ hoveredTile: tile }),
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  setDraggingPiece: (piece) => set({ draggingPiece: piece }),
  toggleBoardPositions: () => set(state => ({ showBoardPositions: !state.showBoardPositions })),
  setShowOptions: (show) => set({ showOptions: show }),
  setShowNameInput: (show) => set({ showNameInput: show }),
  setMousePosition: (position) => set({ mousePosition: position }),
  clearSelection: () => set({ selectedTile: null, draggingPiece: null })
}));