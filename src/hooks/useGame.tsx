import { getClientPb } from "@/lib/pb"
import { Store, useStore } from "@/lib/store"
import { useParams } from "react-router-dom"
import useSWR from "swr"

export interface Game {
  id: string
  gameConf: Store
  name: string
  owner: string
  genre: string
  description: string
}

export function useGame(id: string) {
  const pb = getClientPb()
  const params = useParams()
  const res = useSWR(params.id && ["/game", params.id], async () => await pb.collection("games").getOne<Game>(id))
  const store = useStore()
  if (res.data.gameConf) store.setGame(res.data.gameConf)
}
