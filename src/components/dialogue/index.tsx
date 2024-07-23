import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useWindupString } from "windups"

export function Dialogue() {
  const store = useStore()
  const [text] = useWindupString(store?.dialog?.content ?? "", {
    pace: (char: string) => (char === " " ? 50 : 30),
  })
  return (
    <div
      onClick={() => store.setDialog(undefined)}
      className={cn("h-screen w-screen fixed flex md:items-end items-center p-4 top-0 left-0  z-50", {
        "pointer-events-none opacity-0": !store.dialog,
        "pointer-events-auto opacity-100": store.dialog,
      })}
    >
      <div className="w-full p-4 md:m-8 text-gray-300 rounded-lg bg-black flex ">
        <div className="avatar mr-8">
          <div className="w-32 h-fit rounded">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <div className="grid gap-4 w-full">
          <div className="text-xl w-full ">{text}</div>
          <div
            className={cn("divider", {
              hidden: !store.dialog?.divider,
            })}
          >
            {store.dialog?.divider}
          </div>

          <div
            className={cn("grid gap-2", {
              hidden: !store.dialog?.choices,
            })}
          >
            {store.dialog?.choices?.map((choice, i) => (
              <button key={i} onClick={choice?.onSelect} className="btn w-full btn-sm btn-outline">
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
