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
};
function Tile({ tile, isValidMove, onHover, onClick, isSelected }: TileProps) {
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
      onMouseEnter={() => tileData?.piece && onHover(tileKey)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(tileKey)}
    >
      <span className="absolute bottom-1 left-1 text-xs italic">{tileKey}</span>
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
  const { board, movePiece } = useBoardStore();
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<{
    name: string;
    color: string;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
      if (!target.closest('.chess-board')) {
        setSelectedTile(null);
        setDraggingPiece(null);
      }
    };

    if (selectedTile) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
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

    // If clicking the same selected tile, deselect it
    if (selectedTile === tileKey) {
      setSelectedTile(null);
      setDraggingPiece(null);
      return;
    }

    if (selectedTile && validMoves.has(tileKey)) {
      // Move the piece using the store action
      movePiece(selectedTile as BoardPosition, tileKey as BoardPosition);

      // Clear selection
      setSelectedTile(null);
      setDraggingPiece(null);
    } else if (clickedTileData?.piece) {
      // Select a piece
      setSelectedTile(tileKey);
      setDraggingPiece({
        name: clickedTileData.piece.name,
        color: clickedTileData.piece.color,
      });
    } else {
      // Deselect when clicking empty tile
      setSelectedTile(null);
      setDraggingPiece(null);
    }
  };

  return (
    <div className="border-6 border-black h-full relative">
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

      <div className="chess-board flex w-[800px]">
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
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;
