import { Environment, KeyboardControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { Dialogue } from "./components/dialogue"
import { Ghost } from "./components/ghost"
import { Hero } from "./components/hero"
import Lights from "./components/lights"
import { Map } from "./components/map"
import { useStore } from "./lib/store"
import { cn } from "./lib/utils"

export default function App() {
  /**
   * Keyboard control preset
   */
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
    { name: "action4", keys: ["KeyF"] },
  ]

  /**
   * Character url preset
   */
  const characterURL = "./Demon.glb"

  /**
   * Character animation set preset
   */
  const animationSet = {
    idle: "CharacterArmature|Idle",
    walk: "CharacterArmature|Walk",
    run: "CharacterArmature|Run",
    jump: "CharacterArmature|Jump",
    jumpIdle: "CharacterArmature|Jump_Idle",
    jumpLand: "CharacterArmature|Jump_Land",
    fall: "CharacterArmature|Duck", // This is for falling from high sky
    action1: "CharacterArmature|Wave",
    action2: "CharacterArmature|Death",
    action3: "CharacterArmature|HitReact",
    action4: "CharacterArmature|Punch",
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const store = useStore()
  return (
    <div className="w-screen h-screen">
      <Dialogue />
      {isMobile ? (
        <EcctrlJoystick buttonNumber={0} />
      ) : (
        <div className="fixed z-40 bottom-4  select-none pointer-events-none left-4">
          <img className="w-44" src="/keyControls.png" alt="control keys" />
        </div>
      )}
      <Canvas
        shadows
        className={cn("w-full  h-full", {
          blur: store.dialog,
        })}
      >
        <Environment background preset="night" />
        <Lights />
        <Physics timeStep="vary">
          <KeyboardControls map={keyboardMap}>
            <Ecctrl animated>
              <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
                <Hero />
              </EcctrlAnimation>
            </Ecctrl>
          </KeyboardControls>

          <Map />
          <Ghost position={[24, 0, 1]} rotation={[0, (3 / Math.PI) * 5, 0]} />
        </Physics>
      </Canvas>
    </div>
  )
}
