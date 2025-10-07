/**
 * Utilities for managing game history in localStorage
 */

export interface GameHistoryItem {
  gameId: string;
  playerColor: "white" | "black";
  opponentName?: string;
  createdAt: number;
  lastPlayedAt: number;
  status: "waiting" | "active" | "completed";
}

const GAME_HISTORY_KEY = "chess_game_history";

/**
 * Get all games from localStorage
 */
export function getGameHistory(): GameHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const history = localStorage.getItem(GAME_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading game history:", error);
    return [];
  }
}

/**
 * Add or update a game in history
 */
export function saveGameToHistory(game: GameHistoryItem): void {
  if (typeof window === "undefined") return;

  try {
    const history = getGameHistory();
    const existingIndex = history.findIndex((g) => g.gameId === game.gameId);

    if (existingIndex >= 0) {
      history[existingIndex] = {
        ...history[existingIndex],
        ...game,
        lastPlayedAt: Date.now(),
      };
    } else {
      history.unshift(game);
    }

    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving game to history:", error);
  }
}

/**
 * Remove a game from history
 */
export function removeGameFromHistory(gameId: string): void {
  if (typeof window === "undefined") return;

  try {
    const history = getGameHistory();
    const filtered = history.filter((g) => g.gameId !== gameId);
    localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing game from history:", error);
  }
}

/**
 * Get active (non-completed) games
 */
export function getActiveGames(): GameHistoryItem[] {
  return getGameHistory().filter(
    (game) => game.status === "waiting" || game.status === "active"
  );
}

/**
 * Get completed games
 */
export function getCompletedGames(): GameHistoryItem[] {
  return getGameHistory().filter((game) => game.status === "completed");
}

/**
 * Clear all game history
 */
export function clearGameHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GAME_HISTORY_KEY);
}
