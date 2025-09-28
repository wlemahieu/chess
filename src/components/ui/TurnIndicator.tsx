import { gameStore } from "../../stores/gameStore";

function TurnIndicator() {
  const currentTurn = gameStore((state) => state.currentTurn);

  return (
    <>
      {/* Black's turn indicator - top left */}
      <div
        className={`fixed left-8 top-1/4 transform -translate-y-1/2 transition-all duration-300 ${
          currentTurn === "black" ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-green-500 rounded-full p-3 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md">
            <span className="font-bold text-lg">Black's Turn</span>
          </div>
        </div>
      </div>

      {/* White's turn indicator - bottom left */}
      <div
        className={`fixed left-8 bottom-1/4 transform translate-y-1/2 transition-all duration-300 ${
          currentTurn === "white" ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-green-500 rounded-full p-3 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-md">
            <span className="font-bold text-lg">White's Turn</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default TurnIndicator;