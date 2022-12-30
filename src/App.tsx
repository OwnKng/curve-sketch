import { ScrollControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"

export default function App() {
  return (
    <div className='App'>
      <Canvas
        shadows
        orthographic
        camera={{
          position: [0, 0, 50],
          zoom: 100,
        }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight intensity={2} position={[0, 20, 5]} castShadow />
        <ScrollControls pages={10}>
          <Sketch />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
