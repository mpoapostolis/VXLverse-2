import { TransformMode } from "@/Editor"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function Settings() {
  const store = useStore()
  const uuid = store?.selectedGlb
  const current = store.glbs.find((glb) => glb?.uuid === uuid)
  const unselect = () => store.setSelectedGlb(undefined)
  const [minimized, setMinimized] = useState(false)
  const transformArray = ["translate", "rotate", "scale"] as TransformMode[]

  console.log(store.transformMode)
  return (
    <div
      className={cn("w-96  fixed z-50", {
        hidden: !current?.uuid,
      })}
    >
      {uuid && (
        <div className="drawer w-full md:w-96 select-none fixed  drawer-open">
          <div className="drawer-content bg-base-300">
            <div className="bg-base-100 p-2 text-xs items-center gap-4 flex w-full ">
              <span>{current?.name}</span>
              <button onClick={() => setMinimized(!minimized)} role="button" className="ml-auto text-lg">
                {minimized ? "-" : "▢"}
              </button>
              <button role="button" onClick={unselect}>
                ❌
              </button>
            </div>
            <div
              className={cn("p-2 py-4 grid gap-4", {
                hidden: !minimized,
              })}
            >
              <div className="w-full grid grid-cols-3">
                <label className="label text-xs col-span-3">Transform</label>
                {transformArray.map((mode) => (
                  <div className="w-full">
                    <div className=" flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        id={mode}
                        name="transform"
                        className="radio radio-xs"
                        onChange={() => store.setTransformMode(mode)}
                        defaultChecked={store.transformMode === mode}
                      />
                      <label htmlFor={mode} className=" text-xs">
                        {mode}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider my-0" />
              <div className="w-full">
                <label className="label text-xs ">Dialogue</label>
                <textarea className="textarea rounded-none textarea-bordered w-full" />
              </div>

              <div className="divider my-0" />
              <div className="w-full">
                <label className="label  text-xs ">Appear time of Day:</label>
                <div className="max-h-40 overflow-auto grid gap-2 grid-cols-4 ">
                  {["morning", "noon", "afternoon", "evening", "night"].map((time) => (
                    <div className="flex px-2 gap-2 w-full">
                      <input type="checkbox" id={time} className="checkbox rounded-none checkbox-xs w-fit" />
                      <label htmlFor={time} className="text-xs label-text w-fit">
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divider my-0" />
              <div className="w-full">
                <label className="label  text-xs ">Required Money:</label>
                <div className="max-h-40 overflow-auto ">
                  <input type="number" className="input rounded-none input-bordered w-full input-xs" />
                </div>
              </div>

              <div className="divider my-0" />
              <div className="w-full ">
                <label className="label  text-xs ">Show when inventory has:</label>
                <div className="max-h-40 overflow-auto h-full flex flex-wrap">
                  {store.glbs
                    .filter((glb) => glb?.scene === store.scene)
                    .map((glb) => (
                      <div className="flex gap-3 m-2 ">
                        <input type="checkbox" id={glb?.uuid} className="checkbox  rounded-none  checkbox-xs" />
                        <label htmlFor={glb.uuid} className="text-xs label-text">
                          {glb?.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              <div className="divider" />
              <button
                onClick={() => {
                  store.removeGlb(current)
                  store.setSelectedGlb(undefined)
                }}
                className="btn rounded-none btn-xs w-full btn-error btn-outline btn-square"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
