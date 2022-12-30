import { useFrame } from "@react-three/fiber"
import { forwardRef, useMemo, useRef } from "react"
import * as THREE from "three"

const axis = new THREE.Vector3(0, 0, 0)
const up = new THREE.Vector3(0, 1, 0)
const q = new THREE.Quaternion()

const Line = forwardRef((ref, _) => {
  const ref2 = useRef<THREE.Mesh>(null!)

  const [geometry, curve] = useMemo(() => {
    const curvePath = new THREE.CurvePath()

    const lineOne = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10, 0, 0)
    )

    const lineTwo = new THREE.LineCurve3(
      new THREE.Vector3(10, 0, 0),
      new THREE.Vector3(10, 10, 0)
    )

    const lineThree = new THREE.LineCurve3(
      new THREE.Vector3(10, 10, 0),
      new THREE.Vector3(10, 10, 10)
    )

    const lineFour = new THREE.LineCurve3(
      new THREE.Vector3(10, 10, 10),
      new THREE.Vector3(10, 0, 10)
    )

    const lineFive = new THREE.LineCurve3(
      new THREE.Vector3(10, 0, 10),
      new THREE.Vector3(20, 0, 10)
    )

    curvePath.add(lineOne)
    curvePath.add(lineTwo)
    curvePath.add(lineThree)
    curvePath.add(lineFour)
    curvePath.add(lineFive)

    const points = curvePath.getPoints(50)

    return [new THREE.BufferGeometry().setFromPoints(points), curvePath]
  }, [])

  useFrame((state) => {
    const t = Math.sin(state.clock.getElapsedTime()) * 0.5 + 0.5
    curve.getPoint(t, ref2.current.position)

    const tangent = curve.getTangent(t)

    axis.crossVectors(up, tangent).normalize()

    const radians = Math.acos(up.dot(tangent))
    ref2.current.quaternion.setFromAxisAngle(axis, radians)
  })

  return (
    <>
      <line geometry={geometry}>
        <lineBasicMaterial />
      </line>
      <mesh ref={ref2}>
        <cylinderGeometry args={[0, 2, 5, 3]} />
        <meshNormalMaterial />
      </mesh>
    </>
  )
})

export default Line
