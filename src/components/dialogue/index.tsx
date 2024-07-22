import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useWindupString } from "windups"

export function Dialogue() {
  const store = useStore()
  const [text] = useWindupString(store?.dialog ?? "", {
    pace: (char: string) => (char === " " ? 100 : 50),
  })
  return (
    <div
      onClick={() => store.setDialog(undefined)}
      className={cn("h-screen w-screen fixed grid place-items-center top-0 left-0 bg-black z-50 bg-opacity-60", {
        "pointer-events-none opacity-0": !store.dialog,
        "pointer-events-auto opacity-100": store.dialog,
      })}
    >
      <div className="text-3xl font-bold text-white">{text}</div>
    </div>
  )
}
