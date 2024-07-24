import { Environment, KeyboardControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { animationSet, characterURL, Hero, keyboardMap } from "./components/hero"
import Lights from "./components/lights"

import { Dialogue } from "./components/dialogue"
import { Npc } from "./components/npc"
import { allScenes, Scene } from "./components/scene"
import { SceneText } from "./components/sceneText"
import { useStore } from "./lib/store"
import { cn } from "./lib/utils"

export default function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const store = useStore()
  return (
    <div className="w-screen h-screen">
      <SceneText />
      <Dialogue />
      <div className="fixed z-40 top-4 right-4">
        <button
          onClick={() => {
            store.setDialog({
              content: "Change location",
              divider: "Where do you want to go?",
              choices: allScenes
                .filter((c) => c !== store.scene)
                .map((s) => ({
                  label: s,
                  onSelect: () => {
                    store.setScene(s)
                    store.setSceneText(s)
                    store.setDialog(null)
                  },
                })),
            })
          }}
          className="bg-base-200 text-white px-4 py-2 rounded"
        >
          Change location
        </button>
      </div>
      {isMobile && (!store.dialog || store.sceneText) ? (
        <EcctrlJoystick buttonPositionRight={30} buttonPositionBottom={20} buttonNumber={2} />
      ) : (
        <div className="fixed hidden md:block z-40 bottom-4  select-none pointer-events-none left-4">
          <img className="w-44" src="/keyControls.png" alt="control keys" />
        </div>
      )}
      <Canvas
        color="#171717"
        key={store.scene}
        shadows
        className={cn("w-full  h-full", {
          blur: store.dialog?.content,
        })}
      >
        <fog attach="fog" args={["#000", 0, 30]} />
        <Environment background preset="night" />
        <Lights />
        <Physics key={store.scene} timeStep="vary">
          <KeyboardControls map={keyboardMap}>
            <Ecctrl animated>
              <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
                <Hero />
              </EcctrlAnimation>
            </Ecctrl>
          </KeyboardControls>
          {store.npcs
            .filter((e) => e.scene === store.scene)
            .map((npc) => (
              <Npc key={npc.uuid} {...npc} />
            ))}
          <Scene />
        </Physics>
      </Canvas>
    </div>
  )
}
export { animationSet, characterURL }
