import { Npc, useStore } from "@/lib/store"
import { PivotControls } from "@react-three/drei"
import * as THREE from "three"
import { Character } from "."

export function EditCharacter(props: Npc) {
  const store = useStore()
  return (
    <PivotControls
      onDrag={(e) => {
        const matrix = e // Assuming e is already a Matrix4 instance
        const position = new THREE.Vector3()
        const scale = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        const rotation = new THREE.Euler()

        // Decompose the matrix to get position, quaternion, and scale
        matrix.decompose(position, quaternion, scale)
        rotation.setFromQuaternion(quaternion)

        // Update the store with the decomposed values
        store.updateNpc({
          ...props,
          position: [position.x, position.y, position.z],
          rotation: [rotation.x, rotation.y, rotation.z],
          scale: [scale.x, scale.y, scale.z],
        })
      }}
    >
      <Character {...props} />
    </PivotControls>
  )
}
