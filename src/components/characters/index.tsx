import { Npc, NpcType } from "@/lib/store"
import { Ghost } from "./ghost"
import { Hero } from "./hero"

export const npcType: NpcType[] = ["hero", "ghost"]
export function Character(props: Npc) {
  switch (props.type) {
    case "hero":
      return <Hero position={props.position} scale={props.scale} rotation={props.rotation} />
    case "ghost":
      return <Ghost position={props.position} scale={props.scale} rotation={props.rotation} />
    default:
      return null
  }
}
