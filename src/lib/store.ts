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

export type NpcType = "hero" | "ghost"
export type Npc = {
  uuid: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  scene: string
  type: NpcType
}

export type Store = {
  inventory: Inventory
  scene: string
  npcs: Npc[]
  addNpc: (npc: Npc) => void
  removeNpc: (npc: Npc) => void
  setScene: (scene: string) => void
  setInventory: (inventory: Inventory) => void
  dialog?: Dialogue
  setDialog: (dialog?: Dialogue) => void
  sceneText?: string
  setSceneText: (sceneText: string) => void
  updateNpc: (npc: Npc) => void
}

export const useStore = create<Store>((set) => ({
  sceneText: "Sleep, the cousin of death, visits us each night.",
  setScene: (scene) => set({ scene }),
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
