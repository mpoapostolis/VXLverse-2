import { Canvas } from "@react-three/fiber"

import { Environment, KeyboardControls, MapControls, PivotControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation } from "ecctrl"
import * as THREE from "three"
import { animationSet, characterURL, Hero, keyboardMap } from "./components/hero"
import Lights from "./components/lights"
import { Npc } from "./components/npc"
import { Scene } from "./components/scene"
import { Settings } from "./components/settings"
import { useStore } from "./lib/store"

export default function Editor() {
  const store = useStore()

  return (
    <div className="w-screen h-screen">
      <Settings />
      <Canvas color="#171717" shadows>
        <MapControls makeDefault />
        <Environment background preset="night" />
        <Lights />
        <Physics key={store.scene} timeStep="vary">
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
          <KeyboardControls map={keyboardMap}>
            <Ecctrl floatHeight={0.1} animated>
              <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
                <Hero />
              </EcctrlAnimation>
            </Ecctrl>
          </KeyboardControls>
        </Physics>
      </Canvas>
    </div>
  )
}
