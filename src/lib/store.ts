"use client"

import { create } from "zustand"

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

export type NpcType = {
  uuid: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  scene: string
  type: string
}

export type SceneConfig = Record<string, number>

export type Store = {
  selectedNpc?: string
  setSelectedNpc: (uuid: string) => void
  inventory: Inventory
  sceneConfig: SceneConfig
  scene: string
  npcs: NpcType[]
  addNpc: (npc: NpcType) => void
  removeNpc: (npc: NpcType) => void
  setScene: (scene: string) => void
  setInventory: (inventory: Inventory) => void
  dialog?: Dialogue
  setDialog: (dialog?: Dialogue) => void
  sceneText?: string
  setSceneText: (sceneText: string) => void
  updateNpc: (npc: NpcType) => void
}

export const useStore = create<Store>((set) => ({
  setSelectedNpc: (selectedNpc) => set({ selectedNpc }),
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
  npcs: [],
  addNpc: (npc) => set((state) => ({ npcs: [...state.npcs, npc] })),
  updateNpc: (npc) =>
    set((state) => ({
      npcs: state.npcs.map((n) => (n.uuid === npc.uuid ? npc : n)),
    })),
  removeNpc: (npc) =>
    set((state) => ({
      npcs: state.npcs.filter((n) => n !== npc),
    })),
  setSceneText: (sceneText) => set({ sceneText }),
  setInventory: (inventory) => set({ inventory }),
  setDialog: (dialog) => set({ dialog }),
}))
