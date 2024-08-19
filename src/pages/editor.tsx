import { Assets } from "@/components/editor/assets"
import { EditorCanvas } from "@/components/editor/canvas"
import { Controls } from "@/components/editor/controls"
import { EditorProvider, useEditor } from "@/components/editor/provider"
import { SceneTree } from "@/components/editor/sceneTree"
import { Settings } from "@/components/editor/settings"
import { useGame } from "@/hooks/useGame"
import { useGameConfigStore } from "@/lib/game-store"
import { Suspense } from "react"

function Edit() {
  const store = useGameConfigStore()
  const { selectedScene, selected3dModel } = useEditor()

  useGame()
  return (
    <div key={selectedScene} className="w-screen border  h-screen flex">
      <SceneTree />

      <div className="h-screen flex flex-col  w-full relative">
        <button
          // @ts-ignore
          onClick={() => document.getElementById("my_modal_3")?.showModal()}
          className="z-50 absolute btn-warning right-4 bg-base-200 bottom-4 btn-outline btn  rounded-none"
        >
          Add 3d Model{" "}
        </button>
        <dialog id="my_modal_3" className="modal w-full border grid place-items-center">
          <div className="modal-box w-11/12 max-w-[90vw]">
            <Assets />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {selected3dModel && <Controls />}
        {store.scenes.length ? (
          <EditorCanvas />
        ) : (
          <div className="w-full h-full border-t bg-black bg-opacity-50 border-opacity-10 border-white grid place-items-center text-center text-lg font-bold">
            Create a scene to start adding models
          </div>
        )}
      </div>
      <div key={selected3dModel} className="w-[30vw] border-l  h-screen border-opacity-10 border-white overflow-y-auto">
        <Suspense>
          <Settings />
        </Suspense>
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
