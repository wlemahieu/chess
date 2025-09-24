import { create } from "zustand";

type Store = {
  players: [Player, Player];
};

type Player = {
  name: string;
  color: "black" | "white";
  pieces: Array<Piece>;
};

type Piece = {
  name: "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
  index: number;
};

function createBoard() {}
function createPieces(name: Piece["name"], count = 1): Array<Piece> {
  return new Array(count).map((_, index) => ({
    name,
    index,
  }));
}
function createPlayerPieces(): Array<Piece> {
  return [
    ...createPieces("king"),
    ...createPieces("queen"),
    ...createPieces("rook", 2),
    ...createPieces("bishop", 2),
    ...createPieces("knight", 2),
    ...createPieces("pawn", 8),
  ];
}
export const useChessStore = create<Store>((set) => ({
  players: [
    {
      name: "",
      color: "black",
      pieces: createPlayerPieces(),
    },
    {
      name: "",
      color: "white",
      pieces: createPlayerPieces(),
    },
  ],
  turn: "white",
}));
