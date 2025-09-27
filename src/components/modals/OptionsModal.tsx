import { uiStore } from "../../stores/uiStore";

function OptionsModal() {
  const showOptions = uiStore((state) => state.showOptions);
  const showBoardPositions = uiStore((state) => state.showBoardPositions);
  const toggleBoardPositions = uiStore((state) => state.toggleBoardPositions);
  const setShowOptions = uiStore((state) => state.setShowOptions);

  if (!showOptions) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Options</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showBoardPositions}
            onChange={toggleBoardPositions}
            className="form-checkbox"
          />
          <span>Show board positions</span>
        </label>
        <button
          onClick={() => setShowOptions(false)}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default OptionsModal;
