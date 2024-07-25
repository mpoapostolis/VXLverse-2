"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type InventoryItem = string
export type Inventory = InventoryItem[]

type Dialogue = {
  content: string
  divider?: string
  choices?: {
    label: string
    onSelect: () => void
  }[]
}

export type GLBType = {
  uuid: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  scene: string
  type: "npc" | "misc"
}
export type SceneConfig = Record<string, number>

export type Store = {
  selectedGlb?: string
  setSelectedGlb: (uuid: string) => void
  inventory: Inventory
  sceneConfig: SceneConfig
  scene: string
  glbs: GLBType[]
  addGlb: (glb: GLBType) => void
  removeGlb: (glb: GLBType) => void
  setScene: (scene: string) => void
  setInventory: (inventory: Inventory) => void
  dialog?: Dialogue
  setDialog: (dialog?: Dialogue) => void
  sceneText?: string
  setSceneText: (sceneText: string) => void
  updateGlb: (glb: GLBType) => void
}

export const useStore = create(
  persist<Store>(
    (set) => ({
      setSelectedGlb: (selectedGlb) => set({ selectedGlb }),
      sceneText: "Sleep, the cousin of death, visits us each night.",
      setScene: (scene) => set({ scene }),
      sceneConfig: {
        farm: 0.8,
        house: 2.5,
        park: 20,
        town: 10,
      },
      scene: "park",
      inventory: [],
      glbs: [],
      addGlb: (glb) => set((state) => ({ glbs: [...state.glbs, glb] })),
      updateGlb: (glb) =>
        set((state) => ({
          glbs: state.glbs.map((n) => (n.uuid === glb.uuid ? glb : n)),
        })),
      removeGlb: (glb) =>
        set((state) => ({
          glbs: state.glbs.filter((n) => n !== glb),
        })),
      setSceneText: (sceneText) => set({ sceneText }),
      setInventory: (inventory) => set({ inventory }),
      setDialog: (dialog) => set({ dialog }),
    }),
    {
      name: "yesterday-echoes", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
