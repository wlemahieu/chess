import { useState, useEffect } from "react";
import { getActiveGames, getCompletedGames, type GameHistoryItem } from "~/utils/gameHistory";

interface MyGamesProps {
  onClose: () => void;
  onSelectGame: (gameId: string) => void;
}

export default function MyGames({ onClose, onSelectGame }: MyGamesProps) {
  const [activeGames, setActiveGames] = useState<GameHistoryItem[]>([]);
  const [completedGames, setCompletedGames] = useState<GameHistoryItem[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    setActiveGames(getActiveGames());
    setCompletedGames(getCompletedGames());
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleGameClick = (gameId: string) => {
    onSelectGame(gameId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Games
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowCompleted(false)}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              !showCompleted
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Active ({activeGames.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              showCompleted
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Completed ({completedGames.length})
          </button>
        </div>

        {/* Games List */}
        <div className="flex-1 overflow-y-auto p-4">
          {(showCompleted ? completedGames : activeGames).length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">
                {showCompleted
                  ? "No completed games yet"
                  : "No active games"}
              </p>
              <p className="text-sm">
                {!showCompleted && "Start a new game to see it here!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(showCompleted ? completedGames : activeGames).map((game) => (
                <div
                  key={game.gameId}
                  onClick={() => handleGameClick(game.gameId)}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {game.playerColor === "white" ? "♔" : "♚"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Playing as {game.playerColor === "white" ? "White" : "Black"}
                        </div>
                        {game.opponentName && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            vs {game.opponentName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          game.status === "waiting"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : game.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {game.status === "waiting"
                          ? "Waiting"
                          : game.status === "active"
                          ? "In Progress"
                          : "Completed"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Game ID: {game.gameId.slice(0, 8)}...</span>
                    <span>Last played {formatDate(game.lastPlayedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 Click on a game to resume playing
          </p>
        </div>
      </div>
    </div>
  );
}
