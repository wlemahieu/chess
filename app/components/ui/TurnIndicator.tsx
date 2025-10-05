import { gameStore } from "~/stores/gameStore";

export default function TurnIndicator() {
  const currentTurn = gameStore((state) => state.currentTurn);

  return (
    <>
      <div
        className={`fixed left-4 md:left-8 top-24 md:top-32 transition-all duration-300 z-40 ${
          currentTurn === "black"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
        }`}
      >
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="bg-green-500 rounded-full p-2 md:p-3 shadow-lg">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-white"
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
          <div className="bg-gray-800 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md">
            <span className="font-bold text-sm md:text-lg">Black's Turn</span>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-4 md:left-8 bottom-24 md:bottom-32 transition-all duration-300 z-40 ${
          currentTurn === "white"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
        }`}
      >
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="bg-green-500 rounded-full p-2 md:p-3 shadow-lg">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-white"
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
          <div className="bg-white dark:bg-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md">
            <span className="font-bold text-sm md:text-lg text-gray-900">White's Turn</span>
          </div>
        </div>
      </div>
    </>
  );
}
