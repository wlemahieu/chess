import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { useMemo } from "react";
import { useTexture, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import { useBoardStore } from "./useStore";

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
  const board = useBoardStore();
  console.log(board);
  return (
    <div>
      {/* <div>Bears = {bears}</div>
      <button onClick={increasePopulation}>Increase population</button>
      <button onClick={removeAllBears}>Remove all bears</button> */}
    </div>
  );
}
export default App;
