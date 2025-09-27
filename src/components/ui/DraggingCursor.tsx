import { useEffect } from "react";
import { uiStore } from "../../stores/uiStore";

function DraggingCursor() {
  const draggingPiece = uiStore((state) => state.draggingPiece);
  const mousePosition = uiStore((state) => state.mousePosition);
  const setMousePosition = uiStore((state) => state.setMousePosition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (draggingPiece) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [draggingPiece, setMousePosition]);

  if (!draggingPiece) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 bg-white px-2 py-1 rounded shadow-lg border border-gray-400"
      style={{
        left: mousePosition.x + 10,
        top: mousePosition.y - 10,
      }}
    >
      <span className="font-semibold capitalize">{draggingPiece.name}</span>
      <span className="ml-1 text-xs">
        {draggingPiece.color === "black" ? "●" : "○"}
      </span>
    </div>
  );
}

export default DraggingCursor;
