"use client"

import { create } from "zustand"

export type InventoryItem = string
export type Inventory = InventoryItem[]

export type Store = {
  inventory: Inventory
  setInventory: (inventory: Inventory) => void
  dialog?: string
  setDialog: (dialog?: string) => void
}

export const useStore = create<Store>((set) => ({
  dialog: "Sleep, the cousin of death, visits us each night.",
  inventory: [],
  setInventory: (inventory) => set({ inventory }),
  setDialog: (dialog) => set({ dialog }),
}))
