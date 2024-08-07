"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type InventoryItem = string
export type Inventory = InventoryItem[]

export type Dialogue = {
  content: string
  divider?: string
  choices?: {
    label: string
    onSelect: () => void
  }[]
}

export type PlayerStore = {
  money: number
  energy: number
  time: number
  inventory: Inventory
  selectedGlb?: string
  settingsExpanded: boolean
  dialog?: Dialogue
  sceneText?: string
  addEnergy: (amount: number) => void
  removeEnergy: (amount: number) => void
  setTime: (time: number) => void
  addMoney: (amount: number) => void
  removeMoney: (amount: number) => void
  setSettingsExpanded: (expanded: boolean) => void
  setSelectedGlb: (uuid: string) => void
  addItemToInventory: (item: InventoryItem) => void
  removeItemFromInventory: (item: InventoryItem) => void
  setInventory: (inventory: Inventory) => void
  setDialog: (dialog?: Dialogue) => void
  setSceneText: (sceneText: string) => void
}

export const usePlayerStore = create(
  persist<PlayerStore>(
    (set) => ({
      money: 0,
      energy: 100,
      time: 1,
      inventory: [],
      settingsExpanded: false,
      transformMode: "translate",
      addEnergy: (amount) => set((state) => ({ energy: state.energy + amount })),
      removeEnergy: (amount) => set((state) => ({ energy: state.energy - amount })),
      setTime: (time) => set({ time }),
      addMoney: (amount) => set((state) => ({ money: state.money + amount })),
      removeMoney: (amount) => set((state) => ({ money: state.money - amount })),
      setSettingsExpanded: (expanded) => set({ settingsExpanded: expanded }),
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
      setInventory: (inventory) => set({ inventory }),
      setDialog: (dialog) => set({ dialog }),
      setSceneText: (sceneText) => set({ sceneText }),
    }),
    {
      name: "player-store",
      version: 1.0,
    },
  ),
)
