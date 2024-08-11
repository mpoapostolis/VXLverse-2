import { GameConfigStore } from "@/lib/game-store"
import { getClientPb } from "@/lib/pb"
import { useParams } from "react-router-dom"
import useSWR from "swr"

export interface Game {
  id: string
  gameConf: GameConfigStore
  name: string
  owner: string
  genre: string
  description: string
}

export function useGame() {
  const pb = getClientPb()
  const params = useParams()
  const data = useSWR(
    params.id && ["/games", params.id],
    async () => await pb.collection("games").getOne<Game>(params.id),
  )
  return {
    data: data?.data,
    isLoading: !data?.data && !data?.error,
    isError: data?.error,
  }
}
