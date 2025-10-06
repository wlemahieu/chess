import { useEffect, useState } from "react";
import { useUIStore } from "~/stores/uiStore";
import { useOnlineGameStore } from "~/stores/onlineGameStore";
import { useOnlineGameSync } from "~/hooks/useOnlineGameSync";
import ChessBoard from "~/components/board/ChessBoard";
import GameStatus from "~/components/game/GameStatus";
import CapturedPieces from "~/components/game/CapturedPieces";
import PlayerNameInput from "~/components/modals/PlayerNameInput";
import GameModeSelection from "~/components/modals/GameModeSelection";
import GameEndModal from "~/components/modals/GameEndModal";
import PawnPromotionModal from "~/components/modals/PawnPromotionModal";
import OptionsModal from "~/components/modals/OptionsModal";
import DraggingCursor from "~/components/ui/DraggingCursor";
import TurnIndicator from "~/components/ui/TurnIndicator";
import Navigation from "~/components/ui/Navigation";
import ScreenSizeWarning from "~/components/ui/ScreenSizeWarning";

export default function Game() {
  const showNameInput = useUIStore((state) => state.showNameInput);
  const showModeSelection = useUIStore((state) => state.showModeSelection);
  const setShowModeSelection = useUIStore((state) => state.setShowModeSelection);
  const setShowNameInput = useUIStore((state) => state.setShowNameInput);
  const setGameMode = useOnlineGameStore((state) => state.setGameMode);

  // Sync online game state with Firestore
  useOnlineGameSync();

  useEffect(() => {
    // Check for game ID in URL parameters
    const checkGameLink = async () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const gameParam = params.get("game");

        console.log("Game component mounted, checking URL params...");
        console.log("Game param from URL:", gameParam);

        if (gameParam) {
          // User has a game ID in the URL
          console.log("Found game ID in URL:", gameParam);
          setGameMode("online");
          setShowModeSelection(false);

          // Check if this player is already in this game (reconnection)
          const playerId = localStorage.getItem("chess_player_id");
          console.log("Current player ID from localStorage:", playerId);

          if (playerId) {
            // Try to fetch the game to see if this player is already in it
            const { getDoc, doc } = await import("firebase/firestore");
            const { db } = await import("~/firebase.client");

            try {
              const gameDoc = await getDoc(doc(db, "games", gameParam));

              if (gameDoc.exists()) {
                const gameData = gameDoc.data();
                console.log("Game data:", gameData);

                // Check if this player is already in the game
                const isWhitePlayer = gameData.players?.white?.id === playerId;
                const isBlackPlayer = gameData.players?.black?.id === playerId;

                if (isWhitePlayer || isBlackPlayer) {
                  // Player is reconnecting to their game
                  console.log("Player is reconnecting to game");
                  const playerColor = isWhitePlayer ? "white" : "black";
                  const playerRole = isWhitePlayer ? "host" : "guest";

                  useOnlineGameStore.setState({
                    gameId: gameParam,
                    playerId,
                    playerColor,
                    playerRole,
                    isConnected: true,
                  });

                  // Hide name input and mode selection, start syncing
                  setShowNameInput(false);
                  return;
                }
              }
            } catch (error) {
              console.error("Error checking game:", error);
            }
          }

          // New player joining - show name input
          console.log("New player joining game");
          setShowNameInput(true);
          useOnlineGameStore.setState({ gameId: gameParam });
        }
      }
    };

    checkGameLink();
  }, [setGameMode, setShowModeSelection, setShowNameInput]);

  return (
    <>
      <Navigation />
      {showModeSelection ? (
        <GameModeSelection />
      ) : showNameInput ? (
        <PlayerNameInput />
      ) : (
        <ScreenSizeWarning>
          <div className="flex h-screen bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
            <GameEndModal />
            <PawnPromotionModal />
            <OptionsModal />
            <DraggingCursor />
            <TurnIndicator />

            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-20 md:py-24">
              <ChessBoard />
            </div>

            <CapturedPieces />
          </div>
        </ScreenSizeWarning>
      )}
    </>
  );
}
