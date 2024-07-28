"use client"

import { TransformMode } from "@/Editor"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type InventoryItem = string
export type Inventory = InventoryItem[]

const defaultGlbs = [
  {
    uuid: "9e71e737-2202-4555-8d3b-63a5e93ad485",
    name: "woman_1",
    glbName: "woman_1",
    position: [-1.5080528361722827, -0.8396196961402893, -2.4885654955470553],
    shownTime: {
      morning: true,
      afternoon: true,
      evening: true,
      night: true,
      noon: true,
    },
    scale: [1, 1.0000077281270214, 1],
    rotation: [0.16584531517452566, 0.2155495530204592, -0.20369265494141234],
    scene: "park",
    type: "npc",
    dialogue: {
      content:
        "Arin was once a revered knight in the kingdom of Eldoria, known for his bravery and wisdom. \n  Born to a humble blacksmith, Arin rose through the ranks of the royal guard, demonstrating unparalleled skill with the sword and a keen strategic mind. \n  After decades of service, during which he defended the realm from dragons, dark wizards, and marauding armies, Arin retired from active duty.\n  Now, he dedicates his life to guiding new adventurers, sharing his vast knowledge of the land, its history, and the secrets that lie within its borders. \n  Despite his age, Arin remains sharp and is deeply respected by all who know him.\n",
    },
  },
]

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
  divider?: string
  choices?: {
    label: string
    onSelect: () => void
  }[]
}

export type GLBType = {
  uuid: string
  name: string
  glbName: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  scene: string
  type: "npc" | "misc" | "triggerPoint"
  collectable?: boolean
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
export type SceneConfig = Record<string, number>

export type Store = {
  money: number
  energy: number
  addEnergy: (amount: number) => void
  removeEnergy: (amount: number) => void
  time: number
  setTime: (time: number) => void
  choices: Choice[]
  addChoice: (choice: Choice) => void
  removeChoice: (choice: Choice) => void
  updateChoice: (choice: Choice) => void
  transformMode: TransformMode
  setTransformMode: (mode: TransformMode) => void
  addMoney: (amount: number) => void
  removeMoney: (amount: number) => void
  selectedGlb?: string
  settingsExpanded: boolean
  setSettingsExpanded: (expanded: boolean) => void
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
      choices: [],
      addChoice: (choice) => set((state) => ({ choices: [...state.choices, choice] })),
      removeChoice: (choice) =>
        set((state) => ({
          choices: state.choices.filter((n) => n.uuid !== choice.uuid),
        })),
      updateChoice: (choice) =>
        set((state) => ({
          choices: state.choices.map((n) => (n.uuid === choice.uuid ? choice : n)),
        })),

      energy: 100,
      addEnergy: (amount) => set((state) => ({ energy: state.energy + amount })),
      removeEnergy: (amount) => set((state) => ({ energy: state.energy - amount })),
      time: 1,
      setTime: (time) => set({ time }),

      transformMode: "translate",
      settingsExpanded: false,
      setSettingsExpanded: (expanded) => set({ settingsExpanded: expanded }),
      setTransformMode: (transformMode) => set({ transformMode }),
      addMoney: (amount) =>
        set((state) => {
          if (!amount)
            return {
              money: +state.money,
            }
          console.log("adding money", amount, state.money)
          return { money: +state.money + amount }
        }),

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
      scene: "park",
      inventory: [],
      glbs: defaultGlbs as GLBType[],
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
      version: 1.1,
      name: "yesterday-echoes", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        ...state,

        settingsExpanded: false,
        dialog: undefined,
        money: 0,
        inventory: [],
        scene: state.scene,
        glbs: state.glbs,
      }),
    },
  ),
)
