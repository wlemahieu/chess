import { useState, useEffect } from "react";
import { useOnlineGameStore } from "~/stores/onlineGameStore";
import { useUIStore } from "~/stores/uiStore";

export default function OnlineWaitingRoom() {
  const gameId = useOnlineGameStore((state) => state.gameId);
  const gameState = useOnlineGameStore((state) => state.gameState);
  const setShowNameInput = useUIStore((state) => state.setShowNameInput);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && gameId) {
      const url = `${window.location.origin}?game=${gameId}`;
      setShareUrl(url);
    }
  }, [gameId]);

  useEffect(() => {
    // When player 2 joins, hide this waiting room
    if (gameState?.status === "active" && gameState?.players.black) {
      setShowNameInput(false);
    }
  }, [gameState, setShowNameInput]);

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Play Chess with me!",
          text: "Join my chess game on RdyChess",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 pt-16">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Waiting for Opponent
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Share the link below with your friend
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              ♟️
            </div>
          </div>
        </div>

        {/* Player Info */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You are playing as
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {gameState?.players.white?.name || "Player 1"} (White)
              </p>
            </div>
            <div className="text-3xl">♔</div>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Game Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg mb-4"
        >
          📤 Share Link
        </button>

        {/* QR Code Placeholder (optional future enhancement) */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 Send this link to your friend. Once they join, the game will
            start automatically!
          </p>
        </div>

        {/* Game ID Display */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Game ID: <code className="font-mono">{gameId}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
