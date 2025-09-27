import { uiStore } from "../../stores/uiStore";

function OptionsButton() {
  const setShowOptions = uiStore((state) => state.setShowOptions);

  return (
    <button
      onClick={() => setShowOptions(true)}
      className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    >
      Options
    </button>
  );
}

export default OptionsButton;
