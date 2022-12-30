import { OrbitControls, View } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import Track from "./Track"

export default function App() {
  const line = useRef()
  return (
    <div className='App'>
      <Canvas>
        <OrbitControls />
        <Track ref={line} />
      </Canvas>
    </div>
  )
}
