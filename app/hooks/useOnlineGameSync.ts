import { useEffect } from "react";
import { useOnlineGameStore, deserializeBoardState } from "~/stores/onlineGameStore";
import { useBoardStore } from "~/stores/boardStore";
import { useGameStore } from "~/stores/gameStore";
import { usePlayerStore } from "~/stores/playerStore";

/**
 * Hook to synchronize online game state with Firestore
 * Handles reconnection and real-time updates
 */
export function useOnlineGameSync() {
  const gameMode = useOnlineGameStore((state) => state.gameMode);
  const gameId = useOnlineGameStore((state) => state.gameId);
  const gameState = useOnlineGameStore((state) => state.gameState);
  const playerId = useOnlineGameStore((state) => state.playerId);
  const updatePlayerConnection = useOnlineGameStore((state) => state.updatePlayerConnection);
  const getPlayerIdFromStorage = useOnlineGameStore((state) => state.getPlayerIdFromStorage);
  const subscribeToGame = useOnlineGameStore((state) => state.subscribeToGame);

  // Initialize player ID from localStorage on mount
  useEffect(() => {
    if (gameMode === "online") {
      getPlayerIdFromStorage();
    }
  }, [gameMode, getPlayerIdFromStorage]);

  // Subscribe to game updates
  useEffect(() => {
    if (gameMode === "online" && gameId && !gameState) {
      subscribeToGame(gameId);
    }
  }, [gameMode, gameId, gameState, subscribeToGame]);

  // Update connection status when component mounts/unmounts
  useEffect(() => {
    if (gameMode === "online" && gameId && playerId) {
      updatePlayerConnection(true);

      return () => {
        updatePlayerConnection(false);
      };
    }
  }, [gameMode, gameId, playerId, updatePlayerConnection]);

  // Sync game state from Firestore to local stores
  useEffect(() => {
    if (gameMode === "online" && gameState) {
      // Update board state
      if (gameState.boardState) {
        try {
          const board = deserializeBoardState(gameState.boardState);
          useBoardStore.setState({ board });
          useBoardStore.getState().updateAllPaths();
        } catch (error) {
          console.error("Error deserializing board state:", error);
        }
      }

      // Update game store
      useGameStore.setState({
        currentTurn: gameState.currentTurn,
        inCheck: gameState.inCheck,
        checkmate: gameState.checkmate,
        stalemate: gameState.stalemate,
        capturedPieces: {
          white: gameState.capturedPieces.white.map(name => ({
            name,
            color: "white" as const,
            path: [],
          })),
          black: gameState.capturedPieces.black.map(name => ({
            name,
            color: "black" as const,
            path: [],
          })),
        },
      });

      // Update player names
      if (gameState.players.white) {
        usePlayerStore.getState().setPlayerName("white", gameState.players.white.name);
      }
      if (gameState.players.black) {
        usePlayerStore.getState().setPlayerName("black", gameState.players.black.name);
      }
    }
  }, [gameMode, gameState]);

  // Handle heartbeat to keep connection alive
  useEffect(() => {
    if (gameMode === "online" && gameId && playerId) {
      const heartbeatInterval = setInterval(() => {
        updatePlayerConnection(true);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(heartbeatInterval);
    }
  }, [gameMode, gameId, playerId, updatePlayerConnection]);

  // Handle reconnection when tab regains focus
  useEffect(() => {
    if (gameMode === "online" && gameId && playerId) {
      const handleFocus = () => {
        updatePlayerConnection(true);
      };

      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [gameMode, gameId, playerId, updatePlayerConnection]);

  // Handle page unload
  useEffect(() => {
    if (gameMode === "online" && gameId && playerId) {
      const handleBeforeUnload = () => {
        updatePlayerConnection(false);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [gameMode, gameId, playerId, updatePlayerConnection]);
}
