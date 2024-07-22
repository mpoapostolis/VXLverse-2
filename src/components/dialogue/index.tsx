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
      className={cn("h-screen w-screen fixed flex items-end  top-0 left-0  z-50", {
        "pointer-events-none opacity-0": !store.dialog,
        "pointer-events-auto opacity-100": store.dialog,
      })}
    >
      <div className="w-full p-4 md:m-8 text-gray-300 rounded-lg bg-black flex ">
        <div className="avatar mr-8">
          <div className="w-24 rounded">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <div className="text-xl w-full ">{text}</div>
      </div>
    </div>
  )
}
