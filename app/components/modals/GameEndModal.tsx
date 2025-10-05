import { gameStore } from "~/stores/gameStore";
import { playerStore } from "~/stores/playerStore";
import Modal from "~/components/modals/Modal";

export default function GameEndModal() {
  const checkmate = gameStore((state) => state.checkmate);
  const stalemate = gameStore((state) => state.stalemate);
  const currentTurn = gameStore((state) => state.currentTurn);
  const players = playerStore((state) => state.players);

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
