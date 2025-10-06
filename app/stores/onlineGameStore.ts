import { create } from "zustand";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  addDoc,
  type Unsubscribe
} from "firebase/firestore";
import { db } from "~/firebase.client";
import { saveGameToHistory } from "~/utils/gameHistory";
import type {
  GameMode,
  PlayerRole,
  OnlineGameState,
  Color,
  MoveHistory,
  BoardPosition,
  TileData,
  PieceName
} from "./types";

interface OnlineGameStore {
  // State
  gameMode: GameMode;
  gameId: string | null;
  playerId: string | null;
  playerRole: PlayerRole;
  playerColor: Color | null;
  isConnected: boolean;
  gameState: OnlineGameState | null;
  unsubscribe: Unsubscribe | null;

  // Actions
  setGameMode: (mode: GameMode) => void;
  createOnlineGame: (playerName: string) => Promise<string>;
  joinOnlineGame: (gameId: string, playerName: string) => Promise<boolean>;
  updatePlayerConnection: (isConnected: boolean) => Promise<void>;
  recordMove: (move: MoveHistory) => Promise<void>;
  updateBoardState: (board: Map<BoardPosition, TileData>) => Promise<void>;
  endGame: (winner: Color | "draw") => Promise<void>;
  subscribeToGame: (gameId: string) => void;
  unsubscribeFromGame: () => void;
  resetOnlineGame: () => void;
  getPlayerIdFromStorage: () => string;
}

// Helper to generate or retrieve player ID from localStorage
function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "";

  let playerId = localStorage.getItem("chess_player_id");
  if (!playerId) {
    playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chess_player_id", playerId);
  }
  return playerId;
}

// Helper to serialize board state
function serializeBoardState(board: Map<BoardPosition, TileData>): string {
  const boardArray = Array.from(board.entries());
  return JSON.stringify(boardArray);
}

// Helper to deserialize board state
export function deserializeBoardState(boardState: string): Map<BoardPosition, TileData> {
  const boardArray = JSON.parse(boardState);
  return new Map(boardArray);
}

export const useOnlineGameStore = create<OnlineGameStore>((set, get) => ({
  // Initial state
  gameMode: "local",
  gameId: null,
  playerId: null,
  playerRole: null,
  playerColor: null,
  isConnected: false,
  gameState: null,
  unsubscribe: null,

  setGameMode: (mode) => set({ gameMode: mode }),

  getPlayerIdFromStorage: () => {
    const playerId = getOrCreatePlayerId();
    set({ playerId });
    return playerId;
  },

  createOnlineGame: async (playerName: string) => {
    const playerId = getOrCreatePlayerId();

    console.log("Creating online game for player:", playerName, "with ID:", playerId);

    const initialGameState: Omit<OnlineGameState, "gameId"> = {
      status: "waiting",
      mode: "online",
      players: {
        white: {
          id: playerId,
          name: playerName,
          color: "white",
          isConnected: true,
          lastSeen: Date.now(),
        },
        black: null,
      },
      currentTurn: "white",
      boardState: "", // Will be set when board initializes
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      inCheck: null,
      checkmate: false,
      stalemate: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      // Let Firestore generate the document ID
      console.log("Adding document to Firestore...");
      const docRef = await addDoc(collection(db, "games"), initialGameState);
      const gameId = docRef.id;
      console.log("Game created with ID:", gameId);

      // Update the document with its own ID
      await updateDoc(docRef, { gameId });
      console.log("Game ID updated in document");

      const fullGameState: OnlineGameState = {
        ...initialGameState,
        gameId,
      };

      set({
        gameId,
        playerId,
        playerRole: "host",
        playerColor: "white",
        isConnected: true,
        gameState: fullGameState,
      });

      // Subscribe to game updates
      get().subscribeToGame(gameId);

      // Save to game history
      saveGameToHistory({
        gameId,
        playerColor: "white",
        createdAt: Date.now(),
        lastPlayedAt: Date.now(),
        status: "waiting",
      });

      return gameId;
    } catch (error) {
      console.error("Error creating online game:", error);
      throw error;
    }
  },

  joinOnlineGame: async (gameId: string, playerName: string) => {
    const playerId = getOrCreatePlayerId();

    console.log("Attempting to join game:", gameId, "as player:", playerName, "with ID:", playerId);

    try {
      const gameDoc = await getDoc(doc(db, "games", gameId));

      if (!gameDoc.exists()) {
        console.error("Game not found:", gameId);
        return false;
      }

      const gameData = gameDoc.data() as OnlineGameState;
      console.log("Found game data:", gameData);

      // Check if game is waiting for a player
      if (gameData.status !== "waiting") {
        console.error("Game is not waiting for players, status:", gameData.status);
        return false;
      }

      if (gameData.players.black !== null) {
        console.error("Game is already full");
        return false;
      }

      // Join as black player
      const updatedGameState: Partial<OnlineGameState> = {
        status: "active",
        players: {
          ...gameData.players,
          black: {
            id: playerId,
            name: playerName,
            color: "black",
            isConnected: true,
            lastSeen: Date.now(),
          },
        },
        updatedAt: Date.now(),
      };

      console.log("Updating game with player 2...");
      await updateDoc(doc(db, "games", gameId), updatedGameState);
      console.log("Successfully joined game");

      set({
        gameId,
        playerId,
        playerRole: "guest",
        playerColor: "black",
        isConnected: true,
      });

      // Subscribe to game updates
      get().subscribeToGame(gameId);

      // Save to game history
      saveGameToHistory({
        gameId,
        playerColor: "black",
        opponentName: gameData.players.white?.name,
        createdAt: gameData.createdAt,
        lastPlayedAt: Date.now(),
        status: "active",
      });

      return true;
    } catch (error) {
      console.error("Error joining online game:", error);
      return false;
    }
  },

  updatePlayerConnection: async (isConnected: boolean) => {
    const { gameId, playerId, gameState } = get();
    if (!gameId || !playerId || !gameState) return;

    // Security: Validate player identity against Firestore
    const isWhitePlayer = gameState.players.white?.id === playerId;
    const isBlackPlayer = gameState.players.black?.id === playerId;

    if (!isWhitePlayer && !isBlackPlayer) {
      console.error("Cannot update connection: player not in game");
      return;
    }

    const playerColor = isWhitePlayer ? "white" : "black";

    try {
      await updateDoc(doc(db, "games", gameId), {
        [`players.${playerColor}.isConnected`]: isConnected,
        [`players.${playerColor}.lastSeen`]: Date.now(),
        updatedAt: Date.now(),
      });

      set({ isConnected });
    } catch (error) {
      console.error("Error updating player connection:", error);
    }
  },

  recordMove: async (move: MoveHistory) => {
    const { gameId, gameState, playerId } = get();
    if (!gameId || !gameState || !playerId) return;

    // Security: Re-validate player identity (defense in depth)
    const isWhitePlayer = gameState.players.white?.id === playerId;
    const isBlackPlayer = gameState.players.black?.id === playerId;

    if (!isWhitePlayer && !isBlackPlayer) {
      console.error("Cannot record move: player not in game");
      return;
    }

    const playerColor = isWhitePlayer ? "white" : "black";

    // Verify the move is for this player's color
    if (move.color !== playerColor) {
      console.error("Cannot record move: color mismatch");
      return;
    }

    // Verify it's this player's turn
    if (gameState.currentTurn !== playerColor) {
      console.error("Cannot record move: not player's turn");
      return;
    }

    // Remove undefined fields from the move object
    const cleanMove: MoveHistory = {
      from: move.from,
      to: move.to,
      piece: move.piece,
      color: move.color,
      timestamp: move.timestamp,
    };

    // Only add optional fields if they exist
    if (move.capturedPiece) {
      cleanMove.capturedPiece = move.capturedPiece;
    }
    if (move.promotion) {
      cleanMove.promotion = move.promotion;
    }

    try {
      await updateDoc(doc(db, "games", gameId), {
        moveHistory: [...gameState.moveHistory, cleanMove],
        currentTurn: move.color === "white" ? "black" : "white",
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error recording move:", error);
    }
  },

  updateBoardState: async (board: Map<BoardPosition, TileData>) => {
    const { gameId, playerId, gameState } = get();
    if (!gameId || !playerId || !gameState) return;

    // Security: Validate player is in the game
    const isWhitePlayer = gameState.players.white?.id === playerId;
    const isBlackPlayer = gameState.players.black?.id === playerId;

    if (!isWhitePlayer && !isBlackPlayer) {
      console.error("Cannot update board state: player not in game");
      return;
    }

    const boardState = serializeBoardState(board);

    try {
      await updateDoc(doc(db, "games", gameId), {
        boardState,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error updating board state:", error);
    }
  },

  endGame: async (winner: Color | "draw") => {
    const { gameId, playerId, gameState } = get();
    if (!gameId || !playerId || !gameState) return;

    // Security: Validate player is in the game
    const isWhitePlayer = gameState.players.white?.id === playerId;
    const isBlackPlayer = gameState.players.black?.id === playerId;

    if (!isWhitePlayer && !isBlackPlayer) {
      console.error("Cannot end game: player not in game");
      return;
    }

    try {
      await updateDoc(doc(db, "games", gameId), {
        status: "completed",
        winner,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error ending game:", error);
    }
  },

  subscribeToGame: (gameId: string) => {
    const unsubscribe = onSnapshot(doc(db, "games", gameId), (snapshot) => {
      if (snapshot.exists()) {
        const gameState = snapshot.data() as OnlineGameState;
        set({ gameState });
      }
    });

    set({ unsubscribe });
  },

  unsubscribeFromGame: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  resetOnlineGame: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }

    set({
      gameMode: "local",
      gameId: null,
      playerRole: null,
      playerColor: null,
      isConnected: false,
      gameState: null,
      unsubscribe: null,
    });
  },
}));
