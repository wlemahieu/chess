import { gameStore } from "~/stores/gameStore";
import { uiStore } from "~/stores/uiStore";

function getPieceSymbol(pieceName: string): string {
  const symbols: Record<string, string> = {
    pawn: "P",
    rook: "R",
    knight: "N",
    bishop: "B",
    queen: "Q",
    king: "K"
  };
  return symbols[pieceName] || pieceName.charAt(0).toUpperCase();
}

export default function CapturedPieces() {
  const capturedPieces = gameStore((state) => state.capturedPieces);
  const pieceDisplayMode = uiStore((state) => state.pieceDisplayMode);

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h3 className="text-xl font-bold mb-4">Captured Pieces</h3>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">White's Captures</h4>
        <div className="flex flex-wrap gap-2">
          {capturedPieces.white.map((piece, idx) => (
            <div key={idx} className="text-lg font-bold">
              {pieceDisplayMode === "text" ? getPieceSymbol(piece.name) : "●"}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Black's Captures</h4>
        <div className="flex flex-wrap gap-2">
          {capturedPieces.black.map((piece, idx) => (
            <div key={idx} className="text-lg font-bold">
              {pieceDisplayMode === "text" ? getPieceSymbol(piece.name) : "○"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
