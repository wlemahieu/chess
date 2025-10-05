import { playerStore } from "~/stores/playerStore";
import { uiStore } from "~/stores/uiStore";

export default function PlayerNameInput() {
  const players = playerStore((state) => state.players);
  const setPlayerName = playerStore((state) => state.setPlayerName);
  const setShowNameInput = uiStore((state) => state.setShowNameInput);

  const handleStartGame = () => {
    setShowNameInput(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 pt-16">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Enter Player Names</h2>
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
            onClick={handleStartGame}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
