import { useEditor } from "@/components/editor/provider"
import { cn } from "@/lib/utils"
import { DragEvent } from "react"

export function ModelGrid(props: { id?: string }) {
  const cc0 = "https://creativecommons.org/publicdomain/zero/1.0/"
  const ccBy3 = "https://creativecommons.org/licenses/by/3.0"
  const { data, isLoading } = useEditor()
  return (
    <div
      className={
        "grid w-full p-4 pb-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6  gap-4"
      }
    >
      {isLoading && (
        <div className="w-full my-auto h-60 xl:col-span-6 col-span-3 2xl:col-span-8 grid place-items-center text-center text-lg font-bold">
          Loading...
        </div>
      )}
      {!isLoading && data?.length === 0 && (
        <div className="w-full my-auto xl:col-span-6 col-span-3 2xl:col-span-8 h-60 grid place-items-center text-center text-lg font-bold">
          No models found
        </div>
      )}
      {data?.map((model) => {
        return (
          <div
            key={model.id}
            onDragStart={(event: DragEvent<HTMLDivElement>) => {
              event.dataTransfer.setData("application/json", JSON.stringify(model))
            }}
            draggable
            className={cn("relative   overflow-hidden z-50", {})}
          >
            <div className="relative group">
              <img role="button" src={model.thumbnail} alt={model.name} className="w-full min-h-32  rounded-none" />

              <p className="text-xs flex justify-between absolute top-0 text-left truncate w-full bg-black bg-opacity-70 p-2 ">
                <span className="truncate">{model.name}</span>
                {model.animated ? <span className="text-xs  badge-xs  rounded-full text-warning">Animated</span> : null}
              </p>

              <div className="w-full absolute bottom-0 z-50 hidden   bg-black group-hover:flex justify-between bg-opacity-80 p-2   gap-2 right-0 ">
                <a
                  data-tip={model.attribution_owner}
                  target="_blank"
                  href={model.attribution_url}
                  className="text-xs link tooltip link-primary tooltip-right flex z-50 gap-2 items-center"
                >
                  <span className="">Author</span>
                </a>
                <a
                  target="_blank"
                  href={
                    model.licence === "CC0 1.0"
                      ? cc0
                      : model.licence === "CC-BY 3.0"
                        ? ccBy3
                        : "https://creativecommons.org/licenses/by/4.0"
                  }
                  className="text-xs link-primary flex gap-2 items-center"
                >
                  🔒 <span className="">{model.licence}</span>
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
