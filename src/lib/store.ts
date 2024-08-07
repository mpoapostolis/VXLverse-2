"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type InventoryItem = string
export type Inventory = InventoryItem[]

const defaultGlbs = [] as GLBType[]

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
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  scene: string
  type: "hero" | "npc" | "misc"
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
  gameConf?: {
    scenes: string[]
    glbs: GLBType[]
    choices: Choice[]
  }
  money: number
  energy: number
  addScene: (scene: string) => void
  addEnergy: (amount: number) => void
  removeEnergy: (amount: number) => void
  time: number
  scenes: string[]
  removeScene: (scene: string) => void
  setTime: (time: number) => void
  choices: Choice[]
  addChoice: (choice: Choice) => void
  removeChoice: (choice: Choice) => void
  updateChoice: (choice: Choice) => void
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
      scenes: [],
      removeScene: (scene) =>
        set((state) => ({
          scenes: state.scenes.filter((n) => n !== scene),
        })),
      addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
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
      addMoney: (amount) =>
        set((state) => {
          if (!amount)
            return {
              money: +state.money,
            }
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
      version: 1.3,
      name: "vxlverse", // name of the item in the storage (must be unique)
    },
  ),
)
