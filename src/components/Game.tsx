import { uiStore } from "../stores/uiStore";
import ChessBoard from "./board/ChessBoard";
import GameStatus from "./game/GameStatus";
import CapturedPieces from "./game/CapturedPieces";
import PlayerNameInput from "./modals/PlayerNameInput";
import GameEndModal from "./modals/GameEndModal";
import PawnPromotionModal from "./modals/PawnPromotionModal";
import OptionsModal from "./modals/OptionsModal";
import DraggingCursor from "./ui/DraggingCursor";
import TurnIndicator from "./ui/TurnIndicator";
import Navigation from "./ui/Navigation";
import ScreenSizeWarning from "./ui/ScreenSizeWarning";

function Game() {
  const showNameInput = uiStore((state) => state.showNameInput);

  return (
    <>
      <Navigation />
      {showNameInput ? (
        <PlayerNameInput />
      ) : (
        <ScreenSizeWarning>
          <div className="flex h-screen bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
            <GameEndModal />
            <PawnPromotionModal />
            <OptionsModal />
            <DraggingCursor />
            <TurnIndicator />

            <div className="flex-1 flex flex-col items-center justify-center pt-16">
              <GameStatus />
              <ChessBoard />
            </div>

            <CapturedPieces />
          </div>
        </ScreenSizeWarning>
      )}
    </>
  );
}

export default Game;
