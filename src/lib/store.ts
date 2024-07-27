"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  collectable?: boolean
}
export type SceneConfig = Record<string, number>

export type Store = {
  money: number
  addMoney: (amount: number) => void
  removeMoney: (amount: number) => void
  selectedGlb?: string
  setSelectedGlb: (uuid: string) => void
  inventory: Inventory
  addItemToInventory: (item: InventoryItem) => void
  removeItemFromInventory: (item: InventoryItem) => void
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
      money: 0,
      addMoney: (amount) => set((state) => ({ money: state.money + amount })),
      removeMoney: (amount) => set((state) => ({ money: state.money - amount })),
      setSelectedGlb: (selectedGlb) => set({ selectedGlb }),
      addItemToInventory: (item) =>
        set((state) => {
          const unique = new Set([...state.inventory, item])
          return {
            inventory: Array.from(unique),
          }
        }),
      removeItemFromInventory: (item) =>
        set((state) => ({
          inventory: state.inventory.filter((n) => n !== item),
        })),
      setScene: (scene) => set({ scene }),
      sceneConfig: {
        farm: 0.8,
        house: 2.5,
        park: 20,
        town: 10,
        gallery: 1.8,
      },
      scene: "gallery",
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
      version: 1,
      name: "yesterday-echoes", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        ...state,
        money: 0,
        inventory: [],
        scene: state.scene,
        glbs: state.glbs,
      }),
    },
  ),
)
