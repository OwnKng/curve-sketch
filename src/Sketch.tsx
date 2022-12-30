import { Center, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"

const rotations = 8
const pointsPerTurn = 30

const angleStep = (Math.PI * 2) / pointsPerTurn
const up = new THREE.Vector3(0, 1, 0)
const axis = new THREE.Vector3(0, 0, 0)

export default function Sketch() {
  const ref = useRef<THREE.Mesh>(null!)

  const scroll = useScroll()

  const curve = useMemo(() => {
    const r = 8

    const start = [
      new THREE.Vector3(0, -r * 0.5, -r * 0.25),

      new THREE.Vector3(0, 0, -r * 0.25),
    ]

    const curvePoints = Array.from(
      { length: rotations * pointsPerTurn },
      (_, i) =>
        new THREE.Vector3(
          (i / (rotations * pointsPerTurn)) * 8,
          Math.cos(angleStep * i) * r * 0.25,
          Math.sin(angleStep * i) * r * 0.25
        )
    )

    const end = [
      new THREE.Vector3(8, 0, r * 0.25),
      new THREE.Vector3(8, -r * 0.5, r * 0.25),
    ]

    return new THREE.CatmullRomCurve3(start.concat(curvePoints).concat(end))
  }, [])

  useFrame(() => {
    const t = scroll.offset

    const tangent = curve.getTangent(t)
    axis.crossVectors(up, tangent).normalize()

    const radians = Math.acos(up.dot(tangent))

    curve.getPoint(t, ref.current.position)
    ref.current.quaternion.setFromAxisAngle(axis, radians)
  })

  useLayoutEffect(() => {
    ref.current.geometry.rotateX(Math.PI * 0.5)
  }, [])

  return (
    <Center disableY>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 512, 0.1, 100, false]} />
        <meshStandardMaterial color='#2A2E45' />
      </mesh>
      <mesh ref={ref} castShadow receiveShadow>
        <torusGeometry args={[0.4, 0.15]} />
        <meshStandardMaterial color='#fffffe' />
      </mesh>
    </Center>
  )
}
