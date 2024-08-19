import { Model3d, use3dModels } from "@/hooks/use3dModels"
import { useGameConfigStore } from "@/lib/game-store"
import { debounce } from "@/lib/utils"
import { createContext, DragEvent, FC, useContext, useState } from "react"
import * as THREE from "three"

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

interface EditorContextProps {
  category: string
  setCategory: (category: string) => void
  selected3dModel?: string
  setSelected3dModel: (model: string) => void
  mode: "translate" | "rotate" | "scale"
  setMode: (mode: "translate" | "rotate" | "scale") => void
  selectedScene?: string
  setSelectedScene: (scene: string) => void
  page: number
  setPage: (page: number) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  newSceneName: string
  setNewSceneName: (name: string) => void
  position: [number, number, number]
  setPosition: (position: [number, number, number]) => void
  assetCategory: string
  setAssetCategory: (category: string) => void
  flying: boolean
  setFlying: (flying: boolean) => void
  data: Model3d[]
  isLoading: boolean
  total: number
  totalPages: number
  changeSearchTerm: (term: string) => void
  handleDrop: (e: DragEvent<HTMLDivElement>) => void
  updateFn: (obj: any) => void
  keyForCanvas: string
  currentScene: any
  currentGlb: any
}

const EditorContext = createContext<EditorContextProps | null>(null)

export const useEditor = () => useContext(EditorContext)

export const EditorProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useGameConfigStore()
  const [category, setCategory] = useState<string>(categories[0])
  const [selected3dModel, setSelected3dModel] = useState<string>()
  const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate")
  const [selectedScene, setSelectedScene] = useState<string>()
  const [page, setPage] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [newSceneName, setNewSceneName] = useState<string>("")
  const [position, setPosition] = useState<[number, number, number]>(undefined)
  const [assetCategory, setAssetCategory] = useState<string>("Library")
  const [flying, setFlying] = useState<boolean>(false)
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
      position: position ?? [0, 0, 0],
      animationSet: {},
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
      type: parsedData?.type,
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
    <EditorContext.Provider
      value={{
        category,
        setCategory,
        selected3dModel,
        setSelected3dModel,
        mode,
        setMode,
        selectedScene,
        setSelectedScene,
        page,
        setPage,
        searchTerm,
        setSearchTerm,
        newSceneName,
        setNewSceneName,
        position,
        setPosition,
        assetCategory,
        setAssetCategory,
        flying,
        setFlying,
        data,
        isLoading,
        total,
        totalPages,
        changeSearchTerm,
        handleDrop,
        updateFn,
        keyForCanvas,
        currentScene,
        currentGlb,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
