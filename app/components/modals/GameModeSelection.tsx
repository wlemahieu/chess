import { useState } from "react";
import { useOnlineGameStore } from "~/stores/onlineGameStore";
import { useUIStore } from "~/stores/uiStore";
import { getActiveGames } from "~/utils/gameHistory";
import MyGames from "./MyGames";

export default function GameModeSelection() {
  const setGameMode = useOnlineGameStore((state) => state.setGameMode);
  const setShowNameInput = useUIStore((state) => state.setShowNameInput);
  const setShowModeSelection = useUIStore((state) => state.setShowModeSelection);
  const [showMyGames, setShowMyGames] = useState(false);
  const activeGamesCount = getActiveGames().length;

  const handleLocalMode = () => {
    setGameMode("local");
    setShowModeSelection(false);
    setShowNameInput(true);
  };

  const handleOnlineMode = () => {
    setGameMode("online");
    setShowModeSelection(false);
    setShowNameInput(true);
  };

  const handleSelectGame = (gameId: string) => {
    // Navigate to the game URL
    if (typeof window !== "undefined") {
      window.location.href = `/?game=${gameId}`;
    }
  };

  return (
    <>
      {showMyGames && (
        <MyGames
          onClose={() => setShowMyGames(false)}
          onSelectGame={handleSelectGame}
        />
      )}
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 pt-16">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Choose Game Mode
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          Play chess locally or challenge a friend online
        </p>

        <div className="space-y-4">
          {/* Local Mode */}
          <button
            onClick={handleLocalMode}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">♟️</div>
                <div className="text-left">
                  <div className="font-bold text-lg">Local Game</div>
                  <div className="text-sm text-blue-100">
                    Play on the same device
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </button>

          {/* Online Mode */}
          <button
            onClick={handleOnlineMode}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🌐</div>
                <div className="text-left">
                  <div className="font-bold text-lg">Online Game</div>
                  <div className="text-sm text-green-100">
                    Play with a friend remotely
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </button>
        </div>

        {/* My Games Button */}
        {activeGamesCount > 0 && (
          <button
            onClick={() => setShowMyGames(true)}
            className="w-full mt-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2"
          >
            <span>📋</span>
            <span>My Games ({activeGamesCount})</span>
          </button>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 <strong>Online mode</strong> lets you create a game and share a
            link with your friend. They can join from any device!
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
