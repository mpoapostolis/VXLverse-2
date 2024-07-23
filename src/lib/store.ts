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

export type Store = {
  inventory: Inventory
  scene: string
  setScene: (scene: string) => void
  setInventory: (inventory: Inventory) => void
  dialog?: Dialogue
  setDialog: (dialog?: Dialogue) => void
  sceneText?: string
  setSceneText: (sceneText: string) => void
}

export const useStore = create<Store>((set) => ({
  sceneText: "Sleep, the cousin of death, visits us each night.",
  setScene: (scene) => set({ scene }),
  scene: "farm",
  inventory: [],
  setSceneText: (sceneText) => set({ sceneText }),
  setInventory: (inventory) => set({ inventory }),
  setDialog: (dialog) => set({ dialog }),
}))
