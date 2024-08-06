import { Controls } from "@/components/controls"
import { Settings } from "@/components/settings"
import { TreeFile, TreeFolder } from "@/components/tree"
import { Model3d, use3dModels } from "@/hooks/use3dModels"
import { GameConfigStore, useGameConfigStore } from "@/lib/game-store"
import { Environment, GizmoHelper, GizmoViewport, OrbitControls, TransformControls } from "@react-three/drei"
import { PresetsType } from "@react-three/drei/helpers/environment-assets"
import { Canvas, useFrame, Vector3 } from "@react-three/fiber"
import { ChangeEvent, DragEvent, FC, FormEvent, Suspense, useEffect, useState } from "react"
import * as THREE from "three"
import { Glb } from "../components/glb"
import { cn, debounce } from "../lib/utils"

const categories: string[] = [
  "Scenes & Levels",
  "Nature",
  "Weapons",
  "People & Characters",
  "Objects",
  "Transport",
  "Buildings",
  "Other",
  "Food & Drink",
  "Buildings (Architecture)",
  "Animals",
  "Furniture & Decor",
  "Clutter",
]

interface ModelSearchProps {
  isLoading: boolean
  total: number
  changeSearchTerm: (str: string) => void
  activeTab: string
  setPage: (page: number) => void
  page: number
  totalPages: number
}

const ModelSearch: FC<ModelSearchProps> = ({
  isLoading,
  setPage,
  total,
  changeSearchTerm,
  activeTab,
  page,
  totalPages,
}) => (
  <div className="w-full border-b h-10 border-opacity-10 border-white sticky p-4 py-2 top-0 flex px-4 items-center gap-2">
    <input
      key={activeTab}
      onChange={(e: ChangeEvent<HTMLInputElement>) => changeSearchTerm(e.target.value)}
      type="text"
      placeholder="🔍   Search...."
      className="input input-xs rounded-none input-bordered mr-auto"
    />

    <button
      className="btn btn-sm text-base-content  btn-link  rounded-none"
      onClick={() => setPage(page - 1)}
      disabled={page === 0}
    >
      Prev
    </button>
    {isLoading ? (
      "Loading..."
    ) : (
      <div className="select-none">
        <div className="font-bold text-xs">{`Page: ${page + 1} of ${totalPages}`}</div>
      </div>
    )}

    <button
      className="btn btn-sm text-base-content  btn-link rounded-none"
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages - 1}
    >
      Next
    </button>
  </div>
)

interface ModelGridProps {
  data: Model3d[]
  isLoading: boolean
  page: number
  totalPages: number
}

const ModelGrid: FC<ModelGridProps> = ({ data, isLoading }) => (
  <div className="grid w-full p-4 pb-20 grid-cols-3  2xl:grid-cols-6 xl:grid-cols-6 gap-4">
    {isLoading && (
      <div className="w-full my-auto h-60 xl:col-span-6 col-span-3 2xl:col-span-8 grid place-items-center text-center text-lg font-bold">
        Loading...
      </div>
    )}
    {!isLoading && data?.length === 0 && (
      <div className="w-full my-auto xl:col-span-6 col-span-3 2xl:col-span-8 h-60 grid place-items-center text-center text-lg font-bold">
        No models found
      </div>
    )}
    {data?.map((model) => (
      <div
        key={model.id}
        onDragStart={(event: DragEvent<HTMLDivElement>) => {
          event.dataTransfer.setData("application/json", JSON.stringify(model))
        }}
        draggable
        className="relative   overflow-hidden z-50"
      >
        <img role="button" src={model.thumbnail} alt={model.name} className="w-full h-32 rounded-none" />
        <p className="text-xs absolute text-center  bottom-0 w-full bg-black bg-opacity-50 p-2 truncate">
          {model?.name}
        </p>
        {model.animated && (
          <div className="absolute -top-2   right-0 ">
            <button className="badge p-1 rounded-none badge-xs badge-warning">Animated</button>
          </div>
        )}
      </div>
    ))}
  </div>
)

interface SceneListProps {
  scenes: any[]
  selectedScene: string | undefined
  setSelectedScene: (uuid: string) => void
  setSelected3dModel: (uuid: string) => void
  store: GameConfigStore
  selected3dModel: string | undefined
}

const SceneList: FC<SceneListProps> = ({
  scenes,
  selectedScene,
  setSelectedScene,
  selected3dModel,
  setSelected3dModel,
  store,
}) => (
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

interface SceneFormProps {
  newSceneName: string
  setNewSceneName: (name: string) => void
  store: any
  setSelectedScene: (uuid: string) => void
}

const SceneForm: FC<SceneFormProps> = ({ newSceneName, setNewSceneName, store, setSelectedScene }) => (
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
)

function Camera({ position }: { position: [number, number, number] }) {
  const stopThreshold = 10 // Distance threshold to stop the camera
  let pos: Vector3 = undefined
  useEffect(() => {
    pos = new THREE.Vector3(...position)
  }, [position])

  useFrame(({ camera }) => {
    if (!pos) return
    // @ts-ignore
    const distance = camera.position.distanceTo(pos)
    if (distance < stopThreshold) pos = undefined
    const targetVec = new THREE.Vector3(...position)
    const tempPosition = new THREE.Vector3()

    if (distance > stopThreshold) {
      camera.lookAt(targetVec)
      tempPosition.lerpVectors(camera.position, targetVec, 0.25)
      camera.position.copy(tempPosition)
    }
  })
  const [x, y, z] = position
  return <OrbitControls makeDefault target={[x, Math.max(y - 10, 0), z]} />
}

export const Editor: FC = () => {
  const store = useGameConfigStore()
  const [category, setCategory] = useState<string>(categories[0])
  const [selected3dModel, setSelected3dModel] = useState<string>()
  const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate")
  const [selectedScene, setSelectedScene] = useState<string>()
  const [page, setPage] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [newSceneName, setNewSceneName] = useState<string>("")
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0])
  const [assetCategory, setAssetCategory] = useState<string>("Library")

  const { data, isLoading, total, totalPages } = use3dModels(page, category, searchTerm)

  const changeSearchTerm = debounce((str: string) => {
    setSearchTerm(str)
    setPage(0)
  }, 500)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    const data = e?.dataTransfer?.getData("application/json")
    if (!data) return
    const parsedData = JSON.parse(data) as Model3d
    const uuid = new THREE.Object3D().uuid
    store.addGlb({
      uuid,
      url: parsedData?.glb,
      name: parsedData?.name,
      glbName: parsedData?.name,
      position: [0, 0, 0],
      shownTime: {
        morning: true,
        afternoon: true,
        evening: true,
        night: true,
        noon: true,
      },
      thumbnail: parsedData?.thumbnail,
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      scene: selectedScene,
      type: "npc",
    })
    setSelected3dModel(uuid)
  }

  const updateFn = debounce((obj: any) => {
    store.updateGlb(obj)
  }, 1000)
  const keyForCanvas = selected3dModel ? "resize" : "not"
  const currentScene = store.scenes.find((scene) => scene.uuid === selectedScene)
  const currentGlb = store.glbs.find((glb) => glb.uuid === selected3dModel)
  return (
    <div key={selectedScene} className="w-screen  h-screen flex">
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
                <SceneList
                  selected3dModel={selected3dModel}
                  scenes={store.scenes}
                  selectedScene={selectedScene}
                  setSelectedScene={setSelectedScene}
                  setSelected3dModel={(id) => {
                    setSelected3dModel(id)
                  }}
                  store={store}
                />
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
                  {[
                    "apartment",
                    "city",
                    "dawn",
                    "forest",
                    "lobby",
                    "night",
                    "park",
                    "studio",
                    "sunset",
                    "warehouse",
                  ].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 border-b border-white border-opacity-10" />
            </>
          )}

          <SceneForm
            newSceneName={newSceneName}
            setNewSceneName={setNewSceneName}
            store={store}
            setSelectedScene={setSelectedScene}
          />
        </div>
      </div>
      <div className="h-screen flex flex-col w-full relative">
        {selected3dModel && (
          <Controls
            setPos={() => {
              const pos = currentGlb?.position ?? [0, 0, 0]
              setPosition(pos)
            }}
            mode={mode}
            setMode={(m) => setMode(m)}
          />
        )}
        {store.scenes.length ? (
          <Canvas key={keyForCanvas} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} shadows>
            <Camera position={position ?? [0, 10, 0]} />
            <gridHelper args={[1000, 1000]} />
            <Environment background preset={currentScene?.preset ?? "night"} />
            <ambientLight />
            <GizmoHelper alignment="top-right" margin={[80, 80]}>
              <GizmoViewport axisColors={["#FF7F9A", "#C2EE00", "#73C5FF"]} />
            </GizmoHelper>

            {store.glbs
              .filter((glb) => glb.scene === selectedScene)
              .map((glb) => (
                <TransformControls
                  mode={mode}
                  key={glb.uuid}
                  position={glb.position}
                  scale={glb.scale}
                  rotation={glb.rotation}
                  showX={selected3dModel === glb.uuid}
                  showY={selected3dModel === glb.uuid}
                  showZ={selected3dModel === glb.uuid}
                  enabled={selected3dModel === glb.uuid}
                  onClick={() => {
                    setSelected3dModel(glb.uuid)
                  }}
                  onObjectChange={(e) => {
                    // @ts-ignore
                    const { position, scale, rotation } = e.target.object
                    updateFn({
                      ...glb,
                      position: [position.x, position.y, position.z],
                      scale: [scale.x, scale.y, scale.z],
                      rotation: [rotation.x, rotation.y, rotation.z],
                    })
                  }}
                >
                  <Glb isEdit {...glb} />
                </TransformControls>
              ))}
          </Canvas>
        ) : (
          <div className="w-full h-full border-t bg-black bg-opacity-50 border-opacity-10 border-white grid place-items-center text-center text-lg font-bold">
            Create a scene to start adding models
          </div>
        )}

        {currentScene && (
          <div className={cn("w-full h-full max-h-[26rem] border-t border-white border-opacity-10 overflow-y-auto")}>
            <div className="flex w-full overflow-hidden h-full">
              <div>
                <button className="h-10 w-full text-left border-l-0 hover:bg-base-300 border-b pl-4 p-2 text-sm  font-semibold border-r border-white border-opacity-10">
                  Assets
                </button>

                <ul className="menu menu-xs  h-full overflow-y-auto bg-base-200 border-r border-opacity-10 border-white max-w-60 min-w-60">
                  <li>
                    <TreeFolder
                      onClick={() => {
                        setCategory("Library")
                      }}
                      selected={assetCategory === "Library"}
                    >
                      Library
                    </TreeFolder>

                    <ul>
                      {categories.map((cat) => (
                        <TreeFile
                          onClick={() => {
                            setAssetCategory("Library")
                            setCategory(cat)
                          }}
                          selected={cat === category}
                        >
                          {cat}
                        </TreeFile>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="h-full overflow-hidden w-full">
                <ModelSearch
                  activeTab={category}
                  changeSearchTerm={changeSearchTerm}
                  isLoading={isLoading}
                  page={page}
                  total={total}
                  totalPages={totalPages}
                  setPage={setPage}
                />
                <div className="overflow-auto h-full w-full">
                  <ModelGrid data={data} isLoading={isLoading} page={page} totalPages={totalPages} />
                </div>
              </div>
            </div>
          </div>
        )}
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

export type TransformMode = "scale" | "translate" | "rotate"
