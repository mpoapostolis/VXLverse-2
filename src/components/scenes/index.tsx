import { useStore } from "@/lib/store"
import { Farm } from "../scenes/farm"
import { House } from "../scenes/house"
import { Park } from "../scenes/park"
import { Town } from "../scenes/town"

export const scenes = ["house", "farm", "town", "park"]

export function Scene() {
  const store = useStore()
  switch (store.scene) {
    case "house":
      return <House />
    case "farm":
      return <Farm />
    case "town":
      return <Town />
    case "park":
      return <Park />
    default:
      return <House />
  }
}
