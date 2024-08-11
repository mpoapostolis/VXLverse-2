/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGame } from "@/hooks/useGame"
import { GLBType } from "@/lib/game-store"
import { KeyboardControls, useGLTF } from "@react-three/drei"
import Ecctrl, { EcctrlAnimation } from "ecctrl"
import { useMemo } from "react"
import { SkeletonUtils } from "three/examples/jsm/Addons.js"

function useGltfMemo(url: string) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene])
  return { ...gltf, animations: [...gltf.animations], scene: scene }
}

export function Glb(props: JSX.IntrinsicElements["group"] & GLBType) {
  const { scene } = useGltfMemo(props.url)

  return (
    <group uuid={props.uuid} scale={props.scale} position={[0, -props.scale[1] / 2, 0]} dispose={null}>
      <primitive object={scene} dispose={null} />
    </group>
  )
}

/**
 * Keyboard control preset
 */
export const keyboardMap = [
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

export function Hero() {
  const { data } = useGame()
  const hero = data?.gameConf?.glbs?.find((c) => c?.type === "hero")
  return (
    hero?.uuid && (
      <KeyboardControls map={keyboardMap}>
        <Ecctrl
          mode="firstPerson"
          position={hero?.position}
          onCollisionEnter={(e) => {
            // store.addItemToInventory(e.colliderObject.name)
          }}
          animated
        >
          <EcctrlAnimation
            characterURL={hero.url}
            animationSet={{
              idle: hero.animationSet.idle,
              walk: hero.animationSet.walk,
              run: hero.animationSet.run,
              jump: hero.animationSet.jump,
              jumpIdle: hero.animationSet.jump,
              jumpLand: hero.animationSet.idle,
              fall: hero.animationSet.idle,
              action1: hero.animationSet.action1,
              action2: hero.animationSet.action2,
              action3: hero.animationSet.idle,
              action4: hero.animationSet.action4,
            }}
          >
            <Glb {...hero} />
          </EcctrlAnimation>
        </Ecctrl>
      </KeyboardControls>
    )
  )
}
