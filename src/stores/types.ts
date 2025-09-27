export type Color = "black" | "white";
export type PieceName = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

export type BoardLetters = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type BoardNumbers = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type BoardPosition = `${BoardLetters}${BoardNumbers}`;

export type Path = Array<{ position: BoardPosition }>;

export interface Piece {
  name: PieceName;
  color: Color;
  path: Path;
  hasMoved?: boolean;
}

export interface TileData {
  color: Color;
  piece?: Piece;
  value?: number;
}

export type Tile = [BoardPosition, TileData];
export type MatrixColumn = Tile;
export type Matrix = Array<Array<MatrixColumn>>;

export type MoveType = "move" | "capture" | "both";

export interface Move {
  direction: string;
  steps: number;
  moveType?: MoveType;
  customRule?: (piece: Piece) => boolean;
}

export interface Player {
  name: string;
  color: Color;
  moves: number;
}

export type Players = [Player, Player];