import { useStore } from "@/lib/store"
import { Farm } from "../scenes/farm"
import { House } from "../scenes/house"

export function Scene() {
  const store = useStore()
  switch (store.scene) {
    case "house":
      return <House />
    case "farm":
      return <Farm />
    default:
      return <House />
  }
}
