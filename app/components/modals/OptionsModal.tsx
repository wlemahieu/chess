import { useState, useEffect } from "react";
import {
  uiStore,
  type PieceDisplayMode,
  type BoardSetupMode,
} from "~/stores/uiStore";
import { boardStore } from "~/stores/boardStore";
import Modal from "~/components/modals/Modal";

export default function OptionsModal() {
  const showOptions = uiStore((state) => state.showOptions);
  const showBoardPositions = uiStore((state) => state.showBoardPositions);
  const toggleBoardPositions = uiStore((state) => state.toggleBoardPositions);
  const showTileHover = uiStore((state) => state.showTileHover);
  const toggleTileHover = uiStore((state) => state.toggleTileHover);
  const showMovePaths = uiStore((state) => state.showMovePaths);
  const toggleMovePaths = uiStore((state) => state.toggleMovePaths);
  const pieceDisplayMode = uiStore((state) => state.pieceDisplayMode);
  const setPieceDisplayMode = uiStore((state) => state.setPieceDisplayMode);
  const boardSetupMode = uiStore((state) => state.boardSetupMode);
  const setBoardSetupMode = uiStore((state) => state.setBoardSetupMode);
  const setShowOptions = uiStore((state) => state.setShowOptions);
  const loadSetup = boardStore((state) => state.loadSetup);

  const [tempShowPositions, setTempShowPositions] =
    useState(showBoardPositions);
  const [tempShowTileHover, setTempShowTileHover] = useState(showTileHover);
  const [tempShowMovePaths, setTempShowMovePaths] = useState(showMovePaths);
  const [tempPieceMode, setTempPieceMode] = useState(pieceDisplayMode);
  const [tempSetupMode, setTempSetupMode] = useState(boardSetupMode);

  useEffect(() => {
    if (showOptions) {
      setTempShowPositions(showBoardPositions);
      setTempShowTileHover(showTileHover);
      setTempShowMovePaths(showMovePaths);
      setTempPieceMode(pieceDisplayMode);
      setTempSetupMode(boardSetupMode);
    }
  }, [
    showOptions,
    showBoardPositions,
    showTileHover,
    showMovePaths,
    pieceDisplayMode,
    boardSetupMode,
  ]);

  const handleSave = () => {
    if (tempShowPositions !== showBoardPositions) {
      toggleBoardPositions();
    }
    if (tempShowTileHover !== showTileHover) {
      toggleTileHover();
    }
    if (tempShowMovePaths !== showMovePaths) {
      toggleMovePaths();
    }
    setPieceDisplayMode(tempPieceMode);

    if (tempSetupMode !== boardSetupMode) {
      setBoardSetupMode(tempSetupMode);
      loadSetup(tempSetupMode);
    }

    setShowOptions(false);
  };

  const handleCancel = () => {
    setShowOptions(false);
  };

  return (
    <Modal isOpen={showOptions} onClose={handleCancel}>
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

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={tempShowTileHover}
            onChange={(e) => setTempShowTileHover(e.target.checked)}
            className="form-checkbox"
          />
          <span>Show tile hover (blue)</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={tempShowMovePaths}
            onChange={(e) => setTempShowMovePaths(e.target.checked)}
            className="form-checkbox"
          />
          <span>Show move paths (pink)</span>
        </label>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Piece Display Mode</label>
          <select
            value={tempPieceMode}
            onChange={(e) =>
              setTempPieceMode(e.target.value as PieceDisplayMode)
            }
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
    </Modal>
  );
}
