import { TreeFile, TreeFolder } from "@/components/tree"
import { useGameConfigStore } from "@/lib/game-store"
import { cn } from "@/lib/utils"
import { PresetsType } from "@react-three/drei/helpers/environment-assets"
import { ChangeEvent, FormEvent } from "react"
import * as THREE from "three"
import { useEditor } from "../provider"

export function SceneList() {
  const store = useGameConfigStore()
  const scenes = store.scenes
  const { selectedScene, selected3dModel, setSelectedScene, setSelected3dModel } = useEditor()
  return (
    <ul>
      {scenes.map((scene) => (
        <li key={scene.uuid}>
          <details
            onClick={() => {
              setSelectedScene(scene.uuid)
              setSelected3dModel(undefined)
            }}
            open
          >
            <TreeFolder selected={scene.uuid === selectedScene}>
              <input
                type="text"
                value={scene.name}
                onChange={(e) => store.updateScene({ ...scene, name: e.target.value })}
                className="input mr-auto border-0 truncate max-w-20 px-0 bg-transparent outline-none focus:outline-none  input-xs rounded-none"
              />
              <button
                onClick={async () => {
                  store.removeScene(scene.uuid)
                  const glbs = store.glbs.filter((glb) => glb.scene === scene.uuid)
                  await Promise.resolve().then(() => glbs.forEach((glb) => store.removeGlb(glb)))
                  const [f] = store.scenes.filter((e) => e.uuid !== scene.uuid)
                  setSelectedScene(f?.uuid)
                }}
                className={cn("text-xs text-error ml-auto", {
                  hidden: scene.uuid !== selectedScene,
                })}
              >
                delete
              </button>
            </TreeFolder>

            <ul>
              {store.glbs
                .filter((glb) => glb.scene === scene.uuid)
                .map((glb) => (
                  <TreeFile
                    key={glb.uuid}
                    selected={glb.uuid === selected3dModel}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected3dModel(glb?.uuid)
                      setSelectedScene(scene.uuid)
                    }}
                  >
                    <input
                      type="text"
                      value={glb.name}
                      onChange={(e) => store.updateGlb({ ...glb, name: e.target.value })}
                      className="input mr-auto !p-0  !m-0  border-0 border-white truncate max-w-20 px-0 bg-transparent outline-none focus:outline-none  input-xs rounded-none"
                    />
                    <button
                      onClick={() => {
                        store.removeGlb(glb)
                        setSelected3dModel(undefined)
                      }}
                      className={cn("text-xs text-error ml-auto", {
                        hidden: glb.uuid !== selected3dModel,
                      })}
                    >
                      delete
                    </button>
                  </TreeFile>
                ))}
            </ul>
          </details>
        </li>
      ))}
    </ul>
  )
}

export function SceneTree() {
  const store = useGameConfigStore()
  const { selectedScene, setSelectedScene, newSceneName, setNewSceneName } = useEditor()

  const currentScene = store.scenes.find((scene) => scene.uuid === selectedScene)

  return (
    <div className="h-full  flex flex-col border-r border-white border-opacity-10 min-w-64 w-64">
      <div className="flex border border-base-content border-b border-opacity-10 px-4 py-2 text-lg font-bold items-end">
        <img src="/logo.png" alt="logo" className="w-8" />

        <div className="text-lg w-full">verse</div>
      </div>

      <ul className="menu  menu-xs overflow-y-auto h-full bg-base-200 max-h-full min-w-60">
        <li className="collapse-arrow">
          <TreeFolder selected>Current Game</TreeFolder>

          <ul>
            <li>
              <TreeFolder selected>Scenes</TreeFolder>
              <SceneList />
            </li>
          </ul>
        </li>
      </ul>

      <div className="w-full flex border-t border-white border-opacity-10   flex-col">
        {currentScene && (
          <>
            <div className="grid grid-cols-2 items-center gap-2 p-4">
              <div className="text-xs col-span-2 ">Edit Scene</div>
              <div className="text-xs ">Background:</div>
              <select
                value={currentScene?.preset}
                className="select z-50 w-full select-bordered   rounded-none select-xs  top-0 left-0 "
                onChange={(e) =>
                  store.updateScene({
                    ...currentScene,
                    preset: e.target.value as PresetsType,
                  })
                }
              >
                {["apartment", "city", "dawn", "forest", "lobby", "night", "park", "studio", "sunset", "warehouse"].map(
                  (cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="col-span-2 border-b border-white border-opacity-10" />
          </>
        )}
        <form
          className="p-4 flex w-full"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const uuid = new THREE.Object3D().uuid
            const name = e.currentTarget.newSceneName.value.trim()
            store.addScene({
              uuid,
              name,
              preset: "night",
            })
            e.currentTarget.newSceneName.value = ""
            setSelectedScene(uuid)
          }}
        >
          <input
            required
            type="text"
            name="newSceneName"
            value={newSceneName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSceneName(e.target.value)}
            placeholder="New Scene Name"
            className="input input-bordered input-xs rounded-none"
          />
          <input type="submit" className="btn ml-auto rounded-none btn-outline border-white border-opacity-10 btn-xs" />
        </form>
      </div>
    </div>
  )
}
