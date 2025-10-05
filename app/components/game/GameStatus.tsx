import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { gameStore } from "~/stores/gameStore";
import { playerStore } from "~/stores/playerStore";
import { uiStore } from "~/stores/uiStore";

export default function GameStatus() {
  const currentTurn = gameStore((state) => state.currentTurn);
  const inCheck = gameStore((state) => state.inCheck);
  const players = playerStore((state) => state.players);
  const showNameInput = uiStore((state) => state.showNameInput);
  const currentPlayer = useMemo(
    () => players.find((p) => p.color === currentTurn),
    [players, currentTurn]
  );

  if (showNameInput) return null;

  return (
    <h2 className="font-bold text-black dark:text-white text-sm">
      {currentPlayer?.name}'s Turn
      <span
        className={twMerge(
          "ml-2",
          currentTurn === "black" ? "text-black" : "text-white"
        )}
      >
        ●
      </span>
      {inCheck && <span className="ml-2 text-red-600 font-bold">CHECK!</span>}
    </h2>
  );
}
