import { useEditor } from "@/components/editor/provider"
import { OrbitControls } from "@react-three/drei"
import { useFrame, Vector3 } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"

export function Camera() {
  const { position, flying, setFlying } = useEditor()
  const stopThreshold = 20 // Distance threshold to stop the camera
  let pos: Vector3 = undefined
  const ref = useRef<[number, number, number]>([0, 0, 0])
  useEffect(() => {
    if (!position) return
    pos = new THREE.Vector3(...(position ?? []))
    if (flying) ref.current = position
  }, [position, flying])

  useFrame(({ camera }) => {
    if (!pos || !flying) return
    // @ts-ignore
    const distance = camera.position.distanceTo(pos)
    if (distance < stopThreshold) pos = undefined
    const targetVec = new THREE.Vector3(...position)
    const tempPosition = new THREE.Vector3()

    if (distance > stopThreshold) {
      camera.lookAt(targetVec)
      tempPosition.lerpVectors(camera.position, targetVec, 0.05)
      camera.position.copy(tempPosition)
    } else {
      setFlying(false)
    }
  })
  return <OrbitControls makeDefault target={ref.current} position={pos ?? [0, 0, 0]} />
}
