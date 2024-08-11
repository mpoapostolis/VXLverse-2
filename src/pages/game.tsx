import { GameGlb } from "@/components/glb"
import { Hero } from "@/components/hero"
import { useGame } from "@/hooks/useGame"
import { Environment } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { CuboidCollider, Physics } from "@react-three/rapier"
import { EcctrlJoystick } from "ecctrl"
import { useEffect, useRef, useState } from "react"
import { Dialogue } from "../components/dialogue"
import Lights from "../components/lights"
import { allScenes } from "../components/scene"
import { SceneText } from "../components/sceneText"
import { useStore } from "../lib/store"
import { cn } from "../lib/utils"

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
export function Game() {
  // const [state, setState] = useState<"intro" | "game" | "clickToPlay">("intro")
  const [state, setState] = useState<"intro" | "game" | "clickToPlay">("game")
  const store = useStore()
  const { data } = useGame()
  const [died, setDied] = useState(0)
  const time = store.time % 4
  let timeSrc = "night"
  if (time === 1) timeSrc = "morning"
  if (time === 2) timeSrc = "noon"
  if (time === 3) timeSrc = "afternoon"
  if (time === 0) timeSrc = "night"

  const scenes = data?.gameConf?.scenes
  const currentScene = scenes?.find((s) => s?.uuid === store?.scene) ?? scenes?.at(0)
  const glbs = data?.gameConf?.glbs?.filter((g) => g?.scene === currentScene?.uuid)
  useEffect(() => {
    ref?.current?.play().catch(() => {
      setState("clickToPlay")
    })
  }, [])

  const ref = useRef<HTMLVideoElement>(null)

  return state === "clickToPlay" ? (
    <div className="grid place-content-center w-screen h-screen">
      <button
        onClick={() => {
          ref?.current?.play()
          setState("intro")
        }}
        className="btn-warning btn px-4 py-2 rounded"
      >
        Click to play
      </button>
    </div>
  ) : state === "intro" ? (
    <video
      muted
      ref={ref}
      id="introVideo"
      autoPlay
      className="w-screen h-screen object-cover"
      onEnded={() => {
        setState("game")
      }}
    >
      <source src="/intro.webm" type="video/mp4" />
      <source src="/intro.mp4" type="video/mp4" />
    </video>
  ) : (
    <div className="w-screen h-screen">
      <SceneText />
      <Dialogue />

      <div className="fixed z-40 w-full top-0 flex gap-4">
        <div className="w-48 mr-auto grid gap-8 p-2 bg-opacity-50 bg-base-100 grid-cols-3">
          <div className="flex w-full items-center justify-center flex-col gap-2">
            <img className="w-6 h-6 top-0 right-0" src="/money.png" alt="clock" />
            <span className="text-white text-xs">x{store.money}</span>
          </div>
          <div className="flex w-full items-center justify-center flex-col gap-2">
            <img className="w-6 h-6 top-0 right-0" src={`/energy.png`} alt="clock" />
            <span className="text-white text-xs">x{store.energy}</span>
          </div>
          <div className="flex w-full items-center justify-center flex-col gap-2 mr-auto">
            <img className="w-6 h-6 top-0 right-0" src={`/${timeSrc}.png`} alt="clock" />
            <span className="text-white text-xs">
              {time === 1 && "Morning"}
              {time === 2 && "Noon"}
              {time === 3 && "Evening"}
              {time === 0 && "Night"}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            store.setDialog({
              content: "Change location",
              divider: "Where do you want to go?",
              choices: allScenes
                .filter((c) => c !== store?.scene)
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
          className="bg-base-200 h-fit text-white px-4 py-2 rounded"
        >
          Change location
        </button>
      </div>
      {isMobile && (!store.dialog || store.sceneText) ? (
        <EcctrlJoystick buttonPositionRight={30} buttonPositionBottom={20} />
      ) : (
        <div className="fixed hidden md:block z-40 bottom-4 select-none pointer-events-none left-4">
          <img className="w-44" src="/keyControls.png" alt="control keys" />
        </div>
      )}
      <Canvas
        key={store.scene + died}
        shadows
        className={cn("w-full h-full", {
          blur: store.dialog?.content,
        })}
      >
        {/* <fog attach="fog" args={["#000", 0, 30]} /> */}
        <Environment background preset={currentScene?.preset ?? "night"} />
        <Lights />
        <Physics debug key={store.scene} timeStep="vary">
          <CuboidCollider
            onCollisionEnter={() => {
              store.setSceneText("You died")
              setDied(died + 1)
            }}
            args={[100, 1, 100]}
            position={[0, -15, 0]}
          />
          <Hero />
          {glbs
            ?.filter((glb) => glb.type !== "hero")
            ?.filter((e) => e?.scene === currentScene.uuid)
            .map((glb) => <GameGlb key={glb.uuid} {...glb} />)}
        </Physics>
      </Canvas>
    </div>
  )
}
