import { useEditor } from "@/components/editor/provider"
import { OrbitControls } from "@react-three/drei"
import { useFrame, Vector3 } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"

export function Camera() {
  const { position } = useEditor()
  const stopThreshold = 20 // Distance threshold to stop the camera
  let pos: Vector3 = undefined
  useEffect(() => {
    pos = new THREE.Vector3(...position)
  }, [position])

  useFrame(({ camera }) => {
    if (!pos) return
    // @ts-ignore
    const distance = camera.position.distanceTo(pos)
    if (distance < stopThreshold) pos = undefined
    const targetVec = new THREE.Vector3(...position)
    const tempPosition = new THREE.Vector3()

    if (distance > stopThreshold) {
      camera.lookAt(targetVec)
      tempPosition.lerpVectors(camera.position, targetVec, 0.25)
      camera.position.copy(tempPosition)
    }
  })
  return <OrbitControls makeDefault position={position} />
}
