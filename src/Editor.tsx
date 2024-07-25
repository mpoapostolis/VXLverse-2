import { Canvas } from "@react-three/fiber"

import { Environment, Html, KeyboardControls, TransformControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation } from "ecctrl"
import { useState } from "react"
import * as THREE from "three"
import { Controls } from "./components/controls"
import { Dialogue } from "./components/dialogue"
import { animationSet, characterURL, Hero, keyboardMap } from "./components/hero"
import Lights from "./components/lights"
import { allNpcTypes, Npc } from "./components/npc"
import { allScenes, Scene } from "./components/scene"
import { useStore } from "./lib/store"
import { debounce } from "./lib/utils"

export default function Editor() {
  const store = useStore()
  return (
    <div className="w-screen h-screen">
      <div className="fixed flex gap-4 z-40 top-4 right-4">
        <div className="dropdown">
          <div
            tabIndex={0}
            onClick={() => store.setSelectedNpc(null)}
            className="btn rounded-none bg-base-200 btn-sm text-white"
          >
            Add Npc
          </div>
          <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-none z-[1] w-52 p-2 shadow">
            {allNpcTypes.map((npc) => (
              <li
                key={npc}
                onClick={() => {
                  const uuid = new THREE.Object3D().uuid
                  store.setSelectedNpc(uuid)
                  store.addNpc({
                    uuid,
                    name: "New NPC",
                    position: [0, 0, 0],
                    scale: [1, 1, 1],
                    rotation: [0, 0, 0],
                    scene: store.scene,
                    type: npc,
                  })
                }}
              >
                <a>{npc}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="dropdown">
          <div
            tabIndex={0}
            onClick={() => store.setSelectedNpc(null)}
            className="btn rounded-none bg-base-200 btn-sm text-white"
          >
            Change location
          </div>
          <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-none z-[1] w-52 p-2 shadow">
            {allScenes.map((scene) => (
              <li
                key={scene}
                onClick={() => {
                  store.setSelectedNpc(null)
                  store.setScene(scene)
                }}
              >
                <a>{scene}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialogue />
      <Canvas key={store.scene} shadows>
        <Environment background preset="night" />
        <Lights />
        <Physics timeStep="vary">
          <Content />
        </Physics>
      </Canvas>
    </div>
  )
}

function Content() {
  const store = useStore()

  const selectNpc = (uuid: string) => {
    store.setSelectedNpc(uuid)
  }

  const [mode, setMode] = useState<"scale" | "translate" | "rotate">("translate")
  const selectedNpc = store.npcs.find((e) => e.uuid === store.selectedNpc)
  const deleteNpc = () => {
    store.removeNpc(selectedNpc)
    store.setSelectedNpc(null)
  }

  const updateFn = debounce((obj: any) => {
    store.updateNpc(obj)
  }, 1000)
  return (
    <>
      <Scene />
      {store.npcs
        .filter((e) => e.scene === store.scene)
        .map((npc) => (
          <TransformControls
            enabled
            mode={mode}
            position={npc.position}
            rotation={npc.rotation}
            scale={npc.scale}
            key={npc.uuid}
            onClick={() => {
              selectNpc(npc.uuid)
            }}
            showX={store.selectedNpc === npc.uuid}
            showY={store.selectedNpc === npc.uuid}
            showZ={store.selectedNpc === npc.uuid}
            onObjectChange={(e) => {
              // @ts-ignore
              const { position, scale, rotation } = e.target.object
              updateFn({
                ...npc,
                position: [position.x, position.y, position.z],
                scale: [scale.x, scale.y, scale.z],
                rotation: [rotation.x, rotation.y, rotation.z],
              })
            }}
          >
            <mesh>
              {store.selectedNpc === npc.uuid && (
                <Html position={[0, 0, 0]} center>
                  <Controls onDelete={deleteNpc} onChangeMode={(mode) => setMode(mode)} />
                </Html>
              )}
              <Npc {...npc} isEdit />
            </mesh>
          </TransformControls>
        ))}

      <KeyboardControls map={keyboardMap}>
        <Ecctrl maxVelLimit={5} floatHeight={0.1} animated>
          <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
            <Hero />
          </EcctrlAnimation>
        </Ecctrl>
      </KeyboardControls>
    </>
  )
}
