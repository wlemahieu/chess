import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { useMemo, useState, useEffect } from "react";
import { useTexture, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import {
  useBoardMatrix,
  useBoardStore,
  useMetadataStore,
  type Tile,
  type BoardPosition,
  type TileData,
} from "./useStore";
import { twMerge } from "tailwind-merge";

function Model() {
  // const fbx = useLoader(FBXLoader, "/Chess_set_FBX.fbx");
  // return <primitive object={fbx} />;

  const obj = useLoader(OBJLoader, "/Chess_set_OBJ.obj");
  const texture = useTexture("/Textures/Dark_checkered_board.jpg");

  const geometry = useMemo(() => {
    let g;
    obj.traverse((c) => {
      if (c.type === "Mesh") {
        const _c = c as Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [obj]);

  return (
    <mesh scale={0.7} geometry={geometry}>
      <meshPhysicalMaterial map={texture} attach="material" />
    </mesh>
  );
}

function AppThreeJs() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Model />
      <OrbitControls />
    </Canvas>
  );
}

type TileProps = {
  tile: Tile;
  isValidMove: boolean;
  onHover: (tileKey: string | null) => void;
  onClick: (tileKey: string) => void;
  isSelected: boolean;
  showBoardPositions: boolean;
  currentTurn: string;
};
function Tile({
  tile,
  isValidMove,
  onHover,
  onClick,
  isSelected,
  showBoardPositions,
  currentTurn,
}: TileProps) {
  const [tileKey, tileData] = tile;

  return (
    <div
      className={twMerge(
        "w-[100px] h-[100px] relative hover:bg-blue-500 flex items-center justify-center cursor-pointer",
        tileData?.color === "black"
          ? "bg-gray-700 text-gray-100"
          : "bg-gray-300 text-gray-900",
        isValidMove && "bg-pink-400",
        isSelected && "ring-4 ring-yellow-400"
      )}
      onMouseEnter={() =>
        tileData?.piece &&
        tileData.piece.color === currentTurn &&
        onHover(tileKey)
      }
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(tileKey)}
    >
      {showBoardPositions && (
        <span className="absolute bottom-1 left-1 text-xs italic">
          {tileKey}
        </span>
      )}
      {tileData?.piece && (
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{tileData.piece.name}</span>
          <span
            className={twMerge(
              "text-xs",
              tileData.piece.color === "black" ? "text-black" : "text-white"
            )}
          >
            {tileData.piece.color === "black" ? "●" : "○"}
          </span>
        </div>
      )}
    </div>
  );
}
function App() {
  const matrix = useBoardMatrix();
  const {
    board,
    movePiece,
    currentTurn,
    capturedPieces,
    showBoardPositions,
    toggleBoardPositions,
    promotionPosition,
    promotePawn,
  } = useBoardStore();
  const { players, setPlayerName } = useMetadataStore();
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<{
    name: string;
    color: string;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showOptions, setShowOptions] = useState(false);
  const [showNameInput, setShowNameInput] = useState(true);

  // Track mouse position for dragging cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (draggingPiece) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [draggingPiece]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".chess-board")) {
        setSelectedTile(null);
        setDraggingPiece(null);
      }
    };

    if (selectedTile) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [selectedTile]);

  // Get valid moves for the selected piece
  const validMoves = useMemo(() => {
    const activeTile = selectedTile || hoveredTile;
    if (!activeTile) return new Set<string>();

    const tileData = board.get(activeTile as BoardPosition);
    if (!tileData?.piece?.path) return new Set<string>();

    return new Set(tileData.piece.path.map((move) => move.position));
  }, [selectedTile, hoveredTile, board]);

  const handleTileClick = (tileKey: string) => {
    const clickedTileData = board.get(tileKey as BoardPosition);

    if (selectedTile === tileKey) {
      setSelectedTile(null);
      setDraggingPiece(null);
      return;
    }

    if (selectedTile && validMoves.has(tileKey)) {
      movePiece(selectedTile as BoardPosition, tileKey as BoardPosition);
      setSelectedTile(null);
      setDraggingPiece(null);
    } else if (
      clickedTileData?.piece &&
      clickedTileData.piece.color === currentTurn
    ) {
      setSelectedTile(tileKey);
      setDraggingPiece({
        name: clickedTileData.piece.name,
        color: clickedTileData.piece.color,
      });
    } else {
      setSelectedTile(null);
      setDraggingPiece(null);
    }
  };

  const currentPlayer = players.find((p) => p.color === currentTurn);

  if (showNameInput) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Enter Player Names</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                White Player
              </label>
              <input
                type="text"
                defaultValue={players[0].name}
                onChange={(e) => setPlayerName("white", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Black Player
              </label>
              <input
                type="text"
                defaultValue={players[1].name}
                onChange={(e) => setPlayerName("black", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={() => setShowNameInput(false)}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  const promotingPiece = promotionPosition
    ? board.get(promotionPosition)?.piece
    : null;
  const availableForPromotion = promotingPiece
    ? promotingPiece.color === "white"
      ? capturedPieces.black
      : capturedPieces.white
    : [];

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {promotionPosition && availableForPromotion.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Choose a piece to revive:
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {availableForPromotion.map((piece, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const revivePiece = {
                      ...piece,
                      color: promotingPiece!.color,
                    };
                    promotePawn(promotionPosition, revivePiece);
                  }}
                  className="p-4 border rounded hover:bg-gray-200 flex flex-col items-center"
                >
                  <span className="text-lg font-semibold capitalize">
                    {piece.name}
                  </span>
                  <span className="text-2xl">
                    {piece.color === "white" ? "○" : "●"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showOptions && (
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
      )}

      {draggingPiece && (
        <div
          className="fixed pointer-events-none z-50 bg-white px-2 py-1 rounded shadow-lg border border-gray-400"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
          }}
        >
          <span className="font-semibold capitalize">{draggingPiece.name}</span>
          <span className="ml-1 text-xs">
            {draggingPiece.color === "black" ? "●" : "○"}
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 bg-white px-6 py-3 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            {currentPlayer?.name}'s Turn
            <span className="ml-2 text-lg">
              ({currentTurn === "black" ? "●" : "○"})
            </span>
          </h2>
        </div>

        <div className="chess-board flex w-[800px] shadow-xl">
          {matrix.map((letterColumn, columnIndex) => {
            return (
              <div
                key={`column-${columnIndex}`}
                className="flex flex-col w-[100px]"
              >
                {letterColumn.map((tile, tileIndex) => {
                  const [tileKey] = tile;
                  return (
                    <Tile
                      key={`column-${columnIndex}-tile-${tileIndex}`}
                      tile={tile}
                      isValidMove={validMoves.has(tileKey)}
                      onHover={setHoveredTile}
                      onClick={handleTileClick}
                      isSelected={selectedTile === tileKey}
                      showBoardPositions={showBoardPositions}
                      currentTurn={currentTurn}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowOptions(true)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Options
        </button>
      </div>

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
    </div>
  );
}
export default App;
