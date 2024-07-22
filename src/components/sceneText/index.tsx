import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useWindupString } from "windups"

export function SceneText() {
  const store = useStore()
  const [text] = useWindupString(store?.sceneText ?? "", {
    pace: (char: string) => (char === " " ? 100 : 50),
    onFinished: () => {
      setTimeout(() => {
        store.setSceneText(undefined)
      }, 2000)
    },
  })
  return (
    <div
      onClick={() => store.setDialog(undefined)}
      className={cn(
        "h-screen w-screen transition-all duration-1000 fixed grid place-items-center top-0 left-0 bg-black z-50",
        {
          "pointer-events-none opacity-0": !store.sceneText,
          "pointer-events-auto opacity-100": store.sceneText,
        },
      )}
    >
      <div className="text-3xl font-bold text-center text-white">{text}</div>
    </div>
  )
}
