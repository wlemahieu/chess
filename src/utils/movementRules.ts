import type { Move, Piece, PieceName } from "../stores/types";

export const MOVEMENT_RULES: Map<PieceName, Move[]> = new Map([
  ["pawn", [
    { direction: "forward", steps: 1, moveType: "move" },
    { direction: "forward", steps: 2, moveType: "move", customRule: (piece: Piece) => !piece.hasMoved },
    { direction: "diagonal-forward-left", steps: 1, moveType: "capture" },
    { direction: "diagonal-forward-right", steps: 1, moveType: "capture" }
  ]],
  ["rook", [
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "forward", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "backward", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "left", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "right", steps: i + 1 } as Move))
  ]],
  ["knight", [
    { direction: "knight-forward-left", steps: 1 },
    { direction: "knight-forward-right", steps: 1 },
    { direction: "knight-backward-left", steps: 1 },
    { direction: "knight-backward-right", steps: 1 },
    { direction: "knight-left-forward", steps: 1 },
    { direction: "knight-left-backward", steps: 1 },
    { direction: "knight-right-forward", steps: 1 },
    { direction: "knight-right-backward", steps: 1 }
  ]],
  ["bishop", [
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-forward-left", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-forward-right", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-backward-left", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-backward-right", steps: i + 1 } as Move))
  ]],
  ["queen", [
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "forward", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "backward", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "left", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "right", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-forward-left", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-forward-right", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-backward-left", steps: i + 1 } as Move)),
    ...Array.from({ length: 7 }, (_, i) => ({ direction: "diagonal-backward-right", steps: i + 1 } as Move))
  ]],
  ["king", [
    { direction: "forward", steps: 1 },
    { direction: "backward", steps: 1 },
    { direction: "left", steps: 1 },
    { direction: "right", steps: 1 },
    { direction: "diagonal-forward-left", steps: 1 },
    { direction: "diagonal-forward-right", steps: 1 },
    { direction: "diagonal-backward-left", steps: 1 },
    { direction: "diagonal-backward-right", steps: 1 }
  ]]
]);