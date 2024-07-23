import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useWindupString } from "windups"

export function Dialogue() {
  const store = useStore()
  const [text] = useWindupString(store?.dialog?.content ?? "", {
    pace: (char) => (char === " " ? 50 : 30),
  })

  const handleDialogueClick = () => {
    store.setDialog(undefined)
  }

  const { dialog } = store
  const showDialogue = dialog ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"

  return (
    <div
      onClick={handleDialogueClick}
      className={cn("h-screen w-screen fixed flex md:items-end items-center p-4 top-0 left-0 z-50", showDialogue)}
    >
      <div className="w-full p-4 md:m-8 text-gray-300 rounded-lg bg-black min-h-20">
        <div className="flex w-full">
          <div className="avatar mr-2 mb-4">
            <div className="md:w-32 w-20 h-fit rounded">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
            </div>
          </div>
          <div className="text-xl w-full">{text}</div>
        </div>
        <div className="grid gap-4 w-full">
          {dialog?.divider && <div className="divider">{dialog.divider}</div>}
          {dialog?.choices && (
            <div className="grid gap-2">
              {dialog.choices.map((choice, i) => (
                <button key={i} onClick={choice.onSelect} className="btn w-full btn-sm btn-outline">
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
