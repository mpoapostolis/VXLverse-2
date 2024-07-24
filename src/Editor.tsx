import { Canvas } from "@react-three/fiber"

import { Environment, MapControls, PivotControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { useEffect } from "react"
import * as THREE from "three"
import Lights from "./components/lights"
import { Npc } from "./components/npc"
import { allScenes, Scene } from "./components/scene"
import { Settings } from "./components/settings"
import { useStore } from "./lib/store"

export default function Editor() {
  const store = useStore()
  useEffect(() => {
    store.setSceneConfig(
      allScenes.reduce((acc, scene) => {
        return {
          ...acc,
          [scene]: 1,
        }
      }, {}),
    )
  }, [])
  return (
    <div className="w-screen h-screen">
      <Settings />
      <Canvas color="#171717" shadows>
        <MapControls makeDefault />
        <Environment background preset="night" />
        <Lights />
        <Physics timeStep="vary">
          <Scene />
          {store.npcs
            .filter((e) => e.scene === store.scene)
            .map((npc) => (
              <PivotControls
                enabled={store.selectedNpc === npc.uuid}
                key={npc.uuid}
                disableScaling
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
                    ...npc,
                    position: [position.x, position.y, position.z],
                    rotation: [rotation.x, rotation.y, rotation.z],
                  })
                }}
              >
                <mesh key={npc.uuid} onClick={() => store.setSelectedNpc(npc.uuid)}>
                  <Npc {...npc} isEdit />
                </mesh>
              </PivotControls>
            ))}
        </Physics>
      </Canvas>
    </div>
  )
}
