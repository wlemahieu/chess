import { useMemo } from "react";
import { gameStore } from "~/stores/gameStore";
import { playerStore } from "~/stores/playerStore";

export default function GameStatus() {
  const currentTurn = gameStore((state) => state.currentTurn);
  const inCheck = gameStore((state) => state.inCheck);
  const players = playerStore((state) => state.players);

  const currentPlayer = useMemo(
    () => players.find((p) => p.color === currentTurn),
    [players, currentTurn]
  );

  return (
    <div className="mb-4 bg-white px-6 py-3 rounded-lg shadow">
      <h2 className="text-2xl font-bold">
        {currentPlayer?.name}'s Turn
        <span className="ml-2 text-lg">
          ({currentTurn === "black" ? "●" : "○"})
        </span>
        {inCheck && <span className="ml-2 text-red-600 font-bold">CHECK!</span>}
      </h2>
    </div>
  );
}
