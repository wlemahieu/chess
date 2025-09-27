import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { useMemo, useState } from "react";
import { useTexture, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import { useBoardMatrix, useBoardStore, type Tile } from "./useStore";
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
};
function Tile({ tile, isValidMove, onHover }: TileProps) {
  const [tileKey, tileData] = tile;

  return (
    <div
      className={twMerge(
        "w-[100px] h-[100px] relative hover:bg-blue-500 flex items-center justify-center",
        tileData?.color === "black"
          ? "bg-gray-700 text-gray-100"
          : "bg-gray-300 text-gray-900",
        isValidMove && "bg-pink-400"
      )}
      onMouseEnter={() => tileData?.piece && onHover(tileKey)}
      onMouseLeave={() => onHover(null)}
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
  const board = useBoardStore();
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  // Get valid moves for the hovered piece
  const validMoves = useMemo(() => {
    if (!hoveredTile) return new Set<string>();

    const tileData = board.get(hoveredTile as any);
    if (!tileData?.piece?.path) return new Set<string>();

    return new Set(tileData.piece.path.map((move) => move.position));
  }, [hoveredTile, board]);

  return (
    <div className="border-6 border-black h-full">
      <div className="flex w-[800px]">
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
