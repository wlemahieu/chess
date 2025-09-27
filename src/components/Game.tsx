import React from "react";
import { uiStore } from "../stores/uiStore";
import ChessBoard from "./board/ChessBoard";
import GameStatus from "./game/GameStatus";
import CapturedPieces from "./game/CapturedPieces";
import PlayerNameInput from "./modals/PlayerNameInput";
import GameEndModal from "./modals/GameEndModal";
import PawnPromotionModal from "./modals/PawnPromotionModal";
import OptionsModal from "./modals/OptionsModal";
import DraggingCursor from "./ui/DraggingCursor";
import OptionsButton from "./ui/OptionsButton";

function Game() {
  const showNameInput = uiStore(state => state.showNameInput);

  if (showNameInput) {
    return <PlayerNameInput />;
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <GameEndModal />
      <PawnPromotionModal />
      <OptionsModal />
      <DraggingCursor />

      <div className="flex-1 flex flex-col items-center justify-center">
        <GameStatus />
        <ChessBoard />
        <OptionsButton />
      </div>

      <CapturedPieces />
    </div>
  );
}

export default Game;