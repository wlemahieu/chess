import { useGameStore } from "~/stores/gameStore";
import { usePlayerStore } from "~/stores/playerStore";
import Modal from "~/components/modals/Modal";

export default function GameEndModal() {
  const checkmate = useGameStore((state) => state.checkmate);
  const stalemate = useGameStore((state) => state.stalemate);
  const currentTurn = useGameStore((state) => state.currentTurn);
  const players = usePlayerStore((state) => state.players);

  const isOpen = checkmate || stalemate;
  const winner = checkmate
    ? players.find((p) => p.color !== currentTurn)
    : null;

  return (
    <Modal isOpen={isOpen} className="text-center">
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
    </Modal>
  );
}
