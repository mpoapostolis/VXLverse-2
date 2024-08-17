import { PresetsType } from "@react-three/drei/helpers/environment-assets"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getClientPb } from "./pb"
import { debounce } from "./utils"

export type Choice = {
  parent: string
  uuid: string
  label: string
  requiredMoney?: number
  requiredEnergy?: number
  requiredItem?: string
  reward?: {
    type: "money" | "energy" | "item"
    amount?: number
    item?: string
  }
}

type Dialogue = {
  content: string
  choices?: Choice[]
}

export type GLBType = {
  initialize: (scenes: Scene[], glbs: GLBType[]) => void
  uuid: string
  name: string
  glbName: string
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  scene: string
  type: "hero" | "npc" | "misc"
  collectable?: boolean
  thumbnail?: string
  animationSet: Record<string, string>
  currentAnimation?: string
  requiredItem?: string
  shownTime?: {
    morning: boolean
    afternoon: boolean
    evening: boolean
    night: boolean
    noon: boolean
  }
  dialogue?: Dialogue
}

type Scene = {
  uuid: string
  name: string
  preset: PresetsType
}
export type GameConfigStore = {
  scenes: Scene[]
  choices: Choice[]
  clearStore: () => void
  initialize: (store?: Partial<GameConfigStore>) => void
  glbs: GLBType[]
  addScene: (scene: Scene) => void
  updateScene: (scene: Scene) => void
  removeScene: (scene: string) => void
  addChoice: (choice: Choice) => void
  removeChoice: (choice: Choice) => void
  updateChoice: (choice: Choice) => void
  addGlb: (glb: GLBType) => void
  removeGlb: (glb: GLBType) => void
  updateGlb: (glb: GLBType) => void
  fly: boolean
  setFly: (fly: boolean) => void
}

export const useGameConfigStore = create(
  persist<GameConfigStore>(
    (set) => ({
      scenes: [],
      choices: [],
      glbs: [],
      clearStore: () =>
        set({
          scenes: [],
          choices: [],
          glbs: [],
        }),
      initialize: (store) => set((state) => ({ ...state, ...store })),
      fly: false,
      setFly: (fly) => set({ fly }),
      addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
      updateScene: (scene) =>
        set((state) => ({
          scenes: state.scenes.map((n) => (n.uuid === scene.uuid ? scene : n)),
        })),
      removeScene: (sceneId) =>
        set((state) => ({
          scenes: state.scenes.filter((n) => n.uuid !== sceneId),
        })),
      addChoice: (choice) => set((state) => ({ choices: [...state.choices, choice] })),
      removeChoice: (choice) =>
        set((state) => ({
          choices: state.choices.filter((n) => n.uuid !== choice.uuid),
        })),
      updateChoice: (choice) =>
        set((state) => ({
          choices: state.choices.map((n) => (n.uuid === choice.uuid ? choice : n)),
        })),
      addGlb: (glb) => set((state) => ({ glbs: [...state.glbs, glb] })),
      removeGlb: (glb) =>
        set((state) => ({
          glbs: state.glbs.filter((n) => n.uuid !== glb.uuid),
        })),
      updateGlb: (glb) =>
        set((state) => ({
          glbs: state.glbs.map((n) => (n.uuid === glb.uuid ? glb : n)),
        })),
    }),
    {
      name: "game-config",
      version: 1.0,
    },
  ),
)

const debouncedSave = debounce(async (state: GameConfigStore) => {
  const { scenes, glbs } = state
  const pb = getClientPb()
  const id = window?.location.pathname.split("/")[2]
  if (id)
    await pb.collection("games").update(id, {
      gameConf: {
        scenes,
        glbs,
      },
    })
}, 2000)
useGameConfigStore.subscribe(debouncedSave)
