export type Color = "black" | "white";
export type PieceName = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

export type BoardLetters = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
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

export type GameMode = "local" | "online";
export type PlayerRole = "host" | "guest" | null;

export interface MoveHistory {
  from: BoardPosition;
  to: BoardPosition;
  piece: PieceName;
  color: Color;
  timestamp: number;
  capturedPiece?: PieceName;
  promotion?: PieceName;
}

export interface OnlinePlayer {
  id: string;
  name: string;
  color: Color;
  isConnected: boolean;
  lastSeen: number;
}

export interface OnlineGameState {
  gameId: string;
  status: "waiting" | "active" | "completed";
  mode: GameMode;
  players: {
    white: OnlinePlayer | null;
    black: OnlinePlayer | null;
  };
  currentTurn: Color;
  boardState: string; // Serialized board state
  moveHistory: MoveHistory[];
  capturedPieces: { white: PieceName[]; black: PieceName[] };
  inCheck: Color | null;
  checkmate: boolean;
  stalemate: boolean;
  createdAt: number;
  updatedAt: number;
  winner?: Color | "draw";
}