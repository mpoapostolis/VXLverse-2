import { Environment, KeyboardControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { Hero } from "./components/characters/hero"
import { Dialogue } from "./components/dialogue"
import { Ghost } from "./components/ghost"
import Lights from "./components/lights"

import { House } from "./components/scenes/house"
import { SceneText } from "./components/sceneText"
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
  const characterURL = "./hero.glb"

  type ActionName =
    | "HumanArmature|Man_Clapping"
    | "HumanArmature|Man_Death"
    | "HumanArmature|Man_Idle"
    | "HumanArmature|Man_Jump"
    | "HumanArmature|Man_Punch"
    | "HumanArmature|Man_Run"
    | "HumanArmature|Man_RunningJump"
    | "HumanArmature|Man_Sitting"
    | "HumanArmature|Man_Standing"
    | "HumanArmature|Man_SwordSlash"
    | "HumanArmature|Man_Walk"

  /**
   * Character animation set preset
   */
  const animationSet: Record<string, ActionName> = {
    idle: "HumanArmature|Man_Idle",
    walk: "HumanArmature|Man_Walk",
    run: "HumanArmature|Man_Run",
    jump: "HumanArmature|Man_Jump",
    jumpIdle: "HumanArmature|Man_Idle", // Assuming jump idle is the same as idle
    jumpLand: "HumanArmature|Man_Idle", // Assuming jump land is the same as idle
    fall: "HumanArmature|Man_Death", // Assuming fall is the same as death
    action1: "HumanArmature|Man_Clapping",
    action2: "HumanArmature|Man_Death",
    action3: "HumanArmature|Man_Idle", // Assuming hit react is the same as idle
    action4: "HumanArmature|Man_Punch",
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const store = useStore()

  return (
    <div className="w-screen h-screen">
      <SceneText />
      <Dialogue />
      {isMobile && !store.dialog && !store.sceneText ? (
        <EcctrlJoystick buttonPositionRight={30} buttonPositionBottom={20} buttonNumber={2} />
      ) : (
        <div className="fixed hidden md:block z-40 bottom-4  select-none pointer-events-none left-4">
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

          <House />
          <Ghost position={[2, -2, 2]} rotation={[0, (3 / Math.PI) * 5, 0]} />
        </Physics>
      </Canvas>
    </div>
  )
}
