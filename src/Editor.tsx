import { Environment, Html, KeyboardControls, TransformControls } from "@react-three/drei"
import { Canvas, useThree, Vector3 } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { useRef, useState } from "react"
import * as THREE from "three"
import { isMobile } from "./App"
import { Dialogue } from "./components/dialogue"
import { AllGLBType, allGlbTypes, Glb } from "./components/glb"
import { animationSet, characterURL, Hero, keyboardMap } from "./components/hero"
import Lights from "./components/lights"
import { allScenes, Scene } from "./components/scene"
import { Settings } from "./components/settings"
import { useStore } from "./lib/store"
import { cn, debounce } from "./lib/utils"

export default function Editor() {
  const store = useStore()
  const ref = useRef<THREE.Vector3>(new THREE.Vector3())
  const [died, setDied] = useState(0)

  const clearGlbs = () => {
    setDied((prev) => prev + 1)
    store.glbs.forEach((glb) => {
      if (glb?.scene === store.scene) store.removeGlb(glb)
    })
  }

  const addGlb = (glb: AllGLBType) => {
    const [x, y, z] = ref.current.toArray()
    const uuid = new THREE.Object3D().uuid
    store.setSelectedGlb(uuid)

    store.addGlb({
      uuid,
      name: glb?.name,
      position: [x - 0.5, y, z - 0.5],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      scene: store.scene,
      type: glb?.type,
    })
  }

  const changeLocation = (scene: string) => {
    store.setSelectedGlb(null)
    store.setScene(scene)
  }

  // const saveSettings = () => {
  //   const jsonString = JSON.stringify(store.glbs, null, 2)
  //   const blob = new Blob([jsonString], { type: "application/json" })
  //   const link = document.createElement("a")
  //   link.download = `game-settings.json`
  //   link.href = URL.createObjectURL(blob)
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  return (
    <div className="w-screen h-screen">
      <Settings />
      <div
        className={cn(
          "fixed gap-4 z-40 md:top-4  top-0 justify-between bg-base-200 w-full px-4  ml-auto md:right-4 flex md:justify-end md:w-fit",
          {
            "top-11": store.selectedGlb,
          },
        )}
      >
        <button className="btn  rounded-none bg-base-200 btn-sm text-white" onClick={clearGlbs}>
          Clear
        </button>
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
              .filter((e) => e.type === "npc")
              .map((glb) => (
                <li key={glb?.name} onClick={() => addGlb(glb)}>
                  <a>{glb?.name}</a>
                </li>
              ))}
            <div className="divider m-0" />
            <label className="label">
              <span className="label-text">Misc</span>
            </label>
            {allGlbTypes
              .filter((e) => e.type === "misc")
              .map((glb) => (
                <li key={glb?.name} onClick={() => addGlb(glb)}>
                  <a>{glb?.name}</a>
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
              <li key={scene} onClick={() => changeLocation(scene)}>
                <a>{scene}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isMobile && (!store.dialog || store.sceneText) ? (
        <EcctrlJoystick buttonPositionRight={30} buttonPositionBottom={20} />
      ) : (
        <div className="fixed hidden md:block z-40 bottom-4 select-none pointer-events-none left-4">
          <img className="w-44" src="/keyControls.png" alt="control keys" />
        </div>
      )}
      <Dialogue />
      <Canvas key={store.scene + died} shadows>
        <Environment background preset="night" />
        <Lights />
        <Physics timeStep="vary">
          <Content rref={ref} />
        </Physics>
      </Canvas>
    </div>
  )
}

export type TransformMode = "scale" | "translate" | "rotate"
function Content({ rref }: { rref: React.MutableRefObject<Vector3> }) {
  const store = useStore()

  const updateGlb = debounce((obj: any) => {
    store.updateGlb(obj)
  }, 1000)
  const t = useThree()
  return (
    <>
      {/* {!isMobile && <Perf position="top-left" />} */}
      <Scene />
      {store.glbs
        .filter((e) => e.scene === store.scene)
        .map((glb) => (
          <TransformControls
            key={glb?.uuid}
            enabled
            mode={store.transformMode}
            position={glb?.position}
            rotation={glb?.rotation}
            scale={glb?.scale}
            onClick={() => store.setSelectedGlb(glb?.uuid)}
            showX={store.selectedGlb === glb?.uuid}
            showY={store.selectedGlb === glb?.uuid}
            showZ={store.selectedGlb === glb?.uuid}
            onObjectChange={(e) => {
              // @ts-ignore
              const { position, scale, rotation } = e.target.object
              updateGlb({
                ...glb,
                position: [position.x, position.y, position.z],
                scale: [scale.x, scale.y, scale.z],
                rotation: [rotation.x, rotation.y, rotation.z],
              })
            }}
          >
            <mesh>
              {store.selectedGlb === glb?.uuid && (
                <Html sprite position={[0, -0.5, 0]} center>
                  {/* <Controls onDelete={deleteNpc} onChangeMode={setMode} /> */}
                </Html>
              )}
              <Glb {...glb} isEdit />
            </mesh>
          </TransformControls>
        ))}
      <KeyboardControls map={keyboardMap}>
        <Ecctrl
          maxVelLimit={10}
          name="hero1"
          onContactForce={(payload) => {
            const pos = t.scene.getObjectByName("hero1").position
            rref.current = pos
          }}
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
