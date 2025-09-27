import { useState, useEffect } from "react";
import { uiStore, type PieceDisplayMode, type BoardSetupMode } from "../../stores/uiStore";
import { boardStore } from "../../stores/boardStore";

function OptionsModal() {
  const showOptions = uiStore((state) => state.showOptions);
  const showBoardPositions = uiStore((state) => state.showBoardPositions);
  const toggleBoardPositions = uiStore((state) => state.toggleBoardPositions);
  const pieceDisplayMode = uiStore((state) => state.pieceDisplayMode);
  const setPieceDisplayMode = uiStore((state) => state.setPieceDisplayMode);
  const boardSetupMode = uiStore((state) => state.boardSetupMode);
  const setBoardSetupMode = uiStore((state) => state.setBoardSetupMode);
  const setShowOptions = uiStore((state) => state.setShowOptions);
  const loadSetup = boardStore((state) => state.loadSetup);

  // Local state for temporary changes
  const [tempShowPositions, setTempShowPositions] = useState(showBoardPositions);
  const [tempPieceMode, setTempPieceMode] = useState(pieceDisplayMode);
  const [tempSetupMode, setTempSetupMode] = useState(boardSetupMode);

  // Reset temp state when modal opens
  useEffect(() => {
    if (showOptions) {
      setTempShowPositions(showBoardPositions);
      setTempPieceMode(pieceDisplayMode);
      setTempSetupMode(boardSetupMode);
    }
  }, [showOptions, showBoardPositions, pieceDisplayMode, boardSetupMode]);

  const handleSave = () => {
    // Apply all changes
    if (tempShowPositions !== showBoardPositions) {
      toggleBoardPositions();
    }
    setPieceDisplayMode(tempPieceMode);

    if (tempSetupMode !== boardSetupMode) {
      setBoardSetupMode(tempSetupMode);
      loadSetup(tempSetupMode);
    }

    setShowOptions(false);
  };

  const handleCancel = () => {
    // Just close without saving
    setShowOptions(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!showOptions) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Options</h2>

        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={tempShowPositions}
              onChange={(e) => setTempShowPositions(e.target.checked)}
              className="form-checkbox"
            />
            <span>Show board positions</span>
          </label>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Piece Display Mode</label>
            <select
              value={tempPieceMode}
              onChange={(e) => setTempPieceMode(e.target.value as PieceDisplayMode)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="regular">Regular (Coming Soon)</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Board Setup (Testing)</label>
            <select
              value={tempSetupMode}
              onChange={(e) => setTempSetupMode(e.target.value as BoardSetupMode)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="pawn-pre-promotion">Pawn Pre-Promotion</option>
              <option value="endgame-practice">Endgame Practice</option>
              <option value="check-practice">Check Practice</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Changing setup will reset the game
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default OptionsModal;
