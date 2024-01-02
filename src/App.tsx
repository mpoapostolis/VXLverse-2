import { Box, Environment, KeyboardControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics, RigidBody } from "@react-three/rapier"
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { Suspense, useState } from "react"

import { Floor } from "./components/floor"
import { Hero } from "./components/hero"
import Lights from "./components/lights"
import { Map } from "./components/map"
import { TypeWritter } from "./components/windText"

export default function App() {
  const [scale, setScale] = useState(1)
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

  return (
    <div className="w-screen h-screen">
      <EcctrlJoystick buttonNumber={3} />
      <TypeWritter text="Hello world" />
      <Canvas shadows className="w-full h-full">
        <Environment background preset="night" />
        <Lights />
        <Suspense fallback={null}>
          <Physics timeStep="vary" debug>
            <KeyboardControls map={keyboardMap}>
              {/* @ts-expect-error: No idea why */}
              <Ecctrl animated>
                <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
                  <Hero scale={scale} />
                </EcctrlAnimation>
              </Ecctrl>
            </KeyboardControls>
            <RigidBody type="fixed" onCollisionEnter={(e) => console.log(e)} colliders="cuboid">
              <Floor />
            </RigidBody>
            <RigidBody type="fixed" onCollisionEnter={(e) => console.log(e)} colliders="cuboid">
              <Box args={[1, 1, 1]} position={[0, -0, -1]} onClick={() => setScale(scale + 1)} />
            </RigidBody>
            <RigidBody type="fixed" colliders="trimesh">
              <Map />
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}
