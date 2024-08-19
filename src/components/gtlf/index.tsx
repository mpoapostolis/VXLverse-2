import { GLBType } from "@/lib/game-store"
import { useRef } from "react"
import { Group } from "three"
import { useGltfMemo } from "../glb"

export function Gltf(props: GLBType) {
  const group = useRef<Group>()
  const { scene } = useGltfMemo(props.url)
  return (
    <group uuid={props.uuid} ref={group} dispose={null}>
      <primitive object={scene} dispose={null} />
    </group>
  )
}
