import { Model3d, use3dModels } from "@/hooks/use3dModels"
import { useGameConfigStore } from "@/lib/game-store"
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useGame } from "ecctrl"
import { DragEvent, useState } from "react"
import * as THREE from "three"
import { Glb } from "../components/glb"
import Lights from "../components/lights"
import { cn, debounce } from "../lib/utils"

const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const categories = [
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
  page: number
  totalPages: number
}

const ModelSearch = ({ isLoading, total, changeSearchTerm, activeTab, page, totalPages }: ModelSearchProps) => {
  return (
    <div className="w-full flex px-4 items-center gap-2 my-2">
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="mr-auto">
          <div className="font-bold text-xs">{`Page: ${page + 1}/${totalPages}`}</div>
          <div className=" font-bold text-xs">{`Total: ${total}  models`}</div>
        </div>
      )}
      <input
        key={activeTab}
        onChange={(e) => changeSearchTerm(e.target.value)}
        type="text"
        placeholder="🔍   Search...."
        className="input input-sm input-bordered"
      />
    </div>
  )
}

interface ModelGridProps {
  data: Model3d[]
  isLoading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
}

const ModelGrid = ({ data, isLoading, page, setPage, totalPages }: ModelGridProps) => {
  return (
    <div className="w-full px-4  pb-4  flex place-items-end flex-wrap gap-2">
      <button
        onClick={() => setPage(page - 1)}
        className={cn("w-32 h-32 text-center justify-center bg-base-300 rounded-lg grid place-items-center", {
          hidden: page === 0 || isLoading || data?.length === 0,
        })}
      >
        Previous <br /> Page
      </button>

      {isLoading && (
        <div className="w-full my-auto h-60 grid place-items-center text-center text-lg font-bold">Loading...</div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="w-full my-auto h-60 grid place-items-center text-center text-lg font-bold">No models found</div>
      )}

      {data?.map((model) => (
        <div
          key={model.id}
          onDragStart={(event) => {
            event.dataTransfer.setData("application/json", JSON.stringify(model))
          }}
          draggable
          className="relative rounded-lg overflow-hidden z-40"
        >
          <img
            role="button"
            src={model.thumbnail}
            alt={model.name}
            className="w-32 h-32 rounded-lg transition duration-125"
          />
          <p className="text-xs text-center absolute bottom-0 w-full bg-black bg-opacity-50 p-2 truncate">
            {model.name}
          </p>
        </div>
      ))}

      <button
        onClick={() => setPage(page + 1)}
        className={cn("w-32 h-32 justify-center bg-base-300 rounded-lg grid place-items-center", {
          hidden: page === totalPages - 1 || isLoading || data?.length === 0,
        })}
      >
        Next <br /> Page
      </button>
    </div>
  )
}

export function Editor() {
  const store = useGameConfigStore()
  const [activeTab, setActiveTab] = useState<string>(categories[0])
  const [selectedScene, setSelectedScene] = useState<string>()
  const [page, setPage] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [newSceneName, setNewSceneName] = useState<string>("")

  useGame()

  const { data, isLoading, total, totalPages } = use3dModels(page, activeTab, searchTerm)

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
  }

  return (
    <div className="w-screen h-screen flex">
      <div className="h-screen border-r border-opacity-10 border-white">
        <div
          role="tablist"
          className="h-fit rounded-none flex "
          style={{
            maxWidth: "calc(100vw - 384px)",
          }}
        ></div>
        <div className="grid h-screen grid-rows-[1.5fr_1fr]  w-full relative">
          {store.scenes.length ? (
            <Canvas key={selectedScene} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} shadows>
              <OrbitControls makeDefault />
              <gridHelper args={[100, 100]} />
              <Environment background preset="night" />
              <Lights />
              {store.glbs
                .filter((glb) => glb.scene === selectedScene)
                .map((glb) => (
                  <Glb key={glb.uuid} {...glb} />
                ))}
            </Canvas>
          ) : (
            <div className="w-full h-full border-t bg-black bg-opacity-50 border-opacity-10 border-white grid place-items-center text-center text-lg font-bold">
              Create a scene to start adding models
            </div>
          )}
          <div className="flex w-full overflow-y-auto">
            <div className="h-full  flex flex-col  border-r  border-white border-opacity-10 ">
              <ul className="menu menu-xs overflow-y-auto bg-base-200   max-w-60 min-w-60">
                <li>
                  <details open>
                    <summary>
                      <FolderIcon />
                      Current Game
                    </summary>
                    <ul>
                      <li>
                        <details open>
                          <summary>
                            <FolderIcon
                              fill={store.scenes.map((e) => e.uuid).includes(selectedScene) ? "#f93" : "none"}
                            />
                            Scenes
                          </summary>
                          <ul>
                            {store.scenes.map((scene) => (
                              <li>
                                <details
                                  onClick={() => {
                                    setSelectedScene(scene.uuid)
                                  }}
                                  open={selectedScene === scene.uuid}
                                >
                                  <summary className="flex w-full">
                                    <FolderIcon fill={scene.uuid === selectedScene ? "#f93" : "none"} />
                                    <span className="mr-auto">{scene.name}</span>
                                    <button
                                      onClick={() => {
                                        store.removeScene(scene.uuid)
                                        const glbs = store.glbs.filter((glb) => glb.scene === scene.uuid)
                                        glbs.forEach((glb) => store.removeGlb(glb))

                                        setSelectedScene(undefined)
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
                                          onClick={() => {
                                            setSelectedScene(scene.uuid)
                                          }}
                                        >
                                          <a className="">
                                            <FileIcon />
                                            {glb.name}
                                          </a>
                                        </li>
                                      ))}
                                  </ul>
                                </details>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
              <div className="divider mt-auto my-0" />
              <form
                className="p-4   flex w-full"
                onSubmit={(e) => {
                  e.preventDefault()
                  const uuid = new THREE.Object3D().uuid
                  const name = e.currentTarget.newSceneName.value.trim()
                  store.addScene({
                    uuid,
                    name,
                  })
                  e.currentTarget.newSceneName.value = ""
                  setSelectedScene(uuid)
                }}
              >
                <input
                  key={selectedScene}
                  type="text"
                  name="newSceneName"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  placeholder="New Scene Name"
                  className="input input-bordered input-xs rounded-none"
                />
                <input type="submit" className="btn btn-xs " />
              </form>
            </div>

            <div className="w-full overflow-y-auto ">
              <ModelSearch
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                total={total}
                changeSearchTerm={changeSearchTerm}
                activeTab={activeTab}
              />
              <div className="divider my-0" />
              <div className="flex">
                <ModelGrid data={data} isLoading={isLoading} page={page} setPage={setPage} totalPages={totalPages} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-w-96 overflow-y-auto"></div>
    </div>
  )
}

export type TransformMode = "scale" | "translate" | "rotate"
