import { gameStore } from "../../stores/gameStore";
import { playerStore } from "../../stores/playerStore";

function GameEndModal() {
  const checkmate = gameStore((state) => state.checkmate);
  const stalemate = gameStore((state) => state.stalemate);
  const currentTurn = gameStore((state) => state.currentTurn);
  const players = playerStore((state) => state.players);

  if (!checkmate && !stalemate) return null;

  const winner = checkmate
    ? players.find((p) => p.color !== currentTurn)
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {checkmate ? (
          <>
            <h1 className="text-3xl font-bold mb-4">Checkmate!</h1>
            <h2 className="text-xl">{winner?.name} wins!</h2>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Stalemate!</h1>
            <h2 className="text-xl">The game is a draw</h2>
          </>
        )}
      </div>
    </div>
  );
}

export default GameEndModal;
