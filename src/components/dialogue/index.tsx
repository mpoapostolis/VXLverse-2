import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useWindupString } from "windups"
import { Dialog, DialogContent } from "../ui/dialog"
;``

export function Dialogue() {
  const store = useStore()
  const [text] = useWindupString(store?.dialog ?? "", {
    pace: (char: string) => (char === " " ? 100 : 50),
  })
  return (
    <Dialog open={Boolean(store.dialog)}>
      <DialogContent className="fixed outline-none bottom-0 z-50 w-full md:p-6">
        <div className=" w-full grid   relative rounded min-h-[200px] gap-4 bg-black bg-opacity-80 p-4  px-6 text-white">
          <div className="text-lg h-full  flex flex-col w-full">
            <div className="text-xl  font-bold text-secondary mb-1">{"Me"}</div>
            <div
              className={cn("font-medium   h-full py-2 mb-4 ", {
                "text-gray-500": false,
              })}
            >
              {text}
            </div>
          </div>

          <X role="button" onClick={() => store.setDialog(undefined)} className="absolute top-4 right-4 h-4 w-4" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
