import { useGame as useGameConf } from "@/hooks/useGame"
import { defaultHero, GLBType } from "@/lib/game-store"
import { KeyboardControls } from "@react-three/drei"
import Ecctrl, { EcctrlAnimation } from "ecctrl"
import { useGltfMemo } from "../glb"

export function Glb(props: JSX.IntrinsicElements["group"] & GLBType) {
  const { scene } = useGltfMemo(props.url)
  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl maxVelLimit={props.scale?.at(1) * 5} scale={[1, 1, 1]} position={props.position} animated>
        <EcctrlAnimation characterURL={props.url} animationSet={props.animationSet}>
          <primitive position={[0, -0.65, 0]} object={scene} />
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
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
  const { data } = useGameConf()
  const hero = data?.gameConf?.glbs?.find((c) => c?.type === "hero") ?? defaultHero
  return <Glb {...hero} />
}
