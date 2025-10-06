import { useState } from "react";
import { usePlayerStore } from "~/stores/playerStore";
import { useUIStore } from "~/stores/uiStore";
import { useOnlineGameStore } from "~/stores/onlineGameStore";
import OnlineWaitingRoom from "./OnlineWaitingRoom";

export default function PlayerNameInput() {
  const players = usePlayerStore((state) => state.players);
  const setPlayerName = usePlayerStore((state) => state.setPlayerName);
  const setShowNameInput = useUIStore((state) => state.setShowNameInput);
  const gameMode = useOnlineGameStore((state) => state.gameMode);
  const playerRole = useOnlineGameStore((state) => state.playerRole);
  const createOnlineGame = useOnlineGameStore((state) => state.createOnlineGame);
  const joinOnlineGame = useOnlineGameStore((state) => state.joinOnlineGame);
  const gameId = useOnlineGameStore((state) => state.gameId);

  const [playerName, setPlayerNameLocal] = useState("");
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [error, setError] = useState("");

  // Check if this is a guest joining via URL (has gameId but no playerRole yet)
  const isJoiningGame = gameMode === "online" && gameId !== null && playerRole === null;

  const handleStartLocalGame = () => {
    setShowNameInput(false);
  };

  const handleCreateOnlineGame = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsCreatingGame(true);
    setError("");

    try {
      await createOnlineGame(playerName.trim());
      setPlayerName("white", playerName.trim());
      setShowWaitingRoom(true);
    } catch (err) {
      setError("Failed to create game. Please try again.");
      console.error(err);
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleJoinOnlineGame = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!gameId) {
      setError("Invalid game link");
      return;
    }

    setIsCreatingGame(true);
    setError("");

    try {
      const joined = await joinOnlineGame(gameId, playerName.trim());
      if (joined) {
        setPlayerName("black", playerName.trim());
        setShowNameInput(false);
      } else {
        setError("Failed to join game. Game may be full or not available.");
      }
    } catch (err) {
      setError("Failed to join game. Please try again.");
      console.error(err);
    } finally {
      setIsCreatingGame(false);
    }
  };

  // Show waiting room if game is created and waiting for opponent
  if (showWaitingRoom) {
    return <OnlineWaitingRoom />;
  }

  // Local mode
  if (gameMode === "local") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 pt-16">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Who's playing?
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                White Player
              </label>
              <input
                type="text"
                defaultValue={players[0].name}
                onChange={(e) => setPlayerName("white", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Black Player
              </label>
              <input
                type="text"
                defaultValue={players[1].name}
                onChange={(e) => setPlayerName("black", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleStartLocalGame}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Online mode - Create or Join
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 pt-16">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {isJoiningGame ? "Join Online Game" : "Create Online Game"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isJoiningGame
            ? "Enter your name to join the game"
            : "Enter your name to create a new game"}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerNameLocal(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  isJoiningGame ? handleJoinOnlineGame() : handleCreateOnlineGame();
                }
              }}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={isJoiningGame ? handleJoinOnlineGame : handleCreateOnlineGame}
            disabled={isCreatingGame}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
          >
            {isCreatingGame
              ? "Please wait..."
              : isJoiningGame
              ? "Join Game"
              : "Create Game"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {isJoiningGame
              ? "💡 You'll be assigned the Black pieces and the game will start automatically"
              : "💡 You'll be assigned the White pieces and can share the game link with your friend"}
          </p>
        </div>
      </div>
    </div>
  );
}
