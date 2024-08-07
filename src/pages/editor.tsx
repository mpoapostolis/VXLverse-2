import { Assets } from "@/components/editor/assets"
import { EditorCanvas } from "@/components/editor/canvas"
import { Controls } from "@/components/editor/controls"
import { EditorProvider, useEditor } from "@/components/editor/provider"
import { SceneTree } from "@/components/editor/sceneTree"
import { Settings } from "@/components/editor/settings"
import { useGameConfigStore } from "@/lib/game-store"
import { Suspense } from "react"
import { cn } from "../lib/utils"

function Edit() {
  const store = useGameConfigStore()
  const { selectedScene, selected3dModel, setSelected3dModel } = useEditor()

  const currentScene = store.scenes.find((scene) => scene.uuid === selectedScene)
  const currentGlb = store.glbs.find((glb) => glb.uuid === selected3dModel)
  return (
    <div key={selectedScene} className="w-screen  h-screen flex">
      <SceneTree />

      <div className="h-screen flex flex-col w-full relative">
        {selected3dModel && <Controls />}
        {store.scenes.length ? (
          <EditorCanvas />
        ) : (
          <div className="w-full h-full border-t bg-black bg-opacity-50 border-opacity-10 border-white grid place-items-center text-center text-lg font-bold">
            Create a scene to start adding models
          </div>
        )}

        {currentScene && <Assets />}
      </div>
      <div
        key={selected3dModel}
        className={cn("w-96 border-l  h-screen border-opacity-10 border-white overflow-y-auto", {
          hidden: !selected3dModel,
          block: selected3dModel,
        })}
      >
        <div className="gap-4 items-center justify-between p-4 border-b border-white border-opacity-10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold">{currentGlb?.name}</div>
            <button
              onClick={() => {
                setSelected3dModel(null)
              }}
              className="btn btn-xs w-fit btn-error btn-outline rounded-none"
            >
              Close
            </button>
          </div>
        </div>
        <Suspense>{currentGlb && <Settings {...currentGlb} />}</Suspense>
      </div>
    </div>
  )
}

export function Editor() {
  return (
    <EditorProvider>
      <Edit />
    </EditorProvider>
  )
}
