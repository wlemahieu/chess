import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { useMemo } from "react";
import { useTexture, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import { useBoard, useBoardStore } from "./useStore";
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

function App() {
  const matrix = useBoard();

  return (
    <div className="border-6 border-black h-full">
      <div className="flex">
        {matrix.map((columns) => {
          return (
            <div className="flex flex-col">
              {columns.map((entry) => {
                const [key, tile] = entry;
                return (
                  <div
                    className={twMerge(
                      "p-7",
                      tile?.color === "black"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    )}
                  >
                    {key}
                  </div>
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
