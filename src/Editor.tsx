import { Canvas, useFrame, useThree, Vector3 } from "@react-three/fiber"

import { Environment, Html, KeyboardControls, TransformControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { Perf } from "r3f-perf"
import { useRef, useState } from "react"
import * as THREE from "three"
import { isMobile } from "./App"
import { Controls } from "./components/controls"
import { Dialogue } from "./components/dialogue"
import { allGlbTypes, Glb } from "./components/glb"
import { animationSet, characterURL, Hero, keyboardMap } from "./components/hero"
import Lights from "./components/lights"
import { allScenes, Scene } from "./components/scene"
import { useStore } from "./lib/store"
import { debounce } from "./lib/utils"

export default function Editor() {
  const store = useStore()

  const ref = useRef<THREE.Vector3>(new THREE.Vector3())
  return (
    <div className="w-screen h-screen">
      <div className="fixed flex gap-4 z-40 top-4 right-4">
        <div className="dropdown">
          <div
            tabIndex={0}
            onClick={() => store.setSelectedGlb(null)}
            className="btn rounded-none bg-base-200 btn-sm text-white"
          >
            Add Glb
          </div>
          <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-none z-[1] w-52 p-2 shadow">
            <label className="label">
              <span className="label-text">Npc</span>
            </label>
            {allGlbTypes
              .filter((e) => e !== "coin")
              .map((glb) => (
                <li
                  key={glb}
                  onClick={() => {
                    // get oject by uuid
                    const [x, y, z] = ref.current.toArray()
                    const uuid = new THREE.Object3D().uuid
                    store.setSelectedGlb(uuid)
                    store.addGlb({
                      uuid,
                      name: glb,
                      position: [x - 0.5, y, z - 0.5],
                      scale: [1, 1, 1],
                      rotation: [0, 0, 0],
                      scene: store.scene,
                      type: "npc",
                    })
                  }}
                >
                  <a>{glb}</a>
                </li>
              ))}
            <div className="divider m-0" />
            <label className="label">
              <span className="label-text">Misc</span>
            </label>
            {allGlbTypes
              .filter((e) => e === "coin")
              .map((glb) => (
                <li
                  key={glb}
                  onClick={() => {
                    // get oject by uuid
                    const [x, y, z] = ref.current.toArray()
                    const uuid = new THREE.Object3D().uuid
                    store.setSelectedGlb(uuid)
                    store.addGlb({
                      uuid,
                      name: glb,
                      position: [x - 0.5, y, z - 0.5],
                      scale: [1, 1, 1],
                      rotation: [0, 0, 0],
                      scene: store.scene,
                      type: "misc",
                    })
                  }}
                >
                  <a>{glb}</a>
                </li>
              ))}
          </ul>
        </div>

        <div className="dropdown">
          <div
            tabIndex={0}
            onClick={() => store.setSelectedGlb(null)}
            className="btn rounded-none bg-base-200 btn-sm text-white"
          >
            Change location
          </div>
          <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-none z-[1] w-52 p-2 shadow">
            {allScenes.map((scene) => (
              <li
                key={scene}
                onClick={() => {
                  store.setSelectedGlb(null)
                  store.setScene(scene)
                }}
              >
                <a>{scene}</a>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => {
            //export store as json
            // Convert the JSON object to a string
            const jsonString = JSON.stringify(store.glbs, null, 2)

            // Create a Blob from the JSON string
            const blob = new Blob([jsonString], { type: "application/json" })

            // Create a link element
            const link = document.createElement("a")

            // Set the download attribute with a filename
            link.download = `game-settings.json`

            // Create a URL for the Blob and set it as the href attribute
            link.href = URL.createObjectURL(blob)

            // Append the link to the body
            document.body.appendChild(link)

            // Programmatically click the link to trigger the download
            link.click()

            // Remove the link from the document
            document.body.removeChild(link)
          }}
          className="btn rounded-none bg-base-200 btn-sm text-white"
        >
          Save
        </button>
      </div>
      {isMobile && (!store.dialog || store.sceneText) ? (
        <EcctrlJoystick buttonPositionRight={30} buttonPositionBottom={20} buttonNumber={2} />
      ) : (
        <div className="fixed hidden md:block z-40 bottom-4  select-none pointer-events-none left-4">
          <img className="w-44" src="/keyControls.png" alt="control keys" />
        </div>
      )}

      <Dialogue />
      <Canvas key={store.scene} shadows>
        <Environment background preset="night" />
        <Lights />
        <Physics timeStep="vary">
          <Content rref={ref} />
        </Physics>
      </Canvas>
    </div>
  )
}

function Content(props: { rref: React.MutableRefObject<Vector3> }) {
  const store = useStore()

  const selectNpc = (uuid: string) => {
    store.setSelectedGlb(uuid)
  }

  const [mode, setMode] = useState<"scale" | "translate" | "rotate">("translate")
  const selectedGlb = store.glbs.find((e) => e.uuid === store.selectedGlb)
  const deleteNpc = () => {
    store.removeGlb(selectedGlb)
    store.setSelectedGlb(null)
  }

  const updateFn = debounce((obj: any) => {
    store.updateGlb(obj)
  }, 1000)
  const t = useThree()
  useFrame((t) => {})
  return (
    <>
      <Perf position="top-left" />

      <Scene />
      {store.glbs
        .filter((e) => e.scene === store.scene)
        .map((glb) => (
          <TransformControls
            enabled
            mode={mode}
            position={glb.position}
            rotation={glb.rotation}
            scale={glb.scale}
            key={glb.uuid}
            onClick={() => {
              selectNpc(glb.uuid)
            }}
            showX={store.selectedGlb === glb.uuid}
            showY={store.selectedGlb === glb.uuid}
            showZ={store.selectedGlb === glb.uuid}
            onObjectChange={(e) => {
              // @ts-ignore
              const { position, scale, rotation } = e.target.object
              updateFn({
                ...glb,
                position: [position.x, position.y, position.z],
                scale: [scale.x, scale.y, scale.z],
                rotation: [rotation.x, rotation.y, rotation.z],
              })
            }}
          >
            <mesh>
              {store.selectedGlb === glb.uuid && (
                <Html position={[0, 0, 0]} center>
                  <Controls onDelete={deleteNpc} onChangeMode={(mode) => setMode(mode)} />
                </Html>
              )}
              <Glb {...glb} isEdit />
            </mesh>
          </TransformControls>
        ))}

      <KeyboardControls map={keyboardMap}>
        <Ecctrl
          name="hero1"
          onContactForce={(payload) => {
            props.rref.current = t.scene.getObjectByName("hero1").position
          }}
          maxVelLimit={5}
          floatHeight={0.1}
          animated
        >
          <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
            <Hero />
          </EcctrlAnimation>
        </Ecctrl>
      </KeyboardControls>
    </>
  )
}
