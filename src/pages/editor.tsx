import { Controls } from "@/components/controls"
import { Settings } from "@/components/settings"
import { Model3d, use3dModels } from "@/hooks/use3dModels"
import { GameConfigStore, useGameConfigStore } from "@/lib/game-store"
import { Environment, GizmoHelper, GizmoViewport, OrbitControls, TransformControls } from "@react-three/drei"
import { PresetsType } from "@react-three/drei/helpers/environment-assets"
import { Canvas, useFrame, Vector3 } from "@react-three/fiber"
import { useGame } from "ecctrl"
import { ChangeEvent, DragEvent, FC, FormEvent, useEffect, useState } from "react"
import * as THREE from "three"
import { Glb } from "../components/glb"
import { cn, debounce } from "../lib/utils"

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const FileIcon: FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
)

const FolderIcon: FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
    />
  </svg>
)

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
    {isLoading ? (
      "Loading..."
    ) : (
      <div className="mr-auto">
        <div className="font-bold text-xs">{`Page: ${page + 1}/${totalPages}`}</div>
        <div className="font-bold text-xs">{`Total: ${total} models`}</div>
      </div>
    )}
    <button className="btn btn-sm ml-auto btn-ghost" onClick={() => setPage(page - 1)} disabled={page === 0}>
      Prev
    </button>
    <button className="btn btn-sm btn-ghost" onClick={() => setPage(page + 1)} disabled={page === totalPages - 1}>
      Next
    </button>
    <input
      key={activeTab}
      onChange={(e: ChangeEvent<HTMLInputElement>) => changeSearchTerm(e.target.value)}
      type="text"
      placeholder="🔍   Search...."
      className="input input-xs rounded-none input-bordered"
    />
  </div>
)

interface ModelGridProps {
  data: Model3d[]
  isLoading: boolean
  page: number
  totalPages: number
}

const ModelGrid: FC<ModelGridProps> = ({ data, isLoading }) => (
  <div className="grid w-full p-4 pb-20 grid-cols-3  2xl:grid-cols-8 xl:grid-cols-6 gap-4">
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
        className="relative  overflow-hidden z-40"
      >
        <img role="button" src={model.thumbnail} alt={model.name} className="w-full h-32 rounded-none" />
        <p className="text-xs text-center absolute bottom-0 w-full bg-black bg-opacity-50 p-2 truncate">{model.name}</p>
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
          <summary className="flex w-full">
            <FolderIcon fill={scene.uuid === selectedScene ? "#f93" : "none"} />
            <span className="mr-auto truncate max-w-20">{scene.name}</span>
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
          </summary>
          <ul>
            {store.glbs
              .filter((glb) => glb.scene === scene.uuid)
              .map((glb) => (
                <li
                  key={glb.uuid}
                  className={cn({
                    "text-yellow-600": glb.uuid === selected3dModel,
                  })}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected3dModel(glb?.uuid)
                    setSelectedScene(scene.uuid)
                  }}
                >
                  <a>
                    <FileIcon fill={glb.uuid === selected3dModel ? "#f93" : "none"} />
                    <span className="truncate">{glb.name}</span>
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
                  </a>
                </li>
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

  useGame()

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
          <img src="/logo-op.png" alt="logo" className="w-8" />

          <div className="text-lg w-full">verse</div>
        </div>

        <ul className="menu  menu-xs overflow-y-auto h-full bg-base-200 max-h-full min-w-60">
          <li className="collapse-arrow">
            <details open>
              <summary>
                <FolderIcon fill="#f93" />
                Current Game
              </summary>
              <ul>
                <li>
                  <details open>
                    <summary>
                      <FolderIcon fill="#f93" />
                      Scenes
                    </summary>
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
                  </details>
                </li>
              </ul>
            </details>
          </li>
        </ul>

        <div className="w-full flex border-t border-white border-opacity-10   flex-col">
          {currentScene && (
            <>
              <div className="grid grid-cols-2 items-center gap-2 p-4">
                <div className="text-xs col-span-2 ">Edit Scene</div>

                <div className="text-xs ">scene Name:</div>
                <input
                  type="text"
                  value={currentScene?.name}
                  onChange={(e) => store.updateScene({ ...currentScene, name: e.target.value })}
                  className="input input-bordered input-xs rounded-none"
                />
                <div className="text-xs ">scene Name:</div>
                <select
                  value={currentScene?.preset}
                  className="select z-50 w-full select-bordered bg-base-content text-black rounded-none select-xs  top-0 left-0 "
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
                <div className="h-10 border-b border-r border-white border-opacity-10">
                  <select
                    value={selectedScene}
                    className="select border-0 outline-none ring-0 focus:ring-0 focus:outline-none z-50 w-full   rounded-none select-xs h-full "
                  >
                    {["models", "scripts", "npcs"].map((scene) => (
                      <option key={scene} value={scene}>
                        {scene}
                      </option>
                    ))}
                  </select>
                </div>

                <ul className="menu menu-xs overflow-y-auto bg-base-200 border-r border-opacity-10 border-white max-w-60 min-w-60">
                  <li>
                    <details open>
                      <summary>
                        <FolderIcon fill="#f93" />
                        Game Npcs
                      </summary>
                      <ul>
                        <li>
                          <details open>
                            <summary>
                              <FolderIcon fill={categories.includes(category) ? "#f93" : "none"} />
                              Categories
                            </summary>
                            <ul>
                              {categories.map((cat) => (
                                <li key={cat}>
                                  <a
                                    onClick={() => {
                                      setCategory(cat)
                                    }}
                                    className="flex w-full"
                                  >
                                    <FolderIcon fill={cat === category ? "#f93" : "none"} />
                                    <span className="mr-auto">{cat}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </details>
                        </li>
                      </ul>
                    </details>
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
        <div className="flex flex-col h-full">
          {selected3dModel && (
            <div className="flex items-center justify-between p-4 border-b border-white border-opacity-10">
              <div className="text-xs font-bold">{currentGlb?.name}</div>
              <button
                onClick={() => setSelected3dModel(null)}
                className="btn btn-xs btn-outline w-20 btn-square btn-error"
              >
                unselect
              </button>
            </div>
          )}
        </div>
        <Settings />
      </div>
    </div>
  )
}

export type TransformMode = "scale" | "translate" | "rotate"
