import { useState } from "react";
import { useGameStore } from "~/stores/gameStore";
import { useUIStore } from "~/stores/uiStore";
import PieceDisplay from "~/components/board/PieceDisplay";

function getPieceSymbol(pieceName: string): string {
  const symbols: Record<string, string> = {
    pawn: "P",
    rook: "R",
    knight: "N",
    bishop: "B",
    queen: "Q",
    king: "K",
  };
  return symbols[pieceName] || pieceName.charAt(0).toUpperCase();
}

export default function CapturedPieces() {
  const capturedPieces = useGameStore((state) => state.capturedPieces);
  const pieceDisplayMode = useUIStore((state) => state.pieceDisplayMode);
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <div
      className="fixed right-0 top-0 bottom-0 bg-gray-300/95 dark:bg-gray-700/95 backdrop-blur-sm shadow-lg py-12 px-4 text-black dark:text-white transition-all duration-300 z-40"
      style={{
        width: isMinimized ? "16px" : "208px",
      }}
      onMouseEnter={() => setIsMinimized(false)}
      onMouseLeave={() => setIsMinimized(true)}
    >
      <div
        className={`transition-all duration-300 ${
          isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Captured Pieces</h3>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">White's Captures</h4>
          <div className="flex flex-wrap gap-2">
            {capturedPieces.white.map((piece, idx) => (
              <div key={idx} className="text-lg font-bold">
                {pieceDisplayMode === "text" ? (
                  getPieceSymbol(piece.name)
                ) : (
                  <div className="w-8 h-8">
                    <PieceDisplay piece={piece} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Black's Captures</h4>
          <div className="flex flex-wrap gap-2">
            {capturedPieces.black.map((piece, idx) => (
              <div key={idx} className="text-lg font-bold">
                {pieceDisplayMode === "text" ? (
                  getPieceSymbol(piece.name)
                ) : (
                  <div className="w-8 h-8">
                    <PieceDisplay piece={piece} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${
          isMinimized ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-4 h-16 flex items-center justify-center">
          <div className="w-1 h-8 bg-gray-500 dark:bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
