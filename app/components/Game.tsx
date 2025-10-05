import { uiStore } from "~/stores/uiStore";
import ChessBoard from "~/components/board/ChessBoard";
import GameStatus from "~/components/game/GameStatus";
import CapturedPieces from "~/components/game/CapturedPieces";
import PlayerNameInput from "~/components/modals/PlayerNameInput";
import GameEndModal from "~/components/modals/GameEndModal";
import PawnPromotionModal from "~/components/modals/PawnPromotionModal";
import OptionsModal from "~/components/modals/OptionsModal";
import DraggingCursor from "~/components/ui/DraggingCursor";
import TurnIndicator from "~/components/ui/TurnIndicator";
import Navigation from "~/components/ui/Navigation";
import ScreenSizeWarning from "~/components/ui/ScreenSizeWarning";

export default function Game() {
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
