import React from "react";
import { gameStore } from "../../stores/gameStore";

function CapturedPieces() {
  const capturedPieces = gameStore(state => state.capturedPieces);

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h3 className="text-xl font-bold mb-4">Captured Pieces</h3>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Black's Captures</h4>
        <div className="flex flex-wrap gap-2">
          {capturedPieces.white.map((_piece, idx) => (
            <div key={idx} className="text-2xl">
              ○
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">White's Captures</h4>
        <div className="flex flex-wrap gap-2">
          {capturedPieces.black.map((_piece, idx) => (
            <div key={idx} className="text-2xl">
              ●
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CapturedPieces;