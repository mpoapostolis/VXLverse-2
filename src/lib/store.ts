"use client"

import { create } from "zustand"

export type InventoryItem = string
export type Inventory = InventoryItem[]

export type Store = {
  inventory: Inventory
  setInventory: (inventory: Inventory) => void
  dialog?: string
  setDialog: (dialog?: string) => void
  sceneText?: string
  setSceneText: (sceneText: string) => void
}

export const useStore = create<Store>((set) => ({
  sceneText: "Sleep, the cousin of death, visits us each night.",
  inventory: [],
  setSceneText: (sceneText) => set({ sceneText }),
  setInventory: (inventory) => set({ inventory }),
  setDialog: (dialog) => set({ dialog }),
}))
