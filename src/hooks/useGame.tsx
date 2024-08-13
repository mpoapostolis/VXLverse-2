import { GameConfigStore, useGameConfigStore } from "@/lib/game-store"
import { getClientPb } from "@/lib/pb"
import { useEffect } from "react"
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
  const store = useGameConfigStore()
  const pb = getClientPb()
  const params = useParams()
  const data = useSWR(
    params.id && ["/games", params.id],
    async () => await pb.collection("games").getOne<Game>(params.id),
  )
  useEffect(() => {
    store.initialize(data?.data?.gameConf)
  }, [data?.data])
  return {
    data: data?.data,
    isLoading: !data?.data && !data?.error,
    isError: data?.error,
  }
}
