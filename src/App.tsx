import { OrbitControls, View } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import * as THREE from "three"

export default function App() {
  return (
    <div className='App'>
      <Canvas>
        <OrbitControls />
        <Sketch />
      </Canvas>
    </div>
  )
}

const vectorProjection = (a: THREE.Vector3, b: THREE.Vector3) => {
  const bCopy = b.clone().normalize()
  const sp = a.dot(bCopy)
  bCopy.multiplyScalar(sp)
  return bCopy
}

const Sketch = () => {
  const ball = useRef<THREE.Mesh>(null!)
  const ref = useRef<THREE.BufferGeometry>(null!)
  const projection = useRef<THREE.Mesh>(null!)

  const { width, height } = useThree().viewport

  const origin = new THREE.Vector3(width * 0.5, height * 0.5, 0)
  const path = new THREE.Vector3(4, 1, 0)
  const point = new THREE.Vector3(0, 0, 0)

  useFrame((state) => {
    const { clock } = state

    const x = Math.sin(clock.getElapsedTime()) * width
    const y = Math.sin(clock.getElapsedTime() * 5) * 2
    const z = Math.sin(clock.getElapsedTime() * 5) * 2

    point.set(x, y, z)
    ball.current.position.copy(point)

    let a = new THREE.Vector3().subVectors(point, origin)
    let v = vectorProjection(a, path)

    projection.current.position.copy(v.clone().add(origin))
  })

  useLayoutEffect(() => {
    const points = [
      new THREE.Vector3(origin.x, origin.y, 0),
      new THREE.Vector3(origin.x + path.x, origin.y + path.y, 0),
    ]

    ref.current.setFromPoints(points)
  }, [])

  return (
    <group position={[-origin.x, -origin.y, 0]}>
      <mesh position={[origin.x, origin.y, 0]}>
        <icosahedronGeometry args={[0.25, 0]} />
        <meshBasicMaterial />
      </mesh>
      <mesh ref={ball}>
        <icosahedronGeometry args={[0.25, 0]} />
        <meshBasicMaterial />
      </mesh>
      <mesh ref={projection}>
        <icosahedronGeometry args={[0.25, 0]} />
        <meshBasicMaterial />
      </mesh>
      <line>
        <bufferGeometry ref={ref} />
        <lineBasicMaterial color='red' />
      </line>
    </group>
  )
}
