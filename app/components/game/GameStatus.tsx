import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useGameStore } from "~/stores/gameStore";
import { usePlayerStore } from "~/stores/playerStore";
import { useUIStore } from "~/stores/uiStore";

export default function GameStatus() {
  const currentTurn = useGameStore((state) => state.currentTurn);
  const inCheck = useGameStore((state) => state.inCheck);
  const players = usePlayerStore((state) => state.players);
  const showNameInput = useUIStore((state) => state.showNameInput);
  const showModeSelection = useUIStore((state) => state.showModeSelection);
  const currentPlayer = useMemo(
    () => players.find((p) => p.color === currentTurn),
    [players, currentTurn]
  );

  if (showNameInput || showModeSelection) return null;

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
