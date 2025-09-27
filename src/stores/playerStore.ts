import { create } from "zustand";
import type { Color, Players } from "./types";

interface PlayerState {
  players: Players;
  setPlayerName: (color: Color, name: string) => void;
  incrementPlayerMoves: (color: Color) => void;
  resetPlayers: () => void;
}

export const playerStore = create<PlayerState>((set) => ({
  players: [
    { name: "Player 1", color: "white", moves: 0 },
    { name: "Player 2", color: "black", moves: 0 },
  ],

  setPlayerName: (color, name) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.color === color ? { ...p, name } : p
      ) as Players,
    })),

  incrementPlayerMoves: (color) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.color === color ? { ...p, moves: p.moves + 1 } : p
      ) as Players,
    })),

  resetPlayers: () =>
    set({
      players: [
        { name: "Player 1", color: "white", moves: 0 },
        { name: "Player 2", color: "black", moves: 0 },
      ],
    }),
}));
